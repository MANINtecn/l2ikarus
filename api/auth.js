import crypto from 'crypto'

function createJWT(payload, secret) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${sig}`
}

function verifyJWT(token, secret) {
  try {
    const [header, payload, sig] = token.split('.')
    const expected = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
    if (sig !== expected) return null
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (data.exp < Math.floor(Date.now() / 1000)) return null
    return data
  } catch { return null }
}

function getAction(req) {
  // Suporta /api/auth/google, /api/auth/me etc via rewrite do vercel.json
  const url = req.url || ''
  if (url.includes('/google')) return 'google'
  if (url.includes('/callback')) return 'callback'
  if (url.includes('/logout')) return 'logout'
  if (url.includes('/me')) return 'me'
  return req.query.action || ''
}

export default async function handler(req, res) {
  const action = getAction(req)

  // GET /api/auth/google — inicia OAuth admin
  if (action === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://l2ikarus.com/api/auth/callback'
    if (!clientId) return res.status(500).json({ error: 'GOOGLE_CLIENT_ID não configurado' })
    const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'code', scope: 'email profile', access_type: 'online', prompt: 'select_account' })
    return res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params}`)
  }

  // GET /api/auth/callback — recebe code do Google (admin)
  if (action === 'callback') {
    const { code, error } = req.query
    if (error) return res.redirect('/?auth_error=google_denied')
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://l2ikarus.com/api/auth/callback'
    const jwtSecret = process.env.JWT_SECRET
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    if (!jwtSecret) return res.redirect('/?auth_error=config')
    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
      })
      const tokenData = await tokenRes.json()
      if (!tokenData.access_token) return res.redirect('/?auth_error=token_failed')
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${tokenData.access_token}` } })
      const user = await userRes.json()
      if (adminEmails.length > 0 && !adminEmails.includes(user.email.toLowerCase())) return res.redirect('/?auth_error=not_admin')
      const jwt = createJWT({ email: user.email, name: user.name, picture: user.picture, exp: Math.floor(Date.now() / 1000) + 86400 }, jwtSecret)
      res.setHeader('Set-Cookie', `admin_session=${jwt}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`)
      return res.redirect('/?admin=1')
    } catch (err) {
      console.error('Auth callback error:', err)
      return res.redirect('/?auth_error=server_error')
    }
  }

  // GET /api/auth/me — verifica sessão
  if (action === 'me') {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) return res.status(500).json({ authenticated: false })
    const cookies = req.headers.cookie || ''
    const match = cookies.match(/admin_session=([^;]+)/)
    if (!match) return res.status(401).json({ authenticated: false })
    const payload = verifyJWT(match[1], jwtSecret)
    if (!payload) return res.status(401).json({ authenticated: false })
    return res.status(200).json({ authenticated: true, user: { email: payload.email, name: payload.name, picture: payload.picture } })
  }

  // GET /api/auth/logout — encerra sessão
  if (action === 'logout') {
    res.setHeader('Set-Cookie', 'admin_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0')
    return res.redirect('/')
  }

  res.status(400).json({ error: 'Ação inválida' })
}
