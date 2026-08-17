import crypto from 'crypto'
import { getConnection } from './_db.js'

const L2_CLASSES = {
  0:'Fighter',1:'Warrior',2:'Gladiator',3:'Warlord',4:'Knight',5:'Paladin',6:'Dark Avenger',
  7:'Rogue',8:'Treasure Hunter',9:'Hawkeye',10:'Mage',11:'Wizard',12:'Sorcerer',13:'Necromancer',
  14:'Warlock',15:'Cleric',16:'Bishop',17:'Prophet',18:'Elven Fighter',19:'Elven Knight',
  20:'Temple Knight',21:'Swordsinger',22:'Elven Scout',23:'Plainswalker',24:'Silver Ranger',
  25:'Elven Mage',26:'Elven Wizard',27:'Spellsinger',28:'Elemental Summoner',29:'Elven Oracle',
  30:'Elven Elder',31:'Dark Fighter',32:'Palus Knight',33:'Shillien Knight',34:'Bladedancer',
  35:'Assassin',36:'Abyss Walker',37:'Phantom Ranger',38:'Dark Mage',39:'Dark Wizard',
  40:'Shillien Elder',41:'Phantom Summoner',42:'Shillien Oracle',43:'Orc Fighter',44:'Orc Raider',
  45:'Destroyer',46:'Tyrant',47:'Orc Mystic',48:'Shaman',49:'Overlord',50:'Warcryer',
  51:'Dwarven Fighter',52:'Scavenger',53:'Bounty Hunter',54:'Artisan',55:'Warsmith',
  88:'Duelist',89:'Dreadnought',90:'Phoenix Knight',91:'Hell Knight',92:'Sagittarius',
  93:'Adventurer',94:'Archmage',95:'Soultaker',96:'Arcana Lord',97:'Cardinal',98:'Hierophant',
  99:"Eva's Templar",100:'Sword Muse',101:'Wind Rider',102:'Moonlight Sentinel',
  103:'Mystic Muse',104:'Elemental Master',105:"Eva's Saint",106:'Shillien Templar',
  107:'Spectral Dancer',108:'Ghost Hunter',109:'Ghost Sentinel',110:'Storm Screamer',
  111:'Spectral Master',112:'Shillien Saint',113:'Titan',114:'Grand Khavatari',
  115:'Dominator',116:'Doomcryer',117:'Fortune Seeker',118:'Maestro',
}

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
  const url = req.url || ''
  if (url.includes('/login')) return 'login'
  if (url.includes('/logout')) return 'logout'
  if (url.includes('/me')) return 'me'
  if (url.includes('/wallet')) return 'wallet'
  if (url.includes('/redeem')) return 'redeem'
  return req.query.action || ''
}

