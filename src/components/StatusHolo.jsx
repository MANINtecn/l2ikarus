import { useState, useEffect } from 'react'
import { betaLaunchDate } from '../config/serverRates'

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }
    const timer = setInterval(calculateTimeLeft, 1000)
    calculateTimeLeft()
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="beta-countdown cinzel" style={{ 
      display: 'flex', 
      gap: '1.5rem', 
      justifyContent: 'center', 
      marginBottom: '3rem',
      color: '#fff',
      textShadow: '0 0 15px rgba(255,255,255,0.3)'
    }}>
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1 }}>{value.toString().padStart(2, '0')}</div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '2px', opacity: 0.5, textTransform: 'uppercase', marginTop: '0.5rem' }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

export default function StatusHolo() {
  const [stats, setStats] = useState([
    { id: 'players', label: 'PLAYERS ONLINE', value: '0', icon: '👤', glow: 'var(--neon-blue)' },
    { id: 'accounts', label: 'CONTAS CRIADAS', value: '...', icon: '🆔', glow: 'var(--gold)' },
    { id: 'server', label: 'SERVER STATUS', value: 'OFFLINE', icon: '⚡', glow: '#ef4444' },
    { id: 'uptime', label: 'TEMPO ONLINE', value: '100%', icon: '⏳', glow: 'var(--purple)' }
  ])

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status')
        const data = await res.json()
        
        setStats(prev => prev.map(s => {
          if (s.id === 'players') return { ...s, value: data.players?.toLocaleString() || '0' }
          if (s.id === 'server') return { 
            ...s, 
            value: data.online ? 'ONLINE' : 'OFFLINE', 
            glow: data.online ? '#4ade80' : '#ef4444' 
          }
          return s
        }))
      } catch (e) {
        console.error('Status fetch failed')
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="status" className="status-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ 
            display: 'inline-block',
            padding: '0.3rem 1.5rem',
            background: 'rgba(197, 160, 89, 0.1)',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            borderRadius: '50px',
            color: 'var(--gold)',
            fontSize: '0.65rem',
            letterSpacing: '4px',
            marginBottom: '1.5rem',
            fontWeight: '800'
          }}>BETA PHASE ACTIVE</div>
          
          <h2 className="section-title" style={{ marginBottom: '3rem' }}>O DESPERTAR EM <span style={{ color: 'var(--gold)' }}>CONTAGEM</span></h2>
          
          <CountdownTimer targetDate={betaLaunchDate} />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '2rem',
          position: 'relative',
          zIndex: 2
        }}>
          {stats.map((s, i) => (
            <div 
              key={i} 
              className="glass-panel" 
              style={{ 
                padding: '2.5rem', 
                textAlign: 'center',
                border: `1px solid rgba(255,255,255,0.05)`,
                boxShadow: `0 20px 40px rgba(0,0,0,0.5)`,
                transition: '0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = s.glow;
                e.currentTarget.style.boxShadow = `0 0 30px ${s.glow}33`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
              }}
            >
              <div style={{ 
                fontSize: '2.5rem', 
                marginBottom: '1.5rem', 
                filter: `drop-shadow(0 0 10px ${s.glow})`,
                opacity: 0.8
              }}>
                {s.icon}
              </div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '900', 
                fontFamily: 'Cinzel', 
                color: '#fff',
                letterSpacing: '2px',
                marginBottom: '0.5rem'
              }}>
                {s.value}
              </div>
              <div style={{ 
                fontSize: '0.7rem', 
                letterSpacing: '3px', 
                color: 'var(--text-mute)',
                textTransform: 'uppercase',
                fontWeight: '700'
              }}>
                {s.label}
              </div>
              
              {/* ENERGY LINE */}
              <div style={{ 
                width: '40px', 
                height: '2px', 
                background: s.glow, 
                margin: '1.5rem auto 0',
                boxShadow: `0 0 10px ${s.glow}`
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* BACKGROUND GLOWS */}
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(123,44,191,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1
      }} />
    </section>
  )
}
