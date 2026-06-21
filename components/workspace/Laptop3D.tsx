"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import DeviceLogo from "./DeviceLogo";

function LaptopModel() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = -0.5 + Math.sin(t * 0.45) * 0.35;
    group.current.position.y = -0.35 + Math.sin(t * 0.9) * 0.06;
  });

  const aluminium = (
    <meshStandardMaterial color="#cdced3" metalness={0.95} roughness={0.32} />
  );

  return (
    <group ref={group} rotation={[0.12, -0.5, 0]} scale={1.1}>
      {/* base / keyboard deck */}
      <RoundedBox args={[3.1, 0.12, 2.1]} radius={0.045} smoothness={4}>
        {aluminium}
      </RoundedBox>
      {/* keyboard well */}
      <mesh position={[0, 0.063, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.7, 1.45]} />
        <meshStandardMaterial color="#202024" metalness={0.5} roughness={0.55} />
      </mesh>
      {/* trackpad */}
      <mesh position={[0, 0.064, -0.62]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.0, 0.62]} />
        <meshStandardMaterial color="#bdbec3" metalness={0.7} roughness={0.28} />
      </mesh>

      {/* lid — hinged at the back edge, tilted open */}
      <group position={[0, 0.06, -1.02]} rotation={[-0.28, 0, 0]}>
        <RoundedBox
          args={[3.0, 2.0, 0.08]}
          radius={0.045}
          smoothness={4}
          position={[0, 1.0, 0]}
        >
          {aluminium}
        </RoundedBox>
        {/* screen */}
        <mesh position={[0, 1.0, 0.05]}>
          <planeGeometry args={[2.72, 1.72]} />
          <meshStandardMaterial
            color="#070b14"
            emissive="#11254a"
            emissiveIntensity={0.4}
            metalness={0.1}
            roughness={0.18}
          />
        </mesh>
        {/* UIM logo centred on the screen */}
        <DeviceLogo position={[0, 1.0, 0.052]} size={1.45} />
      </group>
    </group>
  );
}

/** A realistic 3D laptop rendered in WebGL (smooth, no CSS lag). */
export default function Laptop3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.1, 6.4], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 5]} intensity={1.4} />
      <directionalLight position={[-5, 3, 2]} intensity={0.5} color="#cfe0ff" />

      <Suspense fallback={null}>
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, 2]} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={2} color="#ffffff" position={[-5, 2, 1]} rotation-y={Math.PI / 2} scale={[6, 5, 1]} />
          <Lightformer form="rect" intensity={2} color="#dfe8ff" position={[5, 2, 1]} rotation-y={-Math.PI / 2} scale={[6, 5, 1]} />
        </Environment>

        <LaptopModel />
      </Suspense>
    </Canvas>
  );
}
