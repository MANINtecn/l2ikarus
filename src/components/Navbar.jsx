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
      height: scrolled ? '70px' : '100px', // Aumentado um pouco a altura inicial
      zIndex: 1000,
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      background: scrolled ? 'rgba(5, 5, 8, 0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(197, 160, 89, 0.4)' : '1px solid transparent',
      display: 'flex',
      alignItems: 'center',
      overflow: 'visible' // Garante que a logo possa sair do header
    }}>
      <div className="container-wide" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4rem', // Um pouco mais de padding nas laterais
        width: '100%',
        position: 'relative'
      }}>
        {/* LOGO AREA - COM EFEITO DE CRESCIMENTO E OVERFLOW */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div style={{
             position: 'relative',
             zIndex: 10,
             transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' // Efeito elástico suave
          }}>
            <img 
              src="/assets/images/logo.png" 
              alt="L2 Ikarus Logo" 
              style={{ 
                height: scrolled ? '85px' : '70px', // CRESCER AO DAR SCROLL!
                position: 'absolute',
                top: scrolled ? '-42px' : '-35px', // Centraliza verticalmente na transição
                left: 0,
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                mixBlendMode: 'screen',
                filter: scrolled ? 'brightness(1.2) contrast(1.2)' : 'brightness(1.1) contrast(1.1)',
                cursor: 'pointer',
                transform: scrolled ? 'scale(1.15) translateY(10px)' : 'scale(1) translateY(0)'
              }} 
              onClick={() => window.location.href = '#hero'}
            />
          </div>
          
          <h1 className="cinzel" style={{ 
            fontSize: '1.4rem', 
            color: 'var(--gold)', 
            margin: '0 0 0 90px', // Espaço maior para a logo que cresce
            letterSpacing: '4px',
            textShadow: '0 0 20px rgba(197,160,89,0.4)',
            transition: 'opacity 0.4s, transform 0.4s',
            opacity: scrolled ? 0.3 : 1, // Suaviza o texto para dar foco na logo épica
            transform: scrolled ? 'translateX(10px)' : 'translateX(0)',
            pointerEvents: 'none'
          }}>
            L2 IKARUS
          </h1>
        </div>

        {/* HUD NAVIGATION */}
        <nav style={{ 
          display: 'flex', 
          gap: scrolled ? '1.5rem' : '2.5rem', 
          alignItems: 'center',
          background: 'rgba(255,255,255,0.03)',
          padding: scrolled ? '0.6rem 2rem' : '0.8rem 3rem',
          borderRadius: '50px',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.4s',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none'
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
                transition: '0.3s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--gold)'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA AREA */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
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
          <a href="#download" className="btn btn-primary" style={{ 
            padding: scrolled ? '0.6rem 2rem' : '0.8rem 2.8rem', 
            fontSize: '0.8rem',
            clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
            boxShadow: '0 0 20px rgba(197,160,89,0.2)'
          }}>
            JOGAR AGORA
          </a>
        </div>
      </div>
    </header>
  )
}
