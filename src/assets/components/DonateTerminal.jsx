import React, { useState } from 'react'

const packs = [
  {
    id: 1,
    name: 'BÁSICO',
    subtitle: 'Start Pack',
    price: '29,90',
    color: 'rgba(180,180,200,0.8)',
    borderColor: 'rgba(180,180,200,0.4)',
    items: [
      'Arma Grau C (à escolha)',
      'Armadura Completa Grau C',
      '500.000 Adena',
      '2.000 Soulshots Grau C',
      '30 Poções de HP Superiores',
    ],
    description: 'Tudo que você precisa para começar a jornada sem depender de farm inicial.',
  },
  {
    id: 2,
    name: 'ÉPICO',
    subtitle: 'Start Pack',
    price: '59,90',
    color: 'var(--gold)',
    borderColor: 'rgba(197,160,89,0.5)',
    isPopular: true,
    items: [
      'Arma Grau B+5 (à escolha)',
      'Set Completo Grau B',
      '2.000.000 Adena',
      '5.000 Soulshots Grau B',
      'Scroll de XP x3 (30min)',
      'Pack de Consumíveis Premium',
    ],
    description: 'Vantagem real desde o início. Entre no jogo pronto para competir.',
  },
  {
    id: 3,
    name: 'LENDÁRIO',
    subtitle: 'Start Pack',
    price: '99,90',
    color: '#c084fc',
    borderColor: 'rgba(192,132,252,0.4)',
    items: [
      'Arma Grau A+8 (à escolha)',
      'Set Completo Grau A Encantado',
      '10.000.000 Adena',
      '10.000 Soulshots Grau A',
      'Scroll de XP x7 (1h cada)',
      'Pack Premium + Buff Cosmético',
      'Acesso VIP por 30 dias',
    ],
    description: 'O pacote definitivo. Entre no topo e mostre quem você é desde o primeiro login.',
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
          Pacotes de início pensados para você entrar no servidor com vantagem real.
          Sem Pay-to-Win — apenas tempo e conveniência.
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
                background: hovered === pkg.id ? 'rgba(197,160,89,0.04)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${hovered === pkg.id ? pkg.borderColor : 'rgba(197,160,89,0.1)'}`,
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
                <span style={{ fontSize: '0.85rem', color: 'var(--text-mute)' }}>R$</span>
                <span style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', marginLeft: '4px' }}>{pkg.price}</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {pkg.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.5px' }}>
                    <span style={{ color: pkg.color, flexShrink: 0, marginTop: '1px' }}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p style={{ fontSize: '0.7rem', color: 'var(--text-mute)', marginBottom: '2rem', lineHeight: 1.6 }}>
                {pkg.description}
              </p>

              <button className="btn btn-primary" style={{ width: '100%', padding: '1.1rem', borderColor: pkg.color }}>
                ADQUIRIR PACOTE
              </button>

              <div style={{
                position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px',
                background: `linear-gradient(90deg, transparent, ${pkg.color}, transparent)`,
                opacity: hovered === pkg.id ? 1 : 0.2,
                transition: 'opacity 0.4s',
              }} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', opacity: 0.55 }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--text-mute)' }}>
            TRANSAÇÕES PROCESSADAS COM SEGURANÇA VIA SISTEMA TECX
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.2rem', fontSize: '1.3rem' }}>
            <span title="PIX">💠 PIX</span>
            <span title="Stripe">💳 STRIPE</span>
            <span title="PayPal">🅿️ PAYPAL</span>
          </div>
        </div>
      </div>
    </section>
  )
}
