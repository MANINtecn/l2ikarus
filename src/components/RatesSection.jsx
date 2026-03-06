import { useEffect, useRef } from 'react'

const rates = [
  { icon: '⚔', label: 'XP Rate',       value: '×100',    color: '#c5a059' },
  { icon: '📚', label: 'SP Rate',       value: '×100',    color: '#c5a059' },
  { icon: '💎', label: 'Drop Rate',    value: '×10',     color: '#00d2ff' },
  { icon: '🪙', label: 'Adena Rate',   value: '×20',     color: '#00d2ff' },
  { icon: '🛡', label: 'Safe Enchant', value: '+4 / Arm\n+3 / Wep', color: '#9d4edd' },
  { icon: '⚡', label: 'Max Enchant',  value: '+20',     color: '#9d4edd' },
  { icon: '🏆', label: 'Olympiad',     value: 'Bi-Semanal', color: '#e06c4e' },
  { icon: '🌟', label: 'Subclass',     value: 'Sem Quest', color: '#e06c4e' },
  { icon: '⚗', label: 'Spoil Rate',   value: '×10',     color: '#4eae7a' },
]

export default function RatesSection() {
  const containerRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      })
    }, { threshold: 0.15 })

    const items = containerRef.current?.querySelectorAll('.reveal')
    items?.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="rates" className="section" style={{ background: 'var(--bg2)' }} ref={containerRef}>
      {/* BG DECORATION */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(123,44,191,0.08) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* HEADER */}
        <div className="section-header reveal">
          <p className="section-subtitle">Servidor</p>
          <h2 className="section-title">TAXAS DO <span>SERVIDOR</span></h2>
          <div className="ornament"><div className="ornament-diamond" /></div>
          <p style={{
            color: 'var(--muted)',
            fontSize: '0.9rem',
            marginTop: '1.2rem',
            letterSpacing: '1px',
            maxWidth: 520,
            margin: '1.2rem auto 0',
            textAlign: 'center',
          }}>
            Balanceadas para uma experiência épica — nem fácil demais, nem injusta.
          </p>
        </div>

        {/* RATES GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.2rem',
          marginTop: '1rem',
        }}>
          {rates.map((r, i) => (
            <div
              key={r.label}
              className={`glass reveal reveal-delay-${Math.min(i + 1, 6)}`}
              style={{
                padding: '1.8rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.2rem',
                transition: 'all 0.35s ease',
                cursor: 'default',
                animation: `borderGlow ${2 + i * 0.3}s ease-in-out infinite`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = r.color + '60'
                e.currentTarget.style.boxShadow = `0 8px 30px ${r.color}25`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.boxShadow = ''
              }}
            >
              {/* ICON */}
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: `${r.color}18`,
                border: `1px solid ${r.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0,
              }}>
                {r.icon}
              </div>

              {/* TEXT */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  {r.label}
                </div>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  color: r.color,
                  textShadow: `0 0 15px ${r.color}60`,
                  whiteSpace: 'pre-line',
                  lineHeight: 1.2,
                }}>
                  {r.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CHRONICLE TAG */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
        }}>
          <div className="reveal" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0.6rem 2rem',
            border: '1px solid rgba(197,160,89,0.25)',
            borderRadius: '2px',
            background: 'rgba(197,160,89,0.05)',
          }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '3px', color: 'var(--muted)', textTransform: 'uppercase' }}>Chronicle</span>
            <div style={{ width: 1, height: 16, background: 'rgba(197,160,89,0.3)' }} />
            <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--gold)', letterSpacing: '2px' }}>
              HIGH FIVE · INTERLUDE SKILLS
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
