import { useEffect, useState } from 'react'

export default function Navbar({ onRegisterClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    const handleResize = () => {
      if (window.innerWidth > 992) setMenuOpen(false)
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Lock scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  const links = [
    { label: 'Início',    href: '#hero' },
    { label: 'Rates',     href: '#rates' },
    { label: 'Features',  href: '#features' },
    { label: 'Roadmap',   href: '#roadmap' },
    { label: 'Donate',    href: '#donate' },
    { label: 'Download',  href: '#download' },
  ]

  return (
    <header className={`nav-header ${scrolled ? 'scrolled' : ''}`} style={{
      background: scrolled ? (window.innerWidth > 992 ? 'transparent' : 'rgba(5, 5, 10, 0.92)') : 'transparent',
      backdropFilter: scrolled ? (window.innerWidth > 992 ? 'none' : 'blur(20px)') : 'none',
      height: scrolled ? '70px' : '90px',
      borderBottom: scrolled ? (window.innerWidth > 992 ? 'none' : '1px solid rgba(197, 160, 89, 0.2)') : '1px solid transparent',
    }}>
      <div className="container-wide" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem'
      }}>
        {/* LADO ESQUERDO (EQUILIBRAR) */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          {/* Logo could go here if requested, currently empty to center menu */}
        </div>

        {/* NAV DESKTOP */}
        <nav className="nav-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {links.map(l => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
          <button onClick={onRegisterClick} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            CADASTRO
          </button>
        </nav>

        {/* CTA DIREITO */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#download" className="btn btn-primary btn-glow" style={{ fontSize: '0.75rem', padding: '0.6rem 1.5rem' }}>
            ▶ PLAY NOW
          </a>

          {/* HAMBURGER */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger-btn"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              zIndex: 2100,
              display: 'none'
            }}
          >
            <div style={{ width: 26, height: 2, background: '#c5a059', margin: '6px 0', transition: '0.3s', transform: menuOpen ? 'rotate(45deg) translate(6px, 6px)' : '' }} />
            <div style={{ width: 26, height: 2, background: '#c5a059', margin: '6px 0', transition: '0.3s', opacity: menuOpen ? 0 : 1 }} />
            <div style={{ width: 26, height: 2, background: '#c5a059', margin: '6px 0', transition: '0.3s', transform: menuOpen ? 'rotate(-45deg) translate(6px, -6px)' : '' }} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-overlay">
          {links.map(l => (
            <a key={l.href} href={l.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          <button
            className="mobile-nav-link"
            style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => {
              setMenuOpen(false);
              onRegisterClick();
            }}
          >
            CADASTRO
          </button>
          
          <div style={{ marginTop: 'auto', padding: '2rem 1rem', textAlign: 'center' }}>
             <a href="#download" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setMenuOpen(false)}>
                ▶ COMEÇAR AGORA
             </a>
          </div>
        </div>
      )}
    </header>
  )
}
