import { useState, useMemo } from 'react'
import ModelViewer3D from './ModelViewer3D'

export default function ArenaDuality() {
  const [activeSet, setActiveSet] = useState('antharas')

  const sets = {
    antharas: {
      id: 'antharas',
      name: 'ANTHARAS BOSS',
      description: 'O Dragão da Terra. Sua pele de obsidiana e ossos de diamante emanam uma aura de morte eterna.',
      modelUrl: '/assets/skins/antharas/antharas.glb',
      bg: '/assets/images/white_bg.png', // Fundo de alto contraste para a skin escura
      color: '#c5a059',
      glow: 'rgba(197, 160, 89, 0.4)',
      stats: [
        { label: 'P. ATK', value: '+1500' },
        { label: 'P. DEF', value: '+3200' },
        { label: 'ATK SPD', value: '+20%' }
      ]
    },
    valakas: {
      id: 'valakas',
      name: 'VALAKAS BOSS',
      description: 'O Dragão de Fogo. Nascido das entranhas do vulcão Godard, seu sopro derrete até o aço lendário.',
      modelUrl: '/assets/skins/valakas/valakas.glb',
      bg: '/assets/images/lava_bg.png', // Fundo épico vulcânico
      color: '#ff4d00',
      glow: 'rgba(255, 77, 0, 0.4)',
      stats: [
        { label: 'M. ATK', value: '+2800' },
        { label: 'CAST SPD', value: '+35%' },
        { label: 'FIRE RES', value: '100%' }
      ]
    }
  }

  const current = sets[activeSet]

  return (
    <section id="arena" style={{ 
      minHeight: '100vh', 
      width: '100%', 
      position: 'relative',
      background: '#050508',
      padding: '6rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* SECTION HEADER */}
      <div className="reveal-delay-1 animate-fadeDown" style={{ textAlign: 'center', marginBottom: '4rem', zIndex: 10 }}>
        <h2 className="cinzel" style={{ fontSize: '3rem', color: '#fff', marginBottom: '1rem' }}>ARENA <span style={{ color: 'var(--gold)' }}>DUALITY</span></h2>
        <div style={{ width: '100px', height: '2px', background: 'var(--gold)', margin: '0 auto' }} />
      </div>

      {/* DUALITY CONTAINER */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1400px', 
        height: '750px', 
        display: 'flex', 
        gap: '2rem',
        padding: '0 4rem',
        position: 'relative',
        zIndex: 5
      }}>
        
        {/* LEFT: BOSS DETAILS */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="reveal-delay-2 animate-fadeLeft">
            <span style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '4px', fontWeight: '800' }}>DOMÍNIO DOS DRAGÕES</span>
            <h3 className="cinzel" style={{ fontSize: '4rem', color: '#fff', margin: '0.8rem 0', textShadow: `0 0 20px ${current.glow}` }}>{current.name}</h3>
            <p style={{ color: 'var(--text-mute)', fontSize: '1rem', lineHeight: '1.8', marginBottom: '3rem', maxWidth: '500px' }}>
              {current.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
              {current.stats.map(s => (
                <div key={s.label} className="glass-panel" style={{ padding: '1rem', textAlign: 'center', borderBottom: `2px solid ${current.color}` }}>
                  <div style={{ fontSize: '0.6rem', color: '#888', marginBottom: '0.5rem' }}>{s.label}</div>
                  <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '800' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* SELECTOR HUD */}
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {Object.keys(sets).map(key => (
                <button 
                  key={key}
                  onClick={() => setActiveSet(key)}
                  className={activeSet === key ? 'btn btn-primary' : 'btn btn-ghost'}
                  style={{ 
                    padding: '1rem 2rem', 
                    fontSize: '0.7rem',
                    borderColor: activeSet === key ? sets[key].color : 'rgba(255,255,255,0.1)',
                    background: activeSet === key ? sets[key].color : 'none',
                    boxShadow: activeSet === key ? `0 0 20px ${sets[key].glow}` : 'none'
                  }}
                >
                  {sets[key].id.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: 3D SHOWCASE - AGORA SEM LIMITES DE CAIXA */}
        <div style={{ 
          flex: '1.5', 
          position: 'relative', 
          borderRadius: '30px', 
          overflow: 'visible', // Permite que o modelo pop out se necessário
          transition: '0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {/* BACKGROUND ADAPTATIVO */}
          <div style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50px',
            backgroundImage: `url(${current.bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8,
            boxShadow: `inset 0 0 100px #000, 0 0 50px ${current.glow}`,
            transition: 'all 0.6s ease',
            zIndex: 0
          }} />

          {/* 3D VIEWER */}
          <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
            <ModelViewer3D modelUrl={current.modelUrl} backgroundUrl={null} />
          </div>

          {/* HUD OVERLAY ELEMENTS */}
          <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 5 }}>
             <div className="glass-panel" style={{ padding: '0.8rem 1.5rem', fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '2px' }}>
                LIVE PREVIEW: HIGH-END 3D
             </div>
          </div>
        </div>

      </div>

      {/* BACKGROUND PARTICLES/DETAILS */}
      <div style={{ 
        position: 'absolute', 
        left: '2rem', 
        bottom: '2rem', 
        fontSize: '8rem', 
        fontFamily: 'Cinzel', 
        color: 'rgba(255,255,255,0.02)', 
        zIndex: 0,
        userSelect: 'none'
      }}>
        LEGENDARY
      </div>
    </section>
  )
}
