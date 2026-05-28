import crypto from 'crypto'

function verifyJWT(token, secret) {
  try {
    const [header, payload, sig] = token.split('.')
    const expected = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
    if (sig !== expected) return null
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (data.exp < Math.floor(Date.now() / 1000)) return null
    return data
  } catch {
    return null
  }
}

export default function handler(req, res) {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) return res.status(500).json({ authenticated: false })

  const cookies = req.headers.cookie || ''
  const match = cookies.match(/admin_session=([^;]+)/)
  if (!match) return res.status(401).json({ authenticated: false })

  const payload = verifyJWT(match[1], jwtSecret)
  if (!payload) return res.status(401).json({ authenticated: false })

  res.status(200).json({
    authenticated: true,
    user: { email: payload.email, name: payload.name, picture: payload.picture },
  })
}
