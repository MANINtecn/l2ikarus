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

// Pool de conexão reaproveitado (MySQL local da VPS). Essence = pool padrao (compat
// com /status sem parametro, usado ha tempos). Interlude = pool separado, banco l2jacis
// (mesma instancia MySQL, banco proprio do aCis). Ver config.js.
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

let poolInterlude
function getPoolInterlude() {
  if (!poolInterlude) {
    poolInterlude = mysql.createPool({
      ...config.dbInterlude,
      waitForConnections: true,
      connectionLimit: 3,
      queueLimit: 0,
      connectTimeout: 5000,
    })
  }
  return poolInterlude
}

// IKARUS 2026-07-15: getStats agora aceita qual servidor consultar. server=undefined
// ou 'essence' = comportamento ORIGINAL (nao mudar, o card do Essence ja depende disso
// em producao). server='interlude' = mesma logica, banco l2jacis. Estrutura da tabela
// characters e identica nos dois (coluna online), confirmado 2026-07-15.
async function getStats(server) {
  const p = server === 'interlude' ? getPoolInterlude() : getPool()
  // "Online" baseado no MySQL local (confiavel). O check de porta 7777 nao funciona aqui
  // porque a 7777 publica e um proxy DDoS do host (nao escuta na VPS). Se o banco responde
  // e a query roda, o servidor esta operacional; players vem do characters online=1 (dado real).
  try {
    const [[{ players }]] = await p.query('SELECT COUNT(*) AS players FROM characters WHERE online = 1')
    const [[{ accounts }]] = await p.query('SELECT COUNT(*) AS accounts FROM accounts')
    return { online: true, players, accounts }
  } catch (e) {
    console.error(`DB error (status, server=${server || 'essence'}):`, e.message)
    return { online: false, players: 0, accounts: 0 }
  }
}

