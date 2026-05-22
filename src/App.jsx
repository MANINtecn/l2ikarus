import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import Navbar from './assets/components/Navbar'
import BetaBanner, { BANNER_HEIGHT } from './assets/components/BetaBanner'
import Footer from './assets/components/Footer'
import RegisterModal from './assets/components/RegisterModal'
import Hero3D from './assets/components/Hero3D'
import FeaturesTerminal from './assets/components/FeaturesTerminal'
import RoadmapHolo from './assets/components/RoadmapHolo'
import DownloadTerminal from './assets/components/DownloadTerminal'
import DonateTerminal from './assets/components/DonateTerminal'
import DiscordCommunity from './assets/components/DiscordCommunity'
import AudioController from './assets/components/AudioController'
import Preloader from './assets/components/Preloader'
import ServerGuide from './assets/components/ServerGuide'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bannerVisible, setBannerVisible] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    // Simular carregamento de assets
    const timer = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (loading) return;

    const sections = containerRef.current.querySelectorAll('section')
    
    sections.forEach((section) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: false
        },
        scale: 0.8,
        opacity: 0.1,
        ease: "none"
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [loading])

  return (
    <main style={{ position: 'relative', background: '#050508', minHeight: '100vh' }}>
      {loading && <Preloader />}
      
      {!loading && (
        <>
          {bannerVisible && <BetaBanner onDismiss={() => setBannerVisible(false)} />}
          {/* 🚀 SEÇÃO HERO - O DESPERTAR (VÍDEO) */}
          <Navbar
            topOffset={bannerVisible ? BANNER_HEIGHT : 0}
            onRegisterClick={() => setIsRegisterOpen(true)} 
            onLoginClick={() => setIsLoginOpen(true)}
          />
          <AudioController />
          <Hero3D onRegisterClick={() => setIsRegisterOpen(true)} />
          
          {/* 📜 CONTEÚDO QUE ROLA SOBRE O HERO */}
          <div ref={containerRef} className="scroll-content-container" style={{ position: 'relative', zIndex: 5, background: 'transparent' }}>
            {/* Espaçador para o Hero */}
            <div style={{ height: '100vh', pointerEvents: 'none' }} />
            
            {/* 📅 SEÇÃO ROADMAP - EVOLUÇÃO ESTRATÉGICA */}
            <RoadmapHolo />

            {/* 📖 SEÇÃO GUIA - CONHECIMENTO PROIBIDO */}
            <ServerGuide />
            
            <div className="section-divider" />

            {/* 🏰 SEÇÃO FEATURES - MECÂNICAS AAA */}
            <FeaturesTerminal />

            {/* 💰 SEÇÃO DOAÇÕES - TERMINAL TECX */}
            <DonateTerminal />

            {/* 📥 SEÇÃO DOWNLOAD - TERMINAL DE IMPLANTAÇÃO */}
            <DownloadTerminal />
            
            {/* 🤝 SEÇÃO COMUNIDADE - HUB DISCORD */}
            <DiscordCommunity />
            
            <div className="section-divider" style={{ opacity: 0.1 }} />

            {/* 🛡️ FOOTER - FUNDAÇÃO TECX */}
            <Footer onAdminClick={() => setShowLogin(true)} />
          </div>
          
          {/* 🆔 MODAL DE CADASTRO - NOVO RECRUTA */}
          <RegisterModal 
            isOpen={isRegisterOpen} 
            onClose={() => setIsRegisterOpen(false)} 
          />

          {/* 🗝️ MODAL DE LOGIN - PAINEL DO JOGADOR (PLACEHOLDER) */}
          {isLoginOpen && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 11000,
              background: 'rgba(2, 2, 3, 0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(40px)'
            }}>
              <div className="glass-panel" style={{
                padding: '4rem',
                width: '100%', maxWidth: '450px', textAlign: 'center',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                animation: 'fadeUp 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards'
              }}>
                 <div style={{ width: '40px', height: '2px', background: 'var(--gold)', margin: '0 auto 2rem' }} />
                 <h2 className="cinzel" style={{ color: 'var(--gold)', marginBottom: '1rem', fontSize: '2rem' }}>PAINEL DO JOGADOR</h2>
                 <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '3rem' }}>
                   Acesse sua conta para gerenciar personagens, leilões e recompensas.
                 </p>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                   <input type="text" placeholder="LOGIN" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: '#fff', fontSize: '0.8rem' }} />
                   <input type="password" placeholder="SENHA" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: '#fff', fontSize: '0.8rem' }} />
                 </div>

                 <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>CONECTAR</button>
                 <button onClick={() => setIsLoginOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-mute)', fontSize: '0.7rem', cursor: 'pointer', letterSpacing: '2px' }}>CANCELAR</button>
              </div>
            </div>
          )}

          {/* 🗝️ TERMINAL RESTRITO (ADMIN) */}
          {showLogin && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 11000,
              background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(30px)'
            }}>
              <div className="glass-panel" style={{
                padding: '3.5rem',
                width: '100%', maxWidth: '400px', textAlign: 'center',
                position: 'relative',
                animation: 'fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              }}>
                 <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '30px', background: 'var(--gold)' }} />
                 <h2 className="cinzel" style={{ color: 'var(--gold)', marginBottom: '1.5rem', fontSize: '1.6rem' }}>ACESSO RESTRITO</h2>
                 <p style={{ color: 'var(--text-mute)', fontSize: '0.7rem', letterSpacing: '3px', marginBottom: '3.5rem', textTransform: 'uppercase' }}>
                   Área protegida por criptografia de 256-bits. Acesso exclusivo para administradores de elite.
                 </p>
                 <button onClick={() => setShowLogin(false)} className="btn btn-primary" style={{ width: '100%' }}>DESCONECTAR INTERFACE</button>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default App
