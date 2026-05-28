import { useState, useEffect } from 'react'

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
  99:'Eva\'s Templar',100:'Sword Muse',101:'Wind Rider',102:'Moonlight Sentinel',
  103:'Mystic Muse',104:'Elemental Master',105:'Eva\'s Saint',106:'Shillien Templar',
  107:'Spectral Dancer',108:'Ghost Hunter',109:'Ghost Sentinel',110:'Storm Screamer',
  111:'Spectral Master',112:'Shillien Saint',113:'Titan',114:'Grand Khavatari',
  115:'Dominator',116:'Doomcryer',117:'Fortune Seeker',118:'Maestro',
}

export default function AdminPanel({ user, onLogout }) {
  const [tab, setTab] = useState('overview')
  const [status, setStatus] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [statusRes, playersRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/admin/players'),
      ])
      const s = await statusRes.json()
      const p = await playersRes.json()
      setStatus(s)
      setData(p)
    } catch {}
    setLoading(false)
  }

  const tabs = [
    { id: 'overview', label: 'VISÃO GERAL' },
    { id: 'players', label: 'JOGADORES' },
    { id: 'accounts', label: 'CONTAS' },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20000,
      background: 'rgba(2,2,6,0.98)',
      backdropFilter: 'blur(30px)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'sans-serif',
    }}>
      {/* HEADER */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.2rem 2rem',
        borderBottom: '1px solid rgba(197,160,89,0.2)',
        background: 'rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '3px', height: '28px', background: 'var(--gold)' }} />
          <span className="cinzel" style={{ color: 'var(--gold)', fontSize: '1rem', letterSpacing: '4px' }}>
            PAINEL ADMINISTRATIVO
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user.picture && (
            <img src={user.picture} alt={user.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(197,160,89,0.4)' }}
            />
          )}
          <div>
            <p style={{ color: '#fff', fontSize: '0.8rem', margin: 0, fontWeight: '600' }}>{user.name}</p>
            <p style={{ color: 'var(--text-mute)', fontSize: '0.65rem', margin: 0 }}>{user.email}</p>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)',
              color: '#ff4444', padding: '0.5rem 1.2rem', borderRadius: '6px',
              fontSize: '0.65rem', letterSpacing: '2px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,68,68,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,68,68,0.1)' }}
          >
            SAIR
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 2rem' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none', padding: '1rem 1.5rem',
            color: tab === t.id ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
            fontSize: '0.65rem', letterSpacing: '3px', cursor: 'pointer',
            borderBottom: `2px solid ${tab === t.id ? 'var(--gold)' : 'transparent'}`,
            transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
        <button onClick={fetchAll} style={{
          marginLeft: 'auto', background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', letterSpacing: '2px',
          cursor: 'pointer', padding: '1rem',
        }}>↻ ATUALIZAR</button>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
            <p style={{ color: 'var(--text-mute)', letterSpacing: '3px', fontSize: '0.8rem' }}>CARREGANDO...</p>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {tab === 'overview' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  <StatCard
                    label="STATUS DO SERVIDOR"
                    value={status?.online ? 'ON-LINE' : 'OFFLINE'}
                    color={status?.online ? '#4ade80' : '#ef4444'}
                  />
                  <StatCard
                    label="JOGADORES ONLINE"
                    value={data?.onlinePlayers?.length ?? 0}
                    color="var(--gold)"
                  />
                  <StatCard
                    label="TOTAL DE CONTAS"
                    value={data?.totalAccounts?.toLocaleString() ?? 0}
                    color="#c084fc"
                  />
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '1rem' }}>
                    ÚLTIMOS LOGINS
                  </p>
                  {(data?.recentLogins || []).length === 0 ? (
                    <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem' }}>Nenhum dado disponível</p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                      <thead>
                        <tr style={{ color: 'var(--text-mute)', fontSize: '0.6rem', letterSpacing: '2px' }}>
                          <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>CONTA</th>
                          <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>ÚLTIMO ACESSO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data.recentLogins || []).map((a, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '0.6rem 0.5rem', color: '#fff' }}>{a.login}</td>
                            <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-mute)' }}>
                              {a.lastactive ? new Date(a.lastactive * 1000).toLocaleString('pt-BR') : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* PLAYERS TAB */}
            {tab === 'players' && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '1rem' }}>
                  PERSONAGENS ONLINE — {data?.onlinePlayers?.length ?? 0} ATIVOS
                </p>
                {(data?.onlinePlayers || []).length === 0 ? (
                  <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem' }}>Nenhum jogador online no momento</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ color: 'var(--text-mute)', fontSize: '0.6rem', letterSpacing: '2px' }}>
                        <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>PERSONAGEM</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>CLASSE</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>NÍVEL</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>CONTA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.onlinePlayers || []).map((p, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '0.6rem 0.5rem', color: 'var(--gold)', fontWeight: '600' }}>{p.char_name}</td>
                          <td style={{ padding: '0.6rem 0.5rem', color: 'rgba(255,255,255,0.7)' }}>{L2_CLASSES[p.classid] || `Class ${p.classid}`}</td>
                          <td style={{ padding: '0.6rem 0.5rem', color: '#4ade80' }}>{p.level}</td>
                          <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-mute)' }}>{p.account_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ACCOUNTS TAB */}
            {tab === 'accounts' && (
              <div>
                <StatCard label="TOTAL DE CONTAS REGISTRADAS" value={data?.totalAccounts?.toLocaleString() ?? 0} color="#c084fc" />
                <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                  <p style={{ color: 'var(--text-mute)', fontSize: '0.78rem' }}>
                    Mais funcionalidades de gerenciamento de contas em breve.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: `3px solid ${color}` }}>
      <p style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '0.8rem' }}>{label}</p>
      <p style={{ fontSize: '2.2rem', fontWeight: '900', color, margin: 0, fontFamily: 'Cinzel, serif' }}>{value}</p>
    </div>
  )
}
