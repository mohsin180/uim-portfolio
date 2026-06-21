"use client";

import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Keys out the logo's white background so only the UIM mark shows on the screen.
const fragment = /* glsl */ `
  uniform sampler2D uTex;
  varying vec2 vUv;
  void main() {
    vec4 t = texture2D(uTex, vUv);
    float whiteness = min(min(t.r, t.g), t.b);
    float alpha = (1.0 - smoothstep(0.62, 0.92, whiteness)) * t.a;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(t.rgb * 1.25, alpha);
  }
`;

/** The UIM logo on a device screen (transparent over the dark display). */
export default function DeviceLogo({
  position,
  size,
}: {
  position: [number, number, number];
  size: number;
}) {
  const tex = useTexture("/logouimm.png");

  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
  }, [tex]);

  const uniforms = useMemo(() => ({ uTex: { value: tex } }), [tex]);

  return (
    <mesh position={position}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        toneMapped={false}
      />
    </mesh>
  );
}
