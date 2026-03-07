import { useEffect, useRef, useState } from 'react'

export default function Navbar({ onRegisterClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Início',    href: '#hero' },
    { label: 'Rates',     href: '#rates' },
    { label: 'Features',  href: '#features' },
    { label: 'Download',  href: '#download' },
  ]

  return (
    <header ref={navRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      transition: 'all 0.4s ease',
      background: 'rgba(5, 5, 10, 0.98)', // Fundo escuro sólido para melhor visibilidade
      backdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid rgba(197, 160, 89, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
      padding: scrolled ? '0.5rem 2rem' : '1rem 2rem',
      height: '80px', // Altura fixa para o menu
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 1400, // Aumentando um pouco o limite para caber os dois logos
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* LOGO — texto */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2.5rem', 
          lineHeight: 1,
          flex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            {/* OPCÃO 1 (Section 8) */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', color: '#c5a059', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>Opção 1</span>
              <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                <img 
                  src="/assets/Section 8.png" 
                  alt="Logo Opção 1" 
                  style={{
                    height: scrolled ? '160px' : '95px',
                    width: 'auto',
                    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: scrolled ? 'translateY(35px) scale(1.1)' : 'translateY(0)',
                    filter: 'drop-shadow(0 0 15px rgba(197, 160, 89, 0.3))',
                    zIndex: 2000,
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>

            {/* OPCÃO 2 (Section 9) - Favorita com detalhes brancos */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', color: '#fff', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>Opção 2</span>
              <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                <img 
                  src="/assets/Section 9.png" 
                  alt="Logo Opção 2" 
                  style={{
                    height: scrolled ? '160px' : '95px',
                    width: 'auto',
                    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: scrolled ? 'translateY(35px) scale(1.1)' : 'translateY(0)',
                    filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.15))',
                    zIndex: 2000,
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* NAV DESKTOP */}
        <nav style={{ display: 'flex', gap: '2rem' }} className="nav-desktop">
          {links.map(l => (
            <a key={l.href} href={l.href} style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'rgba(224,230,237,0.8)',
              transition: 'color 0.3s ease',
              position: 'relative',
            }}
            onMouseEnter={e => e.target.style.color = '#c5a059'}
            onMouseLeave={e => e.target.style.color = 'rgba(224,230,237,0.8)'}
            >{l.label}</a>
          ))}
          <button 
            onClick={onRegisterClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#c5a059',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => e.target.style.textShadow = '0 0 10px rgba(197, 160, 89, 0.5)'}
            onMouseLeave={e => e.target.style.textShadow = 'none'}
          >
            CADASTRO
          </button>
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="#download" className="btn-primary" style={{ fontSize: '0.7rem', padding: '0.6rem 1.5rem' }}>
            ▶ PLAY NOW
          </a>

          {/* HAMBURGER */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
            className="hamburger-btn"
          >
            <div style={{ width: 24, height: 2, background: '#c5a059', margin: '5px 0', transition: '0.3s' }} />
            <div style={{ width: 24, height: 2, background: '#c5a059', margin: '5px 0', transition: '0.3s' }} />
            <div style={{ width: 24, height: 2, background: '#c5a059', margin: '5px 0', transition: '0.3s' }} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <nav style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          background: 'rgba(5,5,10,0.97)',
          borderTop: '1px solid rgba(197,160,89,0.15)',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: '0.9rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#c5a059',
              }}
            >{l.label}</a>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              onRegisterClick();
            }}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: '0.9rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#fff',
            }}
          >
            CADASTRO
          </button>
        </nav>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </header>
  )
}
