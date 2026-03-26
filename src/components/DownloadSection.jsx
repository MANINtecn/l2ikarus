import { useEffect, useRef, useState } from 'react'

export default function DownloadSection() {
  const [playerCount, setPlayerCount] = useState(1240)
  const [isOnline, setIsOnline] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        if (data.players !== undefined) setPlayerCount(data.players);
        setIsOnline(data.online);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const specs = [
    {
      title: 'MÍNIMOS',
      items: [
        ['OS', 'Windows 7 64-bit'],
        ['CPU', 'Intel Core i3 2.0 GHz'],
        ['RAM', '4 GB'],
        ['GPU', 'NVIDIA GTX 550 Ti'],
        ['Disco', '20 GB livres'],
      ]
    },
    {
      title: 'RECOMENDADOS',
      items: [
        ['OS', 'Windows 10/11 64-bit'],
        ['CPU', 'Intel Core i5 3.0 GHz'],
        ['RAM', '8 GB'],
        ['GPU', 'NVIDIA GTX 1060'],
        ['Disco', '40 GB SSD'],
      ]
    },
  ]

  return (
    <section id="download" className="section" style={{ background: 'var(--bg2)' }} ref={containerRef}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(123,44,191,0.1) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* HEADER */}
        <div className="section-header reveal">
          <p className="section-subtitle">Entre no jogo</p>
          <h2 className="section-title">DOWNLOAD <span>&amp; JOGAR</span></h2>
          <div className="ornament"><div className="ornament-diamond" /></div>
        </div>

        {/* STATUS + DOWNLOAD CARD */}
        <div className="glass reveal" style={{
          maxWidth: 700,
          margin: '0 auto 3rem',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* BG GLOW */}
          <div style={{
            position: 'absolute',
            top: '-40%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '80%',
            background: 'radial-gradient(ellipse, rgba(123,44,191,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* ONLINE STATUS */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '0.4rem 1.2rem',
            background: 'rgba(78,174,122,0.12)',
            border: '1px solid rgba(78,174,122,0.35)',
            borderRadius: 100,
            marginBottom: '1.8rem',
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#4eae7a',
              boxShadow: '0 0 10px #4eae7a',
              animation: 'breathe 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', color: isOnline ? '#4eae7a' : '#ef4444', fontWeight: 600 }}>
              SERVIDOR {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          {/* PLAYER COUNT */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 900,
              fontSize: '3.5rem',
              color: '#fff',
              textShadow: '0 0 30px rgba(197,160,89,0.4)',
              lineHeight: 1,
            }}>{playerCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '4px', textTransform: 'uppercase', marginTop: '0.4rem' }}>
              jogadores online agora
            </div>
          </div>

          {/* DOWNLOAD BTN */}
          <a
            href="https://discord.gg/ikarusdungeons"
            target="_blank"
            rel="noreferrer"
            className="btn-download"
            style={{ display: 'inline-flex' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            BAIXAR CLIENTE
          </a>

          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1rem', letterSpacing: '1px' }}>
            Disponível via Discord · ~15 GB
          </p>
        </div>

        {/* SYSTEM REQUIREMENTS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          maxWidth: 700,
          margin: '0 auto',
        }}>
          {specs.map((s, si) => (
            <div key={s.title} className={`glass reveal reveal-delay-${si + 1}`} style={{ padding: '1.8rem' }}>
              <h4 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.8rem',
                letterSpacing: '4px',
                color: si === 0 ? 'var(--muted)' : 'var(--gold)',
                marginBottom: '1.2rem',
                borderBottom: `1px solid rgba(197,160,89,${si === 0 ? 0.1 : 0.25})`,
                paddingBottom: '0.8rem',
              }}>{s.title}</h4>
              {s.items.map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.4rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '1px' }}>{k}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
