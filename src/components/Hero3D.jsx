import { useState, useEffect } from 'react'
import ModelViewer3D from './ModelViewer3D'

export default function Hero3D({ onRegisterClick }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)
  const desktopModel = '/assets/skins/antharas/ikarus_promo.glb'
  const mobileModel = '/assets/skins/antharas/antharasmobile.glb'
  
  const [modelUrl, setModelUrl] = useState(isMobile ? mobileModel : desktopModel)

  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024
      setIsMobile(mobile)
      setModelUrl(mobile ? mobileModel : desktopModel)
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = 1200 // Sincronizado com ModelViewer3D
      setScrollProgress(Math.min(1, scrollY / maxScroll))
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
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
      padding: '0',
      pointerEvents: 'none'
    }}>
      {/* 🐉 MODELO 3D - POSICIONAMENTO DINÂMICO */}
      <div className="hero-3d-container" style={{ 
        position: 'absolute',
        right: isMobile ? '-35%' : '0', 
        left: 'auto',
        top: isMobile ? '10%' : '0',
        width: isMobile ? '120%' : '100%', 
        height: isMobile ? '550px' : '100%',
        opacity: isMobile ? 1 : 0.9,
        zIndex: isMobile ? 1 : 1,
        pointerEvents: 'auto',
        overflow: 'visible' // 👈 Garante que o ícone 360 apareça
      }}>
        <ModelViewer3D 
          modelUrl={modelUrl} 
          interactive={true} 
          glowColor="#4ade80" 
          animIndex={isMobile ? 8 : undefined}
          isMobileProp={isMobile}
        />

        {/* 🟢 EFEITO LED BACKLIGHT (Aura de Destaque) */}
        {isMobile && (
          <div className="mobile-led-glow" />
        )}

        <div className="hero-gradient-overlay" style={{ 
          background: isMobile 
            ? 'linear-gradient(0deg, rgba(5,5,8,1) 0%, rgba(5,5,8,0) 50%, rgba(5,5,8,1) 100%)' 
            : undefined 
        }} />
      </div>

      {/* 🔘 INDICADOR DE CÂMERA 360° (Blindagem de Visibilidade Máxima) */}
      <div style={{
        position: 'fixed', 
        top: isMobile ? '70%' : '20%', 
        left: isMobile ? '50%' : '72%', 
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        color: 'var(--gold)', pointerEvents: 'none',
        fontSize: '0.75rem', letterSpacing: '4px', fontWeight: '900',
        fontFamily: 'var(--font-heading)',
        zIndex: 15000, // 👈 Hierarquia Suprema
        textShadow: '0 0 20px rgba(197, 160, 89, 0.8)',
        animation: 'ledPulse 4s infinite ease-in-out', 
        opacity: (1 - scrollProgress) * 0.9,
        textAlign: 'center',
        transition: 'opacity 0.1s linear'
      }}>
        {/* Ícone de Seta Circular 360° */}
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '5px' }}>
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
          <text x="12" y="15" fontSize="3.5" fontWeight="bold" fill="currentColor" textAnchor="middle">360°</text>
        </svg>
        <div style={{ 
          background: 'rgba(5,5,8,0.7)', 
          padding: '4px 14px', 
          borderRadius: '50px',
          border: '1px solid rgba(197, 160, 89, 0.4)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 20px rgba(197, 160, 89, 0.2)'
        }}>
          VISÃO 360° VR
        </div>
      </div>

      <div className="container hero-container" style={{ 
        flexDirection: 'row', 
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: isMobile ? 'flex-start' : 'space-between',
        textAlign: 'left',
        height: '100%',
        position: 'relative',
        zIndex: 10,
        paddingTop: isMobile ? '120px' : '0',
        pointerEvents: 'auto', // 👈 HUD e 3D reativam interação
        opacity: 1 - scrollProgress,
        transform: `translateY(${scrollProgress * -100}px)`, // Drift ascendente mais dramático
        transition: 'opacity 0.1s linear'
      }}>
        {/* HUD OVERLAY LEFT: SERVER IDENTITY */}
        <div className="hero-identity reveal-delay-1 animate-fadeUp" style={{ 
          maxWidth: isMobile ? '230px' : '550px', 
          zIndex: 10,
          position: 'relative',
          pointerEvents: 'auto' // 👈 Reativa clique apenas nos elementos de UI
        }}>
          <p className="section-subtitle" style={{ textAlign: 'left' }}>
            {isMobile ? 'IKARUS MOBILE ELITE' : 'SEJA RECONHECIDO POR ONDE FARMA'}
          </p>
          <h1 className="cinzel hero-title" style={{ 
            fontSize: isMobile ? '2.4rem' : 'clamp(3rem, 10vw, 5.5rem)',
            marginBottom: '1rem'
          }}>
            L2<br />
            <span style={{ color: 'var(--gold)' }}>IKARUS</span>
          </h1>
          <p className="hero-description" style={{ 
            fontSize: isMobile ? '0.8rem' : 'clamp(0.9rem, 1.5vw, 1.2rem)',
            marginBottom: isMobile ? '2.4rem' : '3.5rem',
            maxWidth: isMobile ? '200px' : '550px'
          }}>
            {isMobile 
              ? 'O Elfo Antharas agora na palma da sua mão. Performance Otimizada.'
              : 'Experimente o Lineage 2 em uma nova dimensão. 3D High-End. Conjunto Antharas disponível na estreia.'}
          </p>
          
          <div className="hero-actions" style={{ 
            flexDirection: 'row', 
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: isMobile ? '10px' : '1.5rem',
            position: 'relative',
            zIndex: 100
          }}>
             <button onClick={onRegisterClick} className="btn btn-primary" style={{ padding: isMobile ? '0.6rem 1rem' : '0.8rem 1.6rem', width: 'auto', fontSize: isMobile ? '0.7rem' : '0.9rem' }}>
               {isMobile ? 'JOGAR' : 'INICIALIZAR JORNADA'}
             </button>
             <a href="#rates" className="btn btn-ghost" style={{ padding: isMobile ? '0.6rem 1rem' : '0.8rem 1.6rem', width: 'auto', fontSize: isMobile ? '0.7rem' : '0.9rem' }}>
               {isMobile ? 'RATES' : 'RECURSOS ELITE'}
             </a>
          </div>
        </div>

        {/* HUD OVERLAY RIGHT: SERVER STATUS CARDS (Apenas Desktop) */}
        {!isMobile && (
          <div className="hero-status animate-fadeUp" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem', 
            width: '220px',
            pointerEvents: 'auto' // 👈 Reativa clique nos cards de status
          }}>
            {/* STATUS CARD */}
            <div className="glass-panel hero-status-card" style={{ borderLeft: '4px solid #4ade80', padding: '1.5rem' }}>
              <div className="status-header">
                <span className="status-label">STATUS</span>
                <div className="status-dot" style={{ background: '#4ade80', boxShadow: '0 0 10px #4ade80' }} />
              </div>
              <div className="status-value">ON-LINE</div>
              <p className="status-meta">1.240 Jogadores Ativos</p>
            </div>

            {/* RATES HUD */}
            <div className="glass-panel hero-status-card" style={{ borderLeft: '4px solid var(--gold)', padding: '1.5rem' }}>
              <span className="status-label" style={{ marginBottom: '1.2rem', display: 'block' }}>DADOS DO REINO</span>
              <div className="rates-list">
                <div className="rate-item">
                  <span>TAXA DE XP</span>
                  <span className="rate-value">x1000</span>
                </div>
                <div className="rate-item">
                  <span>TAXA SP</span>
                  <span className="rate-value">x1000</span>
                </div>
                <div className="rate-item">
                  <span>ADENA</span>
                  <span className="rate-value">x500</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SCANLINE OVERLAY */}
      <div className="scanline-overlay" />

      {/* MOUSE SCROLL INDICATOR */}
      <div className="scroll-indicator hide-mobile">
         <div className="scroll-line" />
         <span className="scroll-text">ROLAR</span>
      </div>
    </section>
  )
}
