const DISCORD_INVITE = 'https://discord.gg/KF5AzGT7Y9'
const DRIVE_DOWNLOAD = 'https://drive.google.com/file/d/1mevVcw8FLb8lEWelBwYCbbqTH7M_0taP/view?usp=sharing'

const STEPS = [
  {
    num: '01',
    title: 'BAIXE O LAUNCHER',
    desc: 'Só o IKARUS GAMES (~150 MB) pelo Google Drive. Rápido e leve.',
    color: 'var(--gold)',
  },
  {
    num: '02',
    title: 'ABRA E CLIQUE EM INSTALAR',
    desc: 'No card do L2 Ikarus Essence, clique em INSTALAR. O launcher baixa o jogo inteiro — e SALVA O PROGRESSO: se a internet cair, ele continua de onde parou.',
    color: '#5865F2',
  },
  {
    num: '03',
    title: 'SEMPRE ATUALIZADO',
    desc: 'O launcher atualiza o jogo e a si mesmo automaticamente. Abriu, jogou — sem reinstalar nada.',
    color: '#4CAF50',
  },
  {
    num: '04',
    title: 'CRIE SUA CONTA E JOGUE',
    desc: 'Crie a conta direto no launcher ou aqui no site e entre no jogo.',
    color: '#C8A84B',
  },
]

export default function DownloadTerminal() {
  return (
    <section id="download" className="rates-section" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Fundo decorativo */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(88,101,242,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p className="section-subtitle">INSTALAÇÃO & ACESSO</p>
          <h2 className="section-title">
            COMO <span style={{ color: 'var(--gold)' }}>JOGAR</span>
          </h2>
          <p style={{
            color: 'var(--text-mute)', fontSize: '0.8rem',
            letterSpacing: '3px', textTransform: 'uppercase',
            marginTop: '1rem', maxWidth: '500px', margin: '1rem auto 0'
          }}>
            Um launcher só: o IKARUS GAMES baixa, instala e mantém o jogo atualizado sozinho. Sem complicação.
          </p>
        </div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1000px',
          margin: '0 auto 5rem',
        }}>
          {STEPS.map((s) => (
            <div key={s.num} className="glass-panel" style={{
              padding: '2.2rem 1.5rem',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
              alignItems: 'center', textAlign: 'center',
              borderTop: `2px solid ${s.color}`,
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{
                fontSize: '2rem', fontWeight: '900',
                color: s.color, opacity: 0.35,
                fontFamily: 'Cinzel, serif', letterSpacing: '4px',
              }}>{s.num}</span>
              <h3 className="cinzel" style={{
                fontSize: '0.78rem', letterSpacing: '3px',
                color: '#fff', margin: 0,
              }}>{s.title}</h3>
              <p style={{
                fontSize: '0.8rem', color: 'rgba(255,255,255,0.82)',
                lineHeight: '1.7', margin: 0,
              }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Principal — Discord */}
        <div style={{ textAlign: 'center' }}>
          <div className="glass-panel" style={{
            display: 'inline-flex', flexDirection: 'column',
            alignItems: 'center', gap: '2rem',
            padding: 'clamp(2rem, 6vw, 3rem) clamp(1.5rem, 8vw, 4rem)',
            background: 'rgba(200,168,75,0.05)',
            border: '1px solid rgba(200,168,75,0.25)',
            maxWidth: '520px', width: '100%',
          }}>
            {/* Ícone do launcher */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: 'var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(200,168,75,0.4)',
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>

            <div>
              <h3 className="cinzel" style={{
                fontSize: '1.1rem', letterSpacing: '4px',
                color: '#fff', marginBottom: '0.5rem'
              }}>BAIXAR O LAUNCHER</h3>
              <p style={{
                color: 'var(--text-mute)', fontSize: '0.78rem',
                letterSpacing: '2px', lineHeight: '1.7'
              }}>
                IKARUS GAMES · ~150 MB · ESCOLHA O SERVIDOR
              </p>
            </div>

            {/* Botão de download */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              <a
                href={DRIVE_DOWNLOAD || DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '0.9rem 2rem', fontSize: '0.85rem', letterSpacing: '3px', width: '100%' }}
              >
                ⬇ BAIXAR · GOOGLE DRIVE
              </a>
            </div>

            {/* Suporte no Discord */}
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#7289DA', fontSize: '0.72rem',
                letterSpacing: '2px', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              <svg viewBox="0 0 24 24" fill="#7289DA" width="16" height="16">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.079.079 0 0 0 .085-.026c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              PRECISA DE AJUDA? SUPORTE NO DISCORD
            </a>

            <p style={{
              color: 'var(--text-mute)', fontSize: '0.7rem',
              letterSpacing: '2px', margin: 0
            }}>
              GRATUITO · SEM CADASTRO PRÉVIO
            </p>
          </div>
        </div>

        {/* Aviso antivírus */}
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <div className="glass-panel" style={{
            display: 'inline-block', padding: '1rem 2.5rem',
            background: 'rgba(255,68,68,0.03)',
            border: '1px solid rgba(255,68,68,0.1)'
          }}>
            <p style={{
              color: '#ff4444', fontSize: '0.7rem',
              letterSpacing: '3px', fontWeight: '700',
              textTransform: 'uppercase', margin: 0
            }}>
              ⚠ ANTIVÍRUS: DESATIVE AO INSTALAR PARA EVITAR FALSOS POSITIVOS
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}