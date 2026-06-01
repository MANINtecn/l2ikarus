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
import DownloadTerminal from './assets/components/DownloadTerminal'
import DonateTerminal from './assets/components/DonateTerminal'
import DiscordCommunity from './assets/components/DiscordCommunity'
import Preloader from './assets/components/Preloader'
import AdminPanel from './assets/components/AdminPanel'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [adminUser, setAdminUser] = useState(null)
  const [authError, setAuthError] = useState('')
  const [googleData, setGoogleData] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Verifica sessão admin ao carregar
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.authenticated) setAdminUser(d.user)
    }).catch(() => {})

    // Checa parâmetros de URL após OAuth
    const params = new URLSearchParams(window.location.search)

    // Volta do Google com e-mail verificado — abre modal com form
    if (params.get('google_data')) {
      try {
        const data = JSON.parse(atob(params.get('google_data').replace(/-/g, '+').replace(/_/g, '/')))
        setGoogleData(data)
        setIsRegisterOpen(true)
      } catch {}
      window.history.replaceState({}, '', '/')
    }
    if (params.get('reg_error')) {
      setIsRegisterOpen(true)
      window.history.replaceState({}, '', '/')
    }

    // Login admin
    if (params.get('admin') === '1') {
      fetch('/api/auth/me').then(r => r.json()).then(d => {
        if (d.authenticated) setAdminUser(d.user)
      })
      window.history.replaceState({}, '', '/')
    }
    if (params.get('auth_error')) {
      const errs = {
        google_denied: 'Login cancelado.',
        not_admin: 'Acesso negado.',
        token_failed: 'Falha ao obter token do Google.',
        server_error: 'Erro interno. Tente novamente.',
      }
      setAuthError(errs[params.get('auth_error')] || 'Erro desconhecido.')
      setIsLoginOpen(true)
      window.history.replaceState({}, '', '/')
    }
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
          <Hero3D onRegisterClick={() => setIsRegisterOpen(true)} />

          {/* Espaçador — empurra o conteúdo para baixo do hero sem bloquear cliques */}
          <div style={{ height: '100vh', pointerEvents: 'none', position: 'relative', zIndex: 0 }} />

          {/* 📜 CONTEÚDO QUE ROLA SOBRE O HERO */}
          <div ref={containerRef} className="scroll-content-container" style={{ position: 'relative', zIndex: 5, background: 'transparent' }}>
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
            onClose={() => { setIsRegisterOpen(false); setGoogleData(null) }}
            googleData={googleData}
          />

          {/* 🗝️ MODAL DE LOGIN DO JOGADOR */}
          {isLoginOpen && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 11000,
              background: 'rgba(2,2,3,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(40px)',
            }} onClick={() => { setIsLoginOpen(false); setAuthError('') }}>
              <div className="glass-panel" style={{
                padding: '4rem', width: '100%', maxWidth: '450px', textAlign: 'center',
                border: '1px solid rgba(197,160,89,0.3)',
                animation: 'fadeUp 0.6s cubic-bezier(0.2,1,0.3,1) forwards',
              }} onClick={e => e.stopPropagation()}>
                <div style={{ width: '40px', height: '2px', background: 'var(--gold)', margin: '0 auto 2rem' }} />
                <h2 className="cinzel" style={{ color: 'var(--gold)', marginBottom: '1rem', fontSize: '2rem' }}>PAINEL DO JOGADOR</h2>
                <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '3rem' }}>
                  Acesse sua conta para gerenciar personagens e recompensas.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                  <input type="text" placeholder="LOGIN" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: '#fff', fontSize: '0.8rem' }} />
                  <input type="password" placeholder="SENHA" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: '#fff', fontSize: '0.8rem' }} />
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>CONECTAR</button>
                <button onClick={() => { setIsLoginOpen(false); setAuthError('') }} style={{ background: 'none', border: 'none', color: 'var(--text-mute)', fontSize: '0.7rem', cursor: 'pointer', letterSpacing: '2px' }}>CANCELAR</button>
              </div>
            </div>
          )}

          {/* PAINEL ADMIN (após autenticação) */}
          {adminUser && (
            <AdminPanel
              user={adminUser}
              onLogout={() => { window.location.href = '/api/auth/logout' }}
            />
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
        {/* VOTAÇÃO L2JBrasil */}
        <div style={{
          position: 'fixed', bottom: '1.5rem', left: '1.5rem',
          zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        }}>
          <span style={{
            background: 'rgba(197,160,89,0.15)', border: '1px solid rgba(197,160,89,0.4)',
            color: 'var(--gold)', fontSize: '0.55rem', fontWeight: '700',
            letterSpacing: '2px', padding: '3px 10px', borderRadius: '20px',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            🏆 Vote e Ganhe Recompensas
          </span>
          <a
            id="top-l2jbrasil"
            href="https://top.l2jbrasil.com/index.php?a=in&u=ikaruslineagell"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '200px', display: 'block',
              opacity: 0.9, transition: 'opacity 0.2s, transform 0.2s',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <img
              src="https://top.l2jbrasil.com/button_l.php?u=ikaruslineagell&m=left"
              alt="Top L2JBrasil Servidores Lineage2"
              referrerPolicy="no-referrer"
              style={{ width: '100%', display: 'block', borderRadius: '6px' }}
            />
          </a>
        </div>
      </>
    )}
    </main>
  )
}

export default App
