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
      background: scrolled
        ? 'rgba(5, 5, 10, 0.92)'
        : 'linear-gradient(to bottom, rgba(5,5,10,0.85) 0%, transparent 100%)',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(197, 160, 89, 0.12)' : 'none',
      padding: scrolled ? '0.7rem 2rem' : '1.2rem 2rem',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* LOGO — texto */}
        <a href="#hero" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 900,
            fontSize: '1.35rem',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            background: 'linear-gradient(90deg, #c5a059, #f0d080, #c5a059)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 3s linear infinite',
          }}>IKARUS</span>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 300,
            fontSize: '0.6rem',
            letterSpacing: '5px',
            color: 'rgba(0, 210, 255, 0.8)',
            textTransform: 'uppercase',
          }}>ARISE</span>
        </a>

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
