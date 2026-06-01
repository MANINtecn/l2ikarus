import { useState, useEffect } from 'react'
import sectionImg from '../section-1.jpg.jpg'

export default function Hero3D({ onRegisterClick }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [serverStatus, setServerStatus] = useState({ online: false, players: 0 })
  const [adminOnline, setAdminOnline] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024)
    const handleScroll = () => setScrollProgress(Math.min(1, window.scrollY / 600))

    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status')
        const data = await res.json()
        setServerStatus({ online: data.online, players: data.players || 0 })
      } catch {
        setServerStatus({ online: false, players: 0 })
      }

      try {
        const discordRes = await fetch('/api/discord')
        const discordData = await discordRes.json()
        setAdminOnline(discordData.adminOnline || false)
      } catch {
        setAdminOnline(false)
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    fetchStatus()
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section id="hero" className="hero-section" style={{
      height: '100vh', width: '100%',
      position: 'fixed', top: 0, left: 0,
      zIndex: 1, overflow: 'hidden',
    }}>
      {/* VIDEO BACKGROUND */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <video autoPlay muted loop playsInline poster={sectionImg}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', filter: 'brightness(1.15) saturate(1.2)' }}
        >
          <source src="/assets/video-bg.mp4" type="video/mp4" />
        </video>

        {/* Vinheta mínima apenas para legibilidade do texto */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(2,2,8,0.55) 0%, transparent 50%)',
          zIndex: 1,
        }} />
      </div>

      {/* CONTENT — 3 colunas: texto | logo+botões | cards */}
      <div className="container" style={{
        height: '100%', position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '2rem',
        paddingTop: isMobile ? '80px' : '100px',
        opacity: 1 - scrollProgress,
        transform: `translateY(${scrollProgress * -40}px)`,
        transition: 'opacity 0.1s linear',
      }}>

        {/* COLUNA ESQUERDA — título e descrição */}
        <div style={{
          flex: '0 0 auto', maxWidth: isMobile ? '100%' : '360px',
          display: 'flex', flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
        }}>
          <h1 className="cinzel" style={{
            fontSize: isMobile ? '2.2rem' : 'clamp(2rem, 4.5vw, 3.5rem)',
            lineHeight: 1.05, marginBottom: '1.2rem',
            textShadow: '0 8px 30px rgba(0,0,0,0.7)', color: '#fff',
          }}>
            L2 IKARUS
          </h1>
          <p style={{
            fontSize: isMobile ? '0.9rem' : '0.95rem',
            marginBottom: 0,
            color: 'rgba(255,255,255,0.7)', lineHeight: 1.7,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}>
            Lineage 2 Essence reimaginado. Progressão acelerada, sistema de classes moderno e batalhas épicas sem limite de nível para te travar.
          </p>
        </div>

        {/* COLUNA CENTRAL — logo + botões (só desktop) */}
        {!isMobile && (
          <div style={{
            flex: '1 1 auto',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem',
          }}>
            <img
              src="/logo.png"
              alt="L2 Ikarus"
              style={{
                height: '240px', width: 'auto',
                filter: 'drop-shadow(0 0 50px rgba(212,175,55,0.6)) drop-shadow(0 0 120px rgba(212,175,55,0.25))',
                animation: 'logoPulse 4s ease-in-out infinite',
              }}
            />
            <div style={{ display: 'flex', gap: '1.2rem' }}>
              <button onClick={onRegisterClick} className="btn btn-primary"
                style={{ padding: '1rem 2rem', fontSize: '0.75rem', letterSpacing: '2px' }}
              >
                CRIAR CONTA
              </button>
              <a href="#download" className="btn btn-ghost"
                style={{ padding: '1rem 2rem', fontSize: '0.75rem', letterSpacing: '2px' }}
              >
                BAIXAR JOGO
              </a>
            </div>
          </div>
        )}

        {/* MOBILE — logo + botões abaixo do texto */}
        {isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
            <img src="/logo.png" alt="L2 Ikarus" style={{ height: '130px', width: 'auto', filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.5))', animation: 'logoPulse 4s ease-in-out infinite' }} />
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={onRegisterClick} className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', fontSize: '0.75rem' }}>CRIAR CONTA</button>
              <a href="#download" className="btn btn-ghost" style={{ padding: '0.85rem 1.8rem', fontSize: '0.75rem' }}>BAIXAR JOGO</a>
            </div>
          </div>
        )}


        {/* RIGHT: Status cards — apenas desktop */}
        {!isMobile && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '1.2rem',
            width: '230px', flexShrink: 0,
          }}>
            {/* STATUS SERVIDOR */}
            <div className="glass-panel hero-status-card" style={{
              borderLeft: `3px solid ${serverStatus.online ? '#4ade80' : '#ef4444'}`,
              padding: '1.4rem',
            }}>
              <div className="status-header">
                <span className="status-label">STATUS</span>
                <div className="status-dot" style={{
                  background: serverStatus.online ? '#4ade80' : '#ef4444',
                  boxShadow: `0 0 12px ${serverStatus.online ? '#4ade80' : '#ef4444'}`,
                }} />
              </div>
              <div className="status-value" style={{ fontSize: '1.4rem' }}>
                {serverStatus.online ? 'ON-LINE' : 'OFFLINE'}
              </div>
            </div>

            {/* ADMIN IKARUS */}
            <div className="glass-panel hero-status-card" style={{
              borderLeft: `3px solid ${adminOnline ? '#4ade80' : '#ef4444'}`,
              padding: '1.4rem',
            }}>
              <div className="status-header">
                <span className="status-label">ADMIN</span>
                <div className="status-dot" style={{
                  background: adminOnline ? '#4ade80' : '#ef4444',
                  boxShadow: `0 0 12px ${adminOnline ? '#4ade80' : '#ef4444'}`,
                }} />
              </div>
              <div className="status-value" style={{
                fontSize: '1.1rem',
                color: adminOnline ? '#4ade80' : '#ef4444',
                letterSpacing: '2px',
              }}>
                IKARUS
              </div>
              <p className="status-meta" style={{ marginTop: '0.3rem' }}>
                {adminOnline ? 'Online no Discord' : 'Offline no Discord'}
              </p>
            </div>

            {/* RATES */}
            <div className="glass-panel hero-status-card" style={{ borderLeft: '3px solid var(--gold)', padding: '1.4rem' }}>
              <span className="status-label" style={{ marginBottom: '1rem', display: 'block' }}>RATES TÉCNICOS</span>
              <div className="rates-list">
                <div className="rate-item"><span>XP</span><span className="rate-value">x3</span></div>
                <div className="rate-item"><span>SP</span><span className="rate-value">x3</span></div>
                <div className="rate-item"><span>ADENA</span><span className="rate-value">x2</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="scanline-overlay" style={{ opacity: 0.08 }} />
    </section>
  )
}
