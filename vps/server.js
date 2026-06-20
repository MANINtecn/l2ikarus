import http from 'http'
import net from 'net'
import crypto from 'crypto'
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

  // /status é PÚBLICO
  if (req.method === 'GET' && path === '/status') {
    res.writeHead(200)
    return res.end(JSON.stringify(await getStats()))
  }

  // QR Code PIX — PÚBLICO (cliente do jogo carrega a imagem sem api-key)
  if (req.method === 'GET' && path.startsWith('/ikoin/qr/')) {
    const mpgId = path.replace('/ikoin/qr/', '').replace(/[^0-9]/g, '')
    const b64 = qrCache.get(mpgId)
    if (!b64) { res.writeHead(404); return res.end('not found') }
    const buf = Buffer.from(b64, 'base64')
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'no-cache')
    res.writeHead(200)
    return res.end(buf)
  }

  // Webhook MPG — PÚBLICO (MPG chama de fora, sem api-key). Responde 200 imediatamente.
  if (req.method === 'POST' && path === '/mpg/webhook') {
    res.writeHead(200); res.end('{}')
    readBody(req).then(async (body) => {
      try {
        const mpgPaymentId = String(body.data?.id || body.id || '')
        if (!mpgPaymentId || body.action === 'payment.created') return
        const payment = await mpgGetPayment(mpgPaymentId)
        if (payment.status !== 'approved') return
        const p = getPool()
        const [rows] = await p.query(
          "SELECT * FROM ikoin_orders WHERE mp_payment_id=? AND status='pending'",
          [mpgPaymentId]
        )
        if (!rows.length) return
        const order = rows[0]
        await p.query("UPDATE ikoin_orders SET status='paid', paid_at=? WHERE id=?", [Date.now(), order.id])
        await p.query(
          'INSERT INTO ikoin_balance (account_name, balance, updated_at) VALUES (?,?,?) ON DUPLICATE KEY UPDATE balance=balance+?, updated_at=?',
          [order.account_name, order.amount, Date.now(), order.amount, Date.now()]
        )
        await p.query(
          'INSERT INTO ikoin_transactions (account_name, amount, type, description, reference, created_at) VALUES (?,?,?,?,?,?)',
          [order.account_name, order.amount, 'purchase', `PIX aprovado - ${order.amount} Ikoins`, mpgPaymentId, Date.now()]
        )
        console.log(`✅ PIX pago: ${order.account_name} +${order.amount} Ikoins (mpg_id=${mpgPaymentId})`)
      } catch (e) { console.error('webhook error:', e.message) }
    }).catch(() => {})
    return
  }

  // Daqui pra baixo exige a chave secreta (só servidor-a-servidor)
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

  // ===== CRIAR PIX (GS chama isso ao jogador pedir compra) =====
  if (req.method === 'POST' && path === '/ikoin/pix') {
    const body = await readBody(req)
    const account = (body.account || '').trim()
    const ikoins = parseInt(body.ikoins) || 0
    if (!account || ikoins < 10 || ikoins > 5000) {
      res.writeHead(400)
      return res.end(JSON.stringify({ error: 'Quantidade inválida (mín 10, máx 5000).' }))
    }
    try {
      const orderId = crypto.randomUUID()
      const mpgRes = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.mpgToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': orderId,
        },
        body: JSON.stringify({
          transaction_amount: ikoins,
          description: `${ikoins} Ikoins - L2 Ikarus`,
          payment_method_id: 'pix',
          payer: { email: `${account}@l2ikarus.com` },
        })
      })
      const mpg = await mpgRes.json()
      if (!mpg.id) throw new Error(mpg.message || JSON.stringify(mpg))
      const mpgId = String(mpg.id)
      const txData = mpg.point_of_interaction?.transaction_data || {}
      const pixCode = txData.qr_code || ''
      const qrBase64 = txData.qr_code_base64 || ''
      if (qrBase64) {
        qrCache.set(mpgId, qrBase64)
        setTimeout(() => qrCache.delete(mpgId), 31 * 60 * 1000)
      }
      const p = getPool()
      await p.query(
        'INSERT INTO ikoin_orders (id, account_name, amount, status, mp_payment_id, created_at) VALUES (?,?,?,?,?,?)',
        [orderId, account, ikoins, 'pending', mpgId, Date.now()]
      )
      res.writeHead(200)
      res.end(JSON.stringify({ ok: true, mpgId, pixCode, hasQr: !!qrBase64 }))
    } catch (e) {
      console.error('create pix error:', e.message)
      res.writeHead(500)
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  // ===== STATUS DO PIX (GS verifica se foi pago) =====
  if (req.method === 'GET' && path.startsWith('/ikoin/pix/')) {
    const mpgId = path.replace('/ikoin/pix/', '').replace(/[^0-9]/g, '')
    try {
      const p = getPool()
      const [rows] = await p.query("SELECT status, amount FROM ikoin_orders WHERE mp_payment_id=?", [mpgId])
      const order = rows[0] || { status: 'not_found', amount: 0 }
      res.writeHead(200)
      res.end(JSON.stringify(order))
    } catch (e) {
      res.writeHead(500)
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'not found' }))
}).listen(config.port, () => {
  console.log('✅ Status/API server rodando na porta ' + config.port)
})

// ===== HELPERS MERCADO PAGO =====
const qrCache = new Map() // mpgId -> base64 QR (expira em 31min via setTimeout)

async function mpgGetPayment(id) {
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
    headers: { 'Authorization': `Bearer ${config.mpgToken}` }
  })
  return res.json()
}
