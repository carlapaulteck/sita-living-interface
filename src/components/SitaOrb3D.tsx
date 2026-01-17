"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

type OrbState = "idle" | "listening" | "speaking";

interface OrbMeshProps {
  state: OrbState;
}

function OrbMesh({ state }: OrbMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Dynamic properties based on state
  const stateConfig = useMemo(() => ({
    idle: { 
      emissiveIntensity: 0.4, 
      scale: 1, 
      rotationSpeed: 0.001,
      pulseSpeed: 0.5,
      color: new THREE.Color("#4CE0E0")
    },
    listening: { 
      emissiveIntensity: 0.8, 
      scale: 1.05, 
      rotationSpeed: 0.003,
      pulseSpeed: 1.5,
      color: new THREE.Color("#4CE0E0")
    },
    speaking: { 
      emissiveIntensity: 1.0, 
      scale: 1.1, 
      rotationSpeed: 0.005,
      pulseSpeed: 2.5,
      color: new THREE.Color("#E8C27B")
    },
  }), []);

  const config = stateConfig[state];

  useFrame((frameState) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += config.rotationSpeed;
      meshRef.current.rotation.x += config.rotationSpeed * 0.5;
      
      // Pulse effect
      const pulse = Math.sin(frameState.clock.elapsedTime * config.pulseSpeed) * 0.02;
      meshRef.current.scale.setScalar(config.scale + pulse);
    }

    if (glowRef.current) {
      const glowPulse = Math.sin(frameState.clock.elapsedTime * config.pulseSpeed) * 0.1 + 0.9;
      glowRef.current.scale.setScalar(1.3 * glowPulse);
    }
  });

  return (
    <group>
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Main orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
          emissive={config.color}
          emissiveIntensity={config.emissiveIntensity}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Inner core glow */}
      <mesh>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

interface ParticleFieldProps {
  state: OrbState;
}

function ParticleField({ state }: ParticleFieldProps) {
  const particleCount = state === "idle" ? 50 : state === "listening" ? 100 : 150;
  const speed = state === "idle" ? 0.3 : state === "listening" ? 0.6 : 1.0;
  
  return (
    <Sparkles
      count={particleCount}
      scale={4}
      size={2}
      speed={speed}
      color={state === "speaking" ? "#E8C27B" : "#4CE0E0"}
      opacity={0.6}
    />
  );
}

interface SitaOrb3DProps {
  state?: OrbState;
  className?: string;
}

export function SitaOrb3D({ state = "idle", className }: SitaOrb3DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <div className="w-48 h-48 rounded-full bg-secondary/20 animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4CE0E0" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#E8C27B" />
        <spotLight
          position={[0, 5, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          color="#ffffff"
        />

        <Float
          speed={2}
          rotationIntensity={0.2}
          floatIntensity={0.3}
        >
          <OrbMesh state={state} />
        </Float>

        <ParticleField state={state} />

        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
