import { useState } from 'react'

export default function DownloadTerminal() {
  const [downloads, setDownloads] = useState([
    { title: 'CLIENTE COMPLETO', size: '12.4 GB', link: '#', icon: '📥', desc: 'Cliente Interlude limpo e otimizado.' },
    { title: 'PATCH IKARUS', size: '240 MB', link: '#', icon: '⚡', desc: 'Arquivos essenciais de interface e skins.' },
    { title: 'LAUNCHER AUTO', size: '15 MB', link: '#', icon: '🚀', desc: 'Atualização automática para todas as versões.' }
  ])

  return (
    <section id="download" className="rates-section">
      <div className="container">
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
              className="glass-panel download-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--neon-blue)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,210,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="download-info">
                 <div className="download-icon">{d.icon}</div>
                 <div className="download-texts">
                   <h3 className="cinzel download-title">{d.title}</h3>
                   <p className="download-desc">{d.desc}</p>
                 </div>
              </div>

              <div className="download-actions">
                <div className="download-meta">
                   <div className="download-size">SIZE: {d.size}</div>
                   <div className="download-status">STATUS: OK_SECURE</div>
                </div>
                <a href={d.link} className="btn btn-primary download-btn">DOWNLOAD</a>
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
