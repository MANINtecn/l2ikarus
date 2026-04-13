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
          Junte-se à nossa legião no Discord. Coordene ataques, negocie itens e participe de eventos exclusivos.
        </p>

        {/* DYNAMIC MEMBER LIST */}
        <div className="glass-panel" style={{ 
          padding: '2rem',
          background: 'rgba(5, 5, 8, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(197, 160, 89, 0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          borderRadius: '20px',
          position: 'relative',
          width: '100%',
          maxWidth: '800px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 1rem' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>{data?.name || 'L2 IKARUS'}</div>
              <div style={{ color: '#4ade80', fontSize: '0.7rem', letterSpacing: '2px', marginTop: '5px' }}>
                 ● {data?.presence_count || 0} GUERREIROS ONLINE
              </div>
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '1px' }}>
              SYNC: 60s
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
            gap: '1rem',
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: '10px'
          }}>
            {loading ? (
              <div style={{ gridColumn: '1/-1', color: 'var(--text-mute)', padding: '2rem' }}>CARREGANDO COMUNIDADE...</div>
            ) : data?.members?.map((member) => (
              <div key={member.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                background: 'rgba(255,255,255,0.03)',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={member.avatar_url} 
                    alt={member.username} 
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--gold)' }} 
                  />
                  <div style={{ 
                    position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', 
                    background: '#4ade80', borderRadius: '50%', border: '2px solid #050508' 
                  }} />
                </div>
                <div style={{ 
                  color: '#fff', 
                  fontSize: '0.7rem', 
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {member.username}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* JOIN BUTTON */}
        <a 
          href={data?.instant_invite || "https://discord.gg/uCThsAGmVR"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ marginTop: '3rem', padding: '1rem 3rem' }}
        >
          ACESSAR MISSION CONTROL
        </a>
      </div>
    </section>
  )
}
