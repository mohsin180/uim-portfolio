"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { useProgress } from "./shared";

/**
 * Single source of truth for camera motion:
 *  - intro push (logo emerges, camera eases in from far)
 *  - scroll push (camera drives forward through the scene)
 *  - subtle mouse parallax
 * Also advances the shared intro progress each frame.
 */
export default function CameraRig() {
  const { camera } = useThree();
  const { intro, scroll } = useProgress();

  useFrame((state, delta) => {
    // Advance intro toward 1 (slow cinematic reveal).
    intro.current = THREE.MathUtils.damp(intro.current, 1, 0.55, delta);

    // Camera depth: far -> rest (intro), then pull BACK on scroll so the office
    // zooms out as you head into the room.
    const restZ = THREE.MathUtils.lerp(13.5, 9, intro.current);
    const z = THREE.MathUtils.lerp(restZ, 12.5, scroll.current);

    // Subtle pointer parallax, gently damped.
    const px = state.pointer.x;
    const py = state.pointer.y;
    easing.damp3(
      camera.position,
      [px * 0.9, py * 0.6, z],
      0.4,
      delta
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}
