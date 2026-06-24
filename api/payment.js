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

// Token assinado pelo GS (HMAC) pra abrir o pagamento direto da janela do jogo, sem login/cookie.
function verifyPayToken(t, secret) {
  try {
    const [payloadB64, sig] = t.split('.')
    const expected = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url')
    if (sig !== expected) return null
    const data = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
    if (data.exp < Math.floor(Date.now() / 1000)) return null
    return data
  } catch { return null }
}

function getAction(req) {
  const url = req.url || ''
  if (url.includes('/create')) return 'create'
  if (url.includes('/webhook')) return 'webhook'
  if (url.includes('/status')) return 'status'
  if (url.includes('/pixtoken')) return 'pixtoken'
  if (url.includes('/pix')) return 'pix'
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

const PAGBANK_API = process.env.PAGBANK_BASE || 'https://api.pagseguro.com'

async function fetchPngBase64(url) {
  try {
    const r = await fetch(url)
    if (!r.ok) return ''
    const buf = Buffer.from(await r.arrayBuffer())
    return buf.toString('base64')
  } catch { return '' }
}

// Cria cobranca PIX no PagBank (PagSeguro). SEM CPF (doacao anonima).
// Retorna no mesmo formato do MP: { pbOrderId, qrText, qrBase64 } ou { error }.
async function createPagbankPix({ pbToken, orderId, account, email, qty, siteUrl }) {
  const amountCents = qty * 100
  const body = {
    reference_id: orderId,
    customer: { name: account, email },
    items: [{ reference_id: 'ikoin', name: `${qty} Ikoin - L2 Ikarus`, quantity: 1, unit_amount: amountCents }],
    qr_codes: [{ amount: { value: amountCents } }],
    notification_urls: [`${siteUrl}/api/payment/webhook?provider=pagbank`],
  }
  const r = await fetch(`${PAGBANK_API}/orders`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${pbToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await r.json()
  const qr = data?.qr_codes?.[0]
  if (!qr || !qr.text) {
    const msg = data?.error_messages?.[0]?.description || data?.message || 'Falha ao gerar PIX (PagBank).'
    return { error: msg }
  }
  const pngLink = (qr.links || []).find(l => /PNG/i.test(l.rel || ''))
  const qrBase64 = pngLink ? await fetchPngBase64(pngLink.href) : ''
  return { pbOrderId: data.id, qrText: qr.text, qrBase64 }
}

// Consulta o status de uma order no PagBank; true se houver charge PAID.
async function pagbankIsPaid(pbToken, pbOrderId) {
  try {
    const r = await fetch(`${PAGBANK_API}/orders/${pbOrderId}`, {
      headers: { 'Authorization': `Bearer ${pbToken}` },
    })
    const o = await r.json()
    return (o.charges || []).some(c => c.status === 'PAID')
  } catch { return false }
}

export default async function handler(req, res) {
  const action = getAction(req)
  const token = process.env.MP_ACCESS_TOKEN
  const jwtSecret = process.env.JWT_SECRET
  const siteUrl = process.env.SITE_URL || 'https://l2ikarus.com'

  // POST /api/payment/create — cria pagamento e retorna link do checkout
  if (action === 'create') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método inválido' })
    // CARTAO (MercadoPago Checkout) DESATIVADO: a conta MP tem divida e o valor que cai
    // e' usado pra abater a divida. Reativar quando a divida do MP for resolvida.
    return res.status(503).json({ error: 'Pagamento por cartão temporariamente indisponível. Use o PIX.' })
    if (!token) return res.status(500).json({ error: 'MP_ACCESS_TOKEN não configurado' })

    // Autentica o jogador
    const cookies = req.headers.cookie || ''
    const m = cookies.match(/player_session=([^;]+)/)
    const player = m ? verifyJWT(m[1], jwtSecret) : null
    if (!player) return res.status(401).json({ error: 'Faça login para comprar Ikoin.' })

    const { amount } = req.body || {}
    const qty = parseInt(amount)
    if (!qty || qty < 1) return res.status(400).json({ error: 'Quantidade mínima: 1 Ikoin.' })
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

  // POST /api/payment/pix — cria PIX (PagBank por padrao, MP fallback) e retorna QR base64 + copia-e-cola
  if (action === 'pix') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método inválido' })

    const cookies = req.headers.cookie || ''
    const m = cookies.match(/player_session=([^;]+)/)
    const player = m ? verifyJWT(m[1], jwtSecret) : null
    if (!player) return res.status(401).json({ error: 'Faça login para comprar Ikoin.' })

    const { amount } = req.body || {}
    const qty = parseInt(amount)
    if (!qty || qty < 1) return res.status(400).json({ error: 'Quantidade mínima: 1 Ikoin.' })
    if (qty > 100000) return res.status(400).json({ error: 'Quantidade máxima: 100.000 Ikoin.' })

    const provider = (req.body?.provider || 'pagbank').toLowerCase()
    const payerEmail = (player.email && player.email.includes('@')) ? player.email : `${player.login}@l2ikarus.com`

    try {
      const db = await getConnection()
      const orderId = crypto.randomUUID()
      const now = Math.floor(Date.now() / 1000)
      await db.query(
        'INSERT INTO ikoin_orders (id, account_name, amount, status, created_at) VALUES (?, ?, ?, ?, ?)',
        [orderId, player.login, qty, 'pending', now]
      )

      // ----- PagBank (UNICO ativo) -----
      // Fallback p/ MercadoPago DESATIVADO de proposito: a conta MP tem divida e
      // todo valor que cai e' usado pra abater a divida. Reativar (provider !== 'mp'
      // caindo no MP) so depois que a divida do MP for resolvida.
      if (provider !== 'mp') {
        const pbToken = process.env.PAGBANK_TOKEN
        if (!pbToken) return res.status(500).json({ error: 'PAGBANK_TOKEN não configurado' })
        const pb = await createPagbankPix({ pbToken, orderId, account: player.login, email: payerEmail, qty, siteUrl })
        if (pb.error) {
          console.error('PagBank pix error (fallback MP desativado):', pb.error)
          return res.status(503).json({ error: 'PIX temporariamente indisponível. Tente novamente em instantes.' })
        }
        await db.query('UPDATE ikoin_orders SET mp_payment_id = ? WHERE id = ?', ['PB:' + pb.pbOrderId, orderId])
        return res.status(200).json({ orderId, qrBase64: pb.qrBase64, qrCode: pb.qrText, amount: qty })
      }

      // ----- MercadoPago (somente via provider=mp explicito; nada manda isso hoje) -----
      if (!token) return res.status(500).json({ error: 'MP_ACCESS_TOKEN não configurado' })
      const payRes = await fetch(`${MP_API}/v1/payments`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Idempotency-Key': orderId },
        body: JSON.stringify({
          transaction_amount: qty,
          description: `${qty} Ikoin — L2 Ikarus`,
          payment_method_id: 'pix',
          external_reference: orderId,
          notification_url: `${siteUrl}/api/payment/webhook`,
          payer: { email: payerEmail, first_name: player.login },
        }),
      })
      const pay = await payRes.json()
      const tx = pay?.point_of_interaction?.transaction_data
      if (!tx || !tx.qr_code) {
        console.error('MP pix error:', pay)
        return res.status(500).json({ error: pay.message || 'Falha ao gerar PIX.' })
      }
      await db.query('UPDATE ikoin_orders SET mp_payment_id = ? WHERE id = ?', [String(pay.id), orderId])
      return res.status(200).json({ orderId, qrBase64: tx.qr_code_base64 || '', qrCode: tx.qr_code, amount: qty })
    } catch (err) {
      console.error('Pix create error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  // POST /api/payment/pixtoken — cria PIX a partir de token assinado pelo GS (janela do jogo)
  if (action === 'pixtoken') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método inválido' })
    if (!token) return res.status(500).json({ error: 'MP_ACCESS_TOKEN não configurado' })
    const paySecret = process.env.PAY_TOKEN_SECRET
    if (!paySecret) return res.status(500).json({ error: 'PAY_TOKEN_SECRET não configurado' })

    const { t } = req.body || {}
    const data = t ? verifyPayToken(t, paySecret) : null
    if (!data || !data.login) return res.status(401).json({ error: 'Link inválido ou expirado. Gere de novo no jogo.' })
    const qty = parseInt(data.amount)
    if (!qty || qty < 1 || qty > 100000) return res.status(400).json({ error: 'Valor inválido.' })

    try {
      const db = await getConnection()
      const [[acc]] = await db.query('SELECT email FROM accounts WHERE login = ?', [data.login])
      const orderId = crypto.randomUUID()
      const now = Math.floor(Date.now() / 1000)
      await db.query(
        'INSERT INTO ikoin_orders (id, account_name, amount, status, created_at) VALUES (?, ?, ?, ?, ?)',
        [orderId, data.login, qty, 'pending', now]
      )
      const payerEmail = (acc && acc.email && acc.email.includes('@')) ? acc.email : `${data.login}@l2ikarus.com`
      const payRes = await fetch(`${MP_API}/v1/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': orderId,
        },
        body: JSON.stringify({
          transaction_amount: qty,
          description: `${qty} Ikoin — L2 Ikarus`,
          payment_method_id: 'pix',
          external_reference: orderId,
          notification_url: `${siteUrl}/api/payment/webhook`,
          payer: { email: payerEmail, first_name: data.login },
        }),
      })
      const pay = await payRes.json()
      const tx = pay?.point_of_interaction?.transaction_data
      if (!tx || !tx.qr_code) {
        console.error('MP pixtoken error:', pay)
        return res.status(500).json({ error: pay.message || 'Falha ao gerar PIX.' })
      }
      await db.query('UPDATE ikoin_orders SET mp_payment_id = ? WHERE id = ?', [String(pay.id), orderId])
      return res.status(200).json({
        orderId,
        qrBase64: tx.qr_code_base64 || '',
        qrCode: tx.qr_code,
        amount: qty,
      })
    } catch (err) {
      console.error('Pixtoken create error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  // POST /api/payment/webhook — confirma pagamento (PagBank ou Mercado Pago)
  if (action === 'webhook') {
    // ----- PagBank: notification_url tem ?provider=pagbank -----
    if (req.query.provider === 'pagbank') {
      try {
        const order = req.body || {}
        const orderId = order.reference_id
        const paid = (order.charges || []).some(c => c.status === 'PAID')
        if (orderId && paid) {
          const db = await getConnection()
          const [r] = await db.query(
            'UPDATE ikoin_orders SET status = ?, paid_at = ? WHERE id = ? AND status = ?',
            ['paid', Math.floor(Date.now() / 1000), orderId, 'pending'])
          if (r && r.affectedRows > 0) {
            const [[ord]] = await db.query('SELECT account_name, amount FROM ikoin_orders WHERE id = ?', [orderId])
            if (ord) await creditIkoin(db, ord.account_name, ord.amount, 'purchase', `Compra de ${ord.amount} Ikoin (PIX PagBank)`, String(order.id || orderId))
          }
        }
        return res.status(200).send('ok')
      } catch (err) {
        console.error('PagBank webhook error:', err)
        return res.status(200).send('ok')
      }
    }
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
        // Idempotência atômica: só credita se ESTE update mudou o pedido de pending->paid
        const [r] = await db.query(
          'UPDATE ikoin_orders SET status = ?, mp_payment_id = ?, paid_at = ? WHERE id = ? AND status = ?',
          ['paid', String(paymentId), Math.floor(Date.now() / 1000), orderId, 'pending'])
        if (r && r.affectedRows > 0) {
          const [[order]] = await db.query('SELECT account_name, amount FROM ikoin_orders WHERE id = ?', [orderId])
          if (order) await creditIkoin(db, order.account_name, order.amount, 'purchase', `Compra de ${order.amount} Ikoin`, String(paymentId))
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
      const [[order]] = await db.query('SELECT status, amount, account_name, mp_payment_id FROM ikoin_orders WHERE id = ?', [orderId])
      if (!order) return res.status(200).json({ status: 'not_found' })

      // ----- PagBank: mp_payment_id no formato "PB:<orderId>" -----
      if (order.status === 'pending' && order.mp_payment_id && order.mp_payment_id.startsWith('PB:')) {
        const pbToken = process.env.PAGBANK_TOKEN
        if (pbToken && await pagbankIsPaid(pbToken, order.mp_payment_id.slice(3))) {
          const [r] = await db.query(
            'UPDATE ikoin_orders SET status = ?, paid_at = ? WHERE id = ? AND status = ?',
            ['paid', Math.floor(Date.now() / 1000), orderId, 'pending'])
          if (r && r.affectedRows > 0) {
            await creditIkoin(db, order.account_name, order.amount, 'purchase', `Compra de ${order.amount} Ikoin (PIX PagBank)`, order.mp_payment_id)
          }
          return res.status(200).json({ status: 'paid', amount: order.amount })
        }
        return res.status(200).json({ status: order.status, amount: order.amount })
      }

      // Se ainda pendente e tem pagamento MP, consulta direto (não depende só do webhook)
      if (order.status === 'pending' && order.mp_payment_id && token) {
        try {
          const payRes = await fetch(`${MP_API}/v1/payments/${order.mp_payment_id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          })
          const payment = await payRes.json()
          if (payment.status === 'approved') {
            const [r] = await db.query(
              'UPDATE ikoin_orders SET status = ?, paid_at = ? WHERE id = ? AND status = ?',
              ['paid', Math.floor(Date.now() / 1000), orderId, 'pending'])
            if (r && r.affectedRows > 0) {
              await creditIkoin(db, order.account_name, order.amount, 'purchase', `Compra de ${order.amount} Ikoin (PIX)`, String(order.mp_payment_id))
            }
            return res.status(200).json({ status: 'paid', amount: order.amount })
          }
        } catch { /* ignora, devolve o status do banco */ }
      }
      return res.status(200).json({ status: order.status, amount: order.amount })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  res.status(400).json({ error: 'Ação inválida' })
}
