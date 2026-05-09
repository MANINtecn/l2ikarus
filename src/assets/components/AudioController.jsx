import { useState, useRef, useEffect } from 'react'

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  // 🎻 TRILHA SOLO LEVELING: Renomeie seu arquivo para solo_leveling_theme.mp3 e coloque na pasta public/assets/audio/
  const audioUrl = '/assets/audio/solo_leveling_theme.mp3' 

  useEffect(() => {
    // Tentativa de Autoplay Silencioso (Browsers bloqueiam com som, então usamos fade após interação)
    const handleAutoPlay = () => {
      if (!isPlaying && audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
            fadeIn()
          })
          .catch(() => {
            console.log("Aguardando interação para iniciar áudio...")
          })
      }
    }

    // Ouvinte para a primeira interação real do usuário no site para liberar o áudio
    const handleFirstInteraction = () => {
      handleAutoPlay()
      document.removeEventListener('click', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    handleAutoPlay() // Tenta no mount também

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
    }
  }, [])

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
      audioRef.current.volume = 0
      fadeIn()
    }
    setIsPlaying(!isPlaying)
  }

  const fadeIn = () => {
    if (!audioRef.current) return
    let vol = 0
    audioRef.current.volume = 0
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
        transition: '0.3s',
        textShadow: isPlaying ? '0 0 10px var(--gold)' : 'none'
      }}>
        {isPlaying ? 'AUDIO_ON: SOLO_LEVELING_THEME' : 'AUDIO_MUTED'}
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
          transition: '0.4s',
          borderRadius: '50%'
        }}
      >
        <span style={{ animation: isPlaying ? 'pulse 2s infinite' : 'none', display: 'block' }}>
          {isPlaying ? '🔊' : '🔇'}
        </span>
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}} />
    </div>
  )
}
