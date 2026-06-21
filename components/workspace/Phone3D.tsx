"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import DeviceLogo from "./DeviceLogo";

function PhoneModel() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = -0.35 + Math.sin(t * 0.5) * 0.42;
    group.current.position.y = Math.sin(t * 0.9) * 0.08;
  });

  return (
    <group ref={group} rotation={[0.1, -0.35, 0.04]} scale={1.05}>
      {/* body */}
      <RoundedBox args={[1.75, 3.55, 0.22]} radius={0.2} smoothness={6}>
        <meshStandardMaterial color="#1b1b20" metalness={0.85} roughness={0.3} />
      </RoundedBox>

      {/* screen */}
      <mesh position={[0, 0, 0.116]}>
        <planeGeometry args={[1.54, 3.32]} />
        <meshStandardMaterial
          color="#070b14"
          emissive="#12243c"
          emissiveIntensity={0.45}
          roughness={0.14}
          metalness={0.1}
        />
      </mesh>
      {/* screen gradient glow */}
      <mesh position={[0, 0.2, 0.117]}>
        <planeGeometry args={[1.54, 1.8]} />
        <meshBasicMaterial color="#16294d" transparent opacity={0.55} toneMapped={false} />
      </mesh>

      {/* UIM logo centred on the screen */}
      <DeviceLogo position={[0, 0.1, 0.13]} size={1.1} />

      {/* notch */}
      <mesh position={[0, 1.5, 0.122]}>
        <planeGeometry args={[0.5, 0.13]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}

/** A realistic 3D smartphone rendered in WebGL (smooth, no CSS lag). */
export default function Phone3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.6], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <directionalLight position={[-5, 2, 2]} intensity={0.5} color="#cfe0ff" />

      <Suspense fallback={null}>
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, 2]} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={2} color="#ffffff" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 5, 1]} />
          <Lightformer form="rect" intensity={2} color="#dfe8ff" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[6, 5, 1]} />
        </Environment>

        <PhoneModel />
      </Suspense>
    </Canvas>
  );
}
