import { useState, useEffect } from 'react'

const TABS = [
  { id: 'overview', label: 'VISÃO GERAL' },
  { id: 'players', label: 'ONLINE' },
  { id: 'accounts', label: 'CONTAS' },
  { id: 'ranking', label: 'RANKING' },
]

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

  useEffect(() => { fetchTab(tab) }, [tab])

  const fetchTab = async (t) => {
    setLoading(true)
    try {
      if (t === 'overview') {
        const r = await fetch('/api/admin/stats').then(x => x.json())
        setStats(r)
      } else if (t === 'players') {
        const r = await fetch('/api/admin/players').then(x => x.json())
        setPlayers(r.players || [])
      } else if (t === 'ranking') {
        const r = await fetch('/api/admin/ranking').then(x => x.json())
        setRanking(r)
      }
    } catch {}
    setLoading(false)
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
              <StatCard label="ONLINE AGORA" value={stats.online} color="#4ade80" />
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
              JOGADORES ONLINE — {players.length} ATIVOS
            </p>
            <Table
              cols={[
                { key: 'name', label: 'PERSONAGEM', color: () => 'var(--gold)' },
                { key: 'class', label: 'CLASSE' },
                { key: 'level', label: 'NV', color: () => '#4ade80' },
                { key: 'pvp', label: 'PVP', color: () => '#60a5fa' },
                { key: 'pk', label: 'PK', color: () => '#ef4444' },
                { key: 'onlineTime', label: 'TEMPO', render: r => fmtTime(r.onlineTime) },
                { key: 'account', label: 'CONTA', color: () => 'var(--text-mute)' },
              ]}
              rows={players}
              emptyMsg="Nenhum jogador online"
            />
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
      </div>
    </div>
  )
}
