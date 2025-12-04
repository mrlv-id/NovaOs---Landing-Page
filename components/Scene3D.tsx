
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Environment, Float, ContactShadows, Text, useCursor, RenderTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Add type augmentation to fix JSX.IntrinsicElements errors for R3F elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// --- Reusable Materials ---
const bodyMaterial = new THREE.MeshStandardMaterial({
  color: "#1a1a1a",
  roughness: 0.2,
  metalness: 0.8,
});

const sideBandMaterial = new THREE.MeshStandardMaterial({
  color: "#333333",
  roughness: 0.3,
  metalness: 1.0,
});

const screenOffMaterial = new THREE.MeshStandardMaterial({
  color: "#050505",
  roughness: 0.1,
  metalness: 0.1,
});

const screenOnMaterial = new THREE.MeshStandardMaterial({
  color: "#000000",
  emissive: "#3BAFFF",
  emissiveIntensity: 0.4,
  roughness: 0.2,
});

const chipMaterial = new THREE.MeshStandardMaterial({
  color: "#3BAFFF",
  emissive: "#3BAFFF",
  emissiveIntensity: 0.8,
  roughness: 0.4,
  metalness: 0.9,
});

// --- Animated Screen Content ---
const MovingBlob = ({ color, opacity, scale, speed, offset = 0 }: { color: string, opacity: number, scale: number, speed: number, offset?: number }) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if(ref.current) {
            const t = state.clock.getElapsedTime() * speed + offset;
            ref.current.position.x = Math.sin(t) * 0.4;
            ref.current.position.y = Math.cos(t * 0.8) * 0.6;
            ref.current.scale.setScalar(scale + Math.sin(t * 2) * 0.1);
        }
    })
    return (
        <mesh ref={ref}>
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
        </mesh>
    )
}

const RotatingRing = ({ radius, width, opacity, speed, color = "#3BAFFF" }: { radius: number, width: number, opacity: number, speed: number, color?: string }) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.z += delta * speed;
        }
    });
    return (
        <mesh ref={ref}>
            <ringGeometry args={[radius, radius + width, 64]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
        </mesh>
    );
};

