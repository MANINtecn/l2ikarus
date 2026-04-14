export default function Footer({ onAdminClick }) {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      background: 'rgba(5, 5, 8, 0.95)',
      padding: '4rem 2rem 2rem',
      position: 'relative',
      borderTop: '1px solid rgba(197, 160, 89, 0.1)',
      zIndex: 10
    }}>
      <div className="container-wide" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        {/* LOGO SIMPLIFIED */}
        <div style={{ textAlign: 'center' }}>
          <h2 className="cinzel" style={{ 
            fontSize: '1.5rem', 
            color: 'var(--gold)', 
            letterSpacing: '8px',
            margin: 0
          }}>IKARUS</h2>
          <p style={{ 
            fontSize: '0.6rem', 
            letterSpacing: '4px', 
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            marginTop: '0.5rem'
          }}>Legendary Dragon Realm</p>
        </div>

        {/* HUD DIVIDER */}
        <div style={{ 
          width: '100%', 
          maxWidth: '800px', 
          height: '1px', 
          background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.2), transparent)' 
        }} />

        {/* BOTTOM CONTENT */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%', 
          maxWidth: '1200px',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ color: 'var(--text-mute)', fontSize: '0.7rem', letterSpacing: '1px' }}>
            © {year} L2 IKARUS • TODOS OS DIREITOS RESERVADOS
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#" style={{ color: 'var(--text-mute)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Termos de Uso</a>
            <a href="#" style={{ color: 'var(--text-mute)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Privacidade</a>
            <a 
              href="https://discord.gg/EnZJPcXZ5e" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center' }}
              title="Join our Discord"
            >
              <svg viewBox="0 0 127.14 96.36" style={{ width: '18px', height: '18px' }} xmlns="http://www.w3.org/2000/svg">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.06,72.06,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.48,80.21h0A105.73,105.73,0,0,0,32.47,96.36,77.7,77.7,0,0,0,39,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.58,11.1,105.26,105.26,0,0,0,32-16.15h0C129.58,50.8,124.09,24.2,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5.12-12.67,11.41-12.67S54,46,53.86,53,48.74,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.12-12.67,11.41-12.67S96.08,46,95.94,53,90.82,65.69,84.69,65.69Z" fill="currentColor"/>
              </svg>
            </a>
          </div>

          <div 
            onClick={onAdminClick}
            style={{ 
              color: 'rgba(197,160,89,0.3)', 
              fontSize: '0.6rem', 
              cursor: 'pointer',
              fontWeight: '700',
              letterSpacing: '2px'
            }}
          >
            TECX SOFTHOUSE
          </div>
        </div>
      </div>
    </footer>
  )
}
