import { useState, useEffect } from 'react';
import logoBranca from '../assets/LOGO BASICA BRANCA.png'
import DraggableItem from './DraggableItem'

export default function HeroSection({ onRegisterClick, isAdmin }) {
  const [dynamicItems, setDynamicItems] = useState(() => {
    const saved = localStorage.getItem('hero-dynamic-items');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('hero-dynamic-items', JSON.stringify(dynamicItems));
  }, [dynamicItems]);

  const handleDuplicate = (id) => {
    const newItem = {
      id: `copy-${Date.now()}`,
      templateId: id.includes('copy-') ? 'text-only' : id,
      pos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      text: localStorage.getItem(`text-${id}`) || '',
      style: JSON.parse(localStorage.getItem(`style-${id}`) || '{"fontSize":"inherit","fontFamily":"inherit"}')
    };
    setDynamicItems([...dynamicItems, newItem]);
  };

  const handleDelete = (id) => {
    setDynamicItems(dynamicItems.filter(item => item.id !== id));
    localStorage.removeItem(`pos-${id}`);
    localStorage.removeItem(`size-${id}`);
    localStorage.removeItem(`style-${id}`);
    localStorage.removeItem(`text-${id}`);
  };

  const handleReset = () => {
    if (window.confirm('Deseja resetar todo o layout e remover as cópias criadas?')) {
      setDynamicItems([]);
      localStorage.removeItem('hero-dynamic-items');
      window.dispatchEvent(new CustomEvent('reset-layout'));
    }
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

      {/* LOGO */}
      <DraggableItem 
        id="hero-logo" isAdmin={isAdmin} 
        initialPos={{ x: window.innerWidth * 0.7, y: 100 }} initialSize={{ width: 300 }}
        onDuplicate={handleDuplicate}
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
        onDuplicate={handleDuplicate}
      >
        {/* Children handled by initialText */}
      </DraggableItem>

      {/* ORNAMENT */}
      <DraggableItem 
        id="ornament" isAdmin={isAdmin} 
        initialPos={{ x: window.innerWidth / 2 - 15, y: window.innerHeight * 0.52 }}
        onDuplicate={handleDuplicate}
      >
         <div className="ornament-diamond" style={{ pointerEvents: 'none' }} />
      </DraggableItem>

      {/* BUTTONS */}
      <DraggableItem 
        id="hero-actions" isAdmin={isAdmin} 
        initialPos={{ x: window.innerWidth / 2 - 250, y: window.innerHeight * 0.65 }}
        onDuplicate={handleDuplicate}
      >
        <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', flexWrap:'wrap', width: '100%' }}>
          <a href="#download" className="btn btn-primary btn-glow" style={{ padding: '0.9rem 3rem', fontSize: '1rem' }}>▶ JOGAR AGORA</a>
          <button onClick={onRegisterClick} className="btn btn-outline" style={{ padding: '0.9rem 2.8rem', fontSize: '1rem' }}>CRIAR CONTA</button>
        </div>
      </DraggableItem>

      {/* DYNAMIC COPIES */}
      {dynamicItems.map(item => (
        <DraggableItem
          key={item.id}
          id={item.id}
          isAdmin={isAdmin}
          initialPos={item.pos}
          initialText={item.text}
          initialStyle={item.style}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        >
          {item.templateId === 'hero-logo' && (
            <div style={{ width: '100%', pointerEvents: 'none' }}>
               <img src={logoBranca} alt="Logo Copy" style={{ width: '100%', filter: 'drop-shadow(0 0 30px rgba(197, 160, 89, 0.3))' }} />
            </div>
          )}
          {item.templateId === 'ornament' && <div className="ornament-diamond" style={{ pointerEvents: 'none' }} />}
          {item.templateId === 'hero-actions' && (
             <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', flexWrap:'wrap', width: '100%' }}>
                <a href="#download" className="btn btn-primary btn-glow" style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}>▶ COPY BUTTON</a>
             </div>
          )}
        </DraggableItem>
      ))}

      {/* SCROLL INDICATOR (NOT DRAGGABLE) */}
      <div style={{ 
        position:'absolute', bottom: '40px', left:'50%', transform:'translateX(-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', opacity:0.6,
        animation:'float 2.5s ease-in-out infinite', zIndex: 10, pointerEvents: 'none'
      }}>
        <span style={{ fontSize:'0.7rem', letterSpacing:'4px', textTransform:'uppercase', color:'var(--gold)' }}>explore scroll</span>
        <div style={{ width:1, height:60, background:'linear-gradient(to bottom, var(--gold), transparent)', opacity: 0.5 }} />
      </div>

      {/* RESET BUTTON (ADMIN ONLY) */}
      {isAdmin && (
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
          RESTAURAR TUDO (BUILDER)
        </button>
      )}

    </section>
  )
}
