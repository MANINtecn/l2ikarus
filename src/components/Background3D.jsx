import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 300 }) {
  const mesh = useRef()
  
  // Create particle data
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      const speed = 0.05 + Math.random() * 0.1
      const size = 1 + Math.random() * 4 // Length of the line
      
      // Orientation
      const rotation = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      
      // Lifecycle
      const life = Math.random() // Current "phase" in 0-1
      const lifeSpeed = 0.005 + Math.random() * 0.01

      temp.push({ xFactor, yFactor, zFactor, speed, size, rotation, life, lifeSpeed })
    }
    return temp
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    particles.forEach((particle, i) => {
      // Update life cycle
      particle.life += particle.lifeSpeed
      if (particle.life > 1) {
        particle.life = 0
        // Reset position to somewhere else for variety
        particle.xFactor = -50 + Math.random() * 100
        particle.yFactor = -50 + Math.random() * 100
        particle.zFactor = -50 + Math.random() * 100
      }

      // Calculate opacity/scale based on life (fade in, peak, fade out)
      // Sin curve for smooth fade
      const intensity = Math.sin(particle.life * Math.PI) 
      
      // Position update (slow drift)
      const t = state.clock.getElapsedTime()
      dummy.position.set(
        particle.xFactor + Math.cos(t * 0.1) * 2,
        particle.yFactor + Math.sin(t * 0.1) * 2,
        particle.zFactor
      )

      // Apply randomized rotation
      dummy.quaternion.setFromEuler(particle.rotation)
      
      // Scale: the line reaches its full length then shrinks/fades
      // We scale the Y axis primarily to make it a line
      dummy.scale.set(0.02, particle.size * intensity, 0.02)
      
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <cylinderGeometry args={[0.04, 0.04, 1, 4]} />
      <meshStandardMaterial 
        color="#7b2cbf" 
        emissive="#7b2cbf" 
        emissiveIntensity={8} 
        transparent 
        opacity={0.9} 
        blending={THREE.AdditiveBlending} 
      />
    </instancedMesh>
  )
}

export default function Background3D() {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none',
      zIndex: -1,
      background: '#050508'
    }}>
      <Canvas camera={{ position: [0, 0, 50], fov: 75 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#c5a059" />
      </Canvas>
    </div>
  )
}