const ScreenContent = () => {
    return (
        <>
            <PerspectiveCamera makeDefault manual aspect={1.1/2.3} position={[0, 0, 2]} />
            <color attach="background" args={['#050505']} />
            
            {/* Deep Background - Darker, slower */}
            <MovingBlob color="#0c0a20" opacity={0.8} scale={4} speed={0.1} />
            
            {/* Mid Background - The main color blobs */}
            <MovingBlob color="#1e3a8a" opacity={0.4} scale={3} speed={0.2} />
            <MovingBlob color="#3BAFFF" opacity={0.2} scale={2} speed={0.3} offset={10} />
            
            {/* Interactive/Foreground Blobs for extra depth */}
            <MovingBlob color="#7c3aed" opacity={0.15} scale={1.5} speed={0.4} offset={20} />

            {/* Futuristic Abstract UI Layer */}
            <group position={[0, 0, 0.1]}>
                {/* Central Core */}
                <RotatingRing radius={0.1} width={0.01} opacity={0.6} speed={0.8} color="#ffffff" />
                <RotatingRing radius={0.15} width={0.005} opacity={0.5} speed={0.5} />
                <RotatingRing radius={0.22} width={0.002} opacity={0.3} speed={-0.3} />
                <RotatingRing radius={0.35} width={0.001} opacity={0.15} speed={0.1} />
                
                {/* Outer decorative rings */}
                <RotatingRing radius={0.6} width={0.002} opacity={0.05} speed={0.05} />

                {/* Abstract Data Particles */}
                <mesh position={[0.2, 0.4, 0]}>
                    <circleGeometry args={[0.01, 8]} />
                    <meshBasicMaterial color="#3BAFFF" transparent opacity={0.8} />
                </mesh>
                 <mesh position={[-0.2, -0.3, 0]}>
                    <circleGeometry args={[0.015, 8]} />
                    <meshBasicMaterial color="#3BAFFF" transparent opacity={0.6} />
                </mesh>
                <mesh position={[0.3, -0.5, 0]}>
                    <circleGeometry args={[0.008, 8]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
                </mesh>

                {/* Top/Bottom Abstract Bars */}
                <mesh position={[0, 0.9, 0]}>
                    <planeGeometry args={[0.2, 0.005]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
                </mesh>
                <mesh position={[0, -0.9, 0]}>
                    <planeGeometry args={[0.4, 0.005]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
                </mesh>
            </group>
        </>
    )
}

// --- Phone Geometry Component ---
interface PhoneMeshProps {
  exploded?: boolean;
  hovered?: boolean;
  scale?: number;
  screenContent?: boolean;
}

const PhoneMesh: React.FC<PhoneMeshProps> = ({ exploded = false, hovered = false, scale = 1, screenContent = false }) => {
  const group = useRef<THREE.Group>(null);
  const autoRotationY = useRef(0);
  const spinRef = useRef(0); // Velocity for the click interaction
  
  // Animation logic
  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Breathing animation on hover (Scale 1 -> 1.03)
    const targetScale = hovered ? 1.03 * scale : 1 * scale;
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    if (!exploded) {
       // Scroll Calculation
       const scrollY = window.scrollY;
       const scrollProgress = Math.min(scrollY / window.innerHeight, 1);

       // 1. Decelerate Rotation based on scroll
       // Start at 0.5 rad/s, slow down to 0 (complete stop) for a "landing" feel
       const rotationSpeed = THREE.MathUtils.lerp(0.5, 0, scrollProgress);
       
       // Handle spin interaction decay
       spinRef.current = THREE.MathUtils.lerp(spinRef.current, 0, 0.05);

       // Integrate rotations
       // Base rotation + Scroll Speed + Spin Interaction
       autoRotationY.current += (delta * rotationSpeed) + (spinRef.current * delta);
       
       // 2. Change Axis on Scroll (Tilt)
       // Tilt back on X axis (0.5 rad) and slightly on Z (0.15 rad) for a dynamic perspective shift
       const tiltX = scrollProgress * 0.5; 
       const tiltZ = scrollProgress * 0.15;

       // Mouse interaction
       const mouseX = (state.mouse.x * Math.PI) / 10;
       const mouseY = (state.mouse.y * Math.PI) / 20;

       // Apply Rotations with smooth lerp
       group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        autoRotationY.current + mouseX, 
        0.1
      );
      
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        mouseY + tiltX, 
        0.1
      );

      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        tiltZ,
        0.1
      );

    } else {
       // Gentle oscillation for exploded view
       group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  const handleInteraction = (e: any) => {
      if (screenContent) {
          e.stopPropagation();
          // Add a sudden rotational velocity impulse
          spinRef.current = 10;
      }
  }

  // Layer separation calculation
  const layerGap = exploded ? 0.4 : 0;
  
  // Dimensions
  const width = 1.2;
  const height = 2.4;
  const depth = 0.15;
  const radius = 0.1;

  return (
    <group ref={group} dispose={null} onClick={handleInteraction}>
      {/* Back Plate / Body */}
      <mesh position-z={-layerGap}>
         <RoundedBox args={[width, height, depth]} radius={radius} smoothness={4} material={bodyMaterial} />
      </mesh>

      {/* Motherboard / Chip Layer (Only visible if exploded) */}
      {exploded && (
        <group position-z={0}>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.8, 1.2, 0.02]} />
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.2, 0.02]}>
             <boxGeometry args={[0.3, 0.3, 0.02]} />
             <primitive object={chipMaterial} />
          </mesh>
          {/* Decorative circuits */}
          <mesh position={[0.2, -0.4, 0]}>
             <boxGeometry args={[0.4, 0.6, 0.01]} />
             <meshStandardMaterial color="#444" metalness={0.6} />
          </mesh>
        </group>
      )}

      {/* Screen Layer */}
      <group position-z={layerGap}>
        {/* Bezel/Frame */}
        <RoundedBox args={[width, height, 0.02]} radius={radius} smoothness={4} material={sideBandMaterial} />
        
        {/* Display Panel */}
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[width - 0.1, height - 0.1]} />
          {screenContent ? (
              <meshBasicMaterial toneMapped={false}>
                  <RenderTexture attach="map" anisotropy={16}>
                      <ScreenContent />
                  </RenderTexture>
              </meshBasicMaterial>
          ) : (
              <primitive object={exploded ? screenOnMaterial : screenOffMaterial} />
          )}
        </mesh>

        {/* Dynamic Notch/Island */}
        <mesh position={[0, height / 2 - 0.15, 0.012]}>
          <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
          <meshBasicMaterial color="#000" />
          <mesh rotation={[0,0,Math.PI/2]}> 
            <capsuleGeometry args={[0.06, 0.25, 4, 8]} /> 
          </mesh>
        </mesh>
        
        {/* UI Element Mockup (Visible when exploded only, if not using screenContent) */}
        {exploded && !screenContent && (
            <group position={[0, 0, 0.02]} scale={0.8}>
                 <Text 
                    position={[0, 0.4, 0]} 
                    fontSize={0.2} 
                    color="#ffffff" 
                    anchorX="center" 
                    anchorY="middle"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                >
                    12:42
                </Text>
                <mesh position={[0, -0.2, 0]}>
                   <planeGeometry args={[0.8, 0.8]} />
                   <meshBasicMaterial color="#3BAFFF" transparent opacity={0.1} />
                </mesh>
                 <mesh position={[0, -0.2, 0.01]}>
                   <planeGeometry args={[0.2, 0.2]} />
                   <meshBasicMaterial color="#3BAFFF" />
                </mesh>
            </group>
        )}
      </group>
    </group>
  );
};

