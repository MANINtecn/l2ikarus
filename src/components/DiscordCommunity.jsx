import React, { useState, useEffect } from 'react'

export default function DiscordCommunity() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDiscord = async () => {
    try {
      const res = await fetch('/api/discord')
      const json = await res.json()
      setData(json)
      setLoading(false)
    } catch (e) {
      console.error('Discord fetch failed')
    }
  }

  useEffect(() => {
    fetchDiscord()
    const interval = setInterval(fetchDiscord, 60000) // Sync 1 min
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="community" style={{ 
      padding: '8rem 2rem', 
      position: 'relative',
      background: 'radial-gradient(circle at 50% 50%, rgba(88, 101, 242, 0.05) 0%, transparent 70%)'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* HUD ELEMENT */}
        <div style={{ 
          width: '60px', 
          height: '2px', 
          background: 'var(--gold)', 
          marginBottom: '2rem',
          boxShadow: '0 0 20px var(--gold)' 
        }} />

        <h2 className="cinzel" style={{ 
          fontSize: '2.5rem', 
          color: '#fff', 
          letterSpacing: '8px',
          marginBottom: '1rem',
          textShadow: '0 0 30px rgba(255,255,255,0.2)'
        }}>COMUNIDADE</h2>
        
        <p style={{ 
          maxWidth: '600px', 
          color: 'var(--text-mute)', 
          fontSize: '0.8rem', 
          letterSpacing: '3px',
          textTransform: 'uppercase',
          lineHeight: '1.8',
          marginBottom: '4rem'
        }}>
          Participe da nossa central de controle no Discord. Coordene ataques, negocie itens e veja quem está online em tempo real.
        </p>

        {/* OFFICIAL DISCORD WIDGET */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          background: 'rgba(5, 5, 8, 0.6)',
          backdropFilter: 'blur(20px)',
          padding: '2rem',
          borderRadius: '24px',
          border: '1px solid rgba(197, 160, 89, 0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <iframe 
            src="https://discord.com/widget?id=1254439382300098630&theme=dark" 
            width="100%" 
            height="500" 
            allowtransparency="true" 
            frameBorder="0" 
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            style={{ borderRadius: '12px' }}
          ></iframe>
        </div>

        {/* JOIN BUTTON (OPTIONAL BUT GOOD FOR UX) */}
        <a 
          href="https://discord.gg/EnZJPcXZ5e" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ marginTop: '3rem', padding: '1rem 3rem' }}
        >
          OPEN MISSION CONTROL
        </a>
      </div>
    </section>
  )
}
