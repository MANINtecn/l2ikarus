import { useState, useEffect } from 'react'
import { serverRates } from '../config/serverRates'

export default function RatesGrid() {
  const [activeRates, setActiveRates] = useState(serverRates)
  const [glitch, setGlitch] = useState(false)

  // Sutil efeito de pulso aleatório para parecer "vivo"
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 150)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="rates" className="rates-section" style={{ position: 'relative' }}>
      {/* SCANLINE OVERLAY */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 118, 0.03))',
        backgroundSize: '100% 4px, 3px 100%',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: 0.1
      }} />

      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div className="pulse-dot" style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 10px #4ade80' }} />
            <p className="section-subtitle" style={{ margin: 0 }}>LIVE SERVER CONFIGURATION</p>
          </div>
          <h2 className="section-title">RATES DE <span style={{ color: 'var(--gold)' }}>ELITE</span></h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1.5rem',
          filter: glitch ? 'hue-rotate(90deg) brightness(1.2)' : 'none',
          transition: 'filter 0.1s'
        }}>
          {activeRates.map((r, i) => (
            <div 
              key={i} 
              className="glass-panel" 
              style={{ 
                padding: '2rem', 
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(197,160,89,0.1)'
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
              {/* SCANNING BAR */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(transparent, ${r.color}05, transparent)`,
                animation: 'scan 4s linear infinite',
                pointerEvents: 'none'
              }} />

              {/* ORB DECOR */}
              <div style={{ 
                width: '10px', height: '10px', 
                background: r.color, 
                borderRadius: '50%', 
                margin: '0 auto 1.5rem',
                boxShadow: `0 0 15px ${r.color}`,
                animation: 'pulse 2s infinite'
              }} />

              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '900', 
                fontFamily: 'Cinzel', 
                color: '#fff',
                letterSpacing: '3px',
                marginBottom: '0.2rem',
                position: 'relative'
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

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* ENERGY WAVE DECOR */}
      <div style={{ 
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
        background: 'linear-gradient(transparent, rgba(123,44,191,0.05))',
        pointerEvents: 'none'
      }} />
    </section>
  )
}