// ===== Cadastro de conta (a senha JA chega hasheada do Vercel — texto puro nunca trafega) =====
const LOGIN_RE = /^[a-zA-Z0-9_]{4,16}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function registerAccount(body) {
  const login = (body.login || '').trim()
  const passwordHash = body.passwordHash || ''       // SHA1-base64 (Essence)
  const passwordBcrypt = body.passwordBcrypt || ''   // BCrypt $2a$ (Interlude/aCis)
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
    // IKARUS 2026-07-17: 1 conta = TODOS os jogos, mas cada engine tem seu formato de
    // senha. Interlude (aCis) usa BCrypt ($2a$) — SEM o hash bcrypt a conta grava lixo e
    // o login do aCis quebra ("Invalid salt version"). So espelha se o bcrypt veio.
    // Falha aqui NAO derruba o cadastro (banco do Essence e a conta-mae).
    if (passwordBcrypt) {
      try {
        await getPoolInterlude().query('INSERT IGNORE INTO accounts (login, password) VALUES (?, ?)', [login, passwordBcrypt])
      } catch (e) {
        console.error('interlude account mirror error:', e.message)
      }
    }
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
  const query = new URLSearchParams((req.url || '').split('?')[1] || '')

  // /status é PÚBLICO. ?server=interlude consulta o banco do aCis; sem parametro
  // (ou server=essence) mantem o comportamento ORIGINAL de sempre.
  if (req.method === 'GET' && path === '/status') {
    res.writeHead(200)
    return res.end(JSON.stringify(await getStats(query.get('server'))))
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
      // IKARUS 2026-07-16: body.db='interlude' roteia pro banco do aCis (l2jacis).
      // Sem body.db = banco do Essence (comportamento original). Compartilhados
      // (ikoin, contas do site) SEMPRE ficam no banco do Essence.
      const p = body.db === 'interlude' ? getPoolInterlude() : getPool()
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

  // ===== aCis INTERLUDE BBS — rotas seguras (x-api-key obrigatória, já validada acima) =====

  // GET /acis/ikoin/:account — saldo de Ikoin
  if (req.method === 'GET' && path.startsWith('/acis/ikoin/')) {
    const account = decodeURIComponent(path.replace('/acis/ikoin/', '').replace(/[^a-zA-Z0-9_]/g, ''))
    try {
      const p = getPool()
      const [rows] = await p.query('SELECT balance FROM ikoin_balance WHERE account_name=?', [account])
      const balance = rows.length > 0 ? rows[0].balance : 0
      res.writeHead(200)
      return res.end(JSON.stringify({ balance }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
  }

  // GET /acis/premium/:account — status premium Interlude
  if (req.method === 'GET' && path.startsWith('/acis/premium/')) {
    const account = decodeURIComponent(path.replace('/acis/premium/', '').replace(/[^a-zA-Z0-9_]/g, ''))
    try {
      const p = getPool()
      const [rows] = await p.query('SELECT premium_expiry FROM account_premium_interlude WHERE account_name=?', [account])
      const expiry = rows.length > 0 ? rows[0].premium_expiry : 0
      const active = expiry > Date.now()
      res.writeHead(200)
      return res.end(JSON.stringify({ active, expiry }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
  }

  // POST /acis/ikoin/spend — gasto GENERICO de Ikoin (NPC Donate: build por classe,
  // nobless, etc). Debita amount validando saldo. { account, amount, description }
  if (req.method === 'POST' && path === '/acis/ikoin/spend') {
    const body = await readBody(req)
    const account = (body.account || '').replace(/[^a-zA-Z0-9_]/g, '')
    const amount = Math.max(0, parseInt(body.amount) || 0)
    const desc = String(body.description || 'Gasto Ikoin').slice(0, 120)
    if (!account || amount <= 0) { res.writeHead(400); return res.end(JSON.stringify({ error: 'dados incompletos' })) }
    try {
      const p = getPool()
      const [bal] = await p.query('SELECT balance FROM ikoin_balance WHERE account_name=?', [account])
      const balance = bal.length > 0 ? bal[0].balance : 0
      if (balance < amount) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Saldo insuficiente.' })) }
      const now = Date.now()
      await p.query('UPDATE ikoin_balance SET balance=balance-?, updated_at=? WHERE account_name=?', [amount, now, account])
      await p.query('INSERT INTO ikoin_transactions (account_name, amount, type, description, created_at) VALUES (?,?,?,?,?)', [account, -amount, 'spend', desc, now])
      res.writeHead(200)
      return res.end(JSON.stringify({ ok: true }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
  }

  // POST /acis/premium/grant — registra dias de premium SEM debitar Ikoin (o debito ja
  // foi feito antes via /acis/ikoin/spend pelo NPC Donate). { account, days }
  if (req.method === 'POST' && path === '/acis/premium/grant') {
    const body = await readBody(req)
    const account = (body.account || '').replace(/[^a-zA-Z0-9_]/g, '')
    const days = Math.max(1, parseInt(body.days) || 30)
    if (!account) { res.writeHead(400); return res.end(JSON.stringify({ error: 'account obrigatório' })) }
    try {
      const p = getPool()
      const now = Date.now()
      const [prem] = await p.query('SELECT premium_expiry FROM account_premium_interlude WHERE account_name=?', [account])
      const currentExpiry = (prem.length > 0 && prem[0].premium_expiry > now) ? prem[0].premium_expiry : now
      const newExpiry = currentExpiry + days * 86400000
      await p.query('INSERT INTO account_premium_interlude (account_name, premium_expiry, updated_at) VALUES (?,?,?) ON DUPLICATE KEY UPDATE premium_expiry=?, updated_at=?', [account, newExpiry, now, newExpiry, now])
      res.writeHead(200)
      return res.end(JSON.stringify({ ok: true, newExpiry }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
  }

  // POST /acis/premium/buy — compra premium Interlude (50 Ikoin = 30 dias)
  if (req.method === 'POST' && path === '/acis/premium/buy') {
    const body = await readBody(req)
    const account = (body.account || '').replace(/[^a-zA-Z0-9_]/g, '')
    const PRICE = 50
    const DAYS = 30
    if (!account) { res.writeHead(400); return res.end(JSON.stringify({ error: 'account obrigatório' })) }
    try {
      const p = getPool()
      const [bal] = await p.query('SELECT balance FROM ikoin_balance WHERE account_name=?', [account])
      const balance = bal.length > 0 ? bal[0].balance : 0
      if (balance < PRICE) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Saldo insuficiente.' })) }
      const now = Date.now()
      const [prem] = await p.query('SELECT premium_expiry FROM account_premium_interlude WHERE account_name=?', [account])
      const currentExpiry = (prem.length > 0 && prem[0].premium_expiry > now) ? prem[0].premium_expiry : now
      const newExpiry = currentExpiry + DAYS * 86400000
      await p.query('INSERT INTO account_premium_interlude (account_name, premium_expiry, updated_at) VALUES (?,?,?) ON DUPLICATE KEY UPDATE premium_expiry=?, updated_at=?', [account, newExpiry, now, newExpiry, now])
      await p.query('UPDATE ikoin_balance SET balance=balance-?, updated_at=? WHERE account_name=?', [PRICE, now, account])
      await p.query('INSERT INTO ikoin_transactions (account_name, amount, type, description, created_at) VALUES (?,?,?,?,?)', [account, -PRICE, 'spend', 'Premium 30 dias - Interlude', now])
      res.writeHead(200)
      return res.end(JSON.stringify({ ok: true, newExpiry }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
  }

  // POST /acis/classmaster/buy3rd — libera a 3a classe via Ikoin (20 Ikoin, uma vez por classe)
  if (req.method === 'POST' && path === '/acis/classmaster/buy3rd') {
    const body = await readBody(req)
    const account = (body.account || '').replace(/[^a-zA-Z0-9_]/g, '')
    const PRICE = 20
    if (!account) { res.writeHead(400); return res.end(JSON.stringify({ error: 'account obrigatório' })) }
    try {
      const p = getPool()
      const [bal] = await p.query('SELECT balance FROM ikoin_balance WHERE account_name=?', [account])
      const balance = bal.length > 0 ? bal[0].balance : 0
      if (balance < PRICE) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Saldo insuficiente.' })) }
      const now = Date.now()
      await p.query('UPDATE ikoin_balance SET balance=balance-?, updated_at=? WHERE account_name=?', [PRICE, now, account])
      await p.query('INSERT INTO ikoin_transactions (account_name, amount, type, description, created_at) VALUES (?,?,?,?,?)', [account, -PRICE, 'spend', '3a Classe - Interlude', now])
      res.writeHead(200)
      return res.end(JSON.stringify({ ok: true }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
  }

  // GET /acis/offers — ofertas ativas do Interlude
  if (req.method === 'GET' && path === '/acis/offers') {
    try {
      // 2026-07-16: ofertas do Interlude agora vivem no PROPRIO banco dele (l2jacis).
      const [rows] = await getPoolInterlude().query("SELECT id, item_id, count, price_ikoin, title, icon, enchant FROM game_offer WHERE active=1 ORDER BY id")
      res.writeHead(200)
      return res.end(JSON.stringify({ offers: rows }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
  }

  // POST /acis/offers/buy — comprar oferta com Ikoin
  if (req.method === 'POST' && path === '/acis/offers/buy') {
    const body = await readBody(req)
    const account = (body.account || '').replace(/[^a-zA-Z0-9_]/g, '')
    const offerId = parseInt(body.offerId) || 0
    if (!account || !offerId) { res.writeHead(400); return res.end(JSON.stringify({ error: 'Dados inválidos.' })) }
    try {
      // Oferta = banco do Interlude; Ikoin = banco do Essence (carteira COMPARTILHADA da rede).
      const p = getPool()
      const [offers] = await getPoolInterlude().query('SELECT * FROM game_offer WHERE id=? AND active=1', [offerId])
      if (!offers.length) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Oferta indisponível.' })) }
      const offer = offers[0]
      const [bal] = await p.query('SELECT balance FROM ikoin_balance WHERE account_name=?', [account])
      const balance = bal.length > 0 ? bal[0].balance : 0
      if (balance < offer.price_ikoin) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Saldo insuficiente.' })) }
      const now = Date.now()
      await p.query('UPDATE ikoin_balance SET balance=balance-?, updated_at=? WHERE account_name=?', [offer.price_ikoin, now, account])
      await p.query('INSERT INTO ikoin_transactions (account_name, amount, type, description, created_at) VALUES (?,?,?,?,?)', [account, -offer.price_ikoin, 'spend', `Oferta: ${offer.title} - Interlude`, now])
      res.writeHead(200)
      // enchant: permite vender item ja encantado (ex: arma +20). 0 = normal.
      return res.end(JSON.stringify({ ok: true, itemId: offer.item_id, count: offer.count, enchant: offer.enchant || 0 }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
  }

  // GET /acis/rankings/:type — rankings (pvp, pk, rec)
  if (req.method === 'GET' && path.startsWith('/acis/rankings/')) {
    const type = path.replace('/acis/rankings/', '').replace(/[^a-z]/g, '')
    const orderCol = type === 'pk' ? 'pkkills' : type === 'rec' ? 'recommend' : 'pvpkills'
    try {
      // rankings do Interlude vem do banco do Interlude (l2jacis), nao do Essence
      const p = getPoolInterlude()
      const [rows] = await p.query(`SELECT char_name, level, pvpkills, pkkills, recommend FROM characters WHERE char_name != 'ADMIN' ORDER BY ${orderCol} DESC LIMIT 15`)
      res.writeHead(200)
      return res.end(JSON.stringify({ rankings: rows }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
  }

  // POST /acis/changenick — troca de nick (50 Ikoin)
  if (req.method === 'POST' && path === '/acis/changenick') {
    const body = await readBody(req)
    const account = (body.account || '').replace(/[^a-zA-Z0-9_]/g, '')
    const oldNick = (body.oldNick || '').trim()
    const newNick = (body.newNick || '').trim()
    const PRICE = 50
    if (!account || !oldNick || !newNick) { res.writeHead(400); return res.end(JSON.stringify({ error: 'Dados incompletos.' })) }
    if (!/^[A-Za-z0-9]{1,16}$/.test(newNick)) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Nome inválido (1-16 letras/números).' })) }
    try {
      // Ikoin = banco do Essence (carteira compartilhada); characters = banco do Interlude (l2jacis).
      const p = getPool()
      const pi = getPoolInterlude()
      const [bal] = await p.query('SELECT balance FROM ikoin_balance WHERE account_name=?', [account])
      const balance = bal.length > 0 ? bal[0].balance : 0
      if (balance < PRICE) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Saldo insuficiente (50 Ikoin).' })) }
      const [existing] = await pi.query('SELECT char_name FROM characters WHERE char_name=?', [newNick])
      if (existing.length) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Nome já está em uso.' })) }
      const [target] = await pi.query('SELECT char_name FROM characters WHERE char_name=? AND account_name=?', [oldNick, account])
      if (!target.length) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Personagem não encontrado.' })) }
      const now = Date.now()
      await pi.query('UPDATE characters SET char_name=? WHERE char_name=? AND account_name=?', [newNick, oldNick, account])
      await p.query('UPDATE ikoin_balance SET balance=balance-?, updated_at=? WHERE account_name=?', [PRICE, now, account])
      await p.query('INSERT INTO ikoin_transactions (account_name, amount, type, description, created_at) VALUES (?,?,?,?,?)', [account, -PRICE, 'spend', `Troca de nick: ${oldNick} → ${newNick} - Interlude`, now])
      res.writeHead(200)
      return res.end(JSON.stringify({ ok: true }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
  }

  // POST /acis/nobless/buy — compra status Nobless (100 Ikoin). O flag nobless em si
  // e gravado pelo GS (setNoble persiste em l2jacis.characters); aqui so debita a carteira.
  if (req.method === 'POST' && path === '/acis/nobless/buy') {
    const body = await readBody(req)
    const account = (body.account || '').replace(/[^a-zA-Z0-9_]/g, '')
    const charName = (body.charName || '').trim()
    const PRICE = 100
    if (!account || !charName) { res.writeHead(400); return res.end(JSON.stringify({ error: 'Dados incompletos.' })) }
    try {
      const p = getPool()
      const pi = getPoolInterlude()
      const [chars] = await pi.query('SELECT nobless FROM characters WHERE char_name=? AND account_name=?', [charName, account])
      if (!chars.length) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Personagem não encontrado.' })) }
      if (chars[0].nobless === 1) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Personagem já é Nobless.' })) }
      const [bal] = await p.query('SELECT balance FROM ikoin_balance WHERE account_name=?', [account])
      const balance = bal.length > 0 ? bal[0].balance : 0
      if (balance < PRICE) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Saldo insuficiente (100 Ikoin).' })) }
      const now = Date.now()
      await p.query('UPDATE ikoin_balance SET balance=balance-?, updated_at=? WHERE account_name=?', [PRICE, now, account])
      await p.query('INSERT INTO ikoin_transactions (account_name, amount, type, description, created_at) VALUES (?,?,?,?,?)', [account, -PRICE, 'spend', `Nobless: ${charName} - Interlude`, now])
      res.writeHead(200)
      return res.end(JSON.stringify({ ok: true }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
  }

  // POST /acis/changesex — troca de sexo (30 Ikoin)
  if (req.method === 'POST' && path === '/acis/changesex') {
    const body = await readBody(req)
    const account = (body.account || '').replace(/[^a-zA-Z0-9_]/g, '')
    const charName = (body.charName || '').trim()
    const PRICE = 30
    if (!account || !charName) { res.writeHead(400); return res.end(JSON.stringify({ error: 'Dados incompletos.' })) }
    try {
      // Ikoin = banco do Essence (compartilhado); characters = banco do Interlude (l2jacis).
      const p = getPool()
      const pi = getPoolInterlude()
      const [bal] = await p.query('SELECT balance FROM ikoin_balance WHERE account_name=?', [account])
      const balance = bal.length > 0 ? bal[0].balance : 0
      if (balance < PRICE) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Saldo insuficiente (30 Ikoin).' })) }
      const [chars] = await pi.query('SELECT sex FROM characters WHERE char_name=? AND account_name=?', [charName, account])
      if (!chars.length) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Personagem não encontrado.' })) }
      const newSex = chars[0].sex === 0 ? 1 : 0
      const now = Date.now()
      await pi.query('UPDATE characters SET sex=? WHERE char_name=? AND account_name=?', [newSex, charName, account])
      await p.query('UPDATE ikoin_balance SET balance=balance-?, updated_at=? WHERE account_name=?', [PRICE, now, account])
      await p.query('INSERT INTO ikoin_transactions (account_name, amount, type, description, created_at) VALUES (?,?,?,?,?)', [account, -PRICE, 'spend', `Troca de sexo: ${charName} - Interlude`, now])
      res.writeHead(200)
      return res.end(JSON.stringify({ ok: true, newSex }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
  }

  // POST /acis/redeem — resgata código promocional no Interlude
  if (req.method === 'POST' && path === '/acis/redeem') {
    const body = await readBody(req)
    const account = (body.account || '').replace(/[^a-zA-Z0-9_]/g, '')
    const code = (body.code || '').trim().toUpperCase()
    if (!account || !code) { res.writeHead(400); return res.end(JSON.stringify({ error: 'Dados inválidos.' })) }
    try {
      // Codigos do Interlude = banco do Interlude; Ikoin = banco do Essence (compartilhado).
      const p = getPool()
      const pi = getPoolInterlude()
      const [rows] = await pi.query('SELECT items, ikoin, active, max_uses, uses FROM promo_codes WHERE code=?', [code])
      if (!rows.length) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Código inválido.' })) }
      const promo = rows[0]
      if (!promo.active) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Código inativo.' })) }
      if (promo.max_uses > 0 && promo.uses >= promo.max_uses) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Código atingiu o limite de usos.' })) }
      const [dup] = await pi.query('SELECT 1 FROM promo_redeemed WHERE code=? AND account_name=?', [code, account])
      if (dup.length) { res.writeHead(200); return res.end(JSON.stringify({ ok: false, error: 'Você já resgatou este código.' })) }
      // Monta lista de itens pra entregar no Java
      const items = []
      if (promo.items) {
        for (const pair of promo.items.split(';')) {
          const parts = pair.trim().split(':')
          if (parts.length === 2) items.push({ itemId: parseInt(parts[0]), count: parseInt(parts[1]) })
        }
      }
      const now = Date.now()
      await pi.query('INSERT INTO promo_redeemed (code, account_name, redeemed_at) VALUES (?,?,?)', [code, account, now])
      await pi.query('UPDATE promo_codes SET uses=uses+1 WHERE code=?', [code])
      if (promo.ikoin > 0) {
        await p.query('INSERT INTO ikoin_balance (account_name, balance, updated_at) VALUES (?,?,?) ON DUPLICATE KEY UPDATE balance=balance+?, updated_at=?', [account, promo.ikoin, now, promo.ikoin, now])
        await p.query('INSERT INTO ikoin_transactions (account_name, amount, type, description, created_at) VALUES (?,?,?,?,?)', [account, promo.ikoin, 'promo', `Código resgatado: ${code}`, now])
      }
      res.writeHead(200)
      return res.end(JSON.stringify({ ok: true, items, ikoin: promo.ikoin || 0 }))
    } catch (e) {
      res.writeHead(500); return res.end(JSON.stringify({ error: e.message }))
    }
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
