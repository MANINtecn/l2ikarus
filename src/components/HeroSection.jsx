import { useEffect } from 'react';
import logoBranca from '../assets/LOGO BASICA BRANCA.png'
import DraggableItem from './DraggableItem'

export default function HeroSection({ onRegisterClick }) {
  
  const handleReset = () => {
    window.dispatchEvent(new CustomEvent('reset-layout'));
  };

  return (
    <section id="hero" style={{
      position: 'relative', height: '100vh', minHeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      {/* VÍDEO DE FUNDO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          filter: 'brightness(0.65)',
          zIndex: 1
        }}
      >
        <source src="/assets/video-bg.webm" type="video/webm" />
        <source src="/assets/video-bg.mp4" type="video/mp4" />
        <img src="/src/assets/section-1.jpg.jpg" alt="Background Ikarus" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      </video>

      {/* OVERLAYS */}
      <div style={{ position:'absolute',inset:0,zIndex:3,pointerEvents:'none',
        background:'radial-gradient(ellipse at 30% 50%, transparent 20%, rgba(5,5,8,0.9) 100%)' }} />
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'40%',zIndex:3,pointerEvents:'none',
        background:'linear-gradient(to top, var(--bg) 0%, transparent 100%)' }} />

      {/* DRAGGABLE LOGO */}
      <DraggableItem id="hero-logo" initialPos={{ x: window.innerWidth * 0.7, y: 100 }} className="hero-right-logo-container">
        <div style={{ width: 'min(300px, 25vw)', pointerEvents: 'none' }}>
           <img src={logoBranca} alt="L2 Ikarus Logo" style={{ width: '100%', filter: 'drop-shadow(0 0 30px rgba(197, 160, 89, 0.3))' }} />
        </div>
      </DraggableItem>

      {/* DRAGGABLE SEASON LABEL */}
      <DraggableItem id="season-label" initialPos={{ x: window.innerWidth / 2 - 100, y: window.innerHeight * 0.45 }}>
        <div style={{ textAlign: 'center', width: 200, pointerEvents: 'none' }}>
           <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'min(1.1rem, 2.5vw)',
            fontWeight: 700,
            letterSpacing: '6px',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            textShadow: '0 0 20px rgba(197, 160, 89, 0.4)'
          }}>Season 1 BETA</span>
        </div>
      </DraggableItem>

      {/* DRAGGABLE ORNAMENT */}
      <DraggableItem id="ornament" initialPos={{ x: window.innerWidth / 2 - 15, y: window.innerHeight * 0.52 }}>
         <div className="ornament-diamond" style={{ pointerEvents: 'none' }} />
      </DraggableItem>

      {/* DRAGGABLE BUTTONS */}
      <DraggableItem id="hero-actions" initialPos={{ x: window.innerWidth / 2 - 250, y: window.innerHeight * 0.65 }}>
        <div style={{ 
          display:'flex',
          gap:'1.5rem',
          justifyContent:'center',
          flexWrap:'wrap',
          width: 500
        }}>
          <a href="#download" className="btn btn-primary btn-glow" style={{ padding: '0.9rem 3rem', fontSize: '1rem' }}>
            ▶ JOGAR AGORA
          </a>
          <button 
            onClick={onRegisterClick}
            className="btn btn-outline"
            style={{ padding: '0.9rem 2.8rem', fontSize: '1rem' }}
          >
            CRIAR CONTA
          </button>
        </div>
      </DraggableItem>

      {/* SCROLL INDICATOR (NOT DRAGGABLE) */}
      <div style={{ 
        position:'absolute', bottom: '40px', left:'50%', transform:'translateX(-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', opacity:0.6,
        animation:'float 2.5s ease-in-out infinite', zIndex: 10, pointerEvents: 'none'
      }}>
        <span style={{ fontSize:'0.7rem', letterSpacing:'4px', textTransform:'uppercase', color:'var(--gold)' }}>explore scroll</span>
        <div style={{ width:1, height:60, background:'linear-gradient(to bottom, var(--gold), transparent)', opacity: 0.5 }} />
      </div>

      {/* RESET BUTTON */}
      <button 
        onClick={handleReset}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 100,
          background: 'rgba(197, 160, 89, 0.15)',
          border: '1px solid var(--gold)',
          color: 'var(--gold)',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '0.7rem',
          cursor: 'pointer',
          letterSpacing: '1px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s'
        }}
        onMouseEnter={e => e.target.style.background = 'rgba(197, 160, 89, 0.3)'}
        onMouseLeave={e => e.target.style.background = 'rgba(197, 160, 89, 0.15)'}
      >
        RESTAURAR LAYOUT
      </button>

    </section>
  )
}
