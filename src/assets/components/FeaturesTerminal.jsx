import { useState } from 'react'

export default function FeaturesTerminal() {
  const [features, setFeatures] = useState([
    { title: 'COMBATE DE AÇÃO', desc: 'Mod No-Target exclusivo: skills saem na direção que você mira, acertam pelo posicionamento e alcance. Quem joga melhor vence — não o auto-target.', icon: '⚔️' },
    { title: 'ZONA MORTAL · D · C · B', desc: 'Áreas de risco extremo por grade. Morreu lá dentro, perde TUDO. Mas os drops recompensam quem tem coragem de entrar.', icon: '☠️' },
    { title: 'QUESTS DE PROGRESSÃO', desc: 'Quests iniciais que aceleram sua evolução desde o nível 1. Low-rate justo: o esforço importa, mas você nunca fica travado.', icon: '📜' },
    { title: 'ECONOMIA DE MINERAÇÃO', desc: 'Parte das doações é minerada DENTRO do jogo e volta para os jogadores. Qualquer um pode gerar renda jogando. (em breve)', icon: '⛏️' },
    { title: 'START PACKS', desc: 'Pacotes iniciais Basic · Raro · Lendário para começar forte e focar na ação desde o primeiro login.', icon: '🎁' },
    { title: 'LOW-RATE JUSTO', desc: 'Rates equilibrados com progressão sólida e VIP opcional. Mercado estável, sem inflação — cada conquista tem valor real.', icon: '💠' }
  ])

  return (
    <section id="features" className="status-section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <p className="section-subtitle">TECNOLOGIA & MECÂNICAS</p>
          <h2 className="section-title">NÚCLEO DO <span style={{ color: 'var(--gold)' }}>SISTEMA</span></h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
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
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.03)';
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
        background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.05), transparent)',
        pointerEvents: 'none'
      }} />
      <div style={{ 
        position: 'absolute', top: 0, right: '10%', width: '1px', height: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.05), transparent)',
        pointerEvents: 'none'
      }} />
    </section>
  )
}
