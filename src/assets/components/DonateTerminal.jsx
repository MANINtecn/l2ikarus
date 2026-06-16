import React, { useState } from 'react'

const packs = [
  {
    id: 1,
    name: 'BÁSICO',
    subtitle: 'Start Pack',
    claim: 'GRÁTIS',
    claimNote: 'Resgate no Community Board (Alt+B)',
    color: '#cfd2dc',
    borderColor: 'rgba(207,210,220,0.45)',
    bg: 'linear-gradient(160deg, #282830 0%, #1b1b22 62%)',
    glow: 'rgba(180,185,205,0.25)',
    items: [
      'Kit de armas e armadura inicial',
      'Adena para o começo',
      'Soulshots / Spiritshots',
      'Poções de HP',
      'Consumíveis essenciais',
    ],
    description: 'Tudo que você precisa para começar sem depender de farm inicial. Pra todos, de graça.',
  },
  {
    id: 2,
    name: 'RARO',
    subtitle: 'Start Pack',
    claim: 'IKOIN',
    claimNote: 'Resgate no Community Board (Alt+B)',
    color: 'var(--gold)',
    borderColor: 'rgba(197,160,89,0.55)',
    bg: 'linear-gradient(160deg, #2d2820 0%, #1c1b22 62%)',
    glow: 'rgba(197,160,89,0.30)',
    isPopular: true,
    items: [
      'Tudo do Básico em maior quantidade',
      'Mais Adena e shots',
      'Scrolls de XP',
      'Pack de consumíveis premium',
      '★ 1 item exclusivo do tier Raro',
    ],
    description: 'Mais recursos pra acelerar de verdade — e um item único só do Raro.',
  },
  {
    id: 3,
    name: 'LENDÁRIO',
    subtitle: 'Start Pack',
    claim: 'IKOIN',
    claimNote: 'Resgate no Community Board (Alt+B)',
    color: '#c084fc',
    borderColor: 'rgba(192,132,252,0.5)',
    bg: 'linear-gradient(160deg, #2a2233 0%, #1c1b22 62%)',
    glow: 'rgba(192,132,252,0.30)',
    items: [
      'Tudo do Raro em quantidade máxima',
      'Muito mais Adena e shots',
      'Scrolls de XP turbo',
      'Pack premium completo',
      '★ 1 item exclusivo do tier Lendário',
    ],
    description: 'O pacote definitivo. Comece no topo com o item único mais raro.',
  },
]

export default function DonateTerminal() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="donate" style={{
      padding: '8rem 2rem',
      background: 'radial-gradient(circle at 50% 50%, rgba(197, 160, 89, 0.03) 0%, transparent 70%)',
      position: 'relative'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p className="section-subtitle" style={{ letterSpacing: '5px' }}>LOJA OFICIAL — L2 IKARUS</p>
        <h2 className="section-title">START <span style={{ color: 'var(--gold)' }}>PACKS</span></h2>

        <p style={{
          maxWidth: '800px',
          margin: '0 auto 4rem',
          color: 'var(--text-mute)',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          lineHeight: '1.6'
        }}>
          Todo jogador começa com o pack Básico GRÁTIS, resgatado dentro do jogo no Community Board (Alt+B).
          Quer mais? Os tiers Raro e Lendário são resgatados com Ikoin — sem Pay-to-Win, só conveniência.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
        }}>
          {packs.map((pkg) => (
            <div
              key={pkg.id}
              className="glass-panel"
              onMouseEnter={() => setHovered(pkg.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '2.5rem 2rem',
                background: pkg.bg,
                border: `1px solid ${hovered === pkg.id ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '14px',
                boxShadow: hovered === pkg.id
                  ? '0 0 0 1px var(--gold), 0 18px 50px rgba(0,0,0,0.55), 0 0 45px rgba(212,175,55,0.32)'
                  : '0 8px 24px rgba(0,0,0,0.4)',
                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                transform: hovered === pkg.id ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left',
              }}
            >
              {pkg.isPopular && (
                <div style={{
                  position: 'absolute', top: '18px', right: '-32px',
                  background: 'var(--gold)', color: '#000',
                  padding: '4px 40px', transform: 'rotate(45deg)',
                  fontSize: '0.55rem', fontWeight: '900', letterSpacing: '2px'
                }}>POPULAR</div>
              )}

              <p style={{ fontSize: '0.6rem', letterSpacing: '3px', color: 'var(--text-mute)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                {pkg.subtitle}
              </p>
              <h4 className="cinzel" style={{ fontSize: '1.4rem', letterSpacing: '4px', color: pkg.color, marginBottom: '1.5rem' }}>
                {pkg.name}
              </h4>

              <div style={{ marginBottom: '2rem' }}>
                <span style={{
                  display: 'inline-block', padding: '0.45rem 1.1rem', borderRadius: '8px',
                  background: pkg.claim === 'GRÁTIS' ? 'rgba(76,175,80,0.15)' : 'rgba(197,160,89,0.15)',
                  border: `1px solid ${pkg.claim === 'GRÁTIS' ? 'rgba(76,175,80,0.45)' : 'rgba(197,160,89,0.45)'}`,
                  color: pkg.claim === 'GRÁTIS' ? '#7BD88F' : 'var(--gold)',
                  fontWeight: '900', fontSize: '1.25rem', letterSpacing: '2px',
                }}>{pkg.claim}</span>
                <p style={{ fontSize: '0.62rem', letterSpacing: '1px', color: 'var(--text-mute)', marginTop: '0.7rem', textTransform: 'uppercase' }}>
                  {pkg.claimNote}
                </p>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {pkg.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.74rem', color: 'rgba(255,255,255,0.92)', letterSpacing: '0.5px' }}>
                    <span style={{ color: pkg.color, flexShrink: 0, marginTop: '1px' }}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', lineHeight: 1.7 }}>
                {pkg.description}
              </p>

              <div style={{
                width: '100%', padding: '0.95rem', textAlign: 'center', borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.2)',
                color: '#dcdcdc', fontSize: '0.7rem', letterSpacing: '2px', fontWeight: '700',
                boxSizing: 'border-box',
              }}>
                🎮 RESGATE NO JOGO · ALT+B
              </div>

              <div style={{
                position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px',
                background: `linear-gradient(90deg, transparent, ${pkg.color}, transparent)`,
                opacity: hovered === pkg.id ? 1 : 0.2,
                transition: 'opacity 0.4s',
              }} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3.5rem', maxWidth: '760px', margin: '3.5rem auto 0' }}>
          <p style={{ fontSize: '0.78rem', letterSpacing: '1px', color: 'var(--text-mute)', lineHeight: '1.8' }}>
            💰 <strong style={{ color: 'var(--gold)' }}>Ikoin</strong> é a moeda do servidor — comprada aqui no site e usada para
            resgatar os tiers <strong style={{ color: 'var(--gold)' }}>Raro</strong> e <strong style={{ color: '#c084fc' }}>Lendário</strong> dentro
            do jogo (Community Board · Alt+B). O <strong style={{ color: '#7BD88F' }}>Básico</strong> é sempre grátis pra todos.
          </p>
        </div>
      </div>
    </section>
  )
}
