"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { smoothstep, useProgress } from "./shared";

const LOGO_ASPECT = 1024 / 1024; // 1.0 (square)
const LOGO_HEIGHT = 4.7;
const LOGO_WIDTH = LOGO_HEIGHT * LOGO_ASPECT;

/** Keys out the white background of the PNG and emerges the mark from darkness. */
const logoVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const logoFragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uReveal;   // 0..1 intro brightness/alpha
  uniform float uFade;     // 0..1 extra fade (scroll)
  uniform float uGlow;     // emissive boost for bloom
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uTex, vUv);

    // White-background PNG — key out the white so only the mark shows.
    float whiteness = min(min(tex.r, tex.g), tex.b);
    float alpha = (1.0 - smoothstep(0.6, 0.9, whiteness)) * tex.a;
    if (alpha < 0.012) discard;

    // On the light room palette the mark reads in its real colours; a touch of
    // extra depth keeps it crisp against the warm-white background.
    vec3 col = tex.rgb * 1.06;
    col += tex.rgb * uGlow * 0.1;

    gl_FragColor = vec4(col, alpha * uReveal * uFade);
  }
`;

function LogoPlane() {
  const tex = useTexture("/logouimm.png");
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { intro, scroll } = useProgress();

  // Correct color space for the brand colors.
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
  }, [tex]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uReveal: { value: 0 },
      uFade: { value: 1 },
      uGlow: { value: 0 },
    }),
    [tex]
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const logoP = smoothstep(0.0, 0.55, intro.current);
    const sc = scroll.current;

    if (matRef.current) {
      matRef.current.uniforms.uReveal.value = logoP;
      // Glow pulses gently once revealed, dims as you scroll away.
      matRef.current.uniforms.uGlow.value =
        logoP * (0.5 + 0.5 * Math.sin(t * 1.2)) * (1 - sc * 0.7);
      // Move in 3D through the scroll, then fade out to hand off to the button.
      matRef.current.uniforms.uFade.value = 1 - smoothstep(0.5, 0.74, sc);
    }

    if (groupRef.current) {
      const g = groupRef.current;
      const introScale = 0.82 + 0.18 * logoP;
      g.scale.setScalar(introScale);
      g.position.y = Math.sin(t * 0.6) * 0.06;

      // 3D tilt follows the cursor on hover only — no rotation while scrolling.
      const px = state.pointer.x;
      const py = state.pointer.y;
      const targetY = px * 0.5; // yaw: cursor only
      const targetX = -py * 0.38; // pitch: cursor only

      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 4, delta);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 4, delta);
      g.rotation.z = 0;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[LOGO_WIDTH, LOGO_HEIGHT]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={logoVertex}
          fragmentShader={logoFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Procedural radial glow that radiates blue light from behind the logo. */
const glowFragment = /* glsl */ `
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float d = distance(vUv, vec2(0.5));
    float g = smoothstep(0.5, 0.0, d);
    g = pow(g, 2.2);
    gl_FragColor = vec4(uColor, g * uIntensity);
  }
`;

const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function Glow() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { intro, scroll } = useProgress();

  const uniforms = useMemo(
    () => ({
      uIntensity: { value: 0 },
      uColor: { value: new THREE.Color("#9fc0ff") },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const glowP = smoothstep(0.15, 0.7, intro.current);
    if (matRef.current) {
      matRef.current.uniforms.uIntensity.value =
        glowP * (0.16 + 0.04 * Math.sin(t * 1.4)) * (1 - scroll.current * 0.85);
    }
    if (meshRef.current) {
      const s = 1 + 0.04 * Math.sin(t * 1.4);
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -0.6]}>
      <planeGeometry args={[LOGO_WIDTH * 1.5, LOGO_WIDTH * 1.5]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={glowVertex}
        fragmentShader={glowFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function Logo() {
  return (
    <group>
      <Glow />
      <LogoPlane />
    </group>
  );
}
