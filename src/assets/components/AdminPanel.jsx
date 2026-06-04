import { useState, useEffect } from 'react'

const TABS = [
  { id: 'overview', label: 'VISÃO GERAL' },
  { id: 'players', label: 'ONLINE' },
  { id: 'accounts', label: 'CONTAS' },
  { id: 'ranking', label: 'RANKING' },
  { id: 'codes', label: 'CÓDIGOS' },
  { id: 'offer', label: 'OFERTA' },
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
  const [newCode, setNewCode] = useState({ code: '', items: '', ikoin: '', description: '', maxUses: '' })
  const [codeMsg, setCodeMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { objectId, name }
  const [deletePass, setDeletePass] = useState('')
  const [deleteMsg, setDeleteMsg] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [offer, setOffer] = useState({ item_id: '', count: 1, price_ikoin: 100, title: 'Oferta Limitada', active: 0 })
  const [offerItemName, setOfferItemName] = useState(null)
  const [offerMsg, setOfferMsg] = useState('')

  useEffect(() => { fetchTab(tab) }, [tab])

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
        const r = await fetch('/api/admin/codes').then(x => x.json())
        setCodes(r.codes || [])
      } else if (t === 'offer') {
        const r = await fetch('/api/admin/offer').then(x => x.json())
        if (r.offer) setOffer(r.offer)
        setOfferItemName(r.itemName || null)
      }
    } catch {}
    setLoading(false)
  }

  const saveOffer = async () => {
    setOfferMsg('')
    const r = await fetch('/api/admin/offer-save', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: offer.item_id, count: offer.count,
        price: offer.price_ikoin, title: offer.title, active: offer.active,
      }),
    }).then(x => x.json())
    setOfferMsg(r.success ? r.message : (r.error || 'Erro ao salvar'))
    if (r.success) fetchTab('offer')
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
      body: JSON.stringify(newCode),
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
      body: JSON.stringify({ code, active }),
    })
    fetchTab('codes')
  }

  const deleteCode = async (code) => {
    const password = prompt('Senha de confirmação para deletar o código:')
    if (!password) return
    const r = await fetch('/api/admin/code-delete', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, password }),
    }).then(x => x.json())
    if (r.success) fetchTab('codes')
    else alert(r.error)
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

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 2rem', flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none', padding: '0.9rem 1.5rem',
            color: tab === t.id ? 'var(--gold)' : 'rgba(255,255,255,0.35)',
            fontSize: '0.62rem', letterSpacing: '3px', cursor: 'pointer',
            borderBottom: `2px solid ${tab === t.id ? 'var(--gold)' : 'transparent'}`,
          }}>{t.label}</button>
        ))}
        <button onClick={() => fetchTab(tab)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', cursor: 'pointer', padding: '0.9rem' }}>↻ ATUALIZAR</button>
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
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              Configure a <b style={{ color: 'var(--gold)' }}>Oferta Limitada</b> que aparece no Community Board do jogo. O ícone e o nome são puxados automaticamente do item pelo ID.
            </p>
            <div className="glass-panel" style={{ padding: '1.8rem', border: '1px solid rgba(197,160,89,0.3)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '2px', display: 'block', marginBottom: '0.4rem' }}>ID DO ITEM</label>
                  <input value={offer.item_id} onChange={e => setOffer({ ...offer, item_id: e.target.value })} placeholder="ex: 22078" style={{ ...inputStyleAdmin, width: '100%' }} />
                  {offerItemName && <p style={{ fontSize: '0.7rem', color: '#4ade80', margin: '0.4rem 0 0' }}>✓ {offerItemName}</p>}
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
              {offerMsg && <p style={{ marginTop: '0.8rem', fontSize: '0.78rem', color: offerMsg.includes('sucesso') ? '#4ade80' : '#ef4444', textAlign: 'center' }}>{offerMsg}</p>}
            </div>
          </div>
        )}
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
