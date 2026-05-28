import crypto from 'crypto'

function createJWT(payload, secret) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${sig}`
}

export default async function handler(req, res) {
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
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) return res.redirect('/?auth_error=token_failed')

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const user = await userRes.json()

    if (adminEmails.length > 0 && !adminEmails.includes(user.email.toLowerCase())) {
      return res.redirect('/?auth_error=not_admin')
    }

    const jwt = createJWT({
      email: user.email,
      name: user.name,
      picture: user.picture,
      exp: Math.floor(Date.now() / 1000) + 86400, // 24h
    }, jwtSecret)

    res.setHeader('Set-Cookie', `admin_session=${jwt}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`)
    res.redirect('/?admin=1')
  } catch (err) {
    console.error('Auth callback error:', err)
    res.redirect('/?auth_error=server_error')
  }
}
