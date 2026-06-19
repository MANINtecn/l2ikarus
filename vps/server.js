import http from 'http'
import net from 'net'
import mysql from 'mysql2/promise'
import { config } from './config.js'

function checkPort(host, port, timeoutMs = 3000) {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    socket.setTimeout(timeoutMs)
    socket.on('connect', () => { socket.destroy(); resolve(true) })
    socket.on('timeout', () => { socket.destroy(); resolve(false) })
    socket.on('error', () => resolve(false))
    socket.connect(port, host)
  })
}

// Pool de conexão reaproveitado (MySQL local da VPS)
let pool
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...config.db,
      waitForConnections: true,
      connectionLimit: 3,
      queueLimit: 0,
      connectTimeout: 5000,
    })
  }
  return pool
}

async function getStats() {
  // "Online" baseado no MySQL local (confiavel). O check de porta 7777 nao funciona aqui
  // porque a 7777 publica e um proxy DDoS do host (nao escuta na VPS). Se o banco responde
  // e a query roda, o servidor esta operacional; players vem do characters online=1 (dado real).
  try {
    const p = getPool()
    const [[{ players }]] = await p.query('SELECT COUNT(*) AS players FROM characters WHERE online = 1')
    const [[{ accounts }]] = await p.query('SELECT COUNT(*) AS accounts FROM accounts')
    return { online: true, players, accounts }
  } catch (e) {
    console.error('DB error (status):', e.message)
    return { online: false, players: 0, accounts: 0 }
  }
}

// ===== Cadastro de conta (a senha JA chega hasheada do Vercel — texto puro nunca trafega) =====
const LOGIN_RE = /^[a-zA-Z0-9_]{4,16}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function registerAccount(body) {
  const login = (body.login || '').trim()
  const passwordHash = body.passwordHash || ''
  const email = (body.email || '').trim()
  const referredBy = (body.referredBy || '').trim().toLowerCase()

  if (!login || !passwordHash) {
    return { status: 400, body: { message: 'Dados incompletos.' } }
  }
  if (!LOGIN_RE.test(login)) {
    return { status: 400, body: { message: 'Login: 4-16 caracteres, apenas letras, números e _' } }
  }
  if (email && !EMAIL_RE.test(email)) {
    return { status: 400, body: { message: 'E-mail inválido' } }
  }
  try {
    const p = getPool()
    const [existing] = await p.query('SELECT login FROM accounts WHERE login = ?', [login])
    if (existing.length > 0) {
      return { status: 409, body: { message: 'Este login já está em uso' } }
    }
    const createdTime = Math.floor(Date.now() / 1000)
    await p.query(
      'INSERT INTO accounts (login, password, email, created_time) VALUES (?, ?, ?, ?)',
      [login, passwordHash, email, createdTime]
    )
    // Atribuicao de streamer/afiliado (first-touch): so grava se o slug existir e estiver ativo.
    if (referredBy && /^[a-z0-9_-]{2,32}$/.test(referredBy)) {
      try {
        const [s] = await p.query('SELECT slug FROM streamers WHERE slug=? AND active=1', [referredBy])
        if (s.length > 0) {
          await p.query(
            'INSERT IGNORE INTO account_referrals (account_name, streamer_slug, created_at) VALUES (?, ?, ?)',
            [login, referredBy, Date.now()]
          )
        }
      } catch (e) { console.error('referral insert error:', e.message) }
    }
    return { status: 200, body: { success: true, message: 'Conta criada com sucesso!' } }
  } catch (e) {
    console.error('DB error (register):', e.message)
    return { status: 500, body: { message: 'Erro ao criar conta.' } }
  }
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (c) => { data += c; if (data.length > 1e6) req.destroy() })
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')) } catch { resolve({}) } })
    req.on('error', () => resolve({}))
  })
}

http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'content-type, x-api-key')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    return res.end()
  }

  const path = (req.url || '').split('?')[0]

  // /status é PÚBLICO (online/players é info não-sensível; o launcher distribuído chama sem chave).
  if (req.method === 'GET' && path === '/status') {
    res.writeHead(200)
    return res.end(JSON.stringify(await getStats()))
  }

  // Daqui pra baixo exige a chave secreta (NUNCA vai pro launcher/cliente — só servidor-a-servidor).
  if (req.headers['x-api-key'] !== config.apiKey) {
    res.writeHead(401)
    return res.end(JSON.stringify({ error: 'unauthorized' }))
  }

  if (req.method === 'POST' && path === '/register') {
    const body = await readBody(req)
    const result = await registerAccount(body)
    res.writeHead(result.status)
    return res.end(JSON.stringify(result.body))
  }

  // Proxy de query: roda { sql, params } no MySQL local e devolve [result, fields].
  // Protegido pela x-api-key (so o site com a chave chama). Queries parametrizadas (sem injection).
  if (req.method === 'POST' && path === '/query') {
    const body = await readBody(req)
    try {
      const p = getPool()
      const [result] = await p.query(body.sql, body.params || [])
      res.writeHead(200)
      return res.end(JSON.stringify({ result }))
    } catch (e) {
      console.error('DB error (query):', e.message)
      res.writeHead(500)
      return res.end(JSON.stringify({ error: e.message }))
    }
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'not found' }))
}).listen(config.port, () => {
  console.log('✅ Status/API server rodando na porta ' + config.port)
})
