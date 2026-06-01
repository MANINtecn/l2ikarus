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
        'SELECT login, email, access_level FROM accounts WHERE login = ? AND password = ?',
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
        'SELECT char_name, level, classid, online FROM characters WHERE account_name = ? ORDER BY level DESC',
        [payload.login]
      )
      return res.status(200).json({
        authenticated: true,
        login: payload.login,
        email: payload.email,
        characters: chars.map(c => ({
          name: c.char_name,
          level: c.level,
          class: L2_CLASSES[c.classid] || `Class ${c.classid}`,
          online: c.online === 1,
        })),
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
