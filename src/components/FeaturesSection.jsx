import { useEffect, useRef } from 'react'

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
        <path d="M12 3L2 8l10 5 10-5-10-5z"/>
        <path d="M2 14l10 5 10-5"/>
        <path d="M2 11l10 5 10-5"/>
      </svg>
    ),
    title: 'DUNGEONS SOLO',
    desc: 'Instâncias exclusivas para jogadores solo. Enfrente chefes épicos e acumule poder nas profundezas.',
    color: '#c5a059',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/>
        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/>
        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/>
        <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
        <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/>
        <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/>
      </svg>
    ),
    title: 'PVP ÉPICO',
    desc: 'Batalhas em massa, sieges de castelas e PvP aberto em zonas de alto risco com drops valiosos.',
    color: '#e06c4e',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: 'SISTEMA DE RANK',
    desc: 'Suba nas ranks do servidor. Dos Guerreiros novatos até os lendários Shadow Monarchs.',
    color: '#9d4edd',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: 'EVENTOS CUSTOM',
    desc: 'TvT, CTF, Last Man Standing e eventos temáticos exclusivos com recompensas únicas.',
    color: '#4eae7a',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'ANTI-BOT & FAIR PLAY',
    desc: 'Sistema avançado anti-bot e GMs ativos garantindo um ambiente justo para todos os jogadores.',
    color: '#00d2ff',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2M9 2.46A10 10 0 0 1 22 12M2 12A10 10 0 0 1 9 2.46"/>
      </svg>
    ),
    title: 'ECONOMIA BALANCEADA',
    desc: 'Drop e craft equilibrados. Nenhum pay-to-win — habilidade e dedicação decidem o vencedor.',
    color: '#c5a059',
  },
]

export default function FeaturesSection() {
  const containerRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      })
    }, { threshold: 0.1 })

    const items = containerRef.current?.querySelectorAll('.reveal')
    items?.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="features" className="section" style={{ background: 'var(--bg)' }} ref={containerRef}>
      {/* BG DECORATION */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse 50% 40% at 80% 60%, rgba(0,210,255,0.04) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* GRID LINES BG */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(197,160,89,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(197,160,89,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* HEADER */}
        <div className="section-header reveal">
          <p className="section-subtitle">O que nos torna únicos</p>
          <h2 className="section-title">FEATURES <span>EXCLUSIVAS</span></h2>
          <div className="ornament"><div className="ornament-diamond" /></div>
        </div>

        {/* FEATURES GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`glass reveal reveal-delay-${Math.min(i + 1, 6)}`}
              style={{ padding: '2rem 1.8rem', transition: 'all 0.35s ease', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.borderColor = f.color + '50'
                e.currentTarget.style.background = `linear-gradient(135deg, rgba(10,12,30,0.9) 0%, ${f.color}08 100%)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.background = ''
              }}
            >
              {/* CORNER ACCENT */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 3,
                height: '100%',
                background: `linear-gradient(to bottom, ${f.color}, transparent)`,
                opacity: 0.6,
              }} />

              {/* ICON */}
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '12px',
                background: `${f.color}15`,
                border: `1px solid ${f.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.3rem',
                color: f.color,
              }}>
                {f.icon}
              </div>

              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '3px',
                color: f.color,
                marginBottom: '0.8rem',
              }}>{f.title}</h3>

              <p style={{
                color: 'var(--muted)',
                fontSize: '0.9rem',
                lineHeight: 1.7,
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
