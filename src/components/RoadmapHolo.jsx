import { useState } from 'react'

export default function RoadmapHolo() {
  const [phases, setPhases] = useState([
    { title: 'O DESPERTAR', date: 'LANÇAMENTO', desc: 'Level Cap 78, A/S Grade Base, Primeiras Dungeons.', active: true },
    { title: 'FORJA DOS TITÃS', date: '30 DIAS', desc: 'Level Cap 80, Acessórios Lvl 1-3, Noblesse Unlock.', active: false },
    { title: 'DOMÍNIO DO DRAGÃO', date: '60 DIAS', desc: 'Level Cap 85, S80/Dynasty, Acessórios Lvl 4-6, Epic Raids.', active: false }
  ])

  return (
    <section id="roadmap" style={{ padding: '8rem 2rem', background: '#050508', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <p className="section-subtitle">LINHA DO TEMPO</p>
          <h2 className="section-title">ROADMAP DE <span style={{ color: 'var(--gold)' }}>EVOLUÇÃO</span></h2>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          gap: '2rem',
          flexWrap: 'wrap',
          position: 'relative'
        }}>
          {/* ENERGY LINE DECOR */}
          <div style={{ 
            position: 'absolute', top: '40px', left: '0', right: '0', height: '2px',
            background: 'linear-gradient(90deg, var(--gold), rgba(123,44,191,0.2), transparent)',
            zIndex: 1, opacity: 0.3
          }} />

          {phases.map((p, i) => (
            <div 
              key={i} 
              className="glass-panel" 
              style={{ 
                flex: 1, 
                minWidth: '280px', 
                padding: '2.5rem',
                borderTop: p.active ? '4px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                boxShadow: p.active ? '0 0 30px rgba(197,160,89,0.1)' : 'none',
                position: 'relative',
                zIndex: 2
              }}
            >
              <div style={{ 
                width: '16px', height: '16px', 
                background: p.active ? 'var(--gold)' : '#222', 
                borderRadius: '50%', 
                border: '4px solid #050508',
                position: 'absolute', top: '-11px', left: '2rem',
                boxShadow: p.active ? '0 0 15px var(--gold)' : 'none'
              }} />

              <div style={{ 
                fontSize: '0.7rem', 
                letterSpacing: '3px', 
                color: p.active ? 'var(--gold)' : 'var(--text-mute)', 
                fontWeight: '800',
                marginBottom: '1rem'
              }}>
                {p.date}
              </div>

              <h3 className="cinzel" style={{ 
                fontSize: '1.2rem', 
                color: '#fff', 
                marginBottom: '1.5rem',
                letterSpacing: '2px'
              }}>
                {p.title}
              </h3>

              <p style={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-mute)', 
                lineHeight: 1.6,
                letterSpacing: '0.5px'
              }}>
                {p.desc}
              </p>

              <div style={{ 
                marginTop: '2rem', 
                display: 'inline-block',
                padding: '0.4rem 1rem',
                background: p.active ? 'rgba(197,160,89,0.1)' : 'rgba(255,255,255,0.02)',
                color: p.active ? 'var(--gold)' : '#444',
                fontSize: '0.6rem',
                fontWeight: '900',
                letterSpacing: '2px',
                borderRadius: '2px'
              }}>
                {p.active ? 'FASE ATUAL: ONLINE' : 'BLOQUEADO: AGUARDANDO'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BACKGROUND TECH PULSE */}
      <div style={{ 
        position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)',
        width: '100%', height: '300px', background: 'radial-gradient(ellipse at bottom, rgba(123,44,191,0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
    </section>
  )
}
