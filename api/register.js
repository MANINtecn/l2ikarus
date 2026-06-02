import { getConnection } from './_db.js'
import crypto from 'crypto'

const LOGIN_RE = /^[a-zA-Z0-9_]{4,16}$/
const PASS_RE  = /^[^\s]{6,64}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const rateMap = new Map()
function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateMap.get(ip) ?? { count: 0, start: now }
  if (now - entry.start > 60_000) { rateMap.set(ip, { count: 1, start: now }); return false }
  entry.count++; rateMap.set(ip, entry)
  return entry.count > 5
}

function getAction(req) {
  const url = req.url || ''
  if (url.includes('/google')) return 'google'
  if (url.includes('/callback')) return 'callback'
  return req.query.action || ''
}

export default async function handler(req, res) {
  const action = getAction(req)

  // GET /api/register/google — inicia OAuth para cadastro
  if (req.method === 'GET' && action === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = process.env.GOOGLE_REDIRECT_URI_REG || 'https://l2ikarus.com/api/register/callback'
    if (!clientId) return res.status(500).json({ error: 'GOOGLE_CLIENT_ID não configurado' })
    const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'code', scope: 'email profile', access_type: 'online', prompt: 'select_account' })
    return res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params}`)
  }

  // GET /api/register/callback — recebe e-mail do Google, redireciona para formulário
  if (req.method === 'GET' && action === 'callback') {
    const { code, error } = req.query
    if (error) return res.redirect('/?reg_error=google_denied')
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI_REG || 'https://l2ikarus.com/api/register/callback'
    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
      })
      const tokenData = await tokenRes.json()
      if (!tokenData.access_token) return res.redirect('/?reg_error=token_failed')
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${tokenData.access_token}` } })
      const gUser = await userRes.json()
      const data = Buffer.from(JSON.stringify({ email: gUser.email, name: gUser.given_name || gUser.name })).toString('base64url')
      return res.redirect(`/?google_data=${data}`)
    } catch (err) {
      console.error('Google register error:', err)
      return res.redirect('/?reg_error=server_error')
    }
  }

  // POST /api/register — cadastro manual ou após Google
  if (req.method !== 'POST') return res.status(405).json({ message: 'Método não permitido' })

  const ip = req.headers['x-forwarded-for']?.split(',')[0] ?? 'unknown'
  if (isRateLimited(ip)) return res.status(429).json({ message: 'Muitas tentativas. Aguarde 1 minuto.' })

  const { login, password, email } = req.body ?? {}
  if (!login || !password) return res.status(400).json({ message: 'Login e senha são obrigatórios' })
  if (!LOGIN_RE.test(login)) return res.status(400).json({ message: 'Login: 4-16 caracteres, apenas letras, números e _' })
  if (!PASS_RE.test(password)) return res.status(400).json({ message: 'Senha: mínimo 6 caracteres, sem espaços' })
  if (email && !EMAIL_RE.test(email)) return res.status(400).json({ message: 'E-mail inválido' })

  try {
    const pool = await getConnection()
    const hashedPassword = crypto.createHash('sha1').update(password).digest('base64')
    const [existing] = await pool.query('SELECT login FROM accounts WHERE login = ?', [login])
    if (existing.length > 0) return res.status(409).json({ message: 'Este login já está em uso' })
    await pool.query('INSERT INTO accounts (login, password, email) VALUES (?, ?, ?)', [login, hashedPassword, email ?? ''])
    return res.status(200).json({ success: true, message: 'Conta criada com sucesso!' })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ message: err.message || 'Erro ao criar conta.' })
  }
}
