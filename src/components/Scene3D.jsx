import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, useGLTF, Environment, Float, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';

// ─── Textura de Neve Circular (Gerada via Canvas) ───────────────────────────
const createSnowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.3)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

// ─── Componente para Carregar o Asset ──────────────────────────────────────────
const GlacialLake = () => {
  const { scene } = useGLTF('/src/assets/glacial_lake.glb');
  
  useMemo(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={100} position={[0, -2, 0]} />;
};

// ─── Skybox para eliminar streaks e dar profundidade ────────────────────────
const Skybox = () => {
  return (
    <mesh scale={1000}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color="#000000" side={THREE.BackSide} />
    </mesh>
  );
};

// ─── Snowfall (Partículas de Neve Circulares) ───────────────────────────────
const Snowfall = () => {
  const ref = useRef();
  const count = 1200;
  const snowTexture = useMemo(() => createSnowTexture(), []);
  
  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      spd[i] = 0.03 + Math.random() * 0.08;
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const p = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      p[i * 3 + 1] -= speeds[i] * 30 * delta;
      if (p[i * 3 + 1] < -5) p[i * 3 + 1] = 40;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry">
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        map={snowTexture}
        size={0.18} 
        color="#ffffff" 
        transparent 
        opacity={0.6} 
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ─── Controle de Cena e Câmera ────────────────────────────────────────────────
const SceneContent = () => {
  const scroll = useScroll();
  
  useFrame((state) => {
    const offset = scroll.offset;
    
    // Trajetória refinada para evitar clipping e bordas
    let tx, ty, tz;
    if (offset < 0.33) {
      const t = offset * 3;
      tx = THREE.MathUtils.lerp(0, 5, t);
      ty = THREE.MathUtils.lerp(15, 12, t); 
      tz = THREE.MathUtils.lerp(25, 10, t); 
    } else if (offset < 0.66) {
      const t = (offset - 0.33) * 3;
      tx = THREE.MathUtils.lerp(5, -5, t);
      ty = THREE.MathUtils.lerp(12, 18, t);
      tz = THREE.MathUtils.lerp(10, -30, t);
    } else {
      const t = (offset - 0.66) * 3;
      tx = THREE.MathUtils.lerp(-5, 0, t);
      ty = THREE.MathUtils.lerp(18, 55, t);
      tz = THREE.MathUtils.lerp(-30, -100, t);
    }

    state.camera.position.lerp(new THREE.Vector3(tx, ty, tz), 0.1);
  });

  return (
    <>
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={8}
        maxDistance={150}
        minPolarAngle={Math.PI / 3} // Mais restrito
        maxPolarAngle={Math.PI / 2.2} // Travado antes do horizonte do modelo
        makeDefault
      />
      
      <PerspectiveCamera makeDefault fov={50} position={[0, 15, 25]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[40, 80, 40]} intensity={1.8} castShadow />
      
      <Environment preset="night" />

      <Suspense fallback={null}>
        <GlacialLake />
      </Suspense>

      <Snowfall />
      <Skybox />
      
      {/* Fog mais curto para esconder as bordas do modelo GlacialLake que não é infinito */}
      <fog attach="fog" args={['#000000', 0, 120]} />
    </>
  );
};

// ─── Export Principal ────────────────────────────────────────────────────────
const Scene3D = () => {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#050510' }}>
      <Canvas shadows gl={{ antialias: true, preserveDrawingBuffer: false }}>
        <color attach="background" args={['#050510']} />
        
        <Suspense fallback={null}>
          <ScrollControls pages={5} damping={0.2}>
            <SceneContent />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
