import crypto from 'crypto'
import { getConnection } from './_db.js'

const MP_API = 'https://api.mercadopago.com'

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
  const url = req.url || ''
  if (url.includes('/create')) return 'create'
  if (url.includes('/webhook')) return 'webhook'
  if (url.includes('/status')) return 'status'
  return req.query.action || ''
}

async function creditIkoin(db, account, amount, type, description, reference) {
  const now = Math.floor(Date.now() / 1000)
  await db.query(
    `INSERT INTO ikoin_balance (account_name, balance, updated_at) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE balance = balance + ?, updated_at = ?`,
    [account, amount, now, amount, now]
  )
  await db.query(
    'INSERT INTO ikoin_transactions (account_name, amount, type, description, reference, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [account, amount, type, description, reference, now]
  )
}

export default async function handler(req, res) {
  const action = getAction(req)
  const token = process.env.MP_ACCESS_TOKEN
  const jwtSecret = process.env.JWT_SECRET
  const siteUrl = process.env.SITE_URL || 'https://l2ikarus.com'

  // POST /api/payment/create — cria pagamento e retorna link do checkout
  if (action === 'create') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método inválido' })
    if (!token) return res.status(500).json({ error: 'MP_ACCESS_TOKEN não configurado' })

    // Autentica o jogador
    const cookies = req.headers.cookie || ''
    const m = cookies.match(/player_session=([^;]+)/)
    const player = m ? verifyJWT(m[1], jwtSecret) : null
    if (!player) return res.status(401).json({ error: 'Faça login para comprar Ikoin.' })

    const { amount } = req.body || {}
    const qty = parseInt(amount)
    if (!qty || qty < 5) return res.status(400).json({ error: 'Quantidade mínima: 5 Ikoin.' })
    if (qty > 100000) return res.status(400).json({ error: 'Quantidade máxima: 100.000 Ikoin.' })

    try {
      const db = await getConnection()
      const orderId = crypto.randomUUID()
      const now = Math.floor(Date.now() / 1000)

      await db.query(
        'INSERT INTO ikoin_orders (id, account_name, amount, status, created_at) VALUES (?, ?, ?, ?, ?)',
        [orderId, player.login, qty, 'pending', now]
      )

      // Cria preferência no Mercado Pago (1 Ikoin = R$ 1,00)
      const prefRes = await fetch(`${MP_API}/checkout/preferences`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            title: `${qty} Ikoin — L2 Ikarus`,
            quantity: 1,
            unit_price: qty,
            currency_id: 'BRL',
          }],
          external_reference: orderId,
          notification_url: `${siteUrl}/api/payment/webhook`,
          back_urls: {
            success: `${siteUrl}/?ikoin=success`,
            failure: `${siteUrl}/?ikoin=failure`,
            pending: `${siteUrl}/?ikoin=pending`,
          },
          auto_return: 'approved',
        }),
      })
      const pref = await prefRes.json()
      if (!pref.init_point) {
        console.error('MP preference error:', pref)
        return res.status(500).json({ error: 'Falha ao criar pagamento.' })
      }

      return res.status(200).json({ checkoutUrl: pref.init_point, orderId })
    } catch (err) {
      console.error('Payment create error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  // POST /api/payment/webhook — Mercado Pago confirma pagamento
  if (action === 'webhook') {
    if (!token) return res.status(200).send('ok')
    try {
      const paymentId = req.body?.data?.id || req.query['data.id'] || req.query.id
      const type = req.body?.type || req.query.type
      if (type !== 'payment' || !paymentId) return res.status(200).send('ok')

      // Consulta o pagamento no MP
      const payRes = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const payment = await payRes.json()
      const orderId = payment.external_reference

      if (payment.status === 'approved' && orderId) {
        const db = await getConnection()
        // Garante idempotência: só credita se o pedido ainda está pending
        const [[order]] = await db.query('SELECT * FROM ikoin_orders WHERE id = ? AND status = ?', [orderId, 'pending'])
        if (order) {
          await db.query('UPDATE ikoin_orders SET status = ?, mp_payment_id = ?, paid_at = ? WHERE id = ?',
            ['paid', String(paymentId), Math.floor(Date.now() / 1000), orderId])
          await creditIkoin(db, order.account_name, order.amount, 'purchase', `Compra de ${order.amount} Ikoin`, String(paymentId))
        }
      }
      return res.status(200).send('ok')
    } catch (err) {
      console.error('Webhook error:', err)
      return res.status(200).send('ok') // sempre 200 para o MP não reenviar infinitamente
    }
  }

  // GET /api/payment/status?orderId=X — checa status de um pedido
  if (action === 'status') {
    const orderId = req.query.orderId
    if (!orderId) return res.status(400).json({ error: 'orderId obrigatório' })
    try {
      const db = await getConnection()
      const [[order]] = await db.query('SELECT status, amount FROM ikoin_orders WHERE id = ?', [orderId])
      return res.status(200).json(order || { status: 'not_found' })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  res.status(400).json({ error: 'Ação inválida' })
}
