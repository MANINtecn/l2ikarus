import { useEffect, useState } from 'react'

const DiscordIcon = () => (
  <svg viewBox="0 0 127.14 96.36" style={{ width: '20px', height: '20px' }} xmlns="http://www.w3.org/2000/svg">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.06,72.06,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.48,80.21h0A105.73,105.73,0,0,0,32.47,96.36,77.7,77.7,0,0,0,39,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.58,11.1,105.26,105.26,0,0,0,32-16.15h0C129.58,50.8,124.09,24.2,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5.12-12.67,11.41-12.67S54,46,53.86,53,48.74,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.12-12.67,11.41-12.67S96.08,46,95.94,53,90.82,65.69,84.69,65.69Z" fill="currentColor"/>
  </svg>
)

export default function Navbar({ onRegisterClick, onLoginClick, topOffset = 0 }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)
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

  useEffect(() => {
    const fetchDiscordStatus = async () => {
      try {
        const res = await fetch('/api/discord')
        const data = await res.json()
        setOnlineCount(data.presence_count || 0)
      } catch (e) {
        console.error('Failed to fetch Discord status')
      }
    }
    fetchDiscordStatus()
    const interval = setInterval(fetchDiscordStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const leftLinks = [
    { label: 'INÍCIO',    href: '#hero' },
    { label: 'TARIFAS',   href: '#rates' },
    { label: 'RECURSOS',  href: '#features' },
  ]

  const rightLinks = [
    { label: 'DOAR',     href: '#donate' },
    { label: 'DOWNLOAD', href: '#download' },
  ]

  const links = [...leftLinks, ...rightLinks]
  const discordInvite = "https://discord.gg/EnZJPcXZ5e"

  const navLinkStyle = {
    fontSize: '0.65rem',
    fontWeight: '800',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.7)',
    transition: '0.3s',
    textDecoration: 'none'
  }

  return (
    <header style={{
      position: 'fixed',
      top: topOffset, left: 0,
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
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr auto 1fr' : '1fr auto 1fr',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        gap: '2rem'
      }}>

        {/* LEFT: nav links (desktop) or hamburger (mobile) */}
        {isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
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
          </div>
        ) : (
          <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', justifyContent: 'flex-start' }}>
            {leftLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                style={navLinkStyle}
                onMouseEnter={(e) => e.target.style.color = 'var(--gold)'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        {/* CENTER: Logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: scrolled ? '100px' : '130px',
            transition: 'all 0.5s cubic-bezier(0.2, 1, 0.3, 1)',
          }}>
            <img
              src="/assets/images/logo_white.png"
              alt="L2 Ikarus Logo"
              style={{
                height: '100%',
                width: 'auto',
                filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.4))',
                cursor: 'pointer',
              }}
              onClick={() => window.location.href = '#hero'}
            />
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%', height: '120%',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
              zIndex: -1,
              animation: 'logoPulse 4s infinite ease-in-out'
            }} />
          </div>
        </div>

        {/* RIGHT: links + CTA (desktop) or empty (mobile, menu is on left) */}
        {isMobile ? (
          <div />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2.5rem', alignItems: 'center' }}>
            <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
              {rightLinks.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.target.style.color = 'var(--gold)'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem' }}>
              <button
                onClick={onLoginClick}
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
                LOGIN
              </button>

              <a href="#download" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.65rem' }}>
                JOGAR AGORA
              </a>
            </div>
          </div>
        )}

        {/* MOBILE MENU OVERLAY */}
        {isMobile && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100%',
            height: '100vh',
            background: 'rgba(5, 5, 8, 0.98)',
            display: menuOpen ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            zIndex: 1500,
          }}>
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="cinzel"
                style={{ fontSize: '1.5rem', color: '#fff', textDecoration: 'none', letterSpacing: '4px' }}
              >
                {l.label}
              </a>
            ))}

            <a
              href={discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                color: '#fff', textDecoration: 'none', fontSize: '1.2rem',
                marginTop: '1rem',
                background: 'rgba(88, 101, 242, 0.2)',
                padding: '1rem 2rem', borderRadius: '12px',
                border: '1px solid rgba(88, 101, 242, 0.4)'
              }}
            >
              <DiscordIcon />
              <span>DISCORD {onlineCount > 0 && `(${onlineCount} ONLINE)`}</span>
            </a>

            <button
              onClick={() => { setMenuOpen(false); onLoginClick(); }}
              style={{
                background: 'none', border: 'none', color: '#fff',
                fontSize: '1.2rem', fontWeight: '700', letterSpacing: '4px',
                cursor: 'pointer', marginTop: '1rem'
              }}
            >
              LOGIN
            </button>

            <button
              onClick={() => { setMenuOpen(false); onRegisterClick(); }}
              className="btn btn-primary"
              style={{ marginTop: '1rem', width: '200px' }}
            >
              CADASTRO
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
