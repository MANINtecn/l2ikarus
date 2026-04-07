import { useState, useEffect } from 'react'
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
import AudioController from './components/AudioController'

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  return (
    <main style={{ position: 'relative', background: '#050508', minHeight: '100vh' }}>
      {/* 🔮 ELEMENTOS FIXOS (HUD) */}
      <Background3D />
      <Navbar onRegisterClick={() => setIsRegisterOpen(true)} />
      <AudioController />
      
      {/* 🚀 SEÇÃO HERO - O DESPERTAR (3D) */}
      <Hero3D onRegisterClick={() => setIsRegisterOpen(true)} />
      
      {/* 📊 SEÇÃO STATUS - PULSO DO SERVIDOR */}
      <StatusHolo />

      {/* ⚔️ SEÇÃO RATES - EQUILÍBRIO DE ELITE */}
      <RatesGrid />
      
      <div className="section-divider" />

      {/* 🏰 SEÇÃO FEATURES - MECÂNICAS AAA */}
      <FeaturesTerminal />

      {/* 📅 SEÇÃO ROADMAP - EVOLUÇÃO ESTRATÉGICA */}
      <RoadmapHolo />

      {/* 📥 SEÇÃO DOWNLOAD - TERMINAL DE IMPLANTAÇÃO */}
      <DownloadTerminal />
      
      <div className="section-divider" style={{ opacity: 0.1 }} />

      {/* 🛡️ FOOTER - FUNDAÇÃO TECX */}
      <Footer onAdminClick={() => setShowLogin(true)} />
      
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
