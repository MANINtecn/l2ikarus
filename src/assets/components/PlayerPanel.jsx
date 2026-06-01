export default function PlayerPanel({ data, onLogout }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20000,
      background: 'rgba(2,2,6,0.98)', backdropFilter: 'blur(30px)',
      display: 'flex', flexDirection: 'column',
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
            PAINEL DO JOGADOR
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <p style={{ color: '#fff', fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>{data.login}</p>
            {data.email && <p style={{ color: 'var(--text-mute)', fontSize: '0.65rem', margin: 0 }}>{data.email}</p>}
          </div>
          <button onClick={onLogout} style={{
            background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)',
            color: '#ff4444', padding: '0.5rem 1.2rem', borderRadius: '6px',
            fontSize: '0.65rem', letterSpacing: '2px', cursor: 'pointer',
          }}>SAIR</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid var(--gold)' }}>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '0.8rem' }}>PERSONAGENS</p>
            <p style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--gold)', margin: 0, fontFamily: 'Cinzel, serif' }}>
              {data.characters?.length ?? 0}
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid #4ade80' }}>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '0.8rem' }}>ONLINE AGORA</p>
            <p style={{ fontSize: '2.2rem', fontWeight: '900', color: '#4ade80', margin: 0, fontFamily: 'Cinzel, serif' }}>
              {data.characters?.filter(c => c.online).length ?? 0}
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid #c084fc' }}>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '0.8rem' }}>NÍVEL MÁXIMO</p>
            <p style={{ fontSize: '2.2rem', fontWeight: '900', color: '#c084fc', margin: 0, fontFamily: 'Cinzel, serif' }}>
              {data.characters?.length ? Math.max(...data.characters.map(c => c.level)) : 0}
            </p>
          </div>
        </div>

        {/* PERSONAGENS */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '1rem' }}>
            SEUS PERSONAGENS
          </p>
          {!data.characters?.length ? (
            <p style={{ color: 'var(--text-mute)', fontSize: '0.85rem' }}>Nenhum personagem criado ainda.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ color: 'var(--text-mute)', fontSize: '0.6rem', letterSpacing: '2px' }}>
                  {['PERSONAGEM', 'CLASSE', 'NÍVEL', 'STATUS'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.characters.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '0.7rem 0.5rem', color: 'var(--gold)', fontWeight: '700' }}>{c.name}</td>
                    <td style={{ padding: '0.7rem 0.5rem', color: 'rgba(255,255,255,0.7)' }}>{c.class}</td>
                    <td style={{ padding: '0.7rem 0.5rem', color: '#fff', fontWeight: '600' }}>{c.level}</td>
                    <td style={{ padding: '0.7rem 0.5rem' }}>
                      <span style={{
                        background: c.online ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
                        color: c.online ? '#4ade80' : 'var(--text-mute)',
                        border: `1px solid ${c.online ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        padding: '2px 10px', borderRadius: '20px', fontSize: '0.6rem', letterSpacing: '1px',
                      }}>
                        {c.online ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
