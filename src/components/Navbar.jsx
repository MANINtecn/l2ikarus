import { useEffect, useState } from 'react'

export default function Navbar({ onRegisterClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'INÍCIO',    href: '#hero' },
    { label: 'TARIFAS',     href: '#rates' },
    { label: 'CARACTERÍSTICAS',  href: '#features' },
    { label: 'DOAR',    href: '#donate' },
    { label: 'DOWNLOAD',  href: '#download' },
  ]

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%',
      height: scrolled ? '70px' : '90px',
      zIndex: 1000,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      background: scrolled || menuOpen ? 'rgba(5, 5, 8, 0.95)' : 'transparent',
      backdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
      borderBottom: scrolled || menuOpen ? '1px solid rgba(197, 160, 89, 0.3)' : '1px solid transparent',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        position: 'relative'
      }}>
        {/* LOGO AREA */}
        <div style={{ display: 'flex', alignItems: 'center', zIndex: 1100 }}>
          <img 
            src="/assets/images/logo.png" 
            alt="L2 Ikarus Logo" 
            style={{ 
              height: scrolled ? '65px' : '75px',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              mixBlendMode: 'screen',
              filter: 'brightness(1.1) contrast(1.1)',
              cursor: 'pointer',
              transform: scrolled ? 'scale(1)' : 'scale(1.1)'
            }} 
            onClick={() => window.location.href = '#hero'}
          />
          
          <h1 className="cinzel hide-mobile" style={{ 
            fontSize: '1.2rem', 
            color: 'var(--gold)', 
            marginLeft: '15px',
            letterSpacing: '4px',
            textShadow: '0 0 20px rgba(197,160,89,0.4)',
            opacity: scrolled ? 0.5 : 1,
            transition: 'opacity 0.4s'
          }}>
            L2 IKARUS
          </h1>
        </div>

        {/* DESKTOP HUD NAVIGATION */}
        <nav className="hide-mobile" style={{ 
          display: 'flex', 
          gap: '2rem', 
          alignItems: 'center',
          background: 'rgba(255,255,255,0.03)',
          padding: '0.6rem 2.5rem',
          borderRadius: '50px',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.4s'
        }}>
          {links.map(l => (
            <a 
              key={l.href} 
              href={l.href} 
              style={{
                fontSize: '0.65rem',
                fontWeight: '800',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
                transition: '0.3s',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--gold)'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA AREA */}
        <div className="hide-mobile" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', alignItems: 'center' }}>
          <button 
            onClick={onRegisterClick}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'rgba(255,255,255,0.6)', 
              fontSize: '0.7rem', 
              fontWeight: '700', 
              letterSpacing: '2px',
              cursor: 'pointer',
              transition: '0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
          >
            CADASTRO
          </button>
          <a href="#download" className="btn btn-primary" style={{ padding: '0.7rem 1.8rem' }}>
            JOGAR AGORA
          </a>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className="show-mobile"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gold)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 2000,
            padding: '1rem'
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* MOBILE MENU OVERLAY */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'rgba(5, 5, 8, 0.98)',
          display: menuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          zIndex: 1500,
          transition: 'all 0.4s ease',
          opacity: menuOpen ? 1 : 0
        }}>
          {links.map(l => (
            <a 
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="cinzel"
              style={{
                fontSize: '1.5rem',
                color: '#fff',
                textDecoration: 'none',
                letterSpacing: '4px'
              }}
            >
              {l.label}
            </a>
          ))}
          <button 
            onClick={() => {
              setMenuOpen(false);
              onRegisterClick();
            }}
            className="btn btn-primary"
            style={{ marginTop: '2rem', width: '200px' }}
          >
            INICIAR AGORA
          </button>
        </div>
      </div>
    </header>
  )
}
