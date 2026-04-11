import { Canvas, useFrame } from '@react-three/fiber'
import { Center, OrbitControls, Stage, useGLTF, Environment, ContactShadows, PresentationControls, useAnimations, Float } from '@react-three/drei'
// Deploy trigger: 2026-04-10T21:18
import { Suspense, useRef, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'

function HeroParticles({ count = 200, color = "#4ade80" }) {
  const points = useRef()
  
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])

  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const velocity = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
       const r = 5 + Math.random() * 45
       const theta = Math.random() * Math.PI * 2
       const phi = Math.acos(2 * Math.random() - 1)
       
       pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
       pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
       pos[i * 3 + 2] = r * Math.cos(phi)
       
       velocity[i * 3] = (Math.random() - 0.5) * 0.04
       velocity[i * 3 + 1] = (Math.random() - 0.5) * 0.04
       velocity[i * 3 + 2] = (Math.random() - 0.5) * 0.04
    }
    return { pos, velocity }
  }, [count])

  useFrame((state) => {
    if (points.current) {
       const positions = points.current.geometry.attributes.position.array
       const time = state.clock.getElapsedTime()
       
       for (let i = 0; i < count; i++) {
         positions[i * 3] += particles.velocity[i * 3]
         positions[i * 3 + 1] += particles.velocity[i * 3 + 1] + Math.sin(time + i) * 0.02
         positions[i * 3 + 2] += particles.velocity[i * 3 + 2]
         
         const dist = Math.sqrt(positions[i * 3] ** 2 + positions[i * 3 + 1] ** 2 + positions[i * 3 + 2] ** 2)
         if (dist > 50) {
            positions[i * 3] *= 0.1
            positions[i * 3 + 1] *= 0.1
            positions[i * 3 + 2] *= 0.1
         }
       }
       points.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.pos}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.8}
        map={texture}
        color={color}
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function Model({ url, animIndex, isHovered, isTouched, isMobile }) {
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, scene)
  const groupRef = useRef()
  const bones = useRef([])
  const coreBones = useRef([]) // 🦴 Ossos que servirão de fonte de luz (Peito/Spine)

  useMemo(() => {
    bones.current = []
    coreBones.current = []
    const hasAnimations = animations && animations.length > 0;

    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.frustumCulled = false
        obj.castShadow = true
        obj.receiveShadow = true
        
        if (obj.material) {
          const color = obj.material.color
          const isGreenish = color.g > color.r && color.g > color.b
          
          if (isGreenish || obj.material.emissiveMap) {
            obj.material.emissive = new THREE.Color("#4ade80")
            obj.material.emissiveIntensity = 2.5
            obj.material.toneMapped = false
          }
        }

        if (obj.name.toLowerCase().includes('cube') || obj.name.toLowerCase().includes('helper')) {
          obj.visible = false
        }
      }
      
      if (obj.isBone) {
        const n = obj.name.toLowerCase()
        if (!obj.userData.initRot) obj.userData.initRot = obj.rotation.clone()
        
        // 🟢 IDENTIFICAR NÚCLEOS (Duo Support)
        if (n.includes('spine02') || n.includes('spine_02')) {
          coreBones.current.push(obj)
        }

        if (n.includes('spine') || n.includes('head') || n.includes('arm')) {
          bones.current.push(obj)
        }
      }
    })
  }, [scene, animations])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    // 🌊 PULSAÇÃO DOS MATERIAIS
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material && obj.material.emissiveIntensity > 0) {
        obj.material.emissiveIntensity = 2 + Math.sin(t * 1.5) * 1
      }
    })

    const hasAnimations = animations && animations.length > 0;
    if (hasAnimations) return;

    bones.current.forEach((bone) => {
      if (!bone.userData.initRot) return 
      const n = bone.name.toLowerCase()
      if (n.includes('spine')) bone.rotation.x = bone.userData.initRot.x + Math.sin(t * 2) * 0.05
      if (n.includes('head') || n.includes('neck')) {
        bone.rotation.y = bone.userData.initRot.y + Math.sin(t * 1.5) * 0.08
        bone.rotation.z = bone.userData.initRot.z + Math.cos(t * 1.2) * 0.05
      }
      if (n.includes('arm')) bone.rotation.x = bone.userData.initRot.x + Math.sin(t * 2) * 0.1
    })

    // 🔄 ROTAÇÃO 360 AO HOVER (Desktop) - Aplicada ao Grupo
    if (isHovered && !isMobile && groupRef.current) {
      groupRef.current.rotation.y += 0.02 // Aumentada um pouco a velocidade
    }

    // 📏 ESCALA DINÂMICA (Scroll) - Faz a skin diminuir conforme afasta
    if (groupRef.current) {
      const scale = 1 - (scrollProgress * 0.7) // Encolhe até 30% do tamanho original
      groupRef.current.scale.set(scale, scale, scale)
    }
  })

  useEffect(() => {
    if (actions && animations.length > 0) {
      // Se for mobile, espera o toque se não tiver tocando
      if (isMobile && !isTouched) return;

      const provokeIndex = animations.findIndex(a => a.name.toLowerCase().includes('provoke'))
      const finalIndex = provokeIndex !== -1 ? provokeIndex : animIndex

      if (finalIndex !== undefined && animations[finalIndex]) {
        const animName = animations[finalIndex].name
        if (actions[animName]) {
          actions[animName].reset().fadeIn(0.5).play()
        }
      } else {
        Object.keys(actions).forEach(key => {
          actions[key].reset().fadeIn(0.5).play()
        })
      }
    }
  }, [actions, url, animIndex, animations, isTouched, isMobile])

  return (
    <group ref={groupRef}>
      <Center>
        <primitive 
          object={scene} 
          scale={0.25} 
          // 🔄 PERFIL LATERAL: Anão na esquerda, Kamael na direita (-90°)
          rotation={[0, -Math.PI / 2, 0]} 
        />
      </Center>










      
      {/* 💡 LUZES DINÂMICAS (Uma para cada "coração" identificado) */}
      {coreBones.current.map((bone, idx) => (
        <primitive key={idx} object={bone}>
           <pointLight 
            color="#4ade80" 
            intensity={1500} 
            distance={8} 
            decay={2}
          />
        </primitive>
      ))}
    </group>
  )
}

