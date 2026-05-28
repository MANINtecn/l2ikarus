import crypto from 'crypto'
import pool from '../_db.js'

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

export default async function handler(req, res) {
  const jwtSecret = process.env.JWT_SECRET
  const cookies = req.headers.cookie || ''
  const match = cookies.match(/admin_session=([^;]+)/)
  if (!match || !verifyJWT(match[1], jwtSecret)) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  try {
    const db = await pool.getConnection()

    const [online] = await db.query(
      `SELECT char_name, level, classid, account_name
       FROM characters WHERE online = 1
       ORDER BY level DESC LIMIT 50`
    )

    const [accounts] = await db.query(
      `SELECT COUNT(*) as total FROM accounts`
    )

    const [recent] = await db.query(
      `SELECT login, lastactive
       FROM accounts
       ORDER BY lastactive DESC LIMIT 10`
    )

    db.release()

    res.status(200).json({
      onlinePlayers: online,
      totalAccounts: accounts[0]?.total || 0,
      recentLogins: recent,
    })
  } catch (err) {
    console.error('Admin players error:', err)
    res.status(500).json({ error: err.message, onlinePlayers: [], totalAccounts: 0, recentLogins: [] })
  }
}
