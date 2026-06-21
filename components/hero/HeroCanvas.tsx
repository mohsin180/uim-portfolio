"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { ProgressContext, type ProgressRefs, type Quality } from "./shared";
import CameraRig from "./CameraRig";
import Logo from "./Logo";
import Office from "./Office";
import Effects from "./Effects";

/**
 * The Three.js scene. The ProgressContext provider lives INSIDE the Canvas so
 * scene components can read the shared intro/scroll refs across the R3F boundary.
 */
export default function HeroCanvas({
  progress,
  quality,
}: {
  progress: ProgressRefs;
  quality: Quality;
}) {
  return (
    <Canvas
      dpr={quality.dpr}
      camera={{ position: [0, 0, 13.5], fov: 50, near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
    >
      <ProgressContext.Provider value={progress}>
        <color attach="background" args={["#e7e6e3"]} />
        <fog attach="fog" args={["#e7e6e3", 18, 44]} />

        <ambientLight intensity={0.85} />
        <directionalLight position={[5, 8, 6]} intensity={1.6} color="#ffffff" />
        <pointLight position={[-7, -3, 4]} intensity={10} color="#3f86ff" />

        <CameraRig />

        {/* Local studio environment (no remote HDR) for crisp reflections.
            Kept in its own Suspense so a slow env render never hides the scene. */}
        <Suspense fallback={null}>
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[0, 6, -8]} scale={[14, 3, 1]} />
            <Lightformer form="rect" intensity={0.8} color="#dfe7ff" position={[-10, 1, -6]} rotation-y={Math.PI / 2} scale={[10, 8, 1]} />
            <Lightformer form="rect" intensity={0.9} color="#ffffff" position={[10, 1, -6]} rotation-y={-Math.PI / 2} scale={[10, 8, 1]} />
            <Lightformer form="ring" intensity={1.0} color="#9fc0ff" position={[0, 0, 8]} scale={6} />
          </Environment>
        </Suspense>

        <Suspense fallback={null}>
          <Office />
        </Suspense>

        <Suspense fallback={null}>
          <Logo />
        </Suspense>

        <Effects quality={quality} />
      </ProgressContext.Provider>
    </Canvas>
  );
}
