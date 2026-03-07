export default function HeroSection({ onRegisterClick }) {
  return (
    <section id="hero" style={{
      position: 'relative', height: '100vh', minHeight: 600,
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
          objectPosition: 'center 60%', // Baixando ainda mais para mostrar o rosto
          filter: 'brightness(0.78)',
          zIndex: 1
        }}
      >
        <source src="/assets/video-bg.webm" type="video/webm" />
        <source src="/assets/video-bg.mp4" type="video/mp4" />
        {/* Fallback caso não encontre o vídeo */}
        <img src="/src/assets/section-1.jpg.jpg" alt="Background Ikarus" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }} />
      </video>

      {/* OVERLAYS */}
      <div style={{ position:'absolute',inset:0,zIndex:3,pointerEvents:'none',
        background:'radial-gradient(ellipse at 30% 50%, transparent 35%, rgba(5,5,8,0.82) 100%)' }} />
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'30%',zIndex:3,pointerEvents:'none',
        background:'linear-gradient(to top, var(--bg) 0%, transparent 100%)' }} />
      <div style={{ position:'absolute',inset:0,zIndex:3,pointerEvents:'none',
        background:'linear-gradient(to left, rgba(5,5,8,0.5) 0%, transparent 55%)' }} />

      {/* CONTEÚDO */}
      <div style={{ position:'relative',zIndex:10,textAlign:'center',padding:'2rem',maxWidth:900 }}>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:'0.75rem', fontWeight:600,
          letterSpacing:'8px', textTransform:'uppercase', color:'rgba(200,100,255,0.95)',
          marginBottom:'1.2rem', animation:'fadeUp 0.6s ease forwards' }}>
          ⚔ Lineage 2 Private Server ⚔
        </p>

        <h1 style={{ fontFamily:"'Cinzel',serif", fontWeight:900,
          fontSize:'clamp(2.8rem, 8vw, 7rem)', textTransform:'uppercase',
          lineHeight:0.95, letterSpacing:'2px', marginBottom:'0.5rem',
          animation:'fadeUp 0.7s 0.1s ease both' }}>
          <span style={{ display:'block',
            background:'linear-gradient(135deg,#c5a059 0%,#f0d080 40%,#c5a059 70%,#e8c870 100%)',
            backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            animation:'shimmer 4s linear infinite' }}>IKARUS</span>
          <span style={{ display:'block', fontSize:'clamp(1.6rem,4.5vw,3.5rem)',
            letterSpacing:'14px', color:'rgba(255,255,255,0.92)',
            WebkitTextFillColor:'rgba(255,255,255,0.92)', marginTop:'0.3rem' }}>ARISE</span>
        </h1>

        <p style={{ fontFamily:"'Outfit',sans-serif",
          fontSize:'clamp(0.85rem,2vw,1.1rem)', color:'rgba(224,230,237,0.75)',
          letterSpacing:'3px', textTransform:'uppercase',
          margin:'1.8rem auto 3rem', maxWidth:560,
          animation:'fadeUp 0.8s 0.2s ease both', lineHeight:1.8 }}>
          Adentre os mais profundos Dungeons.<br />
          Ascenda. Conquiste. Torne-se Lenda.
        </p>

        <div className="ornament" style={{ animation:'fadeUp 0.8s 0.3s ease both', margin:'0 auto 2.5rem' }}>
          <div className="ornament-diamond" />
        </div>

        <div style={{ display:'flex',gap:'1.2rem',justifyContent:'center',flexWrap:'wrap',animation:'fadeUp 0.9s 0.4s ease both' }}>
          <a href="#download" className="btn-primary">▶ JOGAR AGORA</a>
          <button 
            onClick={onRegisterClick}
            className="btn-outline" 
            style={{ 
              background: 'transparent',
              border: '1px solid #c5a059',
              color: '#c5a059',
              padding: '0.7rem 2rem',
              borderRadius: '6px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            CRIAR CONTA
          </button>
          <a href="https://discord.gg/ikarusdungeons" target="_blank" rel="noreferrer" className="btn-outline">
            <svg width="18" height="14" viewBox="0 0 24 19" fill="currentColor">
              <path d="M20.317 1.6a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.6a.07.07 0 0 0-.032.027C.533 6.147-.32 10.555.099 14.907a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            DISCORD
          </a>
        </div>

        <div style={{ position:'absolute',bottom:'-120px',left:'50%',transform:'translateX(-50%)',
          display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',opacity:0.5,
          animation:'float 2.5s ease-in-out infinite' }}>
          <span style={{ fontSize:'0.65rem',letterSpacing:'3px',textTransform:'uppercase',color:'var(--gold)' }}>scroll</span>
          <div style={{ width:1,height:40,background:'linear-gradient(to bottom, var(--gold), transparent)' }} />
        </div>
      </div>
    </section>
  )
}
