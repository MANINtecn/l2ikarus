import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import logoWhite from '../images/logo_white.png'

export default function Preloader() {
  const containerRef = useRef(null)
  const triangleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação da logo
      gsap.from(".preloader-logo", {
        duration: 1.5,
        y: 20,
        opacity: 0,
        scale: 0.8,
        ease: "expo.out"
      })

      // Pulsação constante e brilho
      gsap.to(".preloader-logo", {
        duration: 2,
        opacity: 0.8,
        scale: 1.05,
        filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))',
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100000,
      background: '#020203',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem'
    }}>
      <div style={{ position: 'relative', width: '180px', display: 'flex', justifyContent: 'center' }}>
        <img 
          src={logoWhite} 
          alt="L2 Ikarus Logo" 
          className="preloader-logo"
          style={{
            width: '100%',
            height: 'auto',
            filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.2))'
          }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 className="cinzel" style={{ color: '#fff', letterSpacing: '8px', fontSize: '1rem', marginBottom: '0.5rem' }}>
          IKARUS
        </h2>
        <div style={{ width: '150px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '0 auto' }} />
        <p style={{ color: 'var(--gold)', fontSize: '0.5rem', letterSpacing: '4px', marginTop: '10px', fontWeight: '900' }}>
          INITIALIZING ELITE INTERFACE
        </p>
      </div>
    </div>
  )
}
