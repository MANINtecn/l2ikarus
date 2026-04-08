import { useState, useMemo } from 'react'
import ModelViewer3D from './ModelViewer3D'

export default function ArenaDuality() {
  const [activeSet, setActiveSet] = useState('antharas')

  const sets = {
    antharas: {
      id: 'antharas',
      name: 'CHEFE DE ANTHARAS',
      description: 'O Dragão da Terra. Sua pele de obsidiana e ossos de diamante emanam uma aura de morte eterna.',
      modelUrl: '/assets/skins/antharas/antharas.glb',
      color: '#4ade80', // Verde para combinar com a aura solicitada
      glow: 'rgba(74, 222, 128, 0.4)',
      stats: [
        { label: 'P. ATK', value: '+1500' },
        { label: 'P. DEF', value: '+3200' },
        { label: 'ATK SPD', value: '+20%' }
      ]
    },
    valakas: {
      id: 'valakas',
      name: 'CHEFE DE VALAKAS',
      description: 'O Dragão de Fogo. Nascido das entranhas do vulcão Godard, seu sopro derrete até o aço lendário.',
      modelUrl: '/assets/skins/valakas/valakas.glb',
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
    <section id="arena" className="arena-section">
      {/* SECTION HEADER */}
      <div className="reveal-delay-1 animate-fadeDown" style={{ textAlign: 'center', marginBottom: '4rem', zIndex: 10 }}>
        <h2 className="cinzel" style={{ fontSize: '3rem', color: '#fff', marginBottom: '1rem' }}>ARENA <span style={{ color: 'var(--gold)' }}>DUALITY</span></h2>
        <div style={{ width: '100px', height: '2px', background: 'var(--gold)', margin: '0 auto' }} />
      </div>

      {/* DUALITY CONTAINER */}
      <div className="container arena-duality-container">
        
        {/* LEFT: BOSS DETAILS */}
        <div className="arena-details reveal-delay-2 animate-fadeLeft">
          <span className="arena-subtitle" style={{ color: current.color }}>DOMÍNIO DOS DRAGÕES</span>
          <h3 className="cinzel arena-name" style={{ textShadow: `0 0 20px ${current.glow}` }}>{current.name}</h3>
          <p className="arena-description">
            {current.description}
          </p>

          <div className="arena-stats-grid">
            {current.stats.map(s => (
              <div key={s.label} className="glass-panel arena-stat-card" style={{ borderBottom: `2px solid ${current.color}` }}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
              </div>
            ))}
          </div>

          {/* SELECTOR HUD */}
          <div className="arena-selectors">
            {Object.keys(sets).map(key => (
              <button 
                key={key}
                onClick={() => setActiveSet(key)}
                className={activeSet === key ? 'btn btn-primary' : 'btn btn-ghost'}
                style={{ 
                  borderColor: activeSet === key ? sets[key].color : 'rgba(255,255,255,0.1)',
                  background: activeSet === key ? sets[key].color : 'none',
                  boxShadow: activeSet === key ? `0 0 20px ${sets[key].glow}` : 'none',
                  color: activeSet === key ? (key === 'antharas' ? '#000' : '#fff') : '#fff'
                }}
              >
                {sets[key].id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: 3D SHOWCASE */}
        <div className="arena-showcase">
          {/* BACKGROUND AURA */}
          <div className="arena-aura" style={{ background: `radial-gradient(circle at center, ${current.glow} 0%, transparent 70%)` }} />

          {/* 3D VIEWER */}
          <div className="arena-3d-wrapper">
            <ModelViewer3D 
              modelUrl={current.modelUrl} 
              backgroundUrl={null} 
              interactive={true} 
              glowColor={current.color}
            />
          </div>

          <div className="arena-live-tag">
             <div className="glass-panel arena-tag-inner">
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
