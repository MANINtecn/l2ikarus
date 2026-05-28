import { useEffect, useState } from 'react'

const DiscordIcon = () => (
  <svg viewBox="0 0 127.14 96.36" style={{ width: '18px', height: '18px' }} xmlns="http://www.w3.org/2000/svg">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.06,72.06,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.48,80.21h0A105.73,105.73,0,0,0,32.47,96.36,77.7,77.7,0,0,0,39,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.58,11.1,105.26,105.26,0,0,0,32-16.15h0C129.58,50.8,124.09,24.2,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5.12-12.67,11.41-12.67S54,46,53.86,53,48.74,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.12-12.67,11.41-12.67S96.08,46,95.94,53,90.82,65.69,84.69,65.69Z" fill="currentColor"/>
  </svg>
)

export default function Navbar({ onRegisterClick, onLoginClick, topOffset = 0 }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    const handleResize = () => setIsMobile(window.innerWidth <= 1024)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const links = [
    { label: 'INÍCIO',    href: '#hero' },
    { label: 'TARIFAS',   href: '#rates' },
    { label: 'RECURSOS',  href: '#features' },
    { label: 'DOAR',      href: '#donate' },
    { label: 'DOWNLOAD',  href: '#download' },
  ]

  const discordInvite = "https://discord.gg/KF5AzGT7Y9"

  const navLinkStyle = {
    fontSize: '0.65rem',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.65)',
    transition: 'color 0.25s',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  return (
    <header style={{
      position: 'fixed',
      top: topOffset, left: 0,
      width: '100%',
      height: scrolled ? '64px' : '80px',
      zIndex: 1000,
      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      background: scrolled || menuOpen
        ? 'rgba(4, 4, 8, 0.92)'
        : 'linear-gradient(to bottom, rgba(4,4,8,0.7) 0%, transparent 100%)',
      backdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
      borderBottom: scrolled || menuOpen ? '1px solid rgba(197, 160, 89, 0.2)' : '1px solid transparent',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: '2rem',
      }}>

        {/* LEFT: nav links desktop */}
        {!isMobile ? (
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                style={navLinkStyle}
                onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
              >
                {l.label}
              </a>
            ))}
          </nav>
        ) : (
          <div />
        )}

        {/* RIGHT: CTAs desktop */}
        {!isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexShrink: 0 }}>
            <a
              href={discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                fontSize: '0.65rem',
                fontWeight: '700',
                letterSpacing: '1.5px',
                transition: 'color 0.25s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
            >
              <DiscordIcon />
              DISCORD
            </a>

            <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.1)' }} />

            <button
              onClick={onLoginClick}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.65rem', fontWeight: '700', letterSpacing: '2px',
                cursor: 'pointer', transition: 'color 0.25s', textTransform: 'uppercase',
              }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
            >
              LOGIN
            </button>

            <a href="#download" className="btn btn-primary" style={{ padding: '0.55rem 1.4rem', fontSize: '0.63rem', letterSpacing: '1.5px' }}>
              JOGAR AGORA
            </a>
          </div>
        ) : (
          /* Mobile hamburger */
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none',
              color: 'var(--gold)', fontSize: '1.4rem',
              cursor: 'pointer', padding: '0.5rem', zIndex: 2000,
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        )}

        {/* Mobile menu overlay */}
        {isMobile && (
          <div style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100vh',
            background: 'rgba(4, 4, 8, 0.98)',
            display: menuOpen ? 'flex' : 'none',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '2rem', zIndex: 1500,
          }}>
            <img src="/assets/images/logo_white.png" alt="L2 Ikarus" style={{ height: '80px', width: 'auto', marginBottom: '1rem', filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.5))' }} />

            {links.map(l => (
              <a
                key={l.href} href={l.href}
                onClick={() => setMenuOpen(false)}
                className="cinzel"
                style={{ fontSize: '1.3rem', color: '#fff', textDecoration: 'none', letterSpacing: '4px' }}
              >
                {l.label}
              </a>
            ))}

            <a href={discordInvite} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                color: '#fff', textDecoration: 'none', fontSize: '1rem',
                marginTop: '1rem', background: 'rgba(88,101,242,0.2)',
                padding: '0.9rem 2rem', borderRadius: '10px',
                border: '1px solid rgba(88,101,242,0.4)',
              }}
            >
              <DiscordIcon /> DISCORD
            </a>

            <button onClick={() => { setMenuOpen(false); onLoginClick() }}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.1rem', fontWeight: '700', letterSpacing: '4px', cursor: 'pointer' }}
            >
              LOGIN
            </button>

            <button onClick={() => { setMenuOpen(false); onRegisterClick() }} className="btn btn-primary" style={{ width: '200px' }}>
              CADASTRO
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
