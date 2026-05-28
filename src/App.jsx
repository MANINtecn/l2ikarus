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
    if (params.get('admin') === '1') {
      fetch('/api/auth/me').then(r => r.json()).then(d => {
        if (d.authenticated) setAdminUser(d.user)
      })
      window.history.replaceState({}, '', '/')
    }
    if (params.get('auth_error')) {
      const errs = {
        google_denied: 'Login cancelado.',
        not_admin: 'Acesso negado. Seu e-mail não tem permissão de admin.',
        token_failed: 'Falha ao obter token do Google.',
        config: 'Erro de configuração no servidor.',
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
            onClose={() => setIsRegisterOpen(false)} 
          />

          {/* 🗝️ MODAL DE LOGIN ADMIN */}
          {isLoginOpen && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 11000,
              background: 'rgba(2,2,3,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(40px)',
            }} onClick={() => { setIsLoginOpen(false); setAuthError('') }}>
              <div className="glass-panel" style={{
                padding: '3.5rem', width: '100%', maxWidth: '420px', textAlign: 'center',
                border: '1px solid rgba(197,160,89,0.3)',
                animation: 'fadeUp 0.6s cubic-bezier(0.2,1,0.3,1) forwards',
              }} onClick={e => e.stopPropagation()}>
                <div style={{ width: '40px', height: '2px', background: 'var(--gold)', margin: '0 auto 2rem' }} />
                <h2 className="cinzel" style={{ color: 'var(--gold)', marginBottom: '0.75rem', fontSize: '1.8rem' }}>
                  ACESSO ADMIN
                </h2>
                <p style={{ color: 'var(--text-mute)', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '2.5rem' }}>
                  Autentique-se com sua conta Google autorizada.
                </p>

                {authError && (
                  <div style={{
                    background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)',
                    padding: '0.9rem', marginBottom: '1.5rem', fontSize: '0.72rem',
                    color: '#ff4444', letterSpacing: '1px',
                  }}>{authError}</div>
                )}

                <a href="/api/auth/google" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.9rem',
                  background: '#fff', color: '#1a1a1a', borderRadius: '8px',
                  padding: '0.9rem 1.5rem', textDecoration: 'none',
                  fontWeight: '700', fontSize: '0.85rem', letterSpacing: '1px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  marginBottom: '2rem',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Entrar com Google
                </a>

                <button onClick={() => { setIsLoginOpen(false); setAuthError('') }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-mute)', fontSize: '0.7rem', cursor: 'pointer', letterSpacing: '2px' }}
                >CANCELAR</button>
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
        </>
      )}
    </main>
  )
}

export default App
