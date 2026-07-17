import crypto from 'crypto'
import { getConnection } from './_db.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const ITEMS_DB = require('./items-db.json')
const itemName = (id) => ITEMS_DB[String(id)] || `Item #${id}`

const L2_CLASSES = {
  0: "Human Fighter",
  1: "Warrior",
  2: "Gladiator",
  3: "Warlord",
  4: "Human Knight",
  5: "Paladin",
  6: "Dark Avenger",
  7: "Rogue",
  8: "Treasure Hunter",
  9: "Hawkeye",
  10: "Human Mystic",
  11: "Human Wizard",
  12: "Sorcerer",
  13: "Necromancer",
  14: "Warlock",
  15: "Cleric",
  16: "Bishop",
  17: "Prophet",
  18: "Elven Fighter",
  19: "Elven Knight",
  20: "Temple Knight",
  21: "Sword Singer",
  22: "Elven Scout",
  23: "Plains Walker",
  24: "Silver Ranger",
  25: "Elven Mystic",
  26: "Elven Wizard",
  27: "Spellsinger",
  28: "Elemental Summoner",
  29: "Elven Oracle",
  30: "Elven Elder",
  31: "Dark Fighter",
  32: "Palus Knight",
  33: "Shillien Knight",
  34: "Bladedancer",
  35: "Assassin",
  36: "Abyss Walker",
  37: "Phantom Ranger",
  38: "Dark Mystic",
  39: "Dark Wizard",
  40: "Spellhowler",
  41: "Phantom Summoner",
  42: "Shillien Oracle",
  43: "Shillien Elder",
  44: "Orc Fighter",
  45: "Orc Raider",
  46: "Destroyer",
  47: "Monk",
  48: "Tyrant",
  49: "Orc Mystic",
  50: "Orc Shaman",
  51: "Overlord",
  52: "Warcryer",
  53: "Dwarf Fighter",
  54: "Scavenger",
  55: "Bounty Hunter",
  56: "Artisan",
  57: "Warsmith",
  88: "Duelist",
  89: "Dreadnought",
  90: "Phoenix Knight",
  91: "Hell Knight",
  92: "Sagittarius",
  93: "Adventurer",
  94: "Archmage",
  95: "Soultaker",
  96: "Arcana Lord",
  97: "Cardinal",
  98: "Hierophant",
  99: "Eva's Templar",
  100: "Sword Muse",
  101: "Wind Rider",
  102: "Moonlight Sentinel",
  103: "Mystic Muse",
  104: "Elemental Master",
  105: "Eva's Saint",
  106: "Shillien Templar",
  107: "Spectral Dancer",
  108: "Ghost Hunter",
  109: "Ghost Sentinel",
  110: "Storm Screamer",
  111: "Spectral Master",
  112: "Shillien Saint",
  113: "Titan",
  114: "Grand Khavatari",
  115: "Dominator",
  116: "Doom Cryer",
  117: "Fortune Seeker",
  118: "Maestro",
  192: "Jin Kamael Soldier",
  125: "Trooper",
  193: "Soul Finder",
  126: "Warden",
  127: "Beserker",
  194: "Soul Breaker",
  130: "Arbalester",
  131: "Doombringer",
  195: "Soul Hound",
  134: "Trickster",
  196: "Death Pilgrim",
  197: "Death Blade",
  198: "Death Messenger",
  199: "Death Knight",
  200: "Death Pilgrim",
  201: "Death Blade",
  202: "Death Messenger",
  203: "Death Knight",
  204: "Death Pilgrim",
  205: "Death Blade",
  206: "Death Messenger",
  207: "Death Knight",
  208: "Sylph Gunner",
  209: "Sharpshooter",
  210: "Wind Sniper",
  211: "Storm Blaster",
  217: "Orc Lancer",
  218: "Rider",
  219: "Dragoon",
  220: "Vanguard Rider",
  221: "Assassin",
  222: "Assassin",
  223: "Assassin",
  224: "Assassin",
  225: "Assassin",
  226: "Assassin",
  227: "Assassin",
  228: "Assassin",
  236: "Element Weaver",
  237: "Element Weaver",
  238: "Element Weaver",
  239: "Element Weaver",
  240: "Divine Templar",
  241: "Divine Templar",
  242: "Divine Templar",
  243: "Divine Templar",
  247: "Warg",
  248: "Warg",
  249: "Warg",
  250: "Warg",
  251: "Blood Rose",
  252: "Blood Rose",
  253: "Blood Rose",
  254: "Blood Rose",
  260: "Ashigaru",
  261: "Hatamoto",
  262: "Ronin",
  263: "Samurai",
}

