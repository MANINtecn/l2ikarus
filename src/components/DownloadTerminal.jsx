import { useState } from 'react'

export default function DownloadTerminal() {
  const [downloads, setDownloads] = useState([
    { title: 'CLIENTE COMPLETO', size: '12.4 GB', link: '#', icon: '📥', desc: 'Cliente Interlude limpo e otimizado.' },
    { title: 'PATCH IKARUS', size: '240 MB', link: '#', icon: '⚡', desc: 'Arquivos essenciais de interface e skins.' },
    { title: 'LAUNCHER AUTO', size: '15 MB', link: '#', icon: '🚀', desc: 'Atualização automática para todas as versões.' }
  ])

  return (
    <section id="download" style={{ padding: '8rem 2rem', background: 'linear-gradient(to bottom, #0a0b12 0%, #050508 100%)', position: 'relative' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <p className="section-subtitle">LOGISTICA & IMPLANTAÇÃO</p>
          <h2 className="section-title">CENTRAL DE <span style={{ color: 'var(--gold)' }}>TRANSFERÊNCIA</span></h2>
        </div>

        <div style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem' 
        }}>
          {downloads.map((d, i) => (
            <div 
              key={i} 
              className="glass-panel" 
              style={{ 
                padding: '2rem 3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '2rem',
                border: '1px solid rgba(255,255,255,0.03)',
                transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--neon-blue)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,210,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                 <div style={{ fontSize: '2rem', opacity: 0.8 }}>{d.icon}</div>
                 <div style={{ textAlign: 'left' }}>
                   <h3 className="cinzel" style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.3rem', letterSpacing: '2px' }}>{d.title}</h3>
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-mute)', letterSpacing: '1px' }}>{d.desc}</p>
                 </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: '800', fontFamily: 'monospace' }}>SIZE: {d.size}</div>
                   <div style={{ fontSize: '0.6rem', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '2px' }}>STATUS: OK_SECURE</div>
                </div>
                <a href={d.link} className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.75rem' }}>DOWNLOAD</a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '5rem', textAlign: 'center' }}>
          <div className="glass-panel" style={{ 
            display: 'inline-block', 
            padding: '1.5rem 3rem', 
            background: 'rgba(255,68,68,0.03)',
            border: '1px solid rgba(255,68,68,0.1)'
          }}>
             <p style={{ color: '#ff4444', fontSize: '0.75rem', letterSpacing: '3px', fontWeight: '700', textTransform: 'uppercase' }}>
               🛡️ ANTIVÍRUS: DESATIVE AO INSTALAR PARA EVITAR FALSOS POSITIVOS.
             </p>
          </div>
        </div>
      </div>

      {/* TECH DECOR */}
      <div style={{ 
        position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(0,210,255,0.02) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
    </section>
  )
}