useGLTF.preload('/assets/skins/antharas/ikarus_promo.glb')

export default function ModelViewer3D({ modelUrl, backgroundUrl, interactive = true, glowColor = "#c5a059", animIndex, isMobileProp }) {
  const containerRef = useRef()
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0) // 0 a 1
  const isMobile = isMobileProp !== undefined ? isMobileProp : window.innerWidth <= 1024

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = 1200 // Aumentado para o efeito durar mais
      const progress = Math.min(1, scrollY / maxScroll)
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      ref={containerRef} 
      onPointerMove={() => !isMobile && !isHovered && setIsHovered(true)}
      onPointerEnter={() => !isMobile && setIsHovered(true)}
      onPointerLeave={() => !isMobile && setIsHovered(false)}
      onTouchStart={() => isMobile && setIsTouched(true)}
      style={{ 
        width: '100%', 
        height: '100%', 
        cursor: interactive ? 'grab' : 'default', 
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent', // 👈 Crucial para ver as partículas atrás
        opacity: 1 - scrollProgress,
        zIndex: 2,
        transition: 'opacity 0.2s ease-out'
      }}
    >
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,5,8,0.8)', backdropFilter: 'blur(10px)',
          color: 'var(--gold)', letterSpacing: '4px', fontSize: '0.8rem',
          fontFamily: 'var(--font-heading)'
        }}>
          INICIALIZANDO ALMA...
        </div>
      )}

      <Canvas 
        shadows={!isMobile} 
        dpr={isMobile ? 1 : [1, 2]} 
        // 🚀 ZOOM ULTRA PROFUNDO: Vai até z=110 (antes era 80)
        camera={{ position: [0, -0.5, 24 + (scrollProgress * 86)], fov: 45 }} 
        gl={{ 
          antialias: true, 
          alpha: true, 
          logarithmicDepthBuffer: !isMobile,
          powerPreference: "high-performance"
        }}
        onCreated={() => setLoading(false)}
      >
        <Suspense fallback={null}>
          <PresentationControls
            global={false}
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0, 0]} 
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
          >
             {modelUrl ? (
               <Model 
                 key={modelUrl} 
                 url={modelUrl} 
                 animIndex={animIndex} 
                 isHovered={isHovered}
                 isTouched={isTouched}
                 isMobile={isMobile}
               />
             ) : null}
          </PresentationControls>

          {!isMobile && <HeroParticles color={glowColor} />}

          <ambientLight intensity={isMobile ? 2 : 1.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={isMobile ? 1500 : 2500} castShadow={!isMobile} />
          <pointLight position={[0, 5, 10]} intensity={isMobile ? 1000 : 1500} color={glowColor} />
          
          <Environment preset="city" />
          
          {!isMobile && <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={15} blur={2.5} far={4} color="#000" />}
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} makeDefault />
      </Canvas>

    </div>
  )
}
