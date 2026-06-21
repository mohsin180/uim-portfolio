"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { useWS, Z_START, Z_END } from "./context";

/**
 * Cinematic dolly: scroll drives the camera forward through the corridor,
 * with a gentle pointer parallax and a subtle sway so it never feels static.
 */
export default function CameraTravel() {
  const { camera } = useThree();
  const { scroll } = useWS();

  useFrame((state, delta) => {
    const p = scroll.current;
    const t = state.clock.elapsedTime;

    const z = THREE.MathUtils.lerp(Z_START, Z_END, p);
    const swayX = Math.sin(t * 0.25) * 0.4;
    const swayY = Math.cos(t * 0.2) * 0.2;

    const px = state.pointer.x;
    const py = state.pointer.y;

    easing.damp3(
      camera.position,
      [swayX + px * 1.3, 0.5 + swayY + py * 0.7, z],
      0.5,
      delta
    );
    // Always look further down the corridor.
    camera.lookAt(px * 0.8, 0.4, z - 14);
  });

  return null;
}
