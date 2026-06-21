"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { WSContext, type WSProgress } from "./context";
import type { Quality } from "../hero/shared";
import CameraTravel from "./CameraTravel";
import Room from "./Room";

/**
 * The 3D corridor the visitor travels through. The progress provider lives
 * inside the Canvas so scene components can read the shared scroll ref.
 */
export default function WorkspaceCanvas({
  progress,
  quality,
}: {
  progress: WSProgress;
  quality: Quality;
}) {
  return (
    <Canvas
      dpr={quality.dpr}
      camera={{ position: [0, 0.5, 10], fov: 60, near: 0.1, far: 140 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <WSContext.Provider value={progress}>
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 16, 58]} />

        <ambientLight intensity={0.85} />
        <hemisphereLight args={["#ffffff", "#cbcac6", 0.5]} />
        <spotLight
          position={[0, 7, 6]}
          angle={0.75}
          penumbra={1}
          intensity={20}
          distance={70}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          {/* Local environment map (no remote HDR) for metallic/glass reflections */}
          <Environment resolution={256} frames={1}>
            <Lightformer
              form="rect"
              intensity={1.1}
              color="#ffffff"
              position={[0, 5, -12]}
              scale={[12, 2, 1]}
            />
            <Lightformer
              form="rect"
              intensity={0.9}
              color="#ffffff"
              position={[-9, 0, -24]}
              rotation-y={Math.PI / 2}
              scale={[10, 6, 1]}
            />
            <Lightformer
              form="rect"
              intensity={0.9}
              color="#ffffff"
              position={[9, 0, -24]}
              rotation-y={-Math.PI / 2}
              scale={[10, 6, 1]}
            />
          </Environment>

          <Room />
        </Suspense>

        <CameraTravel />

        <EffectComposer multisampling={quality.tier === "desktop" ? 2 : 0}>
          <Bloom
            intensity={0.04}
            luminanceThreshold={0.97}
            luminanceSmoothing={0.2}
            mipmapBlur
            radius={0.5}
          />
          <Vignette eskil={false} offset={0.4} darkness={0.32} />
        </EffectComposer>
      </WSContext.Provider>
    </Canvas>
  );
}
