import React from 'react'

export default function DiscordCommunity() {
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
          Junte-se à nossa legião no Discord. Coordene ataques, negocie itens e participe de eventos exclusivos com centenas de jogadores.
        </p>

        {/* WIDGET CONTAINER */}
        <div className="glass-panel" style={{ 
          padding: '1rem',
          background: 'rgba(5, 5, 8, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(197, 160, 89, 0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          borderRadius: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* DECORATIVE CORNERS */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '2px solid var(--gold)', borderLeft: '2px solid var(--gold)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '2px solid var(--gold)', borderRight: '2px solid var(--gold)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '2px solid var(--gold)', borderLeft: '2px solid var(--gold)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '2px solid var(--gold)', borderRight: '2px solid var(--gold)' }} />

          <iframe 
            src="https://discord.com/widget?id=1492885957517770772&theme=dark" 
            width="100%" 
            height="500" 
            style={{ 
              border: 'none',
              minWidth: '320px',
              maxWidth: '400px',
              borderRadius: '12px'
            }}
            allowtransparency="true" 
            frameborder="0" 
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          ></iframe>
        </div>

        {/* JOIN BUTTON */}
        <a 
          href="https://discord.gg/uCThsAGmVR" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ marginTop: '3rem', padding: '1rem 3rem' }}
        >
          ENTRAR NO SERVIDOR
        </a>
      </div>
    </section>
  )
}
