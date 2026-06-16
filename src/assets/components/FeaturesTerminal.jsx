import { useState } from 'react'

export default function FeaturesTerminal() {
  const [features, setFeatures] = useState([
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
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                borderRadius: '16px',
                background: 'linear-gradient(165deg, rgba(212,175,55,0.07) 0%, rgba(22,22,28,0.65) 55%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)';
                e.currentTarget.style.boxShadow = '0 18px 50px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.18)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Badge do ícone */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.1rem', marginBottom: '1.6rem',
                background: 'radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.05) 70%)',
                border: '1px solid rgba(212,175,55,0.3)',
                boxShadow: '0 0 24px rgba(212,175,55,0.15)',
              }}>{f.icon}</div>

              <h3 className="cinzel" style={{
                fontSize: '1.15rem',
                color: '#fff',
                marginBottom: '1rem',
                letterSpacing: '2px',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.8,
                letterSpacing: '0.3px',
                maxWidth: '300px',
              }}>
                {f.desc}
              </p>

              {/* Linha de acento */}
              <div style={{
                marginTop: '1.8rem', width: '40px', height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                opacity: 0.6,
              }} />
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
