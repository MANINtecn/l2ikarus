import { useState, useEffect } from 'react'
import sectionImg from '../section-1.jpg.jpg'
import logoWhite from '../images/logo_white.png'

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
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
        >
          <source src="/assets/video-bg.mp4" type="video/mp4" />
        </video>

        {/* Overlay mais claro para mostrar mais o background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 55% 50%, transparent 25%, rgba(2,2,8,0.55) 100%), linear-gradient(to bottom, rgba(2,2,8,0.2) 0%, rgba(2,2,8,0.65) 100%)',
          zIndex: 1,
        }} />

        {/* Vinheta lateral esquerda para contraste do texto */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(2,2,8,0.7) 0%, transparent 55%)',
          zIndex: 2,
        }} />
      </div>

      {/* LOGO - absolutamente centralizada no hero */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        pointerEvents: 'none',
        textAlign: 'center',
      }}>
        <img
          src={logoWhite}
          alt="L2 Ikarus"
          style={{
            height: isMobile ? '140px' : '280px',
            width: 'auto',
            filter: 'drop-shadow(0 0 50px rgba(212,175,55,0.6)) drop-shadow(0 0 120px rgba(212,175,55,0.25))',
            animation: 'logoPulse 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="container" style={{
        height: '100%', position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: isMobile ? '80px' : '100px',
        opacity: 1 - scrollProgress,
        transform: `translateY(${scrollProgress * -40}px)`,
        transition: 'opacity 0.1s linear',
      }}>

        {/* LEFT CONTENT */}
        <div style={{
          maxWidth: isMobile ? '100%' : '580px',
          zIndex: 10, position: 'relative',
          display: 'flex', flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
        }}>
          <p style={{
            fontSize: '0.7rem', letterSpacing: '4px', fontWeight: '700',
            color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>
            RECONECTE-SE COM A LENDA
          </p>

          <h1 className="cinzel" style={{
            fontSize: isMobile ? '2.2rem' : 'clamp(2.5rem, 6vw, 4.2rem)',
            lineHeight: 1.05, marginBottom: '1.2rem',
            textShadow: '0 8px 30px rgba(0,0,0,0.7)',
            color: '#fff',
          }}>
            L2 IKARUS
          </h1>

          <p style={{
            fontSize: isMobile ? '0.9rem' : '1.05rem',
            marginBottom: isMobile ? '2rem' : '3rem',
            maxWidth: isMobile ? '280px' : '480px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.7,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}>
            A essência do Lineage 2 High-Five em sua forma mais pura. Performance otimizada, estabilidade de elite e a glória dos velhos tempos.
          </p>

          <div style={{ display: 'flex', gap: isMobile ? '1rem' : '1.5rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <button onClick={onRegisterClick} className="btn btn-primary"
              style={{ padding: isMobile ? '0.85rem 1.8rem' : '1rem 2.5rem', fontSize: '0.75rem', letterSpacing: '2px' }}
            >
              CRIAR CONTA
            </button>
            <a href="#download" className="btn btn-ghost"
              style={{ padding: isMobile ? '0.85rem 1.8rem' : '1rem 2.5rem', fontSize: '0.75rem', letterSpacing: '2px' }}
            >
              BAIXAR JOGO
            </a>
          </div>
        </div>

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
              <p className="status-meta">{serverStatus.players.toLocaleString()} Heróis Ativos</p>
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
