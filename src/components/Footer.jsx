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
          
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ color: 'var(--text-mute)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Termos de Uso</a>
            <a href="#" style={{ color: 'var(--text-mute)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Privacidade</a>
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
