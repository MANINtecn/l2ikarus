import { useState, useEffect } from 'react'
import ModelViewer3D from './ModelViewer3D'

export default function Hero3D({ onRegisterClick }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)
  const desktopModel = `/assets/skins/antharas/ikarus_promo.glb?v=${Date.now()}`
  const mobileModel = `/assets/skins/antharas/antharasmobile.glb?v=${Date.now()}`
  
  const [modelUrl, setModelUrl] = useState(isMobile ? mobileModel : desktopModel)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024
      setIsMobile(mobile)
      setModelUrl(mobile ? mobileModel : desktopModel)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section id="hero" className="hero-section" style={{ 
      height: isMobile ? '700px' : '100vh',
      padding: '0'
    }}>
      {/* 🐉 MODELO 3D - POSICIONAMENTO DINÂMICO */}
      <div className="hero-3d-container" style={{ 
        position: 'absolute',
        right: isMobile ? '-35%' : '0', 
        top: isMobile ? '10%' : '0',
        width: isMobile ? '120%' : '100%', 
        height: isMobile ? '550px' : '100%',
        opacity: isMobile ? 1 : 0.9,
        zIndex: isMobile ? 1 : 1,
        pointerEvents: 'auto'
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

      <div className="container hero-container" style={{ 
        flexDirection: 'row', 
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: isMobile ? 'flex-start' : 'space-between',
        textAlign: 'left',
        height: '100%',
        position: 'relative',
        zIndex: 10,
        paddingTop: isMobile ? '120px' : '0',
        pointerEvents: 'none' // 👈 HUD não bloqueia o clique no 3D
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
