import crypto from 'crypto'
import { getConnection } from './_db.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const ITEMS_DB = require('./items-db.json')
const itemName = (id) => ITEMS_DB[String(id)] || `Item #${id}`

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
        `SELECT * FROM characters WHERE online > 0 ORDER BY char_name ASC LIMIT 100`
      )
      // Descobre os nomes reais das colunas
      const cols = rows.length > 0 ? Object.keys(rows[0]) : []
      const pick = (r, ...names) => { for (const n of names) if (r[n] !== undefined) return r[n]; return null }

      return res.status(200).json({
        debug: rows.length === 0 ? 'Nenhuma linha com online>0' : { colunas: cols },
        players: rows.map(r => ({
          objId: pick(r, 'obj_Id', 'obj_id', 'charId', 'char_id', 'objId'),
          name: pick(r, 'char_name', 'charName', 'name'),
          level: pick(r, 'level'),
          class: L2_CLASSES[pick(r, 'classid', 'classId', 'class_id')] || `Class ${pick(r, 'classid', 'classId', 'class_id')}`,
          account: pick(r, 'account_name', 'accountName', 'account'),
          pvp: pick(r, 'pvpkills', 'pvpKills', 'pvp_kills'),
          pk: pick(r, 'pkkills', 'pkKills', 'pk_kills'),
          onlineTime: pick(r, 'onlinetime', 'onlineTime', 'online_time'),
        }))
      })
    }

    // GET /api/admin/char-detail?objId=X — detalhes + inventário do personagem
    if (action === 'char-detail') {
      const objId = req.query.objId
      if (!objId) return res.status(400).json({ error: 'objId obrigatório' })

      const [[char]] = await db.query(
        `SELECT obj_Id, char_name, level, classid, account_name, pvpkills, pkkills,
                onlinetime, exp, sp, x, y, z, curHp, maxHp, curMp, maxMp, karma, sex, race
         FROM characters WHERE obj_Id = ?`, [objId]
      )
      if (!char) return res.status(404).json({ error: 'Personagem não encontrado' })

      const [items] = await db.query(
        `SELECT item_id, count, enchant_level, loc, loc_data
         FROM items WHERE owner_id = ? AND loc IN ('PAPERDOLL','INVENTORY')
         ORDER BY loc DESC, loc_data ASC LIMIT 200`, [objId]
      )

      const SLOTS = {
        1:'Mão Dir',2:'Ouvido Esq',3:'Ouvido Dir',4:'Pescoço',5:'Anel Esq',6:'Anel Dir',
        7:'Cabeça',8:'Mão Esq',9:'Luvas',10:'Peito',11:'Pernas',12:'Botas',13:'Capa',14:'2 Mãos',
        19:'Cabelo',20:'Chapéu',22:'Pulseira Dir',23:'Pulseira Esq',
      }

      const equipped = items.filter(i => i.loc === 'PAPERDOLL').map(i => ({
        objectId: i.object_id, itemId: i.item_id, name: itemName(i.item_id),
        count: i.count, enchant: i.enchant_level,
        slot: SLOTS[i.loc_data] || `Slot ${i.loc_data}`,
      }))
      const inventory = items.filter(i => i.loc === 'INVENTORY').map(i => ({
        objectId: i.object_id, itemId: i.item_id, name: itemName(i.item_id),
        count: i.count, enchant: i.enchant_level,
      }))

      return res.status(200).json({
        char: {
          objId: char.obj_Id, name: char.char_name, level: char.level,
          class: L2_CLASSES[char.classid] || `Class ${char.classid}`,
          account: char.account_name, pvp: char.pvpkills, pk: char.pkkills,
          onlineTime: char.onlinetime, exp: char.exp, sp: char.sp,
          hp: `${char.curHp}/${char.maxHp}`, mp: `${char.curMp}/${char.maxMp}`,
          karma: char.karma, sex: char.sex === 0 ? 'Masculino' : 'Feminino',
          race: ['Humano','Elfo','Dark Elf','Orc','Anão'][char.race] || `Race ${char.race}`,
        },
        equipped, inventory,
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

    // POST /api/admin/set-gm — dar/remover GM do personagem
    if (action === 'set-gm' && req.method === 'POST') {
      const { objId, gm } = req.body || {}
      if (!objId) return res.status(400).json({ error: 'objId obrigatório' })
      const level = gm ? 100 : 0
      await db.query('UPDATE characters SET accesslevel = ? WHERE obj_Id = ?', [level, objId])
      return res.status(200).json({ success: true, message: gm ? 'GM concedido.' : 'GM removido.' })
    }

    // POST /api/admin/delete-item — deletar item com senha
    if (action === 'delete-item' && req.method === 'POST') {
      const { objectId, password } = req.body || {}
      const adminPass = process.env.ADMIN_ACTION_PASSWORD
      if (!adminPass || password !== adminPass) return res.status(403).json({ error: 'Senha incorreta' })
      if (!objectId) return res.status(400).json({ error: 'objectId obrigatório' })
      await db.query('DELETE FROM items WHERE object_id = ?', [objectId])
      return res.status(200).json({ success: true, message: 'Item deletado.' })
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
