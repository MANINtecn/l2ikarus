import { Canvas, useFrame } from '@react-three/fiber'
import { Center, OrbitControls, Stage, useGLTF, Environment, ContactShadows, PresentationControls, useAnimations, Float } from '@react-three/drei'
import { Suspense, useRef, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'

function HeroParticles({ count = 200, color = "#4ade80" }) {
  const points = useRef()
  
  // 🎇 TEXTURA PROCEDURAL PARA BRILHO SUAVE (ORBES DE LUZ)
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
        size={1.8} // Tamanho aumentado para maior impacto visual
        map={texture}
        color={color}
        transparent
        opacity={0.9} // Mais visível
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function Model({ url, animIndex }) {
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, scene)

  // 💡 ESTRUTURA PARA DAR VIDA (ANIMAÇÃO PROCEDURAL)
  const bones = useRef([])

  useMemo(() => {
    bones.current = []
    
    // Se não houver animações nativas, aplicamos correções manuais de pose
    const hasAnimations = animations && animations.length > 0;

    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.frustumCulled = false
        obj.castShadow = true
        obj.receiveShadow = true
        
        // Esconder o "Cubo Branco" ou objetos de auxílio do Blender
        if (obj.name.toLowerCase().includes('cube') || obj.name.toLowerCase().includes('helper')) {
          obj.visible = false
        }
      }
      
      if (obj.isBone) {
        const n = obj.name.toLowerCase()
        if (!obj.userData.initRot) {
          obj.userData.initRot = obj.rotation.clone()
        }
        
        // Só corrigimos T-Pose manualmente se o modelo NÃO for animado
        if (!hasAnimations) {
          if (n.includes('upperarm') || n.includes('shoulder')) {
            if (n.includes(' l ') || n.includes('_l')) obj.rotation.z = obj.userData.initRot.z - 1.2
            if (n.includes(' r ') || n.includes('_r')) obj.rotation.z = obj.userData.initRot.z + 1.2
          }
        }

        if (n.includes('spine') || n.includes('head') || n.includes('arm')) {
          bones.current.push(obj)
        }
      }
    })
  }, [scene, animations])

  // 🫀 O CORAÇÃO PROCEDURAL (DÁ VIDA SEM PRECISAR DE ANIMAÇÕES DO JOGO)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const hasAnimations = animations && animations.length > 0;
    
    // Só aplicamos respiração procedural se NÃO houver animações nativas (para evitar jittering)
    if (hasAnimations) return;

    bones.current.forEach((bone) => {
      if (!bone.userData.initRot) return 

      const n = bone.name.toLowerCase()
      
      if (n.includes('spine')) {
        bone.rotation.x = bone.userData.initRot.x + Math.sin(t * 2) * 0.05
      }
      if (n.includes('head') || n.includes('neck')) {
        bone.rotation.y = bone.userData.initRot.y + Math.sin(t * 1.5) * 0.08
        bone.rotation.z = bone.userData.initRot.z + Math.cos(t * 1.2) * 0.05
      }
      if (n.includes('arm')) {
        bone.rotation.x = bone.userData.initRot.x + Math.sin(t * 2) * 0.1
      }
    })
  })

  useEffect(() => {
    if (actions && animations.length > 0) {
      console.log("IKARUS ANIMATIONS:", animations.map((a, i) => `${i}: ${a.name}`))
      
      if (animIndex !== undefined && animations[animIndex]) {
        // Tocar apenas a animação solicitada por índice
        const animName = animations[animIndex].name
        if (actions[animName]) {
          actions[animName].reset().fadeIn(0.5).play()
        }
      } else {
        // Comportamento padrão: Tocar todas (para modelos duais)
        Object.keys(actions).forEach(key => {
          actions[key].reset().fadeIn(0.5).play()
        })
      }
    }
  }, [actions, url, animIndex, animations])

  // 🎬 RENDERIZAÇÃO AUTOMÁTICA (Centraliza qualquer modelo)
  return (
    <Center>
      <primitive object={scene} scale={0.6} />
    </Center>
  )
}

// 🚀 PRE-CARREGAMENTO
useGLTF.preload('/assets/skins/antharas/ikarus_promo.glb')

export default function ModelViewer3D({ modelUrl, backgroundUrl, interactive = true, glowColor = "#c5a059", animIndex, isMobileProp }) {
  const containerRef = useRef()
  const [loading, setLoading] = useState(true)
  const isMobile = isMobileProp !== undefined ? isMobileProp : window.innerWidth <= 1024

  return (
    <div ref={containerRef} style={{ 
      width: '100%', 
      height: '100%', 
      cursor: interactive ? 'grab' : 'default', 
      position: 'relative',
      overflow: 'hidden',
      pointerEvents: interactive ? 'auto' : 'none',
      background: '#050508'
    }}>
      {/* 🔮 OVERLAY DE CARREGAMENTO EXTERNO (Fiavel no Mobile) */}
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
        camera={{ position: [0, -2, 60], fov: 45 }} 
        gl={{ 
          antialias: true, 
          alpha: true, 
          logarithmicDepthBuffer: !isMobile, // Muito pesado para mobile
          powerPreference: "high-performance"
        }}
        onCreated={() => setLoading(false)}
      >
        <Suspense fallback={null}>
          <PresentationControls
            global={false}
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, Math.PI / 8, 0]} 
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
          >
             {modelUrl ? <Model key={modelUrl} url={modelUrl} animIndex={animIndex} /> : null}
          </PresentationControls>

          {/* 🏔️ AMBIENTE CINEMATOGRÁFICO - Desativado no Mobile se muito pesado */}
          {!isMobile && <HeroParticles color={glowColor} />}

          {/* LUZES MANUAIS */}
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
