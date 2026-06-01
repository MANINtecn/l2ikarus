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
import PlayerPanel from './assets/components/PlayerPanel'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [adminUser, setAdminUser] = useState(null)
  const [playerData, setPlayerData] = useState(null)
  const [googleData, setGoogleData] = useState(null)
  const [loginForm, setLoginForm] = useState({ login: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Verifica sessão admin
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.authenticated) setAdminUser(d.user)
    }).catch(() => {})

    // Verifica sessão jogador
    fetch('/api/player/me').then(r => r.json()).then(d => {
      if (d.authenticated) setPlayerData(d)
    }).catch(() => {})

    const params = new URLSearchParams(window.location.search)

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
    if (params.get('admin') === '1') {
      fetch('/api/auth/me').then(r => r.json()).then(d => {
        if (d.authenticated) setAdminUser(d.user)
      })
      window.history.replaceState({}, '', '/')
    }
  }, [])

  useEffect(() => {
    if (loading) return
    const sections = containerRef.current.querySelectorAll('section')
    sections.forEach((section) => {
      gsap.to(section, {
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
        scale: 0.8, opacity: 0.1, ease: 'none',
      })
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [loading])

  const handlePlayerLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const res = await fetch('/api/player/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (!res.ok) return setLoginError(data.error || 'Erro ao conectar')
      // Busca dados completos após login
      const me = await fetch('/api/player/me').then(r => r.json())
      if (me.authenticated) {
        setPlayerData(me)
        setIsLoginOpen(false)
        setLoginForm({ login: '', password: '' })
      }
    } catch {
      setLoginError('Erro de conexão. Tente novamente.')
    } finally {
      setLoginLoading(false)
    }
  }

  return (
    <main style={{ position: 'relative', background: '#050508', minHeight: '100vh' }}>
      {loading && <Preloader />}

      {!loading && (
        <>
          {bannerVisible && <BetaBanner onDismiss={() => setBannerVisible(false)} />}
          <Navbar
            topOffset={bannerVisible ? BANNER_HEIGHT : 0}
            onRegisterClick={() => setIsRegisterOpen(true)}
            onLoginClick={() => setIsLoginOpen(true)}
          />
          <Hero3D onRegisterClick={() => setIsRegisterOpen(true)} />

          <div style={{ height: '100vh', pointerEvents: 'none', position: 'relative', zIndex: 0 }} />

          <div ref={containerRef} className="scroll-content-container" style={{ position: 'relative', zIndex: 5, background: 'transparent' }}>
            <div className="section-divider" />
            <FeaturesTerminal />
            <DonateTerminal />
            <DownloadTerminal />
            <DiscordCommunity />
            <div className="section-divider" style={{ opacity: 0.1 }} />
            {/* Footer — TECX SOFTHOUSE redireciona para login admin */}
            <Footer onAdminClick={() => { window.location.href = '/api/auth/google' }} />
          </div>

          {/* MODAL DE CADASTRO */}
          <RegisterModal
            isOpen={isRegisterOpen}
            onClose={() => { setIsRegisterOpen(false); setGoogleData(null) }}
            googleData={googleData}
          />

          {/* MODAL DE LOGIN DO JOGADOR */}
          {isLoginOpen && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 11000,
              background: 'rgba(2,2,3,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(40px)',
            }} onClick={() => { setIsLoginOpen(false); setLoginError('') }}>
              <div className="glass-panel" style={{
                padding: '3.5rem', width: '100%', maxWidth: '420px', textAlign: 'center',
                border: '1px solid rgba(197,160,89,0.3)',
                animation: 'fadeUp 0.6s cubic-bezier(0.2,1,0.3,1) forwards',
              }} onClick={e => e.stopPropagation()}>
                <div style={{ width: '40px', height: '2px', background: 'var(--gold)', margin: '0 auto 2rem' }} />
                <h2 className="cinzel" style={{ color: 'var(--gold)', marginBottom: '0.75rem', fontSize: '1.8rem' }}>PAINEL DO JOGADOR</h2>
                <p style={{ color: 'var(--text-mute)', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '2rem' }}>
                  Acesse sua conta para gerenciar personagens.
                </p>

                {loginError && (
                  <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', padding: '0.8rem', marginBottom: '1.5rem', color: '#ff4444', fontSize: '0.75rem' }}>
                    {loginError}
                  </div>
                )}

                <form onSubmit={handlePlayerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <input
                    type="text" placeholder="LOGIN" required
                    value={loginForm.login}
                    onChange={e => setLoginForm({ ...loginForm, login: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: '#fff', fontSize: '0.85rem', outline: 'none', borderRadius: '4px' }}
                  />
                  <input
                    type="password" placeholder="SENHA" required
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: '#fff', fontSize: '0.85rem', outline: 'none', borderRadius: '4px' }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={loginLoading} style={{ width: '100%', padding: '1rem' }}>
                    {loginLoading ? 'CONECTANDO...' : 'CONECTAR'}
                  </button>
                </form>

                <button onClick={() => { setIsLoginOpen(false); setLoginError('') }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-mute)', fontSize: '0.7rem', cursor: 'pointer', letterSpacing: '2px' }}>
                  CANCELAR
                </button>
              </div>
            </div>
          )}

          {/* PAINEL DO JOGADOR (após login) */}
          {playerData && (
            <PlayerPanel
              data={playerData}
              onLogout={() => { window.location.href = '/api/player/logout' }}
            />
          )}

          {/* PAINEL ADMIN (após OAuth Google) */}
          {adminUser && (
            <AdminPanel
              user={adminUser}
              onLogout={() => { window.location.href = '/api/auth/logout' }}
            />
          )}

          {/* VOTAÇÃO L2JBrasil */}
          <div style={{
            position: 'fixed', bottom: '1.5rem', left: '1.5rem',
            zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          }}>
            <span style={{
              background: 'rgba(197,160,89,0.15)', border: '1px solid rgba(197,160,89,0.4)',
              color: 'var(--gold)', fontSize: '0.55rem', fontWeight: '700',
              letterSpacing: '2px', padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap',
            }}>
              🏆 Vote e Ganhe Recompensas
            </span>
            <a href="https://top.l2jbrasil.com/index.php?a=in&u=ikaruslineagell" target="_blank" rel="noopener noreferrer"
              style={{ width: '200px', display: 'block', opacity: 0.9, transition: 'opacity 0.2s, transform 0.2s', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <img src="https://top.l2jbrasil.com/button_l.php?u=ikaruslineagell&m=left" alt="Top L2JBrasil" referrerPolicy="no-referrer" style={{ width: '100%', display: 'block', borderRadius: '6px' }} />
            </a>
          </div>
        </>
      )}
    </main>
  )
}

export default App
