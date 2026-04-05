import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 1500 }) {
  const mesh = useRef()
  const light = useRef()
  
  // Create particle positions
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    // Particle movement
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      
      dummy.position.set(
        (xFactor + Math.cos(t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (yFactor + Math.sin(t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (zFactor + Math.cos(t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      
      dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshPhongMaterial color="#7b2cbf" emissive="#7b2cbf" emissiveIntensity={2} transparent opacity={0.6} />
      </instancedMesh>
    </>
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
      <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#c5a059" />
        <Particles />
      </Canvas>
    </div>
  )
}