// --- Hero Scene ---
export const HeroScene: React.FC = () => {
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    return (
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4.5], fov: 35 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3BAFFF" />
            
            <Float
                speed={2} 
                rotationIntensity={0.5} 
                floatIntensity={0.5} 
                floatingRange={[-0.1, 0.1]}
            >
                <group 
                    onPointerOver={() => setHover(true)} 
                    onPointerOut={() => setHover(false)}
                >
                    {/* Enable animated screen content for Hero */}
                    <PhoneMesh hovered={hovered} screenContent={true} scale={1.0} />
                </group>
            </Float>
            <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={15} blur={2.5} far={4} />
            <Environment preset="city" />
        </Canvas>
    );
};

// --- Exploded Layer Scene ---
export const LayerScene: React.FC = () => {
    return (
        <Canvas dpr={[1, 2]} camera={{ position: [2, 0, 5], fov: 40 }}>
            <ambientLight intensity={0.7} />
            <spotLight position={[5, 5, 5]} intensity={0.8} />
            
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                <group rotation={[0, -0.5, 0]}>
                    <PhoneMesh exploded={true} scale={0.9} />
                </group>
            </Float>
            <Environment preset="studio" />
        </Canvas>
    );
};

// --- Floating Icon Scene (for Testimonial/CTA) ---
export const FloatingIconScene: React.FC = () => {
    return (
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4] }}>
             <ambientLight intensity={0.5} />
             <pointLight position={[2, 2, 2]} color="#3BAFFF" intensity={2} />
             <Float speed={4} rotationIntensity={2} floatIntensity={1}>
                <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#F7F7F7" wireframe wireframeLinewidth={2} />
                </mesh>
                <mesh>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshStandardMaterial color="#3BAFFF" roughness={0.1} metalness={0.5} />
                </mesh>
             </Float>
        </Canvas>
    )
}
