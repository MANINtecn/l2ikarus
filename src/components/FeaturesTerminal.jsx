import { useState } from 'react'

export default function FeaturesTerminal() {
  const [features, setFeatures] = useState([
    { title: 'INSTANCED DUNGEONS', desc: 'Enfrente chefes lendários em instâncias solo ou em grupo com loot exclusivo.', icon: '🏰' },
    { title: 'ELITE PVP BALANCE', desc: 'Sistema de classes refinado para garantir que a habilidade seja o único diferencial.', icon: '⚔️' },
    { title: 'FAIR ECONOMY', desc: 'Comércio livre e mercado estável baseado em Adena e Ancient Adena.', icon: '💎' },
    { title: 'CUSTOM BOSSES', desc: 'Raid Bosses mundiais com mecânicas de luta renovadas e recompensas AAA.', icon: '🐉' },
    { title: 'CRAFTING MASTERY', desc: 'Sistema de craft valorizado, tornando cada item forjado uma conquista real.', icon: '🛠️' },
    { title: 'DAILY REWARDS', desc: 'Holograma de login diário com itens de suporte para sua evolução.', icon: '🎁' }
  ])

  return (
    <section id="features" style={{ padding: '8rem 2rem', background: '#050508', position: 'relative' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <p className="section-subtitle">TECNOLOGIA & MECÂNICAS</p>
          <h2 className="section-title">NÚCLEO DO <span style={{ color: 'var(--gold)' }}>SISTEMA</span></h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '3rem' 
        }}>
          {features.map((f, i) => (
            <div 
              key={i} 
              className="glass-panel" 
              style={{ 
                padding: '3rem 2.5rem',
                borderLeft: '4px solid transparent',
                transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderLeftColor = 'var(--gold)';
                e.currentTarget.style.background = 'rgba(197,160,89,0.03)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderLeftColor = 'transparent';
                e.currentTarget.style.background = 'var(--glass-bg)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '2rem', opacity: 0.8 }}>{f.icon}</div>
              <h3 className="cinzel" style={{ 
                fontSize: '1.2rem', 
                color: '#fff', 
                marginBottom: '1rem',
                letterSpacing: '2px'
              }}>
                {f.title}
              </h3>
              <p style={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-mute)', 
                lineHeight: 1.8,
                letterSpacing: '0.5px'
              }}>
                {f.desc}
              </p>
              
              {/* TERMINAL FOOTER DECOR */}
              <div style={{ 
                marginTop: '2rem', 
                fontSize: '0.6rem', 
                color: 'rgba(255,255,255,0.1)',
                fontFamily: 'monospace',
                letterSpacing: '2px'
              }}>
                SYS_IDENT_ID: 00{i+1}_IKARUS_CORE
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AMBIENT TECH LINES */}
      <div style={{ 
        position: 'absolute', top: 0, left: '10%', width: '1px', height: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(197,160,89,0.05), transparent)',
        pointerEvents: 'none'
      }} />
      <div style={{ 
        position: 'absolute', top: 0, right: '10%', width: '1px', height: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(123,44,191,0.05), transparent)',
        pointerEvents: 'none'
      }} />
    </section>
  )
}
