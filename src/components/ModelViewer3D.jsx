import { Canvas, useFrame } from '@react-three/fiber'
import { Center, OrbitControls, Stage, useGLTF, Environment, ContactShadows, PresentationControls, Html, useAnimations, Float } from '@react-three/drei'
import { Suspense, useRef, useEffect, useMemo } from 'react'

function Model({ url }) {
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, scene)

  // 💡 ESTRUTURA PARA DAR VIDA (ANIMAÇÃO PROCEDURAL)
  const bones = useRef([])

  useMemo(() => {
    bones.current = []
    scene.traverse((obj) => {
      // 1. Configurações da malha
      if (obj.isMesh) {
        obj.frustumCulled = false
        obj.castShadow = true
        obj.receiveShadow = true
      }
      
      // 2. Coleta os ossos para dar "vida" depois
      if (obj.isBone) {
        const n = obj.name.toLowerCase()
        // Salva a rotação inicial para não quebrar a malha
        if (!obj.userData.initRot) {
          obj.userData.initRot = obj.rotation.clone()
        }
        
        // Corrige a T-Pose baixando os braços
        if (n.includes('upperarm') || n.includes('shoulder')) {
          if (n.includes(' l ') || n.includes('_l')) obj.rotation.z = obj.userData.initRot.z - 1.2
          if (n.includes(' r ') || n.includes('_r')) obj.rotation.z = obj.userData.initRot.z + 1.2
        }

        // Guarda partes importantes para a animação de respiração
        if (n.includes('spine') || n.includes('head') || n.includes('arm')) {
          bones.current.push(obj)
        }
      }
    })
  }, [scene])

  // 🫀 O CORAÇÃO PROCEDURAL (DÁ VIDA SEM PRECISAR DE ANIMAÇÕES DO JOGO)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    bones.current.forEach((bone) => {
      if (!bone.userData.initRot) return // Segurança contra NaN

      const n = bone.name.toLowerCase()
      
      // Respiração no peito/coluna
      if (n.includes('spine')) {
        bone.rotation.x = bone.userData.initRot.x + Math.sin(t * 2) * 0.05
      }
      // Movimento leve da cabeça olhando ao redor
      if (n.includes('head') || n.includes('neck')) {
        bone.rotation.y = bone.userData.initRot.y + Math.sin(t * 1.5) * 0.08
        bone.rotation.z = bone.userData.initRot.z + Math.cos(t * 1.2) * 0.05
      }
      // Braços flutuando como asas de energia
      if (n.includes('arm')) {
        bone.rotation.x = bone.userData.initRot.x + Math.sin(t * 2) * 0.1
      }
    })
  })

  useEffect(() => {
    if (actions) {
      const names = Object.keys(actions)
      if (names.length > 0) {
        const idleAnim = names.find(n => n.toLowerCase().includes('idle')) || names[0]
        if (actions[idleAnim]) {
          actions[idleAnim].reset().fadeIn(0.5).play()
        }
      }
    }
  }, [actions, url])

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3} floatingRange={[-0.05, 0.05]}>
      <Center top>
        <primitive object={scene} />
      </Center>
    </Float>
  )
}

// 🚀 PRE-CARREGAMENTO PARA PERFORMANCE AAA
useGLTF.preload('/assets/skins/antharas/antharas.glb')

export default function ModelViewer3D({ modelUrl, backgroundUrl, interactive = true, glowColor = "#c5a059" }) {
  const containerRef = useRef()

  return (
    <div ref={containerRef} style={{ 
      width: '100%', 
      height: '100%', 
      cursor: interactive ? 'grab' : 'default', 
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: backgroundUrl ? `url("${backgroundUrl}")` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      border: backgroundUrl ? '1px solid rgba(197, 160, 89, 0.2)' : 'none',
      boxShadow: backgroundUrl ? 'inset 0 0 100px rgba(0,0,0,0.4)' : 'none',
      pointerEvents: interactive ? 'auto' : 'none'
    }}>
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 5], fov: 40 }} // Câmera levemente mais recuada para estabilidade
        gl={{ antialias: true, alpha: true, logarithmicDepthBuffer: true }}
      >
        <Suspense fallback={<Html center><div style={{ color: 'var(--gold)', whiteSpace: 'nowrap', textShadow: '0 0 10px rgba(197,160,89,0.5)', fontSize: '0.8rem', letterSpacing: '4px' }}>CARREGANDO ALMA...</div></Html>}>
          {interactive ? (
            <PresentationControls
              global={false}
              config={{ mass: 2, tension: 500 }}
              snap={{ mass: 4, tension: 1500 }}
              rotation={[0, 0.3, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <Stage environment="city" intensity={0.9} contactShadow={false} adjustCamera={1.05}>
                {modelUrl ? <Model url={modelUrl} /> : null}
              </Stage>
            </PresentationControls>
          ) : (
            <Stage environment="city" intensity={1.1} contactShadow={false} adjustCamera={1.05}>
               {modelUrl ? <Model url={modelUrl} /> : null}
            </Stage>
          )}

          <ContactShadows 
            position={[0, -1.2, 0]} 
            opacity={0.6} 
            scale={12} 
            blur={2.5} 
            far={2} 
            color="#000000" 
          />

          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1000} color="#fff" castShadow />
          
          {/* BACK-AURA (O brilho que sai de trás da skin) */}
          <pointLight position={[0, 0, -2]} intensity={800} color={glowColor} />
          <pointLight position={[0, 2, -1]} intensity={400} color={glowColor} />
          
          <pointLight position={[-10, 5, -5]} intensity={300} color="#c5a059" />
          <pointLight position={[10, -5, 5]} intensity={200} color="#9021a8" />
          <directionalLight position={[0, 10, -10]} intensity={3.5} color="#fff" />
          
          <Environment preset="city" />
        </Suspense>

        {interactive && (
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            minDistance={2}
            maxDistance={8}
            makeDefault 
          />
        )}
      </Canvas>
    </div>
  )
}
