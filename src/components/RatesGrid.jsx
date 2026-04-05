import { useState } from 'react'

export default function RatesGrid() {
  const [rates, setRates] = useState([
    { label: 'EXPERIENCE', value: 'x1000', sub: 'FAST PROGRESS', color: 'var(--gold)' },
    { label: 'SKILL POINTS', value: 'x1000', sub: 'DYNAMIC SKILLS', color: 'var(--neon-blue)' },
    { label: 'ADENA', value: 'x500', sub: 'STABLE ECONOMY', color: '#ffcc00' },
    { label: 'DROP RATE', value: 'x10', sub: 'RARE ITEMS', color: 'var(--purple)' },
    { label: 'SPOIL RATE', value: 'x15', sub: 'CRAFTING FOCUS', color: '#ff4444' }
  ])

  return (
    <section id="rates" style={{ padding: '6rem 2rem', background: 'linear-gradient(to bottom, #050508 0%, #0a0b12 100%)', position: 'relative' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p className="section-subtitle">CONFIGURAÇÕES DO REINO</p>
          <h2 className="section-title">RATES DE <span style={{ color: 'var(--gold)' }}>ELITE</span></h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {rates.map((r, i) => (
            <div 
              key={i} 
              className="glass-panel" 
              style={{ 
                padding: '2rem', 
                textAlign: 'center',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = r.color;
                e.currentTarget.style.boxShadow = `0 15px 30px ${r.color}22`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(197,160,89,0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* ORB DECOR */}
              <div style={{ 
                width: '10px', height: '10px', 
                background: r.color, 
                borderRadius: '50%', 
                margin: '0 auto 1.5rem',
                boxShadow: `0 0 15px ${r.color}`
              }} />

              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '900', 
                fontFamily: 'Cinzel', 
                color: '#fff',
                letterSpacing: '3px',
                marginBottom: '0.2rem'
              }}>
                {r.value}
              </div>
              
              <div style={{ 
                fontSize: '0.75rem', 
                letterSpacing: '2px', 
                color: 'var(--gold)',
                fontWeight: '700',
                textTransform: 'uppercase',
                marginBottom: '1rem'
              }}>
                {r.label}
              </div>

              <div style={{ 
                fontSize: '0.6rem', 
                letterSpacing: '3px', 
                color: 'var(--text-mute)',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                {r.sub}
              </div>
              
              {/* SIDE SCANLINES */}
              <div style={{ 
                position: 'absolute', inset: '5px',
                border: '1px solid rgba(255,255,255,0.02)',
                pointerEvents: 'none'
              }} />
            </div>
          ))}
        </div>

        {/* BOTTOM CTA FOR RATES */}
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
           <p style={{ color: 'var(--text-mute)', fontSize: '0.85rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
             Todas as rates foram equilibradas matematicamente para garantir o PVP mais épico e a economia mais saudável do mundo L2.
           </p>
           <a href="#info" className="btn btn-ghost" style={{ padding: '1rem 3rem' }}>WIKI COMPLETA</a>
        </div>
      </div>

      {/* ENERGY WAVE DECOR */}
      <div style={{ 
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
        background: 'linear-gradient(transparent, rgba(123,44,191,0.05))',
        pointerEvents: 'none'
      }} />
    </section>
  )
}
