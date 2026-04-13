import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import Navbar from './components/Navbar'
import Background3D from './components/Background3D'
import Footer from './components/Footer'
import RegisterModal from './components/RegisterModal'
import Hero3D from './components/Hero3D'
import StatusHolo from './components/StatusHolo'
import RatesGrid from './components/RatesGrid'
import FeaturesTerminal from './components/FeaturesTerminal'
import RoadmapHolo from './components/RoadmapHolo'
import DownloadTerminal from './components/DownloadTerminal'
import DonateTerminal from './components/DonateTerminal'
import DiscordCommunity from './components/DiscordCommunity'
import AudioController from './components/AudioController'
import FogOverlay from './components/FogOverlay'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const sections = containerRef.current.querySelectorAll('section')
    
    sections.forEach((section) => {
      // 🚀 EFEITO ZOOM OUT GERAL (Estilo Mont-Fort)
      // Cada seção encolhe e apaga conforme o usuário rola para a próxima
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: "top top", // Quando o topo da seção chega no topo da tela
          end: "bottom top", // Até o fundo da seção chegar no topo
          scrub: true,
          pin: false // Não trava, apenas anima a saída
        },
        scale: 0.8,
        opacity: 0.1,
        ease: "none"
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <main style={{ position: 'relative', background: '#050508', minHeight: '100vh' }}>
      {/* 🔮 ELEMENTOS FIXOS (HUD) */}
      <Background3D />
      <FogOverlay />
      <Navbar onRegisterClick={() => setIsRegisterOpen(true)} />
      <AudioController />
      
      {/* 🚀 SEÇÃO HERO - O DESPERTAR (3D) (Agora Fixa no Fundo) */}
      <Hero3D onRegisterClick={() => setIsRegisterOpen(true)} />
      
      {/* 📜 CONTEÚDO QUE ROLA SOBRE O HERO */}
      <div ref={containerRef} className="scroll-content-container" style={{ position: 'relative', zIndex: 5, background: 'transparent' }}>
        {/* Espaçador para o Hero */}
        <div style={{ height: '100vh', pointerEvents: 'none' }} />
        
        {/* 📊 SEÇÃO STATUS - PULSO DO SERVIDOR */}
        <StatusHolo />

        {/* ⚔️ SEÇÃO RATES - EQUILÍBRIO DE ELITE */}
        <RatesGrid />
        
        <div className="section-divider" />

        {/* 🏰 SEÇÃO FEATURES - MECÂNICAS AAA */}
        <FeaturesTerminal />

        {/* 📅 SEÇÃO ROADMAP - EVOLUÇÃO ESTRATÉGICA */}
        <RoadmapHolo />

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
    </main>
  )
}

export default App
