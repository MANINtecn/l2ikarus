import { useState, useRef, useEffect } from 'react'

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  // Link para uma trilha épica (placeholder - você pode trocar pelo arquivo real do L2)
  // 🎻 TRILHA MEDIEVAL: Tema de Dion (Lineage 2) - Fonte de Alta Disponibilidade
  const audioUrl = 'https://www.lineage2.com.br/arquivos/musicas/T06_Dion_Theme.mp3' 

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
      audioRef.current.volume = 0 // Inicia mudo para o fade
      fadeIn()
    }
    setIsPlaying(!isPlaying)
  }

  const fadeIn = () => {
    let vol = 0
    const interval = setInterval(() => {
      if (vol < 0.3) {
        vol += 0.02
        audioRef.current.volume = vol
      } else {
        clearInterval(interval)
      }
    }, 200)
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <audio ref={audioRef} src={audioUrl} loop />
      
      <div style={{ 
        fontSize: '0.6rem', 
        color: 'var(--gold)', 
        letterSpacing: '2px', 
        fontWeight: '700',
        textTransform: 'uppercase',
        opacity: isPlaying ? 1 : 0.4,
        transition: '0.3s'
      }}>
        {isPlaying ? 'AUDIO_ON: DION_THEME' : 'AUDIO_MUTED'}
      </div>

      <button 
        onClick={toggleAudio}
        className="glass-panel"
        style={{
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '1.2rem',
          border: '1px solid rgba(197, 160, 89, 0.2)',
          boxShadow: isPlaying ? '0 0 20px rgba(197, 160, 89, 0.3)' : 'none',
          transition: '0.4s'
        }}
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
    </div>
  )
}
