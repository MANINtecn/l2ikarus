import DraggableItem from "./DraggableItem"

export default function Footer({ onAdminClick, isAdmin, onDuplicate }) {
  const year = new Date().getFullYear()

  const socialLinks = [
    {
      label: 'Discord',
      href: 'https://discord.gg/ikarusdungeons',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 19" fill="currentColor">
          <path d="M20.317 1.6a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.6a.07.07 0 0 0-.032.027C.533 6.147-.32 10.555.099 14.907a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: '#',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: '#',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
  ]

  const navLinks = [
    { label: 'Início', href: '#hero' },
    { label: 'Rates', href: '#rates' },
    { label: 'Features', href: '#features' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: 'Donate', href: '#donate' },
    { label: 'Download', href: '#download' },
  ]

  return (
    <footer style={{
      background: '#020204',
      borderTop: '1px solid rgba(197,160,89,0.12)',
      padding: '4rem 2rem 2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* TOP LINE ORNAMENT */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
        opacity: 0.4,
      }} />

      {/* BG GRID */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(197,160,89,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.02) 1px, transparent 1px)`,
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative' }}>
        {/* MAIN FOOTER CONTENT */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem', marginBottom: '3rem',
        }}>
          {/* BRAND */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: '1.8rem',
                letterSpacing: '6px', background: 'linear-gradient(90deg, #c5a059, #f0d080, #c5a059)',
                backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s linear infinite',
              }}>IKARUS</div>
              <div style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 300, fontSize: '0.65rem',
                letterSpacing: '5px', color: 'rgba(0, 210, 255, 0.7)', textTransform: 'uppercase',
              }}>ARISE</div>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 220 }}>
              Ascenda das trevas. Torne-se lenda.<br />Lineage 2 × Solo Leveling.
            </p>
          </div>

          {/* NAV */}
          <div>
            <h5 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', letterSpacing: '4px', color: 'var(--gold)', marginBottom: '1.2rem', textTransform: 'uppercase' }}>Navegação</h5>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {navLinks.map(l => (
                <li key={l.href}>
                  <a href={l.href} style={{ color: 'var(--muted)', fontSize: '0.875rem', letterSpacing: '1px', transition: 'color 0.25s ease' }}
                  onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = ''}
                  >{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* COMMUNITY */}
          <div>
            <h5 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', letterSpacing: '4px', color: 'var(--gold)', marginBottom: '1.2rem', textTransform: 'uppercase' }}>Comunidade</h5>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {socialLinks.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                  style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'rgba(197,160,89,0.07)', border: '1px solid rgba(197,160,89,0.15)', color: 'var(--muted)', transition: 'all 0.3s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderColor = 'rgba(197,160,89,0.4)'; e.currentTarget.style.background = 'rgba(197,160,89,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.background = ''; e.currentTarget.style.transform = ''; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{ height: 1, background: 'rgba(197,160,89,0.08)', margin: '0 0 1.5rem' }} />

        {/* COPYRIGHT */}
        <div style={{ position: 'relative', height: '100px' }}>
           <DraggableItem 
            id="footer-copyright" isAdmin={isAdmin} 
            initialPos={{ x: 0, y: 0 }}
            onDuplicate={onDuplicate}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', width: '100%' }}>
              <p onClick={onAdminClick} style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '1px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                © {year} L2 Ikarus Arise. Todos os direitos reservados.
              </p>
              <p style={{ fontSize: '0.7rem', color: '#333', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                Lineage 2 é marca registrada da NCSoft Corporation
              </p>
            </div>
          </DraggableItem>
        </div>
      </div>
    </footer>
  )
}
