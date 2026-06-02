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

function requireAdmin(req, res) {
  const jwtSecret = process.env.JWT_SECRET
  const cookies = req.headers.cookie || ''
  const match = cookies.match(/admin_session=([^;]+)/)
  if (!match) { res.status(401).json({ error: 'Não autorizado' }); return null }
  const payload = verifyJWT(match[1], jwtSecret)
  if (!payload) { res.status(401).json({ error: 'Sessão expirada' }); return null }
  return payload
}

function getAction(req) {
  const url = req.url || ''
  if (url.includes('/stats')) return 'stats'
  if (url.includes('/players')) return 'players'
  if (url.includes('/accounts')) return 'accounts'
  if (url.includes('/ranking')) return 'ranking'
  if (url.includes('/ban')) return 'ban'
  if (url.includes('/unban')) return 'unban'
  if (url.includes('/chars')) return 'chars'
  return req.query.action || ''
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  const action = getAction(req)
  const db = await getConnection()

  try {
    // GET /api/admin/stats — métricas gerais
    if (action === 'stats') {
      const now = Math.floor(Date.now() / 1000)
      const todayStart = now - (now % 86400)
      const weekStart = now - 7 * 86400

      const [[{ online }]] = await db.query('SELECT COUNT(*) as online FROM characters WHERE online = 1')
      const [[{ total_accounts }]] = await db.query('SELECT COUNT(*) as total_accounts FROM accounts')
      const [[{ today }]] = await db.query('SELECT COUNT(*) as today FROM accounts WHERE created_time >= ?', [todayStart])
      const [[{ week }]] = await db.query('SELECT COUNT(*) as week FROM accounts WHERE created_time >= ?', [weekStart])
      const [[{ total_chars }]] = await db.query('SELECT COUNT(*) as total_chars FROM characters')
      const [[{ banned }]] = await db.query('SELECT COUNT(*) as banned FROM accounts WHERE access_level < 0')

      // Registros por dia nos últimos 7 dias
      const [daily] = await db.query(
        `SELECT DATE(FROM_UNIXTIME(created_time)) as day, COUNT(*) as count
         FROM accounts WHERE created_time >= ?
         GROUP BY day ORDER BY day ASC`, [weekStart]
      )

      return res.status(200).json({ online, total_accounts, today, week, total_chars, banned, daily })
    }

    // GET /api/admin/players — jogadores online
    if (action === 'players') {
      const [rows] = await db.query(
        `SELECT char_name, level, classid, account_name, pvpkills, pkkills, onlinetime, x, y, z
         FROM characters WHERE online = 1 ORDER BY level DESC LIMIT 100`
      )
      return res.status(200).json({
        players: rows.map(r => ({
          name: r.char_name,
          level: r.level,
          class: L2_CLASSES[r.classid] || `Class ${r.classid}`,
          account: r.account_name,
          pvp: r.pvpkills,
          pk: r.pkkills,
          onlineTime: r.onlinetime,
        }))
      })
    }

    // GET /api/admin/accounts?q=search — busca contas
    if (action === 'accounts') {
      const q = req.query.q || ''
      const [rows] = await db.query(
        `SELECT login, email, access_level, lastIP, lastactive, created_time
         FROM accounts WHERE login LIKE ? OR email LIKE ?
         ORDER BY lastactive DESC LIMIT 30`,
        [`%${q}%`, `%${q}%`]
      )
      return res.status(200).json({ accounts: rows })
    }

    // GET /api/admin/chars?account=login — personagens de uma conta
    if (action === 'chars') {
      const account = req.query.account || ''
      const [rows] = await db.query(
        `SELECT char_name, level, classid, pvpkills, pkkills, online, exp, sp
         FROM characters WHERE account_name = ? ORDER BY level DESC`,
        [account]
      )
      return res.status(200).json({
        chars: rows.map(r => ({
          name: r.char_name,
          level: r.level,
          class: L2_CLASSES[r.classid] || `Class ${r.classid}`,
          pvp: r.pvpkills,
          pk: r.pkkills,
          online: r.online === 1,
        }))
      })
    }

    // GET /api/admin/ranking — top PvP e PK
    if (action === 'ranking') {
      const [pvp] = await db.query(
        `SELECT char_name, level, classid, pvpkills, pkkills FROM characters ORDER BY pvpkills DESC LIMIT 20`
      )
      const [pk] = await db.query(
        `SELECT char_name, level, classid, pvpkills, pkkills FROM characters ORDER BY pkkills DESC LIMIT 20`
      )
      return res.status(200).json({
        pvp: pvp.map(r => ({ name: r.char_name, level: r.level, class: L2_CLASSES[r.classid] || `Class ${r.classid}`, pvp: r.pvpkills, pk: r.pkkills })),
        pk: pk.map(r => ({ name: r.char_name, level: r.level, class: L2_CLASSES[r.classid] || `Class ${r.classid}`, pvp: r.pvpkills, pk: r.pkkills })),
      })
    }

    // POST /api/admin/ban — banir conta
    if (action === 'ban' && req.method === 'POST') {
      const { login, reason } = req.body || {}
      if (!login) return res.status(400).json({ error: 'Login obrigatório' })
      await db.query('UPDATE accounts SET access_level = -1 WHERE login = ?', [login])
      return res.status(200).json({ success: true, message: `${login} banido.` })
    }

    // POST /api/admin/unban — desbanir conta
    if (action === 'unban' && req.method === 'POST') {
      const { login } = req.body || {}
      if (!login) return res.status(400).json({ error: 'Login obrigatório' })
      await db.query('UPDATE accounts SET access_level = 0 WHERE login = ?', [login])
      return res.status(200).json({ success: true, message: `${login} desbanido.` })
    }

    res.status(400).json({ error: 'Ação inválida' })
  } catch (err) {
    console.error('Admin error:', err)
    res.status(500).json({ error: err.message })
  }
}
