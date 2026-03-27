import logoBranca from '../assets/LOGO BASICA BRANCA.png'
import DraggableItem from './DraggableItem'

export default function HeroSection({ onRegisterClick, isAdmin, onDuplicate }) {

  return (
    <section id="hero" style={{
      position: 'relative', height: '100vh', minHeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      {/* VÍDEO DE FUNDO */}
      <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)', zIndex: 1 }}>
        <source src="/assets/video-bg.webm" type="video/webm" />
        <source src="/assets/video-bg.mp4" type="video/mp4" />
        <img src="/src/assets/section-1.jpg.jpg" alt="Background Ikarus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </video>

      {/* OVERLAYS */}
      <div style={{ position:'absolute',inset:0,zIndex:3,pointerEvents:'none', background:'radial-gradient(ellipse at 30% 50%, transparent 20%, rgba(5,5,8,0.9) 100%)' }} />
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'40%',zIndex:3,pointerEvents:'none', background:'linear-gradient(to top, var(--bg) 0%, transparent 100%)' }} />

      {/* BASE DRAGGABLE ELEMENTS */}
      
      {/* LOGO */}
      <DraggableItem 
        id="hero-logo" isAdmin={isAdmin} 
        initialPos={{ x: window.innerWidth * 0.7, y: 100 }} initialSize={{ width: 300 }}
        onDuplicate={onDuplicate}
      >
        <div style={{ width: '100%', pointerEvents: 'none' }}>
           <img src={logoBranca} alt="L2 Ikarus Logo" style={{ width: '100%', filter: 'drop-shadow(0 0 30px rgba(197, 160, 89, 0.3))' }} />
        </div>
      </DraggableItem>

      {/* SEASON LABEL */}
      <DraggableItem 
        id="season-label" isAdmin={isAdmin} 
        initialPos={{ x: window.innerWidth / 2 - 100, y: window.innerHeight * 0.45 }}
        initialText="Season 1 BETA"
        initialStyle={{ fontSize: '1.2rem', fontFamily: "'Cinzel', serif" }}
        onDuplicate={onDuplicate}
      />

      {/* ORNAMENT */}
      <DraggableItem 
        id="ornament" isAdmin={isAdmin} 
        initialPos={{ x: window.innerWidth / 2 - 15, y: window.innerHeight * 0.52 }}
        onDuplicate={onDuplicate}
      >
         <div className="ornament-diamond" style={{ pointerEvents: 'none' }} />
      </DraggableItem>

      {/* BUTTONS */}
      <DraggableItem 
        id="hero-actions" isAdmin={isAdmin} 
        initialPos={{ x: window.innerWidth / 2 - 250, y: window.innerHeight * 0.65 }}
        onDuplicate={onDuplicate}
      >
        <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', flexWrap:'wrap', width: '100%' }}>
          <a href="#download" className="btn btn-primary btn-glow" style={{ padding: '0.9rem 3rem', fontSize: '1rem' }}>▶ JOGAR AGORA</a>
          <button onClick={onRegisterClick} className="btn btn-outline" style={{ padding: '0.9rem 2.8rem', fontSize: '1rem' }}>CRIAR CONTA</button>
        </div>
      </DraggableItem>
      
      {/* Dynamic copies are now handled by App.jsx at the global level */}

    </section>
  )
}
