import { useEffect, useState } from 'react'

const DiscordIcon = () => (
  <svg viewBox="0 0 127.14 96.36" style={{ width: '20px', height: '20px' }} xmlns="http://www.w3.org/2000/svg">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.06,72.06,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.48,80.21h0A105.73,105.73,0,0,0,32.47,96.36,77.7,77.7,0,0,0,39,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.58,11.1,105.26,105.26,0,0,0,32-16.15h0C129.58,50.8,124.09,24.2,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5.12-12.67,11.41-12.67S54,46,53.86,53,48.74,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.12-12.67,11.41-12.67S96.08,46,95.94,53,90.82,65.69,84.69,65.69Z" fill="currentColor"/>
  </svg>
)

export default function Navbar({ onRegisterClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  const links = [
    { label: 'INÍCIO',    href: '#hero' },
    { label: 'TARIFAS',     href: '#rates' },
    { label: 'CARACTERÍSTICAS',  href: '#features' },
    { label: 'DOAR',    href: '#donate' },
    { label: 'DOWNLOAD',  href: '#download' },
  ]

  const discordInvite = "https://discord.gg/EnZJPcXZ5e"

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
          <a 
            href={discordInvite}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              transition: '0.3s',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              background: 'rgba(88, 101, 242, 0.1)',
              border: '1px solid rgba(88, 101, 242, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(88, 101, 242, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              e.currentTarget.style.background = 'rgba(88, 101, 242, 0.1)';
            }}
          >
            <DiscordIcon />
            {onlineCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3ba55c', boxShadow: '0 0 10px #3ba55c' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: '800' }}>{onlineCount}</span>
              </div>
            )}
          </a>

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
        <div className="show-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
          
          <a 
            href={discordInvite}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '1.2rem',
              marginTop: '1rem',
              background: 'rgba(88, 101, 242, 0.2)',
              padding: '1rem 2rem',
              borderRadius: '12px',
              border: '1px solid rgba(88, 101, 242, 0.4)'
            }}
          >
            <DiscordIcon />
            <span>DISCORD {onlineCount > 0 && `(${onlineCount} ONLINE)`}</span>
          </a>

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
