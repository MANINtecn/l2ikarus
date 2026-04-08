import { useState, useEffect } from 'react'

export default function StatusHolo() {
  const [stats, setStats] = useState([
    { label: 'PLAYERS ONLINE', value: '1.240', icon: '👤', glow: 'var(--neon-blue)' },
    { label: 'CONTAS CRIADAS', value: '15.892', icon: '🆔', glow: 'var(--gold)' },
    { label: 'SERVER STATUS', value: 'ONLINE', icon: '⚡', glow: '#4ade80' },
    { label: 'TEMPO ONLINE', value: '99.9%', icon: '⏳', glow: 'var(--purple)' }
  ])

  // Lógica de fetch real seria aqui, vamos manter o estilo AAA fixo por agora
  
  return (
    <section id="status" className="status-section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="section-subtitle">DADOS EM TEMPO REAL</p>
          <h2 className="section-title">STATUS DO <span style={{ color: 'var(--gold)' }}>REINO</span></h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '2rem' 
        }}>
          {stats.map((s, i) => (
            <div 
              key={i} 
              className="glass-panel" 
              style={{ 
                padding: '2.5rem', 
                textAlign: 'center',
                border: `1px solid rgba(255,255,255,0.05)`,
                boxShadow: `0 20px 40px rgba(0,0,0,0.5)`,
                transition: '0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = s.glow;
                e.currentTarget.style.boxShadow = `0 0 30px ${s.glow}33`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
              }}
            >
              <div style={{ 
                fontSize: '2.5rem', 
                marginBottom: '1.5rem', 
                filter: `drop-shadow(0 0 10px ${s.glow})`,
                opacity: 0.8
              }}>
                {s.icon}
              </div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '900', 
                fontFamily: 'Cinzel', 
                color: '#fff',
                letterSpacing: '2px',
                marginBottom: '0.5rem'
              }}>
                {s.value}
              </div>
              <div style={{ 
                fontSize: '0.7rem', 
                letterSpacing: '3px', 
                color: 'var(--text-mute)',
                textTransform: 'uppercase',
                fontWeight: '700'
              }}>
                {s.label}
              </div>
              
              {/* ENERGY LINE */}
              <div style={{ 
                width: '40px', 
                height: '2px', 
                background: s.glow, 
                margin: '1.5rem auto 0',
                boxShadow: `0 0 10px ${s.glow}`
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* BACKGROUND GLOWS */}
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(123,44,191,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1
      }} />
    </section>
  )
}
