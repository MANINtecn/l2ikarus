import { useState, useEffect } from 'react'
import sectionImg from '../section-1.jpg.jpg'

export default function Hero3D({ onRegisterClick }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [serverStatus, setServerStatus] = useState({ online: false, players: 0 })
  const [adminOnline, setAdminOnline] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024)
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrollProgress(Math.min(1, scrollY / 600))
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status')
        const data = await res.json()
        setServerStatus({ online: data.online, players: data.players || 0 })
      } catch (e) {
        setServerStatus({ online: false, players: 0 })
      }

      try {
        const discordRes = await fetch('/api/discord')
        const discordData = await discordRes.json()
        setAdminOnline(discordData.adminOnline || false)
      } catch (e) {
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
      height: '100vh',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1,
      overflow: 'hidden'
    }}>
      {/* 🎬 VÍDEO BACKGROUND - PERFORMANCE OTIMIZADA */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          poster={sectionImg}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.8
          }}
        >
          <source src="/assets/video-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay para contraste e "pegada antiga" */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, transparent 20%, rgba(2,2,3,0.8) 100%), linear-gradient(to bottom, rgba(2,2,3,0.3) 0%, rgba(2,2,3,0.9) 100%)',
          zIndex: 1
        }} />
      </div>

      <div className="container hero-container" style={{ 
        height: '100%',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center', // Mantendo center para alinhamento vertical
        paddingTop: isMobile ? '60px' : '150px', // Puxando para baixo no desktop
        justifyContent: 'space-between',
        opacity: 1 - scrollProgress,
        transform: `translateY(${scrollProgress * -50}px)`,
        transition: 'opacity 0.1s linear'
      }}>
        {/* HUD OVERLAY LEFT: SERVER IDENTITY */}
        <div className="hero-identity reveal-delay-1 animate-fadeUp" style={{ 
          maxWidth: isMobile ? '280px' : '650px', 
          zIndex: 10,
          position: 'relative'
        }}>
          {/* LOGO HERO */}
          <img 
            src="/assets/images/logo_white.png" 
            alt="L2 Ikarus" 
            style={{ 
              height: isMobile ? '60px' : '120px', 
              width: 'auto', 
              marginBottom: '2rem',
              opacity: 0.9,
              filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))'
            }} 
          />
          
          <p className="section-subtitle" style={{ textAlign: 'left', color: 'var(--gold)' }}>
            RECONECTE-SE COM A LENDA
          </p>
          <h1 className="cinzel hero-title" style={{ 
            fontSize: isMobile ? '2.5rem' : 'clamp(3rem, 10vw, 5rem)',
            lineHeight: 1,
            marginBottom: '1rem',
            position: 'relative',
            textShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}>
            L2 IKARUS
          </h1>
          <p className="hero-description" style={{ 
            fontSize: isMobile ? '0.9rem' : 'clamp(1rem, 1.5vw, 1.3rem)',
            marginBottom: isMobile ? '2.4rem' : '3.5rem',
            maxWidth: isMobile ? '250px' : '600px',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            A essência do Lineage 2 High-Five em sua forma mais pura. Performance otimizada, estabilidade de elite e a glória dos velhos tempos.
          </p>
          
          <div className="hero-actions" style={{ 
            flexDirection: 'row', 
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: isMobile ? '15px' : '2rem'
          }}>
             <button onClick={onRegisterClick} className="btn btn-primary" style={{ padding: isMobile ? '0.8rem 1.5rem' : '1rem 2.5rem', width: 'auto' }}>
               CRIAR CONTA
             </button>
             <a href="#download" className="btn btn-ghost" style={{ padding: isMobile ? '0.8rem 1.5rem' : '1rem 2.5rem', width: 'auto' }}>
               BAIXAR JOGO
             </a>
          </div>
        </div>

        {/* HUD OVERLAY RIGHT: SERVER STATUS CARDS (Apenas Desktop) */}
        {!isMobile && (
          <div className="hero-status animate-fadeUp" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem', 
            width: '240px'
          }}>
            <div className="glass-panel hero-status-card" style={{ borderLeft: `4px solid ${serverStatus.online ? '#4ade80' : '#ef4444'}`, padding: '1.5rem' }}>
              <div className="status-header">
                <span className="status-label">STATUS</span>
                <div className="status-dot" style={{ background: serverStatus.online ? '#4ade80' : '#ef4444', boxShadow: `0 0 15px ${serverStatus.online ? '#4ade80' : '#ef4444'}` }} />
              </div>
              <div className="status-value" style={{ fontSize: '1.5rem' }}>{serverStatus.online ? 'ON-LINE' : 'OFFLINE'}</div>
              <p className="status-meta">{serverStatus.players.toLocaleString()} Heróis Ativos</p>
            </div>

            {/* CARD ADMIN IKARUS - STATUS DISCORD */}
            <div className="glass-panel hero-status-card" style={{ borderLeft: `4px solid ${adminOnline ? '#4ade80' : '#ef4444'}`, padding: '1.5rem' }}>
              <div className="status-header">
                <span className="status-label">ADMIN</span>
                <div className="status-dot" style={{
                  background: adminOnline ? '#4ade80' : '#ef4444',
                  boxShadow: `0 0 15px ${adminOnline ? '#4ade80' : '#ef4444'}`
                }} />
              </div>
              <div className="status-value" style={{
                fontSize: '1.1rem',
                color: adminOnline ? '#4ade80' : '#ef4444',
                letterSpacing: '2px'
              }}>
                IKARUS
              </div>
              <p className="status-meta" style={{ marginTop: '0.3rem' }}>
                {adminOnline ? 'Online no Discord' : 'Offline no Discord'}
              </p>
            </div>

            <div className="glass-panel hero-status-card" style={{ borderLeft: '4px solid var(--gold)', padding: '1.5rem' }}>
              <span className="status-label" style={{ marginBottom: '1.2rem', display: 'block' }}>RATES TÉCNICOS</span>
              <div className="rates-list">
                <div className="rate-item"><span>XP</span><span className="rate-value">x3</span></div>
                <div className="rate-item"><span>SP</span><span className="rate-value">x3</span></div>
                <div className="rate-item"><span>ADENA</span><span className="rate-value">x2</span></div>
              </div>
            </div>
          </div>
        )}

        {/* 📊 BARRA DE RATES FIXA - ESTILO ELITE */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: isMobile ? '90%' : 'auto',
          display: 'flex',
          gap: isMobile ? '15px' : '3rem',
          padding: isMobile ? '1rem' : '1rem 3.5rem',
          background: 'rgba(5, 5, 8, 0.4)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(197, 160, 89, 0.1)',
          borderBottom: '1px solid rgba(197, 160, 89, 0.1)',
          zIndex: 20,
          justifyContent: 'center',
          animation: 'fadeUp 1s ease-out 1s both'
        }}>
          {[
            { label: 'EXP', value: 'x3' },
            { label: 'SP', value: 'x3' },
            { label: 'ADENA', value: 'x2' },
            { label: 'QUEST', value: 'x1' },
            { label: 'DROP', value: 'x1' }
          ].map((rate, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ 
                fontFamily: 'Cinzel', 
                fontSize: isMobile ? '1rem' : '1.8rem', 
                color: 'var(--gold)',
                fontWeight: '700',
                lineHeight: 1
              }}>
                {rate.value}
              </div>
              <div style={{ 
                fontSize: '0.6rem', 
                letterSpacing: '3px', 
                color: 'rgba(255,255,255,0.5)',
                marginTop: '4px',
                fontWeight: '800'
              }}>
                {rate.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCANLINE OVERLAY - Para textura de "monitor antigo/militar" */}
      <div className="scanline-overlay" style={{ opacity: 0.15 }} />
    </section>
  )
}
