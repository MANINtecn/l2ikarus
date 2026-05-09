import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Preloader() {
  const containerRef = useRef(null)
  const triangleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação dos fragmentos (shards)
      gsap.from(".shard", {
        duration: 1.5,
        x: (i) => (i === 0 ? -100 : i === 1 ? 0 : 100),
        y: (i) => (i === 1 ? -100 : 50),
        opacity: 0,
        rotation: 45,
        stagger: 0.2,
        ease: "expo.out"
      })

      // Pulsação constante
      gsap.to(".shard", {
        duration: 2,
        opacity: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.1
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
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        {/* Simulação do logo triangular com fragmentos via CSS */}
        {/* Shard 1 (L2) */}
        <div className="shard" style={{
          position: 'absolute',
          left: '0', bottom: '0',
          width: '45px', height: '80px',
          background: 'var(--gold)',
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%)',
          opacity: 0.9
        }} />
        {/* Shard 2 (I) */}
        <div className="shard" style={{
          position: 'absolute',
          left: '50%', transform: 'translateX(-50%)',
          top: '0',
          width: '15px', height: '100px',
          background: '#fff',
          opacity: 1
        }} />
        {/* Shard 3 (K) */}
        <div className="shard" style={{
          position: 'absolute',
          right: '0', bottom: '0',
          width: '45px', height: '80px',
          background: 'var(--gold)',
          clipPath: 'polygon(0% 100%, 0% 0%, 100% 100%)',
          opacity: 0.9
        }} />
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
