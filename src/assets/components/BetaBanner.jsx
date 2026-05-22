export const BANNER_HEIGHT = 34 // px — usado pelo Navbar para se deslocar

export default function BetaBanner({ onDismiss }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: `${BANNER_HEIGHT}px`,
      zIndex: 9999,
      background: 'linear-gradient(90deg, rgba(2,2,3,0.97) 0%, rgba(15,8,2,0.97) 50%, rgba(2,2,3,0.97) 100%)',
      borderBottom: '1px solid rgba(200,168,75,0.35)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 3rem',
      gap: '0.75rem',
    }}>
      {/* Linha de brilho superior */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
        opacity: 0.6,
      }} />

      {/* Dot pulsante */}
      <div style={{
        width: '6px', height: '6px',
        borderRadius: '50%',
        background: '#f59e0b',
        boxShadow: '0 0 8px #f59e0b',
        flexShrink: 0,
        animation: 'betaPulse 1.8s ease-in-out infinite',
      }} />

      <p style={{
        fontSize: 'clamp(0.58rem, 1.8vw, 0.72rem)',
        letterSpacing: 'clamp(1px, 0.4vw, 3px)',
        color: 'var(--gold)',
        fontWeight: '800',
        textTransform: 'uppercase',
        margin: 0,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        Beta Teste Aberto
        <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '400', margin: '0 0.4rem' }}>·</span>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '400', letterSpacing: '1px' }}>
          Servidor em testes — reporte bugs no Discord
        </span>
      </p>

      <button
        onClick={onDismiss}
        style={{
          position: 'absolute',
          right: '0.75rem',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '0.75rem',
          cursor: 'pointer',
          lineHeight: 1,
          padding: '0.4rem 0.5rem',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        aria-label="Fechar aviso"
      >
        ✕
      </button>

      <style>{`
        @keyframes betaPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(0.75); }
        }
      `}</style>
    </div>
  )
}