export default async function handler(req, res) {
  const action = getAction(req)
  const jwtSecret = process.env.JWT_SECRET

  // POST /api/player/login — autentica jogador
  if (action === 'login') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método inválido' })
    const { login, password } = req.body || {}
    if (!login || !password) return res.status(400).json({ error: 'Login e senha obrigatórios' })

    try {
      const db = await getConnection()
      const hashedPass = crypto.createHash('sha1').update(password).digest('base64')
      const [rows] = await db.query(
        'SELECT login, email FROM accounts WHERE login = ? AND password = ?',
        [login, hashedPass]
      )
      if (rows.length === 0) return res.status(401).json({ error: 'Login ou senha incorretos' })

      const account = rows[0]
      const jwt = createJWT({ login: account.login, email: account.email, exp: Math.floor(Date.now() / 1000) + 86400 }, jwtSecret)
      res.setHeader('Set-Cookie', `player_session=${jwt}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`)
      return res.status(200).json({ success: true, login: account.login })
    } catch (err) {
      return res.status(500).json({ error: 'Erro interno: ' + err.message })
    }
  }

  // GET /api/player/me — retorna dados do jogador logado
  if (action === 'me') {
    const cookies = req.headers.cookie || ''
    const match = cookies.match(/player_session=([^;]+)/)
    if (!match) return res.status(401).json({ authenticated: false })
    const payload = verifyJWT(match[1], jwtSecret)
    if (!payload) return res.status(401).json({ authenticated: false })

    try {
      const db = await getConnection()
      const [chars] = await db.query(
        'SELECT char_name, level, classid, online, pvpkills, onlinetime FROM characters WHERE account_name = ? ORDER BY level DESC',
        [payload.login]
      )
      // Saldo Ikoin (cria registro se não existir)
      let ikoin = 0
      try {
        const [bal] = await db.query('SELECT balance FROM ikoin_balance WHERE account_name = ?', [payload.login])
        ikoin = bal.length > 0 ? bal[0].balance : 0
      } catch {}

      return res.status(200).json({
        authenticated: true,
        login: payload.login,
        email: payload.email,
        ikoin,
        characters: chars.map(c => ({
          name: c.char_name,
          level: c.level,
          class: L2_CLASSES[c.classid] || `Class ${c.classid}`,
          online: c.online === 1,
          pvp: c.pvpkills || 0,
          onlinetime: c.onlinetime || 0,
        })),
      })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // GET /api/player/wallet — saldo + histórico de transações
  if (action === 'wallet') {
    const cookies = req.headers.cookie || ''
    const match = cookies.match(/player_session=([^;]+)/)
    if (!match) return res.status(401).json({ authenticated: false })
    const payload = verifyJWT(match[1], jwtSecret)
    if (!payload) return res.status(401).json({ authenticated: false })

    try {
      const db = await getConnection()
      const [bal] = await db.query('SELECT balance FROM ikoin_balance WHERE account_name = ?', [payload.login])
      const [txs] = await db.query(
        'SELECT amount, type, description, created_at FROM ikoin_transactions WHERE account_name = ? ORDER BY id DESC LIMIT 30',
        [payload.login]
      )
      return res.status(200).json({
        balance: bal.length > 0 ? bal[0].balance : 0,
        transactions: txs,
      })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // ==================== PROGRAMA DE INDICAÇÃO ====================
  // Valor mínimo e teto de saque por dia. O teto existe como trava anti-fraude:
  // se alguém achar um furo, o estrago fica limitado a R$ 100/dia até percebermos.
  //
  // ⚠️ PAYOUT_MIN TEMPORARIAMENTE 1 PARA TESTE (17/08/2026) — VOLTAR PARA 50.
  // Com 50, seria preciso gerar R$ 500 em compras indicadas só pra testar o saque.
  // O regulamento publicado (seção 12) diz R$ 50,00.
  const PAYOUT_MIN = 1
  const PAYOUT_MAX_DAY = 100

  // GET /api/player/referral — painel do parceiro (status, números, histórico)
  if (action === 'referral') {
    const cookies = req.headers.cookie || ''
    const match = cookies.match(/player_session=([^;]+)/)
    if (!match) return res.status(401).json({ authenticated: false })
    const payload = verifyJWT(match[1], jwtSecret)
    if (!payload) return res.status(401).json({ authenticated: false })

    try {
      const db = await getConnection()
      const [[st]] = await db.query(
        'SELECT slug, name, commission_pct, status, active, reject_reason FROM streamers WHERE account_name = ?',
        [payload.login])

      // não participa ainda: o site mostra o convite pra se inscrever
      if (!st) return res.status(200).json({ enrolled: false })

      // inscrito mas ainda não aprovado: mostra só o status
      if (st.status !== 'approved') {
        return res.status(200).json({
          enrolled: true, status: st.status, reject_reason: st.reject_reason || null,
        })
      }

      const now = Date.now()

      // Números do topo do painel. Uma consulta só, agrupando por status —
      // 'pending' vira "em validação" e 'available' vira "disponível".
      const [rows] = await db.query(
        `SELECT status, COUNT(*) AS qtd, COALESCE(SUM(commission_value),0) AS total,
                COALESCE(SUM(order_amount),0) AS vendas
         FROM referral_commissions WHERE streamer_slug = ? GROUP BY status`,
        [st.slug])
      const by = Object.fromEntries(rows.map(r => [r.status, r]))

      // 'pending' que já passou dos 30 dias conta como disponível na hora de exibir,
      // mesmo antes do job de maturação rodar — assim o painel nunca "atrasa".
      const [[maduro]] = await db.query(
        `SELECT COALESCE(SUM(commission_value),0) AS total FROM referral_commissions
         WHERE streamer_slug = ? AND status = 'pending' AND available_at <= ?`,
        [st.slug, now])
      const [[verde]] = await db.query(
        `SELECT COALESCE(SUM(commission_value),0) AS total FROM referral_commissions
         WHERE streamer_slug = ? AND status = 'pending' AND available_at > ?`,
        [st.slug, now])

      const [[indicados]] = await db.query(
        'SELECT COUNT(*) AS qtd FROM account_referrals WHERE streamer_slug = ?', [st.slug])

      const disponivel = Number(by.available?.total || 0) + Number(maduro.total || 0)
      const emValidacao = Number(verde.total || 0)
      const pago = Number(by.paid?.total || 0)

      // já sacou hoje? (para o teto diário)
      const [[hoje]] = await db.query(
        `SELECT COALESCE(SUM(amount),0) AS total FROM referral_payouts
         WHERE streamer_slug = ? AND status <> 'rejected' AND requested_at > ?`,
        [st.slug, now - 86400000])

      const [historico] = await db.query(
        `SELECT created_at, buyer_account, order_amount, commission_value, status, available_at
         FROM referral_commissions WHERE streamer_slug = ? ORDER BY id DESC LIMIT 50`,
        [st.slug])

      const [saques] = await db.query(
        `SELECT amount, status, requested_at, processed_at FROM referral_payouts
         WHERE streamer_slug = ? ORDER BY id DESC LIMIT 20`, [st.slug])

      return res.status(200).json({
        enrolled: true,
        status: 'approved',
        slug: st.slug,
        name: st.name,
        commission_pct: st.commission_pct,
        link: `https://l2ikarus.com/r/${st.slug}`,
        indicados: indicados.qtd || 0,
        compras: (by.pending?.qtd || 0) + (by.available?.qtd || 0) + (by.paid?.qtd || 0),
        vendas: Number(by.pending?.vendas || 0) + Number(by.available?.vendas || 0) + Number(by.paid?.vendas || 0),
        comissao_total: disponivel + emValidacao + pago,
        disponivel,
        em_validacao: emValidacao,
        ja_pago: pago,
        payout_min: PAYOUT_MIN,
        payout_max_day: PAYOUT_MAX_DAY,
        sacado_hoje: Number(hoje.total || 0),
        historico,
        saques,
      })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // POST /api/player/referral-join — inscrição no programa (entra como 'pending')
  if (action === 'referral-join') {
    const cookies = req.headers.cookie || ''
    const match = cookies.match(/player_session=([^;]+)/)
    if (!match) return res.status(401).json({ authenticated: false })
    const payload = verifyJWT(match[1], jwtSecret)
    if (!payload) return res.status(401).json({ authenticated: false })

    const { slug, accept } = req.body || {}

    // aceite explícito do regulamento — é o registro de que ele leu e concordou
    if (!accept) return res.status(400).json({ error: 'É preciso aceitar o regulamento.' })

    const s = (slug || '').trim().toLowerCase()
    if (!/^[a-z0-9_-]{3,32}$/.test(s))
      return res.status(400).json({ error: 'Link inválido. Use 3 a 32 caracteres: letras, números, _ ou -' })

    try {
      const db = await getConnection()

      // uma conta = um cadastro (regulamento, seção 3)
      const [[ja]] = await db.query('SELECT slug, status FROM streamers WHERE account_name = ?', [payload.login])
      if (ja) return res.status(400).json({ error: 'Você já possui uma inscrição.', status: ja.status })

      const [[ocupado]] = await db.query('SELECT slug FROM streamers WHERE slug = ?', [s])
      if (ocupado) return res.status(400).json({ error: 'Esse link já está em uso. Escolha outro.' })

      await db.query(
        `INSERT INTO streamers (slug, name, commission_pct, active, account_name, status, applied_at, created_at)
         VALUES (?, ?, 10, 1, ?, 'pending', ?, ?)`,
        [s, payload.login, payload.login, Date.now(), Date.now()])

      return res.status(200).json({ success: true, status: 'pending', slug: s })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // POST /api/player/referral-payout — solicita saque
  if (action === 'referral-payout') {
    const cookies = req.headers.cookie || ''
    const match = cookies.match(/player_session=([^;]+)/)
    if (!match) return res.status(401).json({ authenticated: false })
    const payload = verifyJWT(match[1], jwtSecret)
    if (!payload) return res.status(401).json({ authenticated: false })

    const { amount, pix_key } = req.body || {}
    const valor = Math.floor(Number(amount) * 100) / 100

    // A chave PIX só é pedida AQUI, no momento do saque — não no cadastro.
    // LGPD, princípio da necessidade: não se coleta dado de pagamento de quem
    // talvez nunca chegue a sacar.
    if (!pix_key || String(pix_key).trim().length < 5)
      return res.status(400).json({ error: 'Informe uma chave PIX válida.' })

    try {
      const db = await getConnection()
      const [[st]] = await db.query(
        "SELECT slug FROM streamers WHERE account_name = ? AND status = 'approved' AND active = 1",
        [payload.login])
      if (!st) return res.status(403).json({ error: 'Você não participa do programa.' })

      const now = Date.now()

      // matura o que já passou dos 30 dias antes de calcular o disponível
      await db.query(
        `UPDATE referral_commissions SET status = 'available'
         WHERE streamer_slug = ? AND status = 'pending' AND available_at <= ?`,
        [st.slug, now])

      const [[disp]] = await db.query(
        `SELECT COALESCE(SUM(commission_value),0) AS total FROM referral_commissions
         WHERE streamer_slug = ? AND status = 'available'`, [st.slug])
      const disponivel = Number(disp.total || 0)

      if (valor < PAYOUT_MIN)
        return res.status(400).json({ error: `Valor mínimo para saque: R$ ${PAYOUT_MIN},00` })
      if (valor > disponivel)
        return res.status(400).json({ error: `Saldo disponível: R$ ${disponivel.toFixed(2)}` })

      const [[hoje]] = await db.query(
        `SELECT COALESCE(SUM(amount),0) AS total FROM referral_payouts
         WHERE streamer_slug = ? AND status <> 'rejected' AND requested_at > ?`,
        [st.slug, now - 86400000])
      if (Number(hoje.total || 0) + valor > PAYOUT_MAX_DAY)
        return res.status(400).json({ error: `Limite de R$ ${PAYOUT_MAX_DAY},00 por dia. Já solicitado hoje: R$ ${Number(hoje.total).toFixed(2)}` })

      const [r] = await db.query(
        `INSERT INTO referral_payouts (streamer_slug, amount, status, pix_key, requested_at)
         VALUES (?, ?, 'requested', ?, ?)`,
        [st.slug, valor, String(pix_key).trim(), now])

      // marca as comissões que compõem este saque, das mais antigas pras mais novas
      let restante = valor
      const [comissoes] = await db.query(
        `SELECT id, commission_value FROM referral_commissions
         WHERE streamer_slug = ? AND status = 'available' ORDER BY created_at ASC`,
        [st.slug])
      for (const c of comissoes) {
        if (restante <= 0) break
        await db.query(
          "UPDATE referral_commissions SET status = 'paid', payout_id = ?, paid_at = ? WHERE id = ?",
          [r.insertId, now, c.id])
        restante -= Number(c.commission_value)
      }

      return res.status(200).json({ success: true, amount: valor, payout_id: r.insertId })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // POST /api/player/redeem — resgata código (credita Ikoin no site)
  if (action === 'redeem') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método inválido' })
    const cookies = req.headers.cookie || ''
    const match = cookies.match(/player_session=([^;]+)/)
    if (!match) return res.status(401).json({ error: 'Faça login.' })
    const payload = verifyJWT(match[1], jwtSecret)
    if (!payload) return res.status(401).json({ error: 'Sessão expirada.' })

    const { code } = req.body || {}
    if (!code) return res.status(400).json({ error: 'Informe o código.' })
    const account = payload.login

    try {
      const db = await getConnection()
      const [[promo]] = await db.query('SELECT * FROM promo_codes WHERE code = ?', [code.trim()])
      if (!promo) return res.status(404).json({ error: 'Código inválido.' })
      if (promo.active !== 1) return res.status(400).json({ error: 'Código inativo.' })
      if (promo.max_uses > 0 && promo.uses >= promo.max_uses) return res.status(400).json({ error: 'Código esgotado.' })

      if (!promo.ikoin || promo.ikoin <= 0) {
        return res.status(400).json({ error: 'Este código é resgatável apenas no jogo com .code ' + code.trim() })
      }

      // Verifica resgate de Ikoin já feito
      const [dup] = await db.query('SELECT 1 FROM promo_ikoin_redeemed WHERE code = ? AND account_name = ?', [code.trim(), account])
      if (dup.length > 0) return res.status(409).json({ error: 'Você já resgatou o Ikoin deste código.' })

      const now = Math.floor(Date.now() / 1000)
      // Credita Ikoin
      await db.query(
        `INSERT INTO ikoin_balance (account_name, balance, updated_at) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE balance = balance + ?, updated_at = ?`,
        [account, promo.ikoin, now, promo.ikoin, now]
      )
      await db.query(
        'INSERT INTO ikoin_transactions (account_name, amount, type, description, reference, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [account, promo.ikoin, 'code', `Código ${code.trim()}`, code.trim(), now]
      )
      await db.query('INSERT INTO promo_ikoin_redeemed (code, account_name, redeemed_at) VALUES (?, ?, ?)', [code.trim(), account, now])
      await db.query('UPDATE promo_codes SET uses = uses + 1 WHERE code = ?', [code.trim()])

      const hasItems = promo.items && promo.items.length > 0
      return res.status(200).json({
        success: true,
        ikoin: promo.ikoin,
        message: `+${promo.ikoin} Ikoin creditados!` + (hasItems ? ` Este código também dá itens — resgate no jogo com .code ${code.trim()}` : ''),
      })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // GET /api/player/logout
  if (action === 'logout') {
    res.setHeader('Set-Cookie', 'player_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0')
    return res.redirect('/')
  }

  res.status(400).json({ error: 'Ação inválida' })
}
