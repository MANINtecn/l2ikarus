import { useState } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatusSection from './components/StatusSection'
import RatesSection from './components/RatesSection'
import FeaturesSection from './components/FeaturesSection'
import RoadmapSection from './components/RoadmapSection'
import DonateSection from './components/DonateSection'
import DownloadSection from './components/DownloadSection'
import Footer from './components/Footer'
import RegisterModal from './components/RegisterModal'

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('l2i-admin') === 'true')
  const [showLogin, setShowLogin] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginForm.email === 'admin@l2ikarus.com' && loginForm.password === 'tatyyzk3') {
      setIsAdmin(true)
      localStorage.setItem('l2i-admin', 'true')
      setShowLogin(false)
      setError('')
    } else {
      setError('Credenciais inválidas.')
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('l2i-admin')
  }

  const handleReset = () => {
    if (window.confirm('Deseja realmente restaurar as posições originais de todo o site?')) {
      window.dispatchEvent(new CustomEvent('reset-layout'))
    }
  }

  return (
    <main>
      {/* ADMIN TOOLBAR */}
      {isAdmin && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '40px',
          background: 'rgba(197, 160, 89, 0.95)', color: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2rem', zIndex: 10000, fontWeight: 700, fontSize: '0.8rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          <div>PAINEL DO DESENVOLVEDOR (MODO EDIÇÃO ATIVO)</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleReset} style={{ background: '#000', color: '#fff', border: 'none', padding: '4px 12px', cursor: 'pointer', borderRadius: '4px' }}>RESTAURAR TUDO</button>
            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #000', padding: '4px 12px', cursor: 'pointer', borderRadius: '4px' }}>SAIR</button>
          </div>
        </div>
      )}

      <Navbar isAdmin={isAdmin} onRegisterClick={() => setIsRegisterOpen(true)} />
      <HeroSection isAdmin={isAdmin} onRegisterClick={() => setIsRegisterOpen(true)} />
      <StatusSection isAdmin={isAdmin} />
      
      <div className="section-divider" />
      <RatesSection />
      
      <div className="section-divider" />
      <FeaturesSection />
      
      <div className="section-divider" />
      <RoadmapSection />
      
      <div className="section-divider" />
      <DonateSection />
      
      <div className="section-divider" />
      <DownloadSection />
      
      <Footer onAdminClick={() => setShowLogin(true)} />
      
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 11000,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <form onSubmit={handleLogin} style={{
            background: '#111', border: '1px solid var(--gold)', padding: '2.5rem',
            width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.2rem'
          }}>
            <h2 style={{ color: 'var(--gold)', textAlign: 'center', marginBottom: '1rem', fontFamily: 'Cinzel' }}>ADMIN LOGIN</h2>
            {error && <div style={{ color: '#ff4444', fontSize: '0.8rem', textAlign: 'center' }}>{error}</div>}
            <input 
              type="email" placeholder="Email" required
              value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})}
              style={{ background: '#000', border: '1px solid #333', color: '#fff', padding: '12px' }}
            />
            <input 
              type="password" placeholder="Senha" required
              value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})}
              style={{ background: '#000', border: '1px solid #333', color: '#fff', padding: '12px' }}
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>ENTRAR NO MODO BUILDER</button>
            <button type="button" onClick={() => setShowLogin(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.75rem' }}>CANCELAR</button>
          </form>
        </div>
      )}
    </main>
  )
}

export default App
