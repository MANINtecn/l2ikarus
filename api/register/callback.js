import crypto from 'crypto'
import { getConnection } from '../_db.js'

function generateUsername(googleName) {
  let base = googleName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 12)
  if (base.length < 4) base = ('user' + base).substring(0, 12)
  return base.toLowerCase()
}

function generatePassword() {
  // Sem chars ambíguos (0/O, 1/l/I) — fácil de anotar
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default async function handler(req, res) {
  const { code, error } = req.query
  if (error) return res.redirect('/?reg_error=google_denied')

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI_REG || 'https://l2ikarus.com/api/register/callback'

  try {
    // Troca code por token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
    })
    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) return res.redirect('/?reg_error=token_failed')

    // Pega info do usuário Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const gUser = await userRes.json()

    const pool = await getConnection()

    // Verifica se email já está cadastrado
    const [byEmail] = await pool.query('SELECT login FROM accounts WHERE email = ?', [gUser.email])
    if (byEmail.length > 0) {
      const existingLogin = byEmail[0].login
      const result = Buffer.from(JSON.stringify({ login: existingLogin, existing: true })).toString('base64url')
      return res.redirect(`/?reg_result=${result}`)
    }

    // Gera username único
    let username = generateUsername(gUser.name || gUser.email.split('@')[0])
    const [existing] = await pool.query('SELECT login FROM accounts WHERE login = ?', [username])
    if (existing.length > 0) {
      username = username.substring(0, 10) + Math.floor(Math.random() * 900 + 100)
    }

    // Gera senha e cria conta
    const plainPass = generatePassword()
    const hashedPass = crypto.createHash('sha1').update(plainPass).digest('base64')

    await pool.query(
      'INSERT INTO accounts (login, password, email, access_level) VALUES (?, ?, ?, 0)',
      [username, hashedPass, gUser.email]
    )

    // Retorna credenciais via URL param (base64, não sensível — é senha de jogo gerada)
    const result = Buffer.from(JSON.stringify({ login: username, password: plainPass, name: gUser.given_name || gUser.name })).toString('base64url')
    res.redirect(`/?reg_result=${result}`)
  } catch (err) {
    console.error('Google register error:', err)
    res.redirect('/?reg_error=server_error')
  }
}
