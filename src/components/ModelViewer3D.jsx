import { Canvas } from '@react-three/fiber'
import { Center, OrbitControls, Stage, useGLTF, Environment, ContactShadows, PresentationControls, Html, useAnimations } from '@react-three/drei'
import { Suspense, useRef, useEffect, useMemo } from 'react'

function Model({ url }) {
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, scene)

  // 💡 GARANTE QUE O MODELO NUNCA SUMA (DESATIVA FRUSTUM CULLING)
  useMemo(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.frustumCulled = false
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
  }, [scene])

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
    <Center top>
      <primitive object={scene} scale={6.5} />
    </Center>
  )
}

// 🚀 PRE-CARREGAMENTO PARA PERFORMANCE AAA
useGLTF.preload('/assets/skins/antharas/antharas.glb')

export default function ModelViewer3D({ modelUrl, backgroundUrl, interactive = true }) {
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
              {/* No modo interativo, Stage ajusta a câmera conforme o modelo muda */}
              <Stage environment="city" intensity={0.9} contactShadow={false} adjustCamera={true}>
                {modelUrl ? <Model url={modelUrl} /> : null}
              </Stage>
            </PresentationControls>
          ) : (
            // NO HERO (interactive=false), FIXAMOS O RE-ADJUST PARA EVITAR SALTOS
            <Stage environment="city" intensity={1.1} contactShadow={false} adjustCamera={false}>
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
          <pointLight position={[-10, 5, -5]} intensity={300} color="var(--gold)" />
          <pointLight position={[10, -5, 5]} intensity={200} color="var(--purple)" />
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
