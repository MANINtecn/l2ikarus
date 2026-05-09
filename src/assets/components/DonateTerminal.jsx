import React, { useState } from 'react'

const packages = [
  { 
    id: 1, 
    name: 'RECRUTA', 
    price: '20,00', 
    coins: '2.000', 
    bonus: '0%', 
    color: 'rgba(255, 255, 255, 0.5)', 
    description: 'Ideal para um início sólido na jornada.' 
  },
  { 
    id: 2, 
    name: 'VETERANO', 
    price: '50,00', 
    coins: '5.500', 
    bonus: '10%', 
    color: 'var(--gold)', 
    isPopular: true,
    description: 'O melhor custo-benefício para exploradores sérios.' 
  },
  { 
    id: 3, 
    name: 'ELITE', 
    price: '100,00', 
    coins: '12.000', 
    bonus: '20%', 
    color: '#ff4d4d', 
    description: 'Poder máximo para dominar o campo de batalha.' 
  }
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
        <p className="section-subtitle" style={{ letterSpacing: '5px' }}>TRANSAÇÃO SEGURA - TECX SISTEMAS</p>
        <h2 className="section-title">ADQUIRIR <span style={{ color: 'var(--gold)' }}>L-COINS</span></h2>
        
        <p style={{ 
          maxWidth: '800px', 
          margin: '0 auto 4rem', 
          color: 'var(--text-mute)', 
          fontSize: '0.8rem', 
          textTransform: 'uppercase', 
          letterSpacing: '2px',
          lineHeight: '1.6'
        }}>
          Apoie o desenvolvimento e desbloqueie skins exclusivas, cosméticos e utilitários. 
          Sem elementos Pay-to-Win. Equilíbrio absoluto é nossa lei.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          perspective: '1000px'
        }}>
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className="glass-panel"
              onMouseEnter={() => setHovered(pkg.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '3rem 2rem',
                background: hovered === pkg.id ? 'rgba(197, 160, 89, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${hovered === pkg.id ? pkg.color : 'rgba(197, 160, 89, 0.1)'}`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hovered === pkg.id ? 'translateY(-15px) scale(1.02)' : 'translateY(0) scale(1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {pkg.isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '-35px',
                  background: 'var(--gold)',
                  color: '#000',
                  padding: '5px 40px',
                  transform: 'rotate(45deg)',
                  fontSize: '0.6rem',
                  fontWeight: '900',
                  letterSpacing: '2px'
                }}>POPULAR</div>
              )}

              <h4 className="cinzel" style={{ letterSpacing: '4px', color: pkg.color, marginBottom: '2rem' }}>{pkg.name}</h4>
              
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '1rem', color: 'var(--text-mute)' }}>R$</span>
                <span style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', marginLeft: '5px' }}>{pkg.price}</span>
              </div>

              <div style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '1.5rem', 
                borderRadius: '10px', 
                border: '1px solid rgba(197, 160, 89, 0.05)',
                marginBottom: '2rem'
              }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--gold)', fontWeight: '700' }}>{pkg.coins} L-COINS</div>
                <div style={{ fontSize: '0.7rem', color: pkg.bonus !== '0%' ? '#4ade80' : 'var(--text-mute)', marginTop: '5px' }}>
                  {pkg.bonus !== '0%' ? `+${pkg.bonus} DE BÔNUS INCLUSO` : 'BASE PACKAGE'}
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-mute)', marginBottom: '2.5rem', minHeight: '3rem' }}>
                {pkg.description}
              </p>

              <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem' }}>
                INICIAR TRANSAÇÃO
              </button>

              {/* DECORATIVE LINES */}
              <div style={{ 
                position: 'absolute', bottom: '0', left: '0', width: '100%', height: '4px', 
                background: `linear-gradient(90deg, transparent, ${pkg.color}, transparent)`,
                opacity: hovered === pkg.id ? 1 : 0.2
              }} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '5rem', opacity: 0.6 }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--text-mute)' }}>
             PROCESSADO VIA SISTEMA DE PAGAMENTO CRIPTOFRAFADO
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '1.5rem' }}>
             <span title="PIX">💠 PIX</span>
             <span title="Stripe">💳 STRIPE</span>
             <span title="PayPal">🅿️ PAYPAL</span>
          </div>
        </div>
      </div>
    </section>
  )
}
