import { useEffect, useRef } from 'react'
import DraggableItem from './DraggableItem'

const rates = [
  { icon: '⚔', label: 'XP Rate',       value: '×100',    color: '#c5a059', id: 'rate-xp' },
  { icon: '📚', label: 'SP Rate',       value: '×100',    color: '#c5a059', id: 'rate-sp' },
  { icon: '💎', label: 'Drop Rate',    value: '×10',     color: '#00d2ff', id: 'rate-drop' },
  { icon: '🪙', label: 'Adena Rate',   value: '×20',     color: '#00d2ff', id: 'rate-adena' },
  { icon: '🛡', label: 'Safe Enchant', value: '+4 / Arm\n+3 / Wep', color: '#9d4edd', id: 'rate-safe' },
  { icon: '⚡', label: 'Max Enchant',  value: '+20',     color: '#9d4edd', id: 'rate-max' },
  { icon: '🏆', label: 'Olympiad',     value: 'Bi-Semanal', color: '#e06c4e', id: 'rate-olympiad' },
  { icon: '🌟', label: 'Subclass',     value: 'Sem Quest', color: '#e06c4e', id: 'rate-subclass' },
  { icon: '⚗', label: 'Spoil Rate',   value: '×10',     color: '#4eae7a', id: 'rate-spoil' },
]

export default function RatesSection({ isAdmin, onDuplicate }) {
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
    <section id="rates" className="section" style={{ background: 'var(--bg2)', minHeight: '800px', position: 'relative' }} ref={containerRef}>
      {/* BG DECORATION */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(123,44,191,0.08) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', height: '100%' }}>
        
        {/* HEADER */}
        <DraggableItem 
          id="rates-header" isAdmin={isAdmin} 
          initialPos={{ x: 0, y: 0 }} className="section-header reveal"
          onDuplicate={onDuplicate}
        >
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p className="section-subtitle">Servidor</p>
            <h2 className="section-title">TAXAS DO <span>SERVIDOR</span></h2>
            <div className="ornament"><div className="ornament-diamond" /></div>
          </div>
        </DraggableItem>

        {/* RATES GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.2rem',
          marginTop: '150px', // Space for the draggable header
        }}>
          {rates.map((r, i) => (
            <DraggableItem 
              key={r.id}
              id={r.id}
              isAdmin={isAdmin}
              initialPos={{ x: 0, y: 0 }}
              onDuplicate={onDuplicate}
              className={`reveal reveal-delay-${Math.min(i + 1, 6)}`}
            >
              <div
                className="glass"
                style={{
                  padding: '1.8rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                  transition: 'all 0.35s ease',
                  cursor: 'default',
                  width: '100%',
                  height: '100%'
                }}
              >
                {/* ICON */}
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: `${r.color}18`, border: `1px solid ${r.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0,
                }}>
                  {r.icon}
                </div>

                {/* TEXT */}
                <div style={{ pointerEvents: 'none' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    {r.label}
                  </div>
                  <div style={{
                    fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '1.4rem',
                    color: r.color, textShadow: `0 0 15px ${r.color}60`,
                    whiteSpace: 'pre-line', lineHeight: 1.2,
                  }}>
                    {r.value}
                  </div>
                </div>
              </div>
            </DraggableItem>
          ))}
        </div>

        {/* CHRONICLE TAG */}
        <DraggableItem 
          id="rates-tag" isAdmin={isAdmin} 
          initialPos={{ x: 0, y: 550 }}
          onDuplicate={onDuplicate}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            padding: '0.6rem 2rem', border: '1px solid rgba(197,160,89,0.25)',
            borderRadius: '2px', background: 'rgba(197,160,89,0.05)',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '3px', color: 'var(--muted)', textTransform: 'uppercase' }}>Chronicle</span>
            <div style={{ width: 1, height: 16, background: 'rgba(197,160,89,0.3)' }} />
            <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--gold)', letterSpacing: '2px' }}>
              HIGH FIVE · INTERLUDE SKILLS
            </span>
          </div>
        </DraggableItem>

      </div>
    </section>
  )
}
