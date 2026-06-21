"use client";

import { useMemo } from "react";
import * as THREE from "three";

const CORRIDOR_LEN = 120;
const CORRIDOR_MID = -45; // center of the corridor in z
const HALF_W = 9;
const FLOOR_Y = -3;
const CEIL_Y = 5.5;

/** A long white corridor with matte surfaces and black edge strips. */
export default function Room() {
  // Neon strip positions repeated down both walls (top + bottom edges).
  const strips = useMemo(() => {
    const out: { pos: [number, number, number]; size: [number, number, number] }[] =
      [];
    const seg = 6;
    for (let z = 6; z > -CORRIDOR_LEN; z -= seg) {
      // bottom strips
      out.push({ pos: [-HALF_W + 0.1, FLOOR_Y + 0.15, z], size: [0.08, 0.08, seg * 0.7] });
      out.push({ pos: [HALF_W - 0.1, FLOOR_Y + 0.15, z], size: [0.08, 0.08, seg * 0.7] });
      // top strips
      out.push({ pos: [-HALF_W + 0.1, CEIL_Y - 0.3, z], size: [0.06, 0.06, seg * 0.7] });
      out.push({ pos: [HALF_W - 0.1, CEIL_Y - 0.3, z], size: [0.06, 0.06, seg * 0.7] });
    }
    return out;
  }, []);

  // Ceiling light bars crossing the corridor at intervals.
  const ceilingBars = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let z = 4; z > -CORRIDOR_LEN; z -= 10) out.push([0, CEIL_Y - 0.05, z]);
    return out;
  }, []);

  return (
    <group>
      {/* Matte white floor (no reflection — keeps the strips from doubling) */}
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y, CORRIDOR_MID]}>
        <planeGeometry args={[HALF_W * 2, CORRIDOR_LEN]} />
        <meshStandardMaterial color="#e3e2de" metalness={0.1} roughness={0.85} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation-x={Math.PI / 2} position={[0, CEIL_Y, CORRIDOR_MID]}>
        <planeGeometry args={[HALF_W * 2, CORRIDOR_LEN]} />
        <meshStandardMaterial color="#dedcd8" metalness={0.05} roughness={0.92} />
      </mesh>

      {/* Walls */}
      <mesh rotation-y={Math.PI / 2} position={[-HALF_W, FLOOR_Y + 4, CORRIDOR_MID]}>
        <planeGeometry args={[CORRIDOR_LEN, 9]} />
        <meshStandardMaterial
          color="#dcdbd7"
          metalness={0.05}
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation-y={-Math.PI / 2} position={[HALF_W, FLOOR_Y + 4, CORRIDOR_MID]}>
        <planeGeometry args={[CORRIDOR_LEN, 9]} />
        <meshStandardMaterial
          color="#dcdbd7"
          metalness={0.05}
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Neon edge strips */}
      {strips.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <boxGeometry args={s.size} />
          <meshBasicMaterial color="#0d0d0d" />
        </mesh>
      ))}

      {/* Ceiling cross bars */}
      {ceilingBars.map((p, i) => (
        <mesh key={`c${i}`} position={p}>
          <boxGeometry args={[HALF_W * 1.6, 0.06, 0.18]} />
          <meshBasicMaterial color="#0d0d0d" />
        </mesh>
      ))}
    </group>
  );
}
