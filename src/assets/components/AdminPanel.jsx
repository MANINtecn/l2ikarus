import { useState, useEffect } from 'react'

const TABS = [
  { id: 'overview', label: 'VISÃO GERAL' },
  { id: 'players', label: 'ONLINE' },
  { id: 'accounts', label: 'CONTAS' },
  { id: 'ranking', label: 'RANKING' },
  { id: 'codes', label: 'CÓDIGOS' },
  { id: 'offer', label: 'OFERTA' },
  { id: 'streamers', label: 'STREAMERS' },
  { id: 'charmgmt', label: 'PERSONAGENS' },
]


// Todas as classes do servidor (Essence) - ID real do classList.xml
// Classes do servidor (Essence) com raça - id real do classList.xml
const ALL_CLASSES = [
  { id: 0, name: "Human Fighter", race: 0 },
  { id: 1, name: "Warrior", race: 0 },
  { id: 2, name: "Gladiator", race: 0 },
  { id: 3, name: "Warlord", race: 0 },
  { id: 4, name: "Human Knight", race: 0 },
  { id: 5, name: "Paladin", race: 0 },
  { id: 6, name: "Dark Avenger", race: 0 },
  { id: 7, name: "Rogue", race: 0 },
  { id: 8, name: "Treasure Hunter", race: 0 },
  { id: 9, name: "Hawkeye", race: 0 },
  { id: 10, name: "Human Mystic", race: 0 },
  { id: 11, name: "Human Wizard", race: 0 },
  { id: 12, name: "Sorcerer", race: 0 },
  { id: 13, name: "Necromancer", race: 0 },
  { id: 14, name: "Warlock", race: 0 },
  { id: 15, name: "Cleric", race: 0 },
  { id: 16, name: "Bishop", race: 0 },
  { id: 17, name: "Prophet", race: 0 },
  { id: 18, name: "Elven Fighter", race: 1 },
  { id: 19, name: "Elven Knight", race: 1 },
  { id: 20, name: "Temple Knight", race: 1 },
  { id: 21, name: "Sword Singer", race: 1 },
  { id: 22, name: "Elven Scout", race: 1 },
  { id: 23, name: "Plains Walker", race: 1 },
  { id: 24, name: "Silver Ranger", race: 1 },
  { id: 25, name: "Elven Mystic", race: 1 },
  { id: 26, name: "Elven Wizard", race: 1 },
  { id: 27, name: "Spellsinger", race: 1 },
  { id: 28, name: "Elemental Summoner", race: 1 },
  { id: 29, name: "Elven Oracle", race: 1 },
  { id: 30, name: "Elven Elder", race: 1 },
  { id: 31, name: "Dark Fighter", race: 2 },
  { id: 32, name: "Palus Knight", race: 2 },
  { id: 33, name: "Shillien Knight", race: 2 },
  { id: 34, name: "Bladedancer", race: 2 },
  { id: 35, name: "Assassin", race: 2 },
  { id: 36, name: "Abyss Walker", race: 2 },
  { id: 37, name: "Phantom Ranger", race: 2 },
  { id: 38, name: "Dark Mystic", race: 2 },
  { id: 39, name: "Dark Wizard", race: 2 },
  { id: 40, name: "Spellhowler", race: 2 },
  { id: 41, name: "Phantom Summoner", race: 2 },
  { id: 42, name: "Shillien Oracle", race: 2 },
  { id: 43, name: "Shillien Elder", race: 2 },
  { id: 44, name: "Orc Fighter", race: 3 },
  { id: 45, name: "Orc Raider", race: 3 },
  { id: 46, name: "Destroyer", race: 3 },
  { id: 47, name: "Monk", race: 3 },
  { id: 48, name: "Tyrant", race: 3 },
  { id: 49, name: "Orc Mystic", race: 3 },
  { id: 50, name: "Orc Shaman", race: 3 },
  { id: 51, name: "Overlord", race: 3 },
  { id: 52, name: "Warcryer", race: 3 },
  { id: 53, name: "Dwarf Fighter", race: 4 },
  { id: 54, name: "Scavenger", race: 4 },
  { id: 55, name: "Bounty Hunter", race: 4 },
  { id: 56, name: "Artisan", race: 4 },
  { id: 57, name: "Warsmith", race: 4 },
  { id: 88, name: "Duelist", race: 0 },
  { id: 89, name: "Dreadnought", race: 0 },
  { id: 90, name: "Phoenix Knight", race: 0 },
  { id: 91, name: "Hell Knight", race: 0 },
  { id: 92, name: "Sagittarius", race: 0 },
  { id: 93, name: "Adventurer", race: 0 },
  { id: 94, name: "Archmage", race: 0 },
  { id: 95, name: "Soultaker", race: 0 },
  { id: 96, name: "Arcana Lord", race: 0 },
  { id: 97, name: "Cardinal", race: 0 },
  { id: 98, name: "Hierophant", race: 0 },
  { id: 99, name: "Eva's Templar", race: 1 },
  { id: 100, name: "Sword Muse", race: 1 },
  { id: 101, name: "Wind Rider", race: 1 },
  { id: 102, name: "Moonlight Sentinel", race: 1 },
  { id: 103, name: "Mystic Muse", race: 1 },
  { id: 104, name: "Elemental Master", race: 1 },
  { id: 105, name: "Eva's Saint", race: 1 },
  { id: 106, name: "Shillien Templar", race: 2 },
  { id: 107, name: "Spectral Dancer", race: 2 },
  { id: 108, name: "Ghost Hunter", race: 2 },
  { id: 109, name: "Ghost Sentinel", race: 2 },
  { id: 110, name: "Storm Screamer", race: 2 },
  { id: 111, name: "Spectral Master", race: 2 },
  { id: 112, name: "Shillien Saint", race: 2 },
  { id: 113, name: "Titan", race: 3 },
  { id: 114, name: "Grand Khavatari", race: 3 },
  { id: 115, name: "Dominator", race: 3 },
  { id: 116, name: "Doom Cryer", race: 3 },
  { id: 117, name: "Fortune Seeker", race: 4 },
  { id: 118, name: "Maestro", race: 4 },
  { id: 192, name: "Jin Kamael Soldier", race: 5 },
  { id: 125, name: "Trooper", race: 5 },
  { id: 193, name: "Soul Finder", race: 5 },
  { id: 126, name: "Warden", race: 5 },
  { id: 127, name: "Beserker", race: 5 },
  { id: 194, name: "Soul Breaker", race: 5 },
  { id: 130, name: "Arbalester", race: 5 },
  { id: 131, name: "Doombringer", race: 5 },
  { id: 195, name: "Soul Hound", race: 5 },
  { id: 134, name: "Trickster", race: 5 },
  { id: 196, name: "Death Pilgrim", race: 0 },
  { id: 197, name: "Death Blade", race: 0 },
  { id: 198, name: "Death Messenger", race: 0 },
  { id: 199, name: "Death Knight", race: 0 },
  { id: 200, name: "Death Pilgrim", race: 1 },
  { id: 201, name: "Death Blade", race: 1 },
  { id: 202, name: "Death Messenger", race: 1 },
  { id: 203, name: "Death Knight", race: 1 },
  { id: 204, name: "Death Pilgrim", race: 2 },
  { id: 205, name: "Death Blade", race: 2 },
  { id: 206, name: "Death Messenger", race: 2 },
  { id: 207, name: "Death Knight", race: 2 },
  { id: 208, name: "Sylph Gunner", race: 30 },
  { id: 209, name: "Sharpshooter", race: 30 },
  { id: 210, name: "Wind Sniper", race: 30 },
  { id: 211, name: "Storm Blaster", race: 30 },
  { id: 217, name: "Orc Lancer", race: 3 },
  { id: 218, name: "Rider", race: 3 },
  { id: 219, name: "Dragoon", race: 3 },
  { id: 220, name: "Vanguard Rider", race: 3 },
  { id: 221, name: "Assassin", race: 0 },
  { id: 222, name: "Assassin", race: 0 },
  { id: 223, name: "Assassin", race: 0 },
  { id: 224, name: "Assassin", race: 0 },
  { id: 225, name: "Assassin", race: 2 },
  { id: 226, name: "Assassin", race: 2 },
  { id: 227, name: "Assassin", race: 2 },
  { id: 228, name: "Assassin", race: 2 },
  { id: 236, name: "Element Weaver", race: 31 },
  { id: 237, name: "Element Weaver", race: 31 },
  { id: 238, name: "Element Weaver", race: 31 },
  { id: 239, name: "Element Weaver", race: 31 },
  { id: 240, name: "Divine Templar", race: 31 },
  { id: 241, name: "Divine Templar", race: 31 },
  { id: 242, name: "Divine Templar", race: 31 },
  { id: 243, name: "Divine Templar", race: 31 },
  { id: 247, name: "Warg", race: 0 },
  { id: 248, name: "Warg", race: 0 },
  { id: 249, name: "Warg", race: 0 },
  { id: 250, name: "Warg", race: 0 },
  { id: 251, name: "Blood Rose", race: 2 },
  { id: 252, name: "Blood Rose", race: 2 },
  { id: 253, name: "Blood Rose", race: 2 },
  { id: 254, name: "Blood Rose", race: 2 },
  { id: 260, name: "Ashigaru", race: 5 },
  { id: 261, name: "Hatamoto", race: 5 },
  { id: 262, name: "Ronin", race: 5 },
  { id: 263, name: "Samurai", race: 5 },
]

