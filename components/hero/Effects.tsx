"use client";

import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { Quality } from "./shared";

/** Cinematic post stack. DOF + Noise drop on lower tiers for performance. */
export default function Effects({ quality }: { quality: Quality }) {
  return (
    <EffectComposer multisampling={quality.tier === "desktop" ? 2 : 0}>
      <Bloom
        intensity={0.32}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.25}
        mipmapBlur
        radius={0.6}
      />
      {quality.dof ? (
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.04}
          bokehScale={1.6}
        />
      ) : (
        <></>
      )}
      <Vignette eskil={false} offset={0.55} darkness={0.12} />
      {quality.noise ? (
        <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.015} />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
