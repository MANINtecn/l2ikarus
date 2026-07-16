import { useEffect, useState } from 'react'

export default function Preloader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const steps = [20, 45, 70, 88, 100]
    const timers = steps.map((target, i) =>
      setTimeout(() => setProgress(target), i * 480)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100000,
      background: '#020203',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '2.5rem',
    }}>
      {/* LOGO — atualizada 2026-07-15 (ikarusdragonic, mesma do Hero) */}
      <img
        src="/logo-white.png"
        alt="IKARUS Servers"
        style={{
          width: '340px', height: 'auto', maxWidth: '80vw',
          filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.5))',
          animation: 'logoPulse 2s ease-in-out infinite',
        }}
      />

      {/* BARRA DE PROGRESSO */}
      <div style={{ width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '100%', height: '2px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '2px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--gold), #fff8dc)',
            transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 0 10px rgba(212,175,55,0.6)',
          }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.55rem', letterSpacing: '3px' }}>
          {progress}%
        </p>
      </div>
    </div>
  )
}