const RACES_LIST = [
  { id: 0, name: "Human" }, { id: 1, name: "Elf" }, { id: 2, name: "Dark Elf" }, { id: 3, name: "Orc" }, { id: 4, name: "Dwarf" }, { id: 5, name: "Kamael" }, { id: 30, name: "Sylph" }, { id: 31, name: "High Elf" },
]

const TOWNS_LIST = [
  { id: 'giran', name: 'Giran' }, { id: 'aden', name: 'Aden' }, { id: 'dion', name: 'Dion' },
  { id: 'gludio', name: 'Gludio' }, { id: 'gludin', name: 'Gludin' }, { id: 'heine', name: 'Heine' },
  { id: 'goddard', name: 'Goddard' }, { id: 'rune', name: 'Rune' }, { id: 'schuttgart', name: 'Schuttgart' },
  { id: 'floran', name: 'Floran' },
]

const inputStyleAdmin = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  padding: '0.7rem 0.9rem', color: '#fff', fontSize: '0.8rem', borderRadius: '5px', outline: 'none',
}

const StatCard = ({ label, value, color = 'var(--gold)' }) => (
  <div className="glass-panel" style={{ padding: '1.4rem', borderLeft: `3px solid ${color}` }}>
    <p style={{ fontSize: '0.55rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '0.6rem' }}>{label}</p>
    <p style={{ fontSize: '2rem', fontWeight: '900', color, margin: 0, fontFamily: 'Cinzel, serif' }}>{value ?? '—'}</p>
  </div>
)

const Table = ({ cols, rows, emptyMsg = 'Nenhum dado' }) => (
  rows.length === 0
    ? <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem', padding: '1rem 0' }}>{emptyMsg}</p>
    : <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c.key} style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-mute)', fontSize: '0.58rem', letterSpacing: '2px' }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              {cols.map(c => (
                <td key={c.key} style={{ padding: '0.6rem 0.5rem', color: c.color?.(row) || 'rgba(255,255,255,0.75)' }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
)

export default function AdminPanel({ user, onLogout }) {
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [players, setPlayers] = useState([])
  const [accounts, setAccounts] = useState([])
  const [accountChars, setAccountChars] = useState({})
  const [ranking, setRanking] = useState({ pvp: [], pk: [] })
  const [rankTab, setRankTab] = useState('pvp')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [banMsg, setBanMsg] = useState('')
  const [charModal, setCharModal] = useState(null)
  const [charLoading, setCharLoading] = useState(false)
  const [playersDebug, setPlayersDebug] = useState(null)
  const [charTab, setCharTab] = useState('dados')
  const [codes, setCodes] = useState([])
  const [streamers, setStreamers] = useState([])
  const [strForm, setStrForm] = useState({ slug: '', name: '', commission_pct: 30, payout_info: '' })
  const [strMsg, setStrMsg] = useState('')
  const [newCode, setNewCode] = useState({ code: '', items: '', ikoin: '', description: '', maxUses: '' })
  const [codeMsg, setCodeMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { objectId, name }
  const [deletePass, setDeletePass] = useState('')
  const [deleteMsg, setDeleteMsg] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [offerSlot, setOfferSlot] = useState(1)
  const [offersData, setOffersData] = useState({ 1: null, 2: null })
  const [offer, setOffer] = useState({ item_id: '', count: 1, price_ikoin: 100, title: 'Oferta Limitada', active: 0 })
  const [offerMsg, setOfferMsg] = useState('')
  // IKARUS 2026-07-16: CODIGOS e OFERTAS sao POR JOGO (banco proprio de cada servidor).
  // Ikoin/contas continuam compartilhados. 'essence' = comportamento original.
  const [gameServer, setGameServer] = useState('essence')
  const srvQS = gameServer === 'interlude' ? '?server=interlude' : ''
  const [charQuery, setCharQuery] = useState('')
  const [charResults, setCharResults] = useState([])
  const [selChar, setSelChar] = useState(null)
  const [charMgmtMsg, setCharMgmtMsg] = useState('')
  const [newClass, setNewClass] = useState('')
  const [selRace, setSelRace] = useState(0)
  const [newTown, setNewTown] = useState('giran')

  const searchChars = async () => {
    if (!charQuery.trim()) return
    setCharMgmtMsg('')
    const r = await fetch(`/api/admin/char-search?name=${encodeURIComponent(charQuery.trim())}`).then(x => x.json())
    setCharResults(r.chars || [])
    if (!r.chars?.length) setCharMgmtMsg('Nenhum personagem encontrado.')
  }

  const charAction = async (endpoint, body, okMsg) => {
    setCharMgmtMsg('⏳ Processando...')
    try {
      const r = await fetch(`/api/admin/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(x => x.json())
      setCharMgmtMsg(r.success ? '✓ ' + r.message : '✗ ' + (r.error || 'Erro'))
      if (r.success) searchChars()
    } catch {
      setCharMgmtMsg('✗ Erro de conexão.')
    }
  }

  const blankOffer = { item_id: '', count: 1, price_ikoin: 100, title: 'Oferta Limitada', active: 0, enchant: 0 }
  const loadOfferSlot = (slot, data) => {
    const d = (data || offersData)[slot]
    setOffer(d ? { item_id: d.item_id, count: d.count, price_ikoin: d.price_ikoin, title: d.title, active: d.active, enchant: d.enchant || 0 } : { ...blankOffer })
    setOfferSlot(slot)
    setOfferMsg('')
  }

  useEffect(() => { fetchTab(tab) }, [tab])
  useEffect(() => { if (tab === 'codes' || tab === 'offer') fetchTab(tab) }, [gameServer])

  const fetchTab = async (t) => {
    setLoading(true)
    try {
      if (t === 'overview') {
        // Busca stats e players juntos para o card e a lista nunca divergirem
        const [s, p] = await Promise.all([
          fetch('/api/admin/stats').then(x => x.json()),
          fetch('/api/admin/players').then(x => x.json()),
        ])
        setStats(s)
        setPlayers(p.players || [])
        setPlayersDebug(p.debug || p.error || null)
      } else if (t === 'players') {
        const r = await fetch('/api/admin/players').then(x => x.json())
        setPlayers(r.players || [])
        setPlayersDebug(r.debug || r.error || null)
      } else if (t === 'ranking') {
        const r = await fetch('/api/admin/ranking').then(x => x.json())
        setRanking(r)
      } else if (t === 'codes') {
        const r = await fetch('/api/admin/codes' + srvQS).then(x => x.json())
        setCodes(r.codes || [])
      } else if (t === 'offer') {
        const r = await fetch('/api/admin/offer' + srvQS).then(x => x.json())
        const data = r.offers || { 1: null, 2: null }
        setOffersData(data)
        loadOfferSlot(offerSlot, data)
      } else if (t === 'streamers') {
        const r = await fetch('/api/admin/streamers').then(x => x.json())
        setStreamers(r.streamers || [])
      }
    } catch {}
    setLoading(false)
  }

  const saveOffer = async () => {
    setOfferMsg('⏳ Salvando...')
    try {
      const r = await fetch('/api/admin/offer-save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: offerSlot, itemId: offer.item_id, count: offer.count,
          price: offer.price_ikoin, title: offer.title, active: offer.active,
          server: gameServer, enchant: offer.enchant,
        }),
      }).then(x => x.json())
      setOfferMsg(r.success ? '✓ ' + r.message : '✗ ' + (r.error || 'Erro ao salvar'))
      if (r.success) fetchTab('offer')
    } catch {
      setOfferMsg('✗ Erro de conexão com o servidor.')
    }
  }

  const searchAccounts = async () => {
    setLoading(true)
    try {
      const r = await fetch(`/api/admin/accounts?q=${encodeURIComponent(search)}`).then(x => x.json())
      setAccounts(r.accounts || [])
    } catch {}
    setLoading(false)
  }

  const loadChars = async (login) => {
    if (accountChars[login]) { setAccountChars(p => ({ ...p, [login]: undefined })); return }
    const r = await fetch(`/api/admin/chars?account=${encodeURIComponent(login)}`).then(x => x.json())
    setAccountChars(p => ({ ...p, [login]: r.chars || [] }))
  }

  const banAccount = async (login, ban) => {
    const action = ban ? 'ban' : 'unban'
    const r = await fetch(`/api/admin/${action}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login }),
    }).then(x => x.json())
    setBanMsg(r.message || r.error)
    setTimeout(() => setBanMsg(''), 3000)
    searchAccounts()
  }

  const openCharDetail = async (objId) => {
    setCharLoading(true)
    setCharModal({ loading: true })
    setActionMsg('')
    setCharTab('dados')
    try {
      const r = await fetch(`/api/admin/char-detail?objId=${objId}`).then(x => x.json())
      setCharModal(r)
    } catch { setCharModal(null) }
    setCharLoading(false)
  }

  const setGM = async (objId, gm) => {
    const r = await fetch('/api/admin/set-gm', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objId, gm }),
    }).then(x => x.json())
    setActionMsg(r.message || r.error)
    setTimeout(() => setActionMsg(''), 3000)
  }

  const confirmDelete = (item) => {
    setDeleteConfirm(item)
    setDeletePass('')
    setDeleteMsg('')
  }

  const deleteItem = async () => {
    const r = await fetch('/api/admin/delete-item', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objectId: deleteConfirm.objectId, password: deletePass }),
    }).then(x => x.json())
    if (r.success) {
      setDeleteMsg('✓ ' + r.message)
      // Atualiza inventário removendo o item
      setCharModal(prev => ({
        ...prev,
        inventory: prev.inventory.filter(i => i.objectId !== deleteConfirm.objectId),
        equipped: prev.equipped.filter(i => i.objectId !== deleteConfirm.objectId),
      }))
      setTimeout(() => { setDeleteConfirm(null); setDeleteMsg('') }, 1500)
    } else {
      setDeleteMsg('✗ ' + r.error)
    }
  }

  const adjustIkoin = async (login) => {
    const v = prompt(`Quantos Ikoin dar/remover de "${login}"?\n(use número negativo para remover)`)
    if (!v) return
    const amount = parseInt(v)
    if (!amount) return
    const r = await fetch('/api/admin/ikoin', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, amount }),
    }).then(x => x.json())
    setBanMsg(r.message || r.error)
    setTimeout(() => setBanMsg(''), 4000)
  }

  const createCode = async () => {
    setCodeMsg('')
    const r = await fetch('/api/admin/code-create', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newCode, server: gameServer }),
    }).then(x => x.json())
    if (r.success) {
      setCodeMsg('✓ ' + r.message)
      setNewCode({ code: '', items: '', ikoin: '', description: '', maxUses: '' })
      fetchTab('codes')
    } else {
      setCodeMsg('✗ ' + r.error)
    }
    setTimeout(() => setCodeMsg(''), 4000)
  }

  const toggleCode = async (code, active) => {
    await fetch('/api/admin/code-toggle', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, active, server: gameServer }),
    })
    fetchTab('codes')
  }

  const deleteCode = async (code) => {
    const password = prompt('Senha de confirmação para deletar o código:')
    if (!password) return
    const r = await fetch('/api/admin/code-delete', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, password, server: gameServer }),
    }).then(x => x.json())
    if (r.success) fetchTab('codes')
    else alert(r.error)
  }

  const saveStreamer = async () => {
    setStrMsg('')
    const r = await fetch('/api/admin/streamer-save', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strForm),
    }).then(x => x.json())
    if (r.success) {
      setStrMsg(`✓ Salvo! Link: ${r.link}`)
      setStrForm({ slug: '', name: '', commission_pct: 30, payout_info: '' })
      fetchTab('streamers')
    } else setStrMsg(r.error || 'Erro ao salvar')
  }

  const toggleStreamer = async (slug, active) => {
    await fetch('/api/admin/streamer-toggle', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, active }),
    })
    fetchTab('streamers')
  }

  const fmtTime = (secs) => {
    if (!secs) return '—'
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    return `${h}h ${m}m`
  }

  const fmtDate = (ts) => ts ? new Date(ts * 1000).toLocaleDateString('pt-BR') : '—'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 20000, background: 'rgba(2,2,6,0.98)', backdropFilter: 'blur(30px)', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid rgba(197,160,89,0.2)', background: 'rgba(0,0,0,0.4)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '3px', height: '26px', background: 'var(--gold)' }} />
          <span className="cinzel" style={{ color: 'var(--gold)', fontSize: '0.9rem', letterSpacing: '4px' }}>PAINEL ADMINISTRATIVO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user.picture && <img src={user.picture} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(197,160,89,0.4)' }} />}
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>{user.email}</span>
          <button onClick={onLogout} style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.65rem', letterSpacing: '2px', cursor: 'pointer' }}>SAIR</button>
        </div>
      </div>

      {/* BODY: SIDEBAR + CONTENT */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* SIDEBAR */}
        <div style={{ width: '210px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', padding: '1rem 0.8rem' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? 'rgba(197,160,89,0.12)' : 'none',
              border: 'none', borderLeft: `3px solid ${tab === t.id ? 'var(--gold)' : 'transparent'}`,
              padding: '0.8rem 1rem', marginBottom: '0.2rem', textAlign: 'left',
              color: tab === t.id ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
              fontSize: '0.7rem', letterSpacing: '2px', cursor: 'pointer', borderRadius: '0 6px 6px 0',
              transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
          <button onClick={() => fetchTab(tab)} style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem', letterSpacing: '2px', cursor: 'pointer', padding: '0.7rem', borderRadius: '6px' }}>↻ ATUALIZAR</button>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem 2rem' }}>
        {loading && <p style={{ color: 'var(--text-mute)', letterSpacing: '3px', fontSize: '0.75rem' }}>CARREGANDO...</p>}

        {/* VISÃO GERAL */}
        {!loading && tab === 'overview' && stats && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
              <div onClick={() => setTab('players')} style={{ cursor: 'pointer' }}>
                <StatCard label="ONLINE AGORA ↗" value={players.length} color="#4ade80" />
              </div>
              <StatCard label="TOTAL DE CONTAS" value={stats.total_accounts?.toLocaleString()} />
              <StatCard label="CADASTROS HOJE" value={stats.today} color="#60a5fa" />
              <StatCard label="CADASTROS 7 DIAS" value={stats.week} color="#c084fc" />
              <StatCard label="PERSONAGENS" value={stats.total_chars?.toLocaleString()} color="rgba(255,255,255,0.5)" />
              <StatCard label="CONTAS BANIDAS" value={stats.banned} color="#ef4444" />
            </div>

            {stats.daily?.length > 0 && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <p style={{ fontSize: '0.58rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '1rem' }}>REGISTROS — ÚLTIMOS 7 DIAS</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
                  {stats.daily.map((d, i) => {
                    const max = Math.max(...stats.daily.map(x => x.count))
                    const pct = max > 0 ? (d.count / max) * 100 : 0
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.55rem', color: 'var(--gold)' }}>{d.count}</span>
                        <div style={{ width: '100%', height: `${Math.max(pct, 4)}%`, background: 'var(--gold)', borderRadius: '3px 3px 0 0', minHeight: '4px' }} />
                        <span style={{ fontSize: '0.5rem', color: 'var(--text-mute)' }}>{String(d.day).slice(5)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* JOGADORES ONLINE */}
        {!loading && tab === 'players' && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.58rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '1rem' }}>
              JOGADORES ONLINE — {players.length} ATIVOS · <span style={{ color: 'rgba(255,255,255,0.3)' }}>clique no jogador para ver detalhes</span>
            </p>
            {players.length === 0
              ? <div>
                  <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem' }}>Nenhum jogador online</p>
                  {playersDebug && (
                    <pre style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '6px', color: '#60a5fa', fontSize: '0.7rem', overflow: 'auto' }}>
                      DEBUG: {JSON.stringify(playersDebug, null, 2)}
                    </pre>
                  )}
                </div>
              : <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr>
                      {['PERSONAGEM','CLASSE','NV','PVP','PK','TEMPO','CONTA'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-mute)', fontSize: '0.58rem', letterSpacing: '2px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((p, i) => (
                      <tr key={i}
                        onClick={() => openCharDetail(p.objId)}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(197,160,89,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '0.6rem 0.5rem', color: 'var(--gold)', fontWeight: '700' }}>{p.name}</td>
                        <td style={{ padding: '0.6rem 0.5rem', color: 'rgba(255,255,255,0.7)' }}>{p.class}</td>
                        <td style={{ padding: '0.6rem 0.5rem', color: '#4ade80' }}>{p.level}</td>
                        <td style={{ padding: '0.6rem 0.5rem', color: '#60a5fa' }}>{p.pvp}</td>
                        <td style={{ padding: '0.6rem 0.5rem', color: '#ef4444' }}>{p.pk}</td>
                        <td style={{ padding: '0.6rem 0.5rem', color: 'rgba(255,255,255,0.5)' }}>{fmtTime(p.onlineTime)}</td>
                        <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-mute)' }}>{p.account}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        {/* CONTAS */}
        {tab === 'accounts' && (
          <div>
            {banMsg && (
              <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', padding: '0.8rem 1.2rem', marginBottom: '1rem', color: '#4ade80', fontSize: '0.75rem' }}>
                {banMsg}
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchAccounts()}
                placeholder="Buscar por login ou e-mail..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', color: '#fff', fontSize: '0.82rem', borderRadius: '6px', outline: 'none' }}
              />
              <button onClick={searchAccounts} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.7rem' }}>BUSCAR</button>
            </div>

            {!loading && accounts.map((acc, i) => (
              <div key={i} className="glass-panel" style={{ padding: '1.2rem', marginBottom: '1rem', borderLeft: `3px solid ${acc.access_level < 0 ? '#ef4444' : 'rgba(197,160,89,0.3)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ color: acc.access_level < 0 ? '#ef4444' : 'var(--gold)', fontWeight: '700', fontSize: '0.9rem' }}>{acc.login}</span>
                    {acc.access_level < 0 && <span style={{ marginLeft: '0.5rem', background: 'rgba(255,68,68,0.15)', color: '#ef4444', fontSize: '0.55rem', padding: '2px 8px', borderRadius: '10px', letterSpacing: '1px' }}>BANIDO</span>}
                    <p style={{ color: 'var(--text-mute)', fontSize: '0.68rem', margin: '4px 0 0' }}>
                      {acc.email || 'sem e-mail'} · IP: {acc.lastIP || '—'} · Último acesso: {fmtDate(acc.lastactive)} · Cadastro: {fmtDate(acc.created_time)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => loadChars(acc.login)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.4rem 0.9rem', borderRadius: '5px', fontSize: '0.62rem', cursor: 'pointer', letterSpacing: '1px' }}>
                      {accountChars[acc.login] ? 'OCULTAR' : 'VER CHARS'}
                    </button>
                    <button onClick={() => adjustIkoin(acc.login)} style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.3)', color: 'var(--gold)', padding: '0.4rem 0.9rem', borderRadius: '5px', fontSize: '0.62rem', cursor: 'pointer', letterSpacing: '1px' }}>
                      + IKOIN
                    </button>
                    {acc.access_level < 0
                      ? <button onClick={() => banAccount(acc.login, false)} style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', padding: '0.4rem 0.9rem', borderRadius: '5px', fontSize: '0.62rem', cursor: 'pointer' }}>DESBANIR</button>
                      : <button onClick={() => banAccount(acc.login, true)} style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ef4444', padding: '0.4rem 0.9rem', borderRadius: '5px', fontSize: '0.62rem', cursor: 'pointer' }}>BANIR</button>
                    }
                  </div>
                </div>

                {accountChars[acc.login] && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Table
                      cols={[
                        { key: 'name', label: 'PERSONAGEM', color: () => '#fff' },
                        { key: 'class', label: 'CLASSE' },
                        { key: 'level', label: 'NV', color: () => '#4ade80' },
                        { key: 'pvp', label: 'PVP', color: () => '#60a5fa' },
                        { key: 'pk', label: 'PK', color: () => '#ef4444' },
                        { key: 'online', label: 'STATUS', render: r => (
                          <span style={{ color: r.online ? '#4ade80' : 'var(--text-mute)', fontSize: '0.6rem' }}>
                            {r.online ? '● ONLINE' : '○ OFFLINE'}
                          </span>
                        )},
                      ]}
                      rows={accountChars[acc.login]}
                      emptyMsg="Nenhum personagem"
                    />
                  </div>
                )}
              </div>
            ))}
            {!loading && accounts.length === 0 && search && (
              <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem' }}>Nenhuma conta encontrada.</p>
            )}
            {!loading && !search && accounts.length === 0 && (
              <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem' }}>Digite um login ou e-mail para buscar.</p>
            )}
          </div>
        )}

        {/* RANKING */}
        {!loading && tab === 'ranking' && (
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              {['pvp', 'pk'].map(r => (
                <button key={r} onClick={() => setRankTab(r)} style={{
                  background: rankTab === r ? 'rgba(197,160,89,0.15)' : 'none',
                  border: `1px solid ${rankTab === r ? 'rgba(197,160,89,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: rankTab === r ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
                  padding: '0.5rem 1.5rem', borderRadius: '6px', fontSize: '0.7rem', letterSpacing: '3px', cursor: 'pointer',
                }}>TOP {r.toUpperCase()}</button>
              ))}
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <Table
                cols={[
                  { key: '_rank', label: '#', render: (r, i) => <span style={{ color: i < 3 ? 'var(--gold)' : 'var(--text-mute)', fontWeight: i < 3 ? '900' : '400' }}>{(ranking[rankTab].indexOf(r) + 1)}</span> },
                  { key: 'name', label: 'PERSONAGEM', color: () => '#fff' },
                  { key: 'class', label: 'CLASSE' },
                  { key: 'level', label: 'NV', color: () => '#4ade80' },
                  { key: 'pvp', label: 'PVP', color: () => '#60a5fa' },
                  { key: 'pk', label: 'PK', color: () => '#ef4444' },
                ]}
                rows={ranking[rankTab]}
                emptyMsg="Nenhum dado de ranking"
              />
            </div>
          </div>
        )}

        {/* CÓDIGOS PROMOCIONAIS */}
        {!loading && tab === 'codes' && (
          <div>
            {/* SELETOR DE SERVIDOR — codigos/ofertas sao por jogo */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.2rem' }}>
              {['essence', 'interlude'].map(s => (
                <button key={s} onClick={() => setGameServer(s)} style={{
                  flex: 1, padding: '0.6rem', borderRadius: '8px', cursor: 'pointer',
                  background: gameServer === s ? 'rgba(197,160,89,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${gameServer === s ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                  color: gameServer === s ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                  fontSize: '0.72rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase',
                }}>
                  {s === 'essence' ? 'ESSENCE' : 'INTERLUDE'}
                </button>
              ))}
            </div>
            {/* Criar novo código */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.58rem', color: 'var(--gold)', letterSpacing: '3px', marginBottom: '1rem' }}>CRIAR NOVO CÓDIGO</p>
              {codeMsg && <div style={{ background: codeMsg.startsWith('✓') ? 'rgba(74,222,128,0.1)' : 'rgba(255,68,68,0.1)', border: `1px solid ${codeMsg.startsWith('✓') ? 'rgba(74,222,128,0.3)' : 'rgba(255,68,68,0.3)'}`, padding: '0.7rem 1rem', marginBottom: '1rem', color: codeMsg.startsWith('✓') ? '#4ade80' : '#ef4444', fontSize: '0.75rem' }}>{codeMsg}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <input value={newCode.code} onChange={e => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })} placeholder="CÓDIGO (ex: STREAMER10)" style={inputStyleAdmin} />
                <input value={newCode.maxUses} onChange={e => setNewCode({ ...newCode, maxUses: e.target.value })} placeholder="Máx. usos (0 = ilimitado)" type="number" style={inputStyleAdmin} />
              </div>
              <input value={newCode.items} onChange={e => setNewCode({ ...newCode, items: e.target.value })} placeholder="Itens (resgate no GAME): itemId:qtd;itemId:qtd  (ex: 57:1000000;3470:5)" style={{ ...inputStyleAdmin, width: '100%', marginBottom: '0.8rem', boxSizing: 'border-box' }} />
              <input value={newCode.ikoin} onChange={e => setNewCode({ ...newCode, ikoin: e.target.value })} type="number" placeholder="Ikoin de bônus (resgate no SITE) — deixe 0 se não quiser" style={{ ...inputStyleAdmin, width: '100%', marginBottom: '0.8rem', boxSizing: 'border-box' }} />
              <input value={newCode.description} onChange={e => setNewCode({ ...newCode, description: e.target.value })} placeholder="Descrição (opcional)" style={{ ...inputStyleAdmin, width: '100%', marginBottom: '1rem', boxSizing: 'border-box' }} />
              <button onClick={createCode} className="btn btn-primary" style={{ padding: '0.7rem 2rem', fontSize: '0.7rem' }}>CRIAR CÓDIGO</button>
              <p style={{ fontSize: '0.62rem', color: 'var(--text-mute)', marginTop: '0.8rem', lineHeight: 1.5 }}>
                💡 <span style={{ color: 'var(--gold)' }}>Itens</span> são resgatados no jogo com <span style={{ color: 'var(--gold)' }}>.code SEUCODIGO</span>. <span style={{ color: 'var(--gold)' }}>Ikoin</span> é resgatado no painel do jogador. Cada conta resgata uma vez.
              </p>
            </div>

            {/* Lista de códigos */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.58rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '1rem' }}>CÓDIGOS CRIADOS — {codes.length}</p>
              {codes.length === 0
                ? <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem' }}>Nenhum código criado ainda.</p>
                : <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                    <thead>
                      <tr>
                        {['CÓDIGO', 'ITENS', 'IKOIN', 'USOS', 'STATUS', 'AÇÕES'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-mute)', fontSize: '0.55rem', letterSpacing: '2px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {codes.map((c, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '0.6rem 0.5rem', color: 'var(--gold)', fontWeight: '700', fontFamily: 'monospace' }}>{c.code}</td>
                          <td style={{ padding: '0.6rem 0.5rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', fontSize: '0.68rem' }}>{c.items || '—'}</td>
                          <td style={{ padding: '0.6rem 0.5rem', color: c.ikoin > 0 ? 'var(--gold)' : 'var(--text-mute)' }}>{c.ikoin > 0 ? `${c.ikoin} IK` : '—'}</td>
                          <td style={{ padding: '0.6rem 0.5rem', color: 'rgba(255,255,255,0.7)' }}>{c.uses}{c.max_uses > 0 ? `/${c.max_uses}` : ''}</td>
                          <td style={{ padding: '0.6rem 0.5rem' }}>
                            <span style={{ color: c.active ? '#4ade80' : 'var(--text-mute)', fontSize: '0.6rem' }}>{c.active ? '● ATIVO' : '○ INATIVO'}</span>
                          </td>
                          <td style={{ padding: '0.6rem 0.5rem', display: 'flex', gap: '0.4rem' }}>
                            <button onClick={() => toggleCode(c.code, !c.active)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.3rem 0.7rem', borderRadius: '4px', fontSize: '0.58rem', cursor: 'pointer' }}>{c.active ? 'DESATIVAR' : 'ATIVAR'}</button>
                            <button onClick={() => deleteCode(c.code)} style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)', color: '#ef4444', padding: '0.3rem 0.7rem', borderRadius: '4px', fontSize: '0.58rem', cursor: 'pointer' }}>DEL</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              }
            </div>
          </div>
        )}

        {/* ABA OFERTA LIMITADA */}
        {!loading && tab === 'offer' && (
          <div style={{ maxWidth: '560px' }}>
            {/* SELETOR DE SERVIDOR — codigos/ofertas sao por jogo */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.2rem' }}>
              {['essence', 'interlude'].map(s => (
                <button key={s} onClick={() => setGameServer(s)} style={{
                  flex: 1, padding: '0.6rem', borderRadius: '8px', cursor: 'pointer',
                  background: gameServer === s ? 'rgba(197,160,89,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${gameServer === s ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                  color: gameServer === s ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                  fontSize: '0.72rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase',
                }}>
                  {s === 'essence' ? 'ESSENCE' : 'INTERLUDE'}
                </button>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              Configure as <b style={{ color: 'var(--gold)' }}>2 Ofertas Limitadas</b> do Community Board. O ícone e o nome são puxados automaticamente do item pelo ID.
            </p>
            {/* SELETOR DE SLOT */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.2rem' }}>
              {[1, 2].map(slot => (
                <button key={slot} onClick={() => loadOfferSlot(slot)} style={{
                  flex: 1, padding: '0.7rem', borderRadius: '8px', cursor: 'pointer',
                  background: offerSlot === slot ? 'rgba(197,160,89,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${offerSlot === slot ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                  color: offerSlot === slot ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                  fontSize: '0.78rem', fontWeight: '700', letterSpacing: '1px',
                }}>
                  OFERTA {slot} {offersData[slot]?.active ? '●' : ''}
                </button>
              ))}
            </div>
            <div className="glass-panel" style={{ padding: '1.8rem', border: '1px solid rgba(197,160,89,0.3)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {gameServer === 'interlude' && (
                  <div>
                    <label style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '2px', display: 'block', marginBottom: '0.4rem' }}>ENCHANT (0 = normal, ex: 20 = +20)</label>
                    <input type="number" value={offer.enchant} onChange={e => setOffer({ ...offer, enchant: e.target.value })} style={{ ...inputStyleAdmin, width: '100%' }} />
                  </div>
                )}
                <div>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '2px', display: 'block', marginBottom: '0.4rem' }}>ID DO ITEM</label>
                  <input value={offer.item_id} onChange={e => setOffer({ ...offer, item_id: e.target.value })} placeholder="ex: 22078" style={{ ...inputStyleAdmin, width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '2px', display: 'block', marginBottom: '0.4rem' }}>QUANTIDADE</label>
                  <input type="number" value={offer.count} onChange={e => setOffer({ ...offer, count: e.target.value })} style={{ ...inputStyleAdmin, width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '2px', display: 'block', marginBottom: '0.4rem' }}>PREÇO (IKOIN)</label>
                  <input type="number" value={offer.price_ikoin} onChange={e => setOffer({ ...offer, price_ikoin: e.target.value })} style={{ ...inputStyleAdmin, width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '2px', display: 'block', marginBottom: '0.4rem' }}>TÍTULO</label>
                  <input value={offer.title} onChange={e => setOffer({ ...offer, title: e.target.value })} style={{ ...inputStyleAdmin, width: '100%' }} />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
                <input type="checkbox" checked={!!offer.active} onChange={e => setOffer({ ...offer, active: e.target.checked ? 1 : 0 })} style={{ width: '18px', height: '18px', accentColor: 'var(--gold)' }} />
                <span style={{ color: offer.active ? '#4ade80' : 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{offer.active ? 'OFERTA ATIVA (visível no jogo)' : 'Oferta desativada (oculta no jogo)'}</span>
              </label>
              <button onClick={saveOffer} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>SALVAR OFERTA</button>
              {offerMsg && <p style={{ marginTop: '0.8rem', fontSize: '0.82rem', fontWeight: '600', color: offerMsg.startsWith('✓') ? '#4ade80' : offerMsg.startsWith('⏳') ? 'var(--gold)' : '#ef4444', textAlign: 'center' }}>{offerMsg}</p>}
            </div>

            {/* PREVIEW DA OFERTA ATUAL */}
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '3px', marginBottom: '0.8rem' }}>PREVIEW DA OFERTA (COMO APARECE NO JOGO)</p>
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,170,68,0.08), rgba(0,0,0,0.3))',
                border: `1px solid ${offer.active ? 'rgba(255,170,68,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '12px', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem',
                opacity: offer.active ? 1 : 0.5,
              }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '8px', background: 'rgba(255,170,68,0.12)', border: '1px solid rgba(255,170,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🎁</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#FFAA44', fontWeight: '700', fontSize: '0.95rem', margin: 0 }}>{offer.title || 'Oferta Limitada'}</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: '2px 0 0' }}>
                    {`Item ${offer.item_id || '—'}`}{offer.count > 1 ? ` x${offer.count}` : ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '1rem', margin: 0 }}>{offer.price_ikoin} IK</p>
                  <p style={{ color: offer.active ? '#4ade80' : 'rgba(255,255,255,0.3)', fontSize: '0.6rem', letterSpacing: '1px', margin: '2px 0 0' }}>{offer.active ? '● ATIVA' : '○ OCULTA'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA STREAMERS / AFILIADOS */}
        {!loading && tab === 'streamers' && (
          <div style={{ maxWidth: '860px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '0.8rem' }}>
              Cada streamer ganha o link <b style={{ color: 'var(--gold)' }}>l2ikarus.com/r/&lt;slug&gt;</b>. Quem se cadastra por ele fica vinculado (30 dias, first-touch). Comissão = % sobre Ikoin comprado pelos indicados.
            </p>
            {/* Form criar/editar */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '0.6rem', background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '8px' }}>
              <div><label style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', display: 'block' }}>SLUG (link)</label>
                <input value={strForm.slug} onChange={e => setStrForm({ ...strForm, slug: e.target.value })} placeholder="nickdostreamer" style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '0.4rem', borderRadius: '4px', width: '140px' }} /></div>
              <div><label style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', display: 'block' }}>NOME</label>
                <input value={strForm.name} onChange={e => setStrForm({ ...strForm, name: e.target.value })} placeholder="Nome" style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '0.4rem', borderRadius: '4px', width: '140px' }} /></div>
              <div><label style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', display: 'block' }}>COMISSÃO %</label>
                <input type="number" value={strForm.commission_pct} onChange={e => setStrForm({ ...strForm, commission_pct: e.target.value })} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '0.4rem', borderRadius: '4px', width: '70px' }} /></div>
              <div><label style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', display: 'block' }}>PIX/PAGAMENTO</label>
                <input value={strForm.payout_info} onChange={e => setStrForm({ ...strForm, payout_info: e.target.value })} placeholder="chave pix" style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '0.4rem', borderRadius: '4px', width: '160px' }} /></div>
              <button onClick={saveStreamer} style={{ background: 'var(--gold)', color: '#0d0d0d', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>SALVAR</button>
            </div>
            {strMsg && <p style={{ color: strMsg.startsWith('✓') ? '#6c6' : '#e66', fontSize: '0.8rem', marginBottom: '0.6rem' }}>{strMsg}</p>}
            {/* Tabela relatorio */}
            <Table
              cols={['Slug', 'Nome', 'Contas', 'Ikoin comprado', 'Comissão (R$)', '%', 'Status', 'Ação']}
              rows={streamers.map(s => [
                s.slug, s.name, s.accounts, s.ikoin_bought, s.commission, s.commission_pct + '%',
                s.active ? 'Ativo' : 'Inativo',
                <button key={s.slug} onClick={() => toggleStreamer(s.slug, !s.active)} style={{ background: 'none', border: '1px solid #555', color: '#aaa', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>{s.active ? 'Desativar' : 'Ativar'}</button>
              ])}
              emptyMsg="Nenhum streamer cadastrado"
            />
          </div>
        )}

        {/* ABA PERSONAGENS (edição offline) */}
        {tab === 'charmgmt' && (
          <div style={{ maxWidth: '720px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
              Busque um personagem pelo nome para editar. <b style={{ color: '#f87171' }}>O char precisa estar OFFLINE</b> — as mudanças valem ao logar.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.2rem', marginTop: '1rem' }}>
              <input value={charQuery} onChange={e => setCharQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchChars()}
                placeholder="Nome do personagem" style={{ ...inputStyleAdmin, flex: 1 }} />
              <button onClick={searchChars} className="btn btn-primary" style={{ padding: '0.7rem 1.5rem' }}>BUSCAR</button>
            </div>

            {charResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.2rem' }}>
                {charResults.map(c => (
                  <div key={c.objId} onClick={() => { setSelChar(c); setNewClass(''); setSelRace(c.race ?? 0); setCharMgmtMsg('') }} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1rem',
                    background: selChar?.objId === c.objId ? 'rgba(197,160,89,0.12)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selChar?.objId === c.objId ? 'var(--gold)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '8px', cursor: 'pointer',
                  }}>
                    <div>
                      <span style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '0.9rem' }}>{c.name}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginLeft: '0.8rem' }}>Lv {c.level} · {c.class} · {c.account}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {c.isGM && <span style={{ color: '#00CCFF', fontSize: '0.6rem', fontWeight: '700' }}>GM</span>}
                      <span style={{ color: c.online ? '#4ade80' : 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>{c.online ? '● ONLINE' : '○ OFFLINE'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selChar && (
              <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(197,160,89,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <h4 className="cinzel" style={{ color: 'var(--gold)', margin: 0 }}>{selChar.name}</h4>
                  <span style={{ color: selChar.online ? '#f87171' : '#4ade80', fontSize: '0.7rem' }}>{selChar.online ? '⚠ ONLINE — deslogue antes' : '✓ Offline — pode editar'}</span>
                </div>

                {/* GM */}
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <button onClick={() => charAction('set-gm', { objId: selChar.objId, gm: true }, 'GM')} style={{ flex: 1, minWidth: '140px', padding: '0.7rem', background: 'rgba(0,204,255,0.1)', border: '1px solid rgba(0,204,255,0.4)', color: '#00CCFF', borderRadius: '7px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>★ DAR GM (Master)</button>
                  <button onClick={() => charAction('set-gm', { objId: selChar.objId, gm: false }, 'GM')} style={{ flex: 1, minWidth: '140px', padding: '0.7rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', cursor: 'pointer', fontSize: '0.75rem' }}>REMOVER GM</button>
                </div>

                {/* TROCAR RAÇA + CLASSE */}
                <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', margin: '0 0 0.5rem' }}>TROCAR RAÇA + CLASSE</p>
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <select value={selRace} onChange={e => { setSelRace(parseInt(e.target.value)); setNewClass('') }} style={{ ...inputStyleAdmin, flex: 1 }}>
                    {RACES_LIST.map(r => <option key={r.id} value={r.id} style={{ background: '#1a1a1f', color: '#fff' }}>{r.name}</option>)}
                  </select>
                  <select value={newClass} onChange={e => setNewClass(e.target.value)} style={{ ...inputStyleAdmin, flex: 1.4 }}>
                    <option value="" style={{ background: '#1a1a1f', color: '#fff' }}>— Classe —</option>
                    {ALL_CLASSES.filter(cl => cl.race === selRace).map(cl => <option key={cl.id} value={cl.id} style={{ background: '#1a1a1f', color: '#fff' }}>{cl.id} — {cl.name}</option>)}
                  </select>
                  <button onClick={() => charAction('char-class', { objId: selChar.objId, classId: newClass }, 'Classe')} disabled={!newClass} style={{ padding: '0.7rem 1.2rem', background: 'rgba(192,132,252,0.12)', border: '1px solid rgba(192,132,252,0.4)', color: '#c084fc', borderRadius: '7px', cursor: newClass ? 'pointer' : 'not-allowed', fontSize: '0.75rem', fontWeight: '700', opacity: newClass ? 1 : 0.5, whiteSpace: 'nowrap' }}>APLICAR</button>
                </div>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', margin: '0 0 1rem' }}>Escolha a raça → a classe. A raça e a aparência do char são ajustadas automaticamente (sem bug). Char offline.</p>

                {/* TELEPORTE (destravar) */}
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <select value={newTown} onChange={e => setNewTown(e.target.value)} style={{ ...inputStyleAdmin, flex: 1 }}>
                    {TOWNS_LIST.map(t => <option key={t.id} value={t.id} style={{ background: '#1a1a1f', color: '#fff' }}>Teleportar para {t.name}</option>)}
                  </select>
                  <button onClick={() => charAction('char-teleport', { objId: selChar.objId, town: newTown }, 'Teleporte')} style={{ padding: '0.7rem 1.2rem', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.4)', color: '#4ade80', borderRadius: '7px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>DESTRAVAR</button>
                </div>

                {charMgmtMsg && <p style={{ marginTop: '1rem', fontSize: '0.82rem', fontWeight: '600', textAlign: 'center', color: charMgmtMsg.startsWith('✓') ? '#4ade80' : charMgmtMsg.startsWith('⏳') ? 'var(--gold)' : '#ef4444' }}>{charMgmtMsg}</p>}
              </div>
            )}
            {charMgmtMsg && !selChar && <p style={{ fontSize: '0.82rem', color: '#ef4444' }}>{charMgmtMsg}</p>}
          </div>
        )}
        </div>
      </div>

      {/* MODAL CONFIRMAÇÃO DELETE */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setDeleteConfirm(null)}>
          <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '380px', border: '1px solid rgba(255,68,68,0.4)' }} onClick={e => e.stopPropagation()}>
            <h4 className="cinzel" style={{ color: '#ef4444', marginBottom: '0.5rem' }}>DELETAR ITEM</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              <strong style={{ color: '#fff' }}>{deleteConfirm.name}</strong>{deleteConfirm.enchant > 0 ? ` +${deleteConfirm.enchant}` : ''} · Qty: {deleteConfirm.count?.toLocaleString()}
            </p>
            <input
              type="password" placeholder="Senha de confirmação"
              value={deletePass}
              onChange={e => setDeletePass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && deleteItem()}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,68,68,0.3)', padding: '0.8rem', color: '#fff', fontSize: '0.85rem', borderRadius: '4px', outline: 'none', marginBottom: '1rem', boxSizing: 'border-box' }}
            />
            {deleteMsg && <p style={{ color: deleteMsg.startsWith('✓') ? '#4ade80' : '#ef4444', fontSize: '0.75rem', marginBottom: '0.75rem' }}>{deleteMsg}</p>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={deleteItem} style={{ flex: 1, background: 'rgba(255,68,68,0.15)', border: '1px solid rgba(255,68,68,0.4)', color: '#ef4444', padding: '0.7rem', borderRadius: '5px', fontSize: '0.7rem', letterSpacing: '2px', cursor: 'pointer' }}>CONFIRMAR</button>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '0.7rem', borderRadius: '5px', fontSize: '0.7rem', letterSpacing: '2px', cursor: 'pointer' }}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALHES DO PERSONAGEM */}
      {charModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 30000,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)', padding: '1rem',
        }} onClick={() => setCharModal(null)}>
          <div className="glass-panel" style={{
            width: '100%', maxWidth: '700px', maxHeight: '85vh', overflow: 'auto',
            padding: '2rem', position: 'relative',
            border: '1px solid rgba(197,160,89,0.3)',
          }} onClick={e => e.stopPropagation()}>

            {charModal.loading ? (
              <p style={{ color: 'var(--text-mute)', letterSpacing: '3px' }}>CARREGANDO...</p>
            ) : charModal.char ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 className="cinzel" style={{ color: 'var(--gold)', fontSize: '1.3rem', margin: 0 }}>{charModal.char.name}</h3>
                    <p style={{ color: 'var(--text-mute)', fontSize: '0.68rem', margin: '4px 0 0', letterSpacing: '2px' }}>
                      {charModal.char.class} · Nv {charModal.char.level} · {charModal.char.race} · {charModal.char.sex}
                    </p>
                  </div>
                  <button onClick={() => setCharModal(null)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
                </div>

                {/* AÇÕES */}
                {actionMsg && <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', padding: '0.6rem 1rem', marginBottom: '1rem', color: '#4ade80', fontSize: '0.75rem' }}>{actionMsg}</div>}
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setGM(charModal.char.objId, true)} style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.3)', color: 'var(--gold)', padding: '0.5rem 1rem', borderRadius: '5px', fontSize: '0.65rem', letterSpacing: '2px', cursor: 'pointer' }}>
                    ⭐ DAR GM
                  </button>
                  <button onClick={() => setGM(charModal.char.objId, false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '0.5rem 1rem', borderRadius: '5px', fontSize: '0.65rem', letterSpacing: '2px', cursor: 'pointer' }}>
                    REMOVER GM
                  </button>
                  <button onClick={() => banAccount(charModal.char.account, true)} style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '5px', fontSize: '0.65rem', letterSpacing: '2px', cursor: 'pointer' }}>
                    🔨 BANIR CONTA
                  </button>
                </div>

                {/* ABAS DO MODAL */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {[
                    { id: 'dados', label: 'DADOS' },
                    { id: 'equip', label: `EQUIPAMENTO (${charModal.equipped?.length || 0})` },
                    { id: 'inv', label: `INVENTÁRIO (${charModal.inventory?.length || 0})` },
                  ].map(t => (
                    <button key={t.id} onClick={() => setCharTab(t.id)} style={{
                      background: 'none', border: 'none', padding: '0.6rem 1rem',
                      color: charTab === t.id ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
                      fontSize: '0.6rem', letterSpacing: '2px', cursor: 'pointer',
                      borderBottom: `2px solid ${charTab === t.id ? 'var(--gold)' : 'transparent'}`,
                    }}>{t.label}</button>
                  ))}
                </div>

                {/* STATS */}
                {charTab === 'dados' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '0.5rem' }}>
                  {[
                    { l: 'PVP', v: charModal.char.pvp, c: '#60a5fa' },
                    { l: 'PK', v: charModal.char.pk, c: '#ef4444' },
                    { l: 'HP', v: charModal.char.hp, c: '#4ade80' },
                    { l: 'MP', v: charModal.char.mp, c: '#c084fc' },
                    { l: 'EXP', v: Number(charModal.char.exp).toLocaleString(), c: 'var(--gold)' },
                    { l: 'SP', v: Number(charModal.char.sp).toLocaleString(), c: 'rgba(255,255,255,0.6)' },
                    { l: 'KARMA', v: charModal.char.karma, c: charModal.char.karma > 0 ? '#ef4444' : '#4ade80' },
                    { l: 'TEMPO ONLINE', v: fmtTime(charModal.char.onlineTime), c: 'rgba(255,255,255,0.5)' },
                  ].map(s => (
                    <div key={s.l} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.7rem', borderRadius: '6px' }}>
                      <p style={{ fontSize: '0.52rem', color: 'var(--text-mute)', letterSpacing: '2px', margin: '0 0 4px' }}>{s.l}</p>
                      <p style={{ fontSize: '0.85rem', color: s.c, fontWeight: '700', margin: 0 }}>{s.v}</p>
                    </div>
                  ))}
                </div>
                )}

                {/* EQUIPAMENTO */}
                {charTab === 'equip' && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    {charModal.equipped?.length === 0 && <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem' }}>Nenhum item equipado.</p>}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
                      {charModal.equipped.map((item, i) => (
                        <div key={i} style={{ background: 'rgba(197,160,89,0.06)', border: '1px solid rgba(197,160,89,0.15)', padding: '0.6rem 0.8rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.55rem', color: 'var(--text-mute)', margin: 0 }}>{item.slot}</p>
                            <p style={{ fontSize: '0.78rem', color: '#fff', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                            {item.enchant > 0 && <span style={{ color: 'var(--gold)', fontWeight: '900' }}>+{item.enchant}</span>}
                            <button onClick={() => confirmDelete(item)} style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)', color: '#ef4444', width: '22px', height: '22px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* INVENTÁRIO */}
                {charTab === 'inv' && (
                  <div>
                    {charModal.inventory?.length === 0 && <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem' }}>Inventário vazio.</p>}
                    <div style={{ maxHeight: '380px', overflow: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                        <thead>
                          <tr>
                            {['NOME', 'QUANTIDADE', 'ENCANT', ''].map(h => (
                              <th key={h} style={{ textAlign: 'left', padding: '0.4rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-mute)', fontSize: '0.55rem', letterSpacing: '2px' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {charModal.inventory.map((item, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <td style={{ padding: '0.4rem 0.5rem', color: '#fff' }}>{item.name}</td>
                              <td style={{ padding: '0.4rem 0.5rem', color: 'rgba(255,255,255,0.7)' }}>{item.count?.toLocaleString()}</td>
                              <td style={{ padding: '0.4rem 0.5rem', color: item.enchant > 0 ? 'var(--gold)' : 'var(--text-mute)' }}>
                                {item.enchant > 0 ? `+${item.enchant}` : '—'}
                              </td>
                              <td style={{ padding: '0.4rem 0.5rem' }}>
                                <button onClick={() => confirmDelete(item)} style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)', color: '#ef4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', cursor: 'pointer' }}>DEL</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: '#ef4444' }}>Erro ao carregar dados do personagem.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
