import { useState, useEffect } from 'react'
import ModelViewer3D from './ModelViewer3D'

export default function Hero3D({ onRegisterClick }) {
  const [modelUrl, setModelUrl] = useState(`/assets/skins/antharas/ikarus_promo.glb?v=${Date.now()}`)

  return (
    <section id="hero" style={{ 
      height: '100vh', 
      width: '100%', 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'radial-gradient(circle at center, #0a0b12 0%, #050508 100%)'
    }}>
      {/* 3D STAGE - POSICIONADO NO VÃO À DIREITA DO TEXTO PARA MAIOR VISIBILIDADE */}
      {/* 🐉 MODELO 3D - COMO CENÁRIO DE FUNDO (Z-INDEX 1) */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 1,
        opacity: 0.9,
      }}>
        <ModelViewer3D 
          modelUrl={modelUrl} 
          interactive={true} 
          glowColor="#4ade80" 
        />
        {/* Camada de Gradiente para suavizar bordas e Contrastar Texto */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(90deg, rgba(5,5,8,0.8) 0%, rgba(5,5,8,0.2) 50%, rgba(5,5,8,0.8) 100%), linear-gradient(0deg, rgba(5,5,8,0.5) 0%, transparent 40%, rgba(5,5,8,0.3) 100%)',
          pointerEvents: 'none' 
        }} />
      </div>

      {/* HUD OVERLAY LEFT: SERVER IDENTITY */}
      <div style={{ 
        position: 'absolute', 
        left: '6rem', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        zIndex: 10,
        maxWidth: '550px',
        textShadow: '0 0 40px rgba(0,0,0,0.8)' // Sombra extra para legibilidade sobre o 3D
      }}>
        <div className="reveal-delay-1 animate-fadeUp">
          <p className="section-subtitle" style={{ textAlign: 'left', marginBottom: '0.8rem', letterSpacing: '5px', color: 'var(--gold)' }}>SEJA RECONHECIDO POR ONDE FARMA</p>
          <h1 className="cinzel" style={{ 
            fontSize: '5.5rem', 
            lineHeight: '0.9', 
            color: '#fff', 
            marginBottom: '1.5rem',
            textShadow: '0 10px 30px rgba(0, 0, 0, 0.9), 0 0 20px rgba(197, 160, 89, 0.3)'
          }}>
            L2<br />
            <span style={{ color: 'var(--gold)' }}>IKARUS</span>
          </h1>
          <p style={{ color: '#fff', fontSize: '1.2rem', letterSpacing: '1px', marginBottom: '3.5rem', opacity: 0.9, lineHeight: '1.6', fontWeight: '500' }}>
            Experimente o Lineage 2 em uma nova dimensão. 3D High-End. <br/>
            <span style={{ color: 'var(--gold)', fontWeight: '700' }}>Conjunto Antharas disponível na estreia.</span>
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
             <button onClick={onRegisterClick} className="btn btn-primary" style={{ padding: '1.3rem 3.5rem', fontSize: '0.9rem', boxShadow: '0 15px 35px rgba(197,160,89,0.3)' }}>INICIALIZAR JORNADA</button>
             <a href="#rates" className="btn btn-ghost" style={{ padding: '1.3rem 3.5rem', fontSize: '0.75rem', backdropFilter: 'blur(10px)' }}>RECURSOS ELITE</a>
          </div>
        </div>
      </div>

      {/* HUD OVERLAY RIGHT: SERVER STATUS CARDS */}
      <div style={{ 
        position: 'absolute', 
        right: '4rem', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* STATUS CARD */}
        <div className="glass-panel" style={{ padding: '1.5rem', width: '220px', borderLeft: '4px solid #4ade80' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '2px' }}>STATUS</span>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80' }} />
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', fontFamily: 'Cinzel' }}>ON-LINE</div>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-mute)', marginTop: '5px' }}>1.240 Jogadores Ativos</p>
        </div>

        {/* RATES HUD */}
        <div className="glass-panel" style={{ padding: '1.5rem', width: '220px', borderLeft: '4px solid var(--gold)' }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '2px', display: 'block', marginBottom: '1.2rem' }}>DADOS DO REINO</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: '#888' }}>TAXA DE XP</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: '900' }}>x1000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: '#888' }}>TAXA SP</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: '900' }}>x1000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: '#888' }}>ADENA</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: '900' }}>x500</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM DECORATION: SCANLINE OVERLAY */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        pointerEvents: 'none', 
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))', 
        backgroundSize: '100% 4px, 3px 100%',
        opacity: 0.1
      }} />

      {/* MOUSE SCROLL INDICATOR */}
      <div style={{ 
        position: 'absolute', 
        bottom: '3rem', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        opacity: 0.5
      }}>
         <div style={{ width: '1px', height: '60px', background: 'linear-gradient(transparent, var(--gold))' }} />
         <span style={{ fontSize: '0.6rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)' }}>ROLAR</span>
      </div>
    </section>
  )
}
