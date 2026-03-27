import { useState, useEffect } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatusSection from './components/StatusSection'
import FeaturesSection from './components/FeaturesSection'
import RoadmapSection from './components/RoadmapSection'
import DonateSection from './components/DonateSection'
import DownloadSection from './components/DownloadSection'
import Footer from './components/Footer'
import RegisterModal from './components/RegisterModal'
import DraggableItem from './components/DraggableItem'

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('l2i-admin') === 'true')
  const [showLogin, setShowLogin] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  // GLOBAL BUILDER STATE
  const [dynamicItems, setDynamicItems] = useState(() => {
    try {
      const saved = localStorage.getItem('global-dynamic-items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading dynamic items:', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('global-dynamic-items', JSON.stringify(dynamicItems));
  }, [dynamicItems]);

  const addTextItem = () => {
    const newItem = {
      id: `text-${Date.now()}`,
      type: 'text',
      pos: { x: window.innerWidth / 2 - 100, y: window.scrollY + 200 },
      text: 'Novo Texto Editável',
      style: { fontSize: '24px', fontFamily: "'Cinzel', serif", color: 'var(--gold)' }
    };
    setDynamicItems([...dynamicItems, newItem]);
  };

  const handleDuplicate = (id) => {
    const original = dynamicItems.find(item => item.id === id);
    const newItem = {
      ...original,
      id: `copy-${Date.now()}`,
      pos: { x: (original?.pos?.x || 0) + 20, y: (original?.pos?.y || 0) + 20 },
    };
    
    // If it's a template from a section, we need to get its current state from localstorage
    if (!original) {
      const savedText = localStorage.getItem(`text-${id}`) || '';
      const savedStyle = JSON.parse(localStorage.getItem(`style-${id}`) || '{"fontSize":"inherit","fontFamily":"inherit"}');
      const copy = {
        id: `copy-${Date.now()}`,
        type: 'text',
        pos: { x: window.innerWidth / 2, y: window.scrollY + 100 },
        text: savedText,
        style: savedStyle
      };
      setDynamicItems([...dynamicItems, copy]);
      return;
    }

    setDynamicItems([...dynamicItems, newItem]);
  };

  const handleDelete = (id) => {
    setDynamicItems(dynamicItems.filter(item => item.id !== id));
    localStorage.removeItem(`pos-${id}`);
    localStorage.removeItem(`size-${id}`);
    localStorage.removeItem(`style-${id}`);
    localStorage.removeItem(`text-${id}`);
  };

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
    if (window.confirm('Deseja realmente restaurar as posições originais e REMOVER todos os elementos novos criados?')) {
      setDynamicItems([]);
      localStorage.removeItem('global-dynamic-items');
      window.dispatchEvent(new CustomEvent('reset-layout'))
    }
  }

  return (
    <main style={{ position: 'relative' }}>
      {/* ADMIN TOOLBAR */}
      {isAdmin && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '50px',
          background: 'rgba(197, 160, 89, 0.98)', color: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2rem', zIndex: 10000, fontWeight: 700, fontSize: '0.85rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.6)', borderBottom: '2px solid #000'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>BUILDER IKARUS ATIVO</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={addTextItem} style={{ background: '#000', color: 'var(--gold)', border: 'none', padding: '6px 15px', cursor: 'pointer', borderRadius: '4px', fontSize: '0.75rem' }}>+ ADICIONAR TEXTO</button>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleReset} style={{ background: '#000', color: '#fff', border: 'none', padding: '6px 15px', cursor: 'pointer', borderRadius: '4px' }}>RESTAURAR TUDO</button>
            <button onClick={handleLogout} style={{ background: 'transparent', border: '2px solid #000', padding: '5px 15px', cursor: 'pointer', borderRadius: '4px' }}>SAIR</button>
          </div>
        </div>
      )}

      <Navbar isAdmin={isAdmin} onRegisterClick={() => setIsRegisterOpen(true)} />
      
      {/* Sections with Admin Props */}
      <HeroSection 
        isAdmin={isAdmin} 
        onRegisterClick={() => setIsRegisterOpen(true)} 
        onDuplicate={handleDuplicate}
      />
      
      <StatusSection 
        isAdmin={isAdmin} 
        onDuplicate={handleDuplicate}
      />
      
      <div className="section-divider" />
      <FeaturesSection 
        isAdmin={isAdmin} 
        onDuplicate={handleDuplicate}
      />
      
      <div className="section-divider" />
      <RoadmapSection 
        isAdmin={isAdmin} 
        onDuplicate={handleDuplicate}
      />
      
      <div className="section-divider" />
      <DonateSection 
        isAdmin={isAdmin} 
        onDuplicate={handleDuplicate}
      />
      
      <div className="section-divider" />
      <DownloadSection 
        isAdmin={isAdmin} 
        onDuplicate={handleDuplicate}
      />
      
      <Footer onAdminClick={() => setShowLogin(true)} isAdmin={isAdmin} />
      
      {/* GLOBAL DYNAMIC ITEMS LAYER */}
      {dynamicItems.map(item => (
        <DraggableItem
          key={item.id}
          id={item.id}
          isAdmin={isAdmin}
          initialPos={item.pos}
          initialText={item.text}
          initialStyle={item.style}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      ))}

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