// classId -> race (ordinal). HUMAN0 ELF1 DARKELF2 ORC3 DWARF4 KAMAEL5 ERTHEIA6 SYLPH30 HIGHELF31
const CLASS_RACE = { 0: 0,1: 0,2: 0,3: 0,4: 0,5: 0,6: 0,7: 0,8: 0,9: 0,10: 0,11: 0,12: 0,13: 0,14: 0,15: 0,16: 0,17: 0,18: 1,19: 1,20: 1,21: 1,22: 1,23: 1,24: 1,25: 1,26: 1,27: 1,28: 1,29: 1,30: 1,31: 2,32: 2,33: 2,34: 2,35: 2,36: 2,37: 2,38: 2,39: 2,40: 2,41: 2,42: 2,43: 2,44: 3,45: 3,46: 3,47: 3,48: 3,49: 3,50: 3,51: 3,52: 3,53: 4,54: 4,55: 4,56: 4,57: 4,88: 0,89: 0,90: 0,91: 0,92: 0,93: 0,94: 0,95: 0,96: 0,97: 0,98: 0,99: 1,100: 1,101: 1,102: 1,103: 1,104: 1,105: 1,106: 2,107: 2,108: 2,109: 2,110: 2,111: 2,112: 2,113: 3,114: 3,115: 3,116: 3,117: 4,118: 4,125: 5,126: 5,127: 5,130: 5,131: 5,134: 5,192: 5,193: 5,194: 5,195: 5,196: 0,197: 0,198: 0,199: 0,200: 1,201: 1,202: 1,203: 1,204: 2,205: 2,206: 2,207: 2,208: 30,209: 30,210: 30,211: 30,217: 3,218: 3,219: 3,220: 3,221: 0,222: 0,223: 0,224: 0,225: 2,226: 2,227: 2,228: 2,236: 31,237: 31,238: 31,239: 31,240: 31,241: 31,242: 31,243: 31,247: 0,248: 0,249: 0,250: 0,251: 2,252: 2,253: 2,254: 2,260: 5,261: 5,262: 5,263: 5 }

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
  if (url.includes('/offer-save')) return 'offer-save'
  if (url.includes('/offer')) return 'offer'
  return req.query.action || ''
}

