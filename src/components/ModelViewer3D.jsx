import { Canvas, useFrame } from '@react-three/fiber'
import { Center, OrbitControls, Stage, useGLTF, Environment, ContactShadows, PresentationControls, useAnimations, Float } from '@react-three/drei'
// Deploy trigger: 2026-04-10T21:18
import { Suspense, useRef, useEffect, useMemo, useState } from 'react'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

function HeroParticles({ count = 150, color = "#4ade80" }) {
  const mesh = useRef()
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80
      )
      const speed = 0.02 + Math.random() * 0.05
      const rotation = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      const life = Math.random()
      const lifeSpeed = 0.002 + Math.random() * 0.005
      const size = 2 + Math.random() * 6
      temp.push({ pos, speed, rotation, life, lifeSpeed, size })
    }
    return temp
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.getElapsedTime()
    
    particles.forEach((p, i) => {
      p.life += p.lifeSpeed
      if (p.life > 1) p.life = 0
      
      const intensity = Math.sin(p.life * Math.PI)
      
      dummy.position.set(
        p.pos.x + Math.sin(t * 0.2 + i) * 2,
        p.pos.y + Math.cos(t * 0.2 + i) * 2,
        p.pos.z
      )
      
      dummy.quaternion.setFromEuler(p.rotation)
      // Make it a long thin line
      dummy.scale.set(0.04, p.size * intensity, 0.04)
      
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]} frustumCulled={false}>
      <cylinderGeometry args={[1, 1, 1, 4]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={10} 
        transparent 
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

function Model({ url, animIndex, isHovered, isTouched, isMobile, scrollProgress }) {
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
            obj.material.emissiveIntensity = 1.2 // Reduzido de 2.5
            obj.material.toneMapped = true // Reativado para controle de cor melhor
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
        obj.material.emissiveIntensity = 0.8 + Math.sin(t * 1.5) * 0.4 // Pulsação mais discreta
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

function SceneManagement({ scrollProgress, isMobile }) {
  useFrame((state) => {
    const t = scrollProgress
    
    // 🎥 CAMERA PATH (Estilo Mont-Fort)
    // A câmera não apenas afasta, ela faz um movimento orbital suave
    const targetX = THREE.MathUtils.lerp(0, 18 * Math.sin(t * Math.PI * 0.4), t) // Mais largo para o Duo
    const targetY = THREE.MathUtils.lerp(-0.5, 3, t)
    const targetZ = 24 + (t * 80)

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.1)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.1)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1)
    
    // Foca entre os dois (offset 0)
    state.camera.lookAt(0, targetY * 0.4, 0)
  })

  return (
    <>
      <fog attach="fog" args={['#050508', 30, 160]} />
      {!isMobile && (
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.4} // Aumentado para brilhar apenas o que for realmente luz
            mipmapBlur 
            intensity={0.8} // Reduzido de 1.2
            radius={0.3} 
          />
          <Noise opacity={0.03} />
          <Vignette eskil={false} offset={0.2} darkness={1.2} />
        </EffectComposer>
      )}
    </>
  )
}

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
        camera={{ position: [0, -0.5, 24], fov: 45 }} 
        gl={{ 
          antialias: true, 
          alpha: true, 
          logarithmicDepthBuffer: !isMobile,
          powerPreference: "high-performance"
        }}
        onCreated={() => setLoading(false)}
      >
        <SceneManagement scrollProgress={scrollProgress} isMobile={isMobile} />

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
               <group style={{ opacity: 1 - scrollProgress }}>
                 {/* PERSONAGEM 1 (ESQUERDA) */}
                 <group position={[-1.2, 0, 0]} rotation={[0, 0.2, 0]}>
                   <Model 
                     url={modelUrl} 
                     animIndex={animIndex} 
                     isHovered={isHovered}
                     isTouched={isTouched}
                     isMobile={isMobile}
                     scrollProgress={scrollProgress}
                   />
                 </group>
                 {/* PERSONAGEM 2 (DIREITA) */}
                 {!isMobile && (
                   <group position={[1.2, 0, -1]} rotation={[0, -0.2, 0]}>
                     <Model 
                       url={modelUrl} 
                       animIndex={animIndex} 
                       isHovered={isHovered}
                       isTouched={isTouched}
                       isMobile={isMobile}
                       scrollProgress={scrollProgress}
                     />
                   </group>
                 )}
               </group>
             ) : null}
          </PresentationControls>

          {!isMobile && <HeroParticles color={glowColor} />}

          <ambientLight intensity={isMobile ? 0.6 : 0.4} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={isMobile ? 1000 : 1500} castShadow={!isMobile} />
          <pointLight position={[0, 5, 10]} intensity={isMobile ? 500 : 800} color={glowColor} />
          
          <Environment preset="city" />
          
          {!isMobile && <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={15} blur={2.5} far={4} color="#000" />}
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} makeDefault />
      </Canvas>

    </div>
  )
}
