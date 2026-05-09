import { useState } from 'react'

const guideItems = [
  {
    id: 'pvp',
    title: 'PVP DINÂMICO',
    subtitle: 'COMBATE DE ELITE',
    image: '/assets/guide/pvp.png',
    description: 'Nosso sistema de PVP foi refinado para recompensar a habilidade. Com balanceamento matemático de classes e geodata premium, cada duelo é uma experiência cinematográfica.',
    features: ['Balanceamento Real', 'Novas Arenas', 'Recompensas de Honra']
  },
  {
    id: 'boss',
    title: 'BOSSES ÉPICOS',
    subtitle: 'DESAFIO SUPREMO',
    image: '/assets/guide/boss.png',
    description: 'Enfrente Valakas, Antharas e Baium em encontros épicos redimensionados para o nosso servidor. Drops exclusivos e disputas territoriais intensas esperam por você.',
    features: ['Respawn Dinâmico', 'Drops Customizados', 'IA Aprimorada']
  },
  {
    id: 'economy',
    title: 'ECONOMIA REAL',
    subtitle: 'MERCADO VIVO',
    image: '/assets/guide/economy.png',
    description: 'Um mercado sustentável onde cada Adena conta. Sistema de leilão integrado e proteção contra inflação para garantir que seu esforço seja sempre valorizado.',
    features: ['Anti-Inflação', 'Leilão no Site', 'Craft Valorizado']
  },
  {
    id: 'craft',
    title: 'SISTEMA DE CRAFT',
    subtitle: 'FORJA DE LENDA',
    image: '/assets/guide/craft.png',
    description: 'O craft voltou a ser o coração do Lineage 2. Receitas raras e materiais únicos tornam a profissão de anão essencial e extremamente lucrativa.',
    features: ['Receitas Exclusivas', 'Chance de Masterwork', 'Materiais Raros']
  },
  {
    id: 'events',
    title: 'EVENTOS DIÁRIOS',
    subtitle: 'DINÂMICA CONSTANTE',
    image: '/assets/guide/events.png',
    description: 'Nunca um dia igual ao outro. Eventos automáticos como TvT, CTF e Dominação garantem ação constante e prêmios valiosos para todos os níveis.',
    features: ['TvT Automático', 'Sieges Semanais', 'Eventos Sazonais']
  },
  {
    id: 'duality',
    title: 'ARENA DUALITY',
    subtitle: 'MECÂNICA EXCLUSIVA',
    image: '/assets/guide/duality.png',
    description: 'Uma arena única onde a luz e as trevas se enfrentam. Ganhe buffs especiais controlando pontos estratégicos e domine o ranking de elite do servidor.',
    features: ['Ranking Mensal', 'Buffs de Dominação', 'Arenas 1v1 e 3v3']
  }
]

export default function ServerGuide() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="guide" className="guide-section" style={{ position: 'relative', padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p className="section-subtitle">CONHEÇA O UNIVERSO IKARUS</p>
          <h2 className="section-title">GUIA DO <span style={{ color: 'var(--gold)' }}>SERVIDOR</span></h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {guideItems.map((item, index) => (
            <div 
              key={item.id}
              className="guide-card glass-panel"
              onClick={() => setSelected(item)}
              style={{
                position: 'relative',
                height: '400px',
                borderRadius: '15px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(197, 160, 89, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-10px)'
                e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.5)'
                e.currentTarget.querySelector('.card-overlay').style.opacity = '0.9'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.1)'
                e.currentTarget.querySelector('.card-overlay').style.opacity = '0.7'
              }}
            >
              <img 
                src={item.image} 
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }}
              />
              <div className="card-overlay" style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(2,2,3,1) 0%, rgba(2,2,3,0.4) 50%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem',
                opacity: 0.7,
                transition: '0.5s'
              }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.6rem', fontWeight: '800', letterSpacing: '3px' }}>{item.subtitle}</span>
                <h3 className="cinzel" style={{ color: '#fff', fontSize: '1.5rem', margin: '0.5rem 0' }}>{item.title}</h3>
                <div style={{ width: '30px', height: '2px', background: 'var(--gold)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL EXPLICAÇÃO */}
      {selected && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(15px)'
        }} onClick={() => setSelected(null)}>
          <div className="glass-panel" style={{
            maxWidth: '800px',
            width: '100%',
            background: '#0a0a0f',
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            animation: 'fadeUp 0.4s ease-out'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: window.innerWidth < 768 ? '100%' : '40%', height: window.innerWidth < 768 ? '200px' : 'auto' }}>
              <img src={selected.image} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '3rem', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '4px' }}>{selected.subtitle}</span>
                  <h2 className="cinzel" style={{ color: '#fff', fontSize: '2.5rem', margin: '0.5rem 0' }}>{selected.title}</h2>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.5 }}>✕</button>
              </div>
              <p style={{ color: 'var(--text-mute)', lineHeight: '1.8', margin: '2rem 0' }}>{selected.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {selected.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.8rem' }}>
                    <div style={{ width: '6px', height: '6px', background: 'var(--gold)', borderRadius: '50%' }} />
                    {f}
                  </div>
                ))}
              </div>

              <button className="btn btn-primary" style={{ marginTop: '3rem', width: '100%' }} onClick={() => setSelected(null)}>FECHAR GUIA</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