export default async function handler(req, res) {
  const admin = requireAdmin(req, res)
  if (!admin) return
  const action = getAction(req)
  const db = await getConnection()
  // IKARUS 2026-07-16: server=interlude (query ou body) roteia CODIGOS e OFERTAS pro
  // banco proprio do Interlude (l2jacis). Ikoin/contas/stats continuam no banco do
  // Essence (compartilhados pela rede). Sem o parametro = Essence (original).
  const isInterlude = (req.query?.server || req.body?.server) === 'interlude'
  const gameDb = isInterlude ? await getConnection('interlude') : db

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

      const pick = (r, ...names) => { for (const n of names) if (r && r[n] !== undefined) return r[n]; return null }

      // Descobre o nome real da coluna de ID
      const [colInfo] = await db.query(`SHOW COLUMNS FROM characters`)
      const colNames = colInfo.map(c => c.Field)
      const idCol = ['obj_Id', 'obj_id', 'charId', 'char_id', 'objId'].find(c => colNames.includes(c)) || 'obj_Id'

      const [[char]] = await db.query(`SELECT * FROM characters WHERE \`${idCol}\` = ? LIMIT 1`, [objId])
      if (!char) return res.status(404).json({ error: 'Personagem não encontrado' })

      const charId = pick(char, 'obj_Id', 'obj_id', 'charId', 'char_id', 'objId')

      // Descobre a coluna de owner na tabela items
      const [itemCols] = await db.query(`SHOW COLUMNS FROM items`)
      const itemColNames = itemCols.map(c => c.Field)
      const ownerCol = ['owner_id', 'ownerId', 'owner'].find(c => itemColNames.includes(c)) || 'owner_id'

      const [items] = await db.query(
        `SELECT * FROM items WHERE \`${ownerCol}\` = ? AND loc IN ('PAPERDOLL','INVENTORY') LIMIT 300`, [charId]
      )

      const SLOTS = {
        1:'Mão Dir',2:'Ouvido Esq',3:'Ouvido Dir',4:'Pescoço',5:'Anel Esq',6:'Anel Dir',
        7:'Cabeça',8:'Mão Esq',9:'Luvas',10:'Peito',11:'Pernas',12:'Botas',13:'Capa',14:'2 Mãos',
        19:'Cabelo',20:'Chapéu',22:'Pulseira Dir',23:'Pulseira Esq',
      }

      const mapItem = (i) => ({
        objectId: pick(i, 'object_id', 'objectId', 'item_obj_id'),
        itemId: pick(i, 'item_id', 'itemId', 'item'),
        name: itemName(pick(i, 'item_id', 'itemId', 'item')),
        count: pick(i, 'count', 'item_count'),
        enchant: pick(i, 'enchant_level', 'enchantLevel', 'enchant') || 0,
        loc: pick(i, 'loc', 'location'),
        locData: pick(i, 'loc_data', 'locData', 'slot'),
      })

      const allItems = items.map(mapItem)
      const equipped = allItems.filter(i => i.loc === 'PAPERDOLL').map(i => ({ ...i, slot: SLOTS[i.locData] || `Slot ${i.locData}` }))
      const inventory = allItems.filter(i => i.loc === 'INVENTORY')

      const sex = pick(char, 'sex')
      const race = pick(char, 'race')
      return res.status(200).json({
        char: {
          objId: charId, name: pick(char, 'char_name', 'charName', 'name'),
          level: pick(char, 'level'),
          class: L2_CLASSES[pick(char, 'classid', 'classId')] || `Class ${pick(char, 'classid', 'classId')}`,
          account: pick(char, 'account_name', 'accountName'),
          pvp: pick(char, 'pvpkills', 'pvpKills'), pk: pick(char, 'pkkills', 'pkKills'),
          onlineTime: pick(char, 'onlinetime', 'onlineTime'),
          exp: pick(char, 'exp'), sp: pick(char, 'sp'),
          hp: `${pick(char, 'curHp')}/${pick(char, 'maxHp')}`,
          mp: `${pick(char, 'curMp')}/${pick(char, 'maxMp')}`,
          karma: pick(char, 'karma'),
          sex: sex === 0 ? 'Masculino' : 'Feminino',
          race: ['Humano','Elfo','Dark Elf','Orc','Anão'][race] || `Race ${race}`,
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
      const level = gm ? 100 : 0 // 100 = Master (isGM=true)

      // Descobre o nome real da coluna de ID + a coluna de access level + online
      const [cols] = await db.query('SHOW COLUMNS FROM characters')
      const names = cols.map(c => c.Field)
      const idCol = ['charId', 'obj_Id', 'obj_id', 'char_id', 'objId'].find(c => names.includes(c)) || 'charId'
      const accessCol = ['accesslevel', 'accessLevel', 'access_level'].find(c => names.includes(c)) || 'accesslevel'
      const onlineCol = names.includes('online') ? 'online' : null

      // Avisa se estiver online (mudanca so vale apos relogar e pode ser sobrescrita)
      if (onlineCol) {
        const [[c]] = await db.query(`SELECT \`${onlineCol}\` AS on0, char_name FROM characters WHERE \`${idCol}\` = ?`, [objId])
        if (c && c.on0 > 0) {
          return res.status(409).json({ error: `${c.char_name} está ONLINE. Peça para deslogar, depois aplique o GM (senão é sobrescrito ao sair).` })
        }
      }

      await db.query(`UPDATE characters SET \`${accessCol}\` = ? WHERE \`${idCol}\` = ?`, [level, objId])
      return res.status(200).json({ success: true, message: gm ? 'GM (Master) concedido! Faça login no personagem.' : 'GM removido.' })
    }

    // GET /api/admin/char-search?name=X — busca personagens por nome
    if (action === 'char-search') {
      const name = req.query.name || ''
      if (!name.trim()) return res.status(200).json({ chars: [] })
      const [cols] = await db.query('SHOW COLUMNS FROM characters')
      const names = cols.map(c => c.Field)
      const idCol = ['charId', 'obj_Id', 'obj_id', 'char_id', 'objId'].find(c => names.includes(c)) || 'charId'
      const accessCol = ['accesslevel', 'accessLevel', 'access_level'].find(c => names.includes(c)) || 'accesslevel'
      const [rows] = await db.query(
        `SELECT \`${idCol}\` AS objId, char_name, level, classid, race, sex, online, \`${accessCol}\` AS access, account_name
         FROM characters WHERE char_name LIKE ? ORDER BY char_name ASC LIMIT 30`,
        [`%${name.trim()}%`]
      )
      return res.status(200).json({
        chars: rows.map(r => ({
          objId: r.objId, name: r.char_name, level: r.level,
          classId: r.classid, class: L2_CLASSES[r.classid] || `Class ${r.classid}`,
          race: r.race, online: r.online > 0, access: r.access, account: r.account_name,
          isGM: r.access >= 100,
        })),
      })
    }

    // POST /api/admin/char-class — troca classe E raça do personagem (offline)
    if (action === 'char-class' && req.method === 'POST') {
      const { objId, classId } = req.body || {}
      const cid = parseInt(classId)
      if (!objId || isNaN(cid)) return res.status(400).json({ error: 'objId e classId obrigatórios' })
      if (CLASS_RACE[cid] === undefined) return res.status(400).json({ error: `classId ${cid} inválido (não existe no servidor).` })

      const [cols] = await db.query('SHOW COLUMNS FROM characters')
      const names = cols.map(c => c.Field)
      const idCol = ['charId', 'obj_Id', 'obj_id', 'char_id', 'objId'].find(c => names.includes(c)) || 'charId'

      const [[cur]] = await db.query(`SELECT classid, race, online, char_name FROM characters WHERE \`${idCol}\` = ?`, [objId])
      if (!cur) return res.status(404).json({ error: 'Personagem não encontrado' })
      if (cur.online > 0) return res.status(409).json({ error: `${cur.char_name} está ONLINE. Deslogue antes de trocar a classe.` })

      const newRace = CLASS_RACE[cid]
      const raceChanged = cur.race !== newRace

      // classid (+ base_class) + race
      const sets = ['classid = ?']
      const vals = [cid]
      if (names.includes('base_class')) { sets.push('base_class = ?'); vals.push(cid) }
      if (names.includes('race')) { sets.push('race = ?'); vals.push(newRace) }
      // Ao mudar de raça, reseta aparência (face/cabelo são específicos da raça)
      if (raceChanged) {
        if (names.includes('face')) { sets.push('face = 0') }
        if (names.includes('hairStyle')) { sets.push('hairStyle = 0') }
        if (names.includes('hairColor')) { sets.push('hairColor = 0') }
      }
      vals.push(objId)
      await db.query(`UPDATE characters SET ${sets.join(', ')} WHERE \`${idCol}\` = ?`, vals)

      const RACE_NAMES = { 0: 'Human', 1: 'Elf', 2: 'Dark Elf', 3: 'Orc', 4: 'Dwarf', 5: 'Kamael', 6: 'Ertheia', 30: 'Sylph', 31: 'High Elf' }
      const msg = `Classe: ${L2_CLASSES[cid] || cid} (${RACE_NAMES[newRace] || 'race ' + newRace})${raceChanged ? ' — raça e aparência ajustadas' : ''}. Faça login.`
      return res.status(200).json({ success: true, message: msg })
    }

    // POST /api/admin/char-teleport — reseta posição para uma cidade (destrava char)
    if (action === 'char-teleport' && req.method === 'POST') {
      const { objId, town } = req.body || {}
      if (!objId) return res.status(400).json({ error: 'objId obrigatório' })
      const TOWNS = {
        giran: [83400, 147943, -3404], aden: [146783, 25808, -2000],
        dion: [15670, 142983, -2700], gludio: [-14000, 123000, -3120],
        gludin: [-84318, 244579, -3730], heine: [111409, 219364, -3545],
        goddard: [147451, -56787, -2780], rune: [43835, -47749, -800],
        schuttgart: [87386, -143288, -1293], floran: [17286, 170615, -3500],
      }
      const loc = TOWNS[town] || TOWNS.giran
      const [cols] = await db.query('SHOW COLUMNS FROM characters')
      const names = cols.map(c => c.Field)
      const idCol = ['charId', 'obj_Id', 'obj_id', 'char_id', 'objId'].find(c => names.includes(c)) || 'charId'
      if (names.includes('online')) {
        const [[c]] = await db.query(`SELECT online, char_name FROM characters WHERE \`${idCol}\` = ?`, [objId])
        if (c && c.online > 0) return res.status(409).json({ error: `${c.char_name} está ONLINE. Deslogue antes de teleportar.` })
      }
      await db.query(`UPDATE characters SET x = ?, y = ?, z = ? WHERE \`${idCol}\` = ?`, [loc[0], loc[1], loc[2], objId])
      return res.status(200).json({ success: true, message: `Teleportado para ${town || 'giran'}. Faça login.` })
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

    // GET /api/admin/codes — lista códigos promocionais
    if (action === 'codes') {
      const [rows] = await gameDb.query('SELECT * FROM promo_codes ORDER BY created_at DESC LIMIT 100')
      return res.status(200).json({ codes: rows })
    }

    // POST /api/admin/code-create — cria código
    if (action === 'code-create' && req.method === 'POST') {
      const { code, items, ikoin, description, maxUses } = req.body || {}
      const ikoinAmt = parseInt(ikoin) || 0
      const itemsClean = (items || '').replace(/\s/g, '')
      if (!code) return res.status(400).json({ error: 'Código obrigatório' })
      if (!itemsClean && ikoinAmt <= 0) return res.status(400).json({ error: 'Informe itens, Ikoin, ou ambos.' })
      if (itemsClean && !/^(\d+:\d+;?)+$/.test(itemsClean)) {
        return res.status(400).json({ error: 'Formato de itens inválido. Use: itemId:quantidade;itemId:quantidade' })
      }
      try {
        await gameDb.query(
          'INSERT INTO promo_codes (code, items, ikoin, description, active, max_uses, uses, created_by, created_at) VALUES (?, ?, ?, ?, 1, ?, 0, ?, ?)',
          [code.trim(), itemsClean || null, ikoinAmt, description || null, parseInt(maxUses) || 0, admin.email || 'admin', Math.floor(Date.now() / 1000)]
        )
        return res.status(200).json({ success: true, message: `Código ${code} criado.` })
      } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Este código já existe.' })
        throw e
      }
    }

    // POST /api/admin/code-toggle — ativa/desativa código
    if (action === 'code-toggle' && req.method === 'POST') {
      const { code, active } = req.body || {}
      await gameDb.query('UPDATE promo_codes SET active = ? WHERE code = ?', [active ? 1 : 0, code])
      return res.status(200).json({ success: true, message: active ? 'Código ativado.' : 'Código desativado.' })
    }

    // POST /api/admin/code-delete — deleta código
    if (action === 'code-delete' && req.method === 'POST') {
      const { code, password } = req.body || {}
      const adminPass = process.env.ADMIN_ACTION_PASSWORD
      if (!adminPass || password !== adminPass) return res.status(403).json({ error: 'Senha incorreta' })
      await gameDb.query('DELETE FROM promo_codes WHERE code = ?', [code])
      await gameDb.query('DELETE FROM promo_redeemed WHERE code = ?', [code])
      return res.status(200).json({ success: true, message: 'Código removido.' })
    }

    // POST /api/admin/ikoin — credita/debita Ikoin de uma conta
    if (action === 'ikoin' && req.method === 'POST') {
      const { login, amount, reason } = req.body || {}
      const amt = parseInt(amount)
      if (!login || !amt) return res.status(400).json({ error: 'Login e quantidade obrigatórios' })
      const now = Math.floor(Date.now() / 1000)
      await db.query(
        `INSERT INTO ikoin_balance (account_name, balance, updated_at) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE balance = balance + ?, updated_at = ?`,
        [login, amt, now, amt, now]
      )
      await db.query(
        'INSERT INTO ikoin_transactions (account_name, amount, type, description, created_at) VALUES (?, ?, ?, ?, ?)',
        [login, amt, 'admin', reason || `Ajuste admin (${admin.email})`, now]
      )
      const [[bal]] = await db.query('SELECT balance FROM ikoin_balance WHERE account_name = ?', [login])
      return res.status(200).json({ success: true, message: `Saldo de ${login}: ${bal.balance} IK`, balance: bal.balance })
    }

    // GET /api/admin/offer — lê as 2 ofertas limitadas
    if (action === 'offer') {
      const [rows] = await gameDb.query('SELECT * FROM game_offer WHERE id IN (1,2)')
      const offers = { 1: null, 2: null }
      for (const r of rows) offers[r.id] = r
      return res.status(200).json({ offers })
    }

    // POST /api/admin/offer-save — cria/atualiza uma oferta (offerId 1 ou 2)
    if (action === 'offer-save' && req.method === 'POST') {
      const { offerId, itemId, count, price, title, active } = req.body || {}
      const oid = (parseInt(offerId) === 2) ? 2 : 1
      const iid = parseInt(itemId)
      const cnt = parseInt(count) || 1
      const prc = parseInt(price) || 100
      if (!iid) return res.status(400).json({ error: 'ID do item obrigatório' })
      const now = Date.now()
      if (isInterlude) {
        // Interlude: tabela propria (l2jacis) tem coluna enchant (vender ex: arma +20)
        const enc = parseInt(req.body?.enchant) || 0
        await gameDb.query(
          `INSERT INTO game_offer (id, item_id, count, price_ikoin, title, enchant, active, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE item_id=?, count=?, price_ikoin=?, title=?, enchant=?, active=?, updated_at=?`,
          [oid, iid, cnt, prc, title || 'Oferta Limitada', enc, active ? 1 : 0, now,
           iid, cnt, prc, title || 'Oferta Limitada', enc, active ? 1 : 0, now]
        )
      } else {
        await db.query(
          `INSERT INTO game_offer (id, item_id, count, price_ikoin, title, active, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE item_id=?, count=?, price_ikoin=?, title=?, active=?, updated_at=?`,
          [oid, iid, cnt, prc, title || 'Oferta Limitada', active ? 1 : 0, now,
           iid, cnt, prc, title || 'Oferta Limitada', active ? 1 : 0, now]
        )
      }
      return res.status(200).json({ success: true, message: `Oferta ${oid} salva com sucesso.` })
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

    // ===== STREAMERS / AFILIADOS =====
    // Lista streamers + relatorio (contas indicadas, Ikoin comprado, comissao)
    if (action === 'streamers' && req.method !== 'POST') {
      const [streamers] = await db.query('SELECT slug, name, commission_pct, active, payout_info, created_at FROM streamers ORDER BY created_at DESC')
      // contas indicadas por streamer
      const [refs] = await db.query('SELECT streamer_slug, COUNT(*) AS accounts FROM account_referrals GROUP BY streamer_slug')
      // Ikoin COMPRADO (orders pagas) pelos indicados, por streamer; exclui a propria conta do streamer (slug)
      const [paid] = await db.query(
        `SELECT ar.streamer_slug, COALESCE(SUM(o.amount),0) AS ikoin_bought
         FROM account_referrals ar
         JOIN ikoin_orders o ON o.account_name = ar.account_name AND o.status = 'paid'
         WHERE ar.account_name <> ar.streamer_slug
         GROUP BY ar.streamer_slug`
      )
      const refMap = Object.fromEntries(refs.map(r => [r.streamer_slug, r.accounts]))
      const paidMap = Object.fromEntries(paid.map(r => [r.streamer_slug, r.ikoin_bought]))
      const report = streamers.map(s => {
        const ikoin = paidMap[s.slug] || 0
        return {
          ...s,
          accounts: refMap[s.slug] || 0,
          ikoin_bought: ikoin,
          commission: Math.floor(ikoin * (s.commission_pct / 100)),
          link: `https://l2ikarus.com/r/${s.slug}`,
        }
      })
      return res.status(200).json({ streamers: report })
    }
    // Criar/atualizar streamer
    if (action === 'streamer-save' && req.method === 'POST') {
      let { slug, name, commission_pct, payout_info } = req.body || {}
      slug = (slug || '').trim().toLowerCase()
      if (!/^[a-z0-9_-]{2,32}$/.test(slug)) return res.status(400).json({ error: 'Slug invalido (2-32: letras, numeros, _ , -)' })
      const pct = Math.max(0, Math.min(100, parseInt(commission_pct) || 25))
      await db.query(
        `INSERT INTO streamers (slug, name, commission_pct, active, payout_info, created_at) VALUES (?, ?, ?, 1, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), commission_pct = VALUES(commission_pct), payout_info = VALUES(payout_info)`,
        [slug, name || slug, pct, payout_info || null, Date.now()]
      )
      return res.status(200).json({ success: true, message: `Streamer ${slug} salvo.`, link: `https://l2ikarus.com/r/${slug}` })
    }
    // Ativar/desativar streamer
    if (action === 'streamer-toggle' && req.method === 'POST') {
      const { slug, active } = req.body || {}
      await db.query('UPDATE streamers SET active = ? WHERE slug = ?', [active ? 1 : 0, (slug || '').toLowerCase()])
      return res.status(200).json({ success: true })
    }

    res.status(400).json({ error: 'Ação inválida' })
  } catch (err) {
    console.error('Admin error:', err)
    res.status(500).json({ error: err.message })
  }
}
