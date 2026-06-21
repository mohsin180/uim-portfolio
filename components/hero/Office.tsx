"use client";

import { RoundedBox, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* Room-matched palette (same tones as the workspace corridor). */
const FLOOR = "#e3e2de";
const WALL = "#dcdbd7";
const WALL_SIDE = "#d8d7d3";
const STRIP = "#0d0d0d";
const DESK_TOP = "#ece9e4";
const METAL = "#c9ccd2";
const DARK = "#23262b";
const SCREEN = "#243049";

/* ---- desk + laptop + chair --------------------------------------------- */

function Laptop({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={0.62}>
      {/* base */}
      <RoundedBox args={[1.4, 0.07, 1.0]} radius={0.03} smoothness={3} position={[0, 0.035, 0]}>
        <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.32} />
      </RoundedBox>
      {/* lid + screen, hinged at the back edge and tilted toward the camera */}
      <group position={[0, 0.07, -0.5]} rotation={[-1.92, 0, 0]}>
        <RoundedBox args={[1.4, 1.0, 0.05]} radius={0.03} smoothness={3} position={[0, 0.5, 0]}>
          <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.5, 0.032]}>
          <planeGeometry args={[1.26, 0.86]} />
          <meshStandardMaterial color={SCREEN} emissive={SCREEN} emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Chair({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.92, 0]} castShadow>
        <boxGeometry args={[0.82, 0.1, 0.8]} />
        <meshStandardMaterial color="#3a3d44" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.4, -0.36]} castShadow>
        <boxGeometry args={[0.82, 0.9, 0.1]} />
        <meshStandardMaterial color="#3a3d44" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.9, 10]} />
        <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.06, 16]} />
        <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Desk({
  position,
  withChair = true,
}: {
  position: [number, number, number];
  withChair?: boolean;
}) {
  const legs: [number, number][] = [
    [-1.45, -0.6],
    [1.45, -0.6],
    [-1.45, 0.6],
    [1.45, 0.6],
  ];
  return (
    <group position={position}>
      {/* top */}
      <RoundedBox args={[3.3, 0.12, 1.5]} radius={0.04} smoothness={3} position={[0, 1.2, 0]} castShadow>
        <meshStandardMaterial color={DESK_TOP} roughness={0.55} metalness={0.05} />
      </RoundedBox>
      {/* legs */}
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.6, z]} castShadow>
          <boxGeometry args={[0.1, 1.2, 0.1]} />
          <meshStandardMaterial color={DARK} metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
      <Laptop position={[0, 1.27, 0.05]} />
      {withChair && <Chair position={[0, 0, 1.5]} rotation={Math.PI} />}
    </group>
  );
}

/* ---- wall scenery ------------------------------------------------------- */

function WallArt({
  position,
  color,
  size = [2.2, 1.5],
}: {
  position: [number, number, number];
  color: string;
  size?: [number, number];
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[size[0], size[1], 0.08]} />
        <meshStandardMaterial color={STRIP} roughness={0.45} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[size[0] - 0.28, size[1] - 0.28]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Plant({ position }: { position: [number, number, number] }) {
  const blobs: [number, number, number, number][] = [
    [0, 0.95, 0, 0.52],
    [0.28, 1.25, 0.12, 0.4],
    [-0.24, 1.18, -0.12, 0.42],
    [0.04, 1.5, 0, 0.36],
  ];
  return (
    <group position={position}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.22, 0.62, 16]} />
        <meshStandardMaterial color={DARK} roughness={0.7} />
      </mesh>
      {blobs.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <icosahedronGeometry args={[s, 0]} />
          <meshStandardMaterial color="#4f7a5e" roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/* ---- the office --------------------------------------------------------- */

export default function Office() {
  return (
    <group position={[0, -2.6, 0]}>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4]} receiveShadow>
        <planeGeometry args={[46, 42]} />
        <meshStandardMaterial color={FLOOR} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* back wall + side walls */}
      <mesh position={[0, 5, -13]}>
        <planeGeometry args={[42, 16]} />
        <meshStandardMaterial color={WALL} roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-15, 5, -3]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[40, 16]} />
        <meshStandardMaterial color={WALL_SIDE} roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[15, 5, -3]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[40, 16]} />
        <meshStandardMaterial color={WALL_SIDE} roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* black accent strips on the back wall (room motif) */}
      <mesh position={[0, 0.12, -12.9]}>
        <boxGeometry args={[42, 0.24, 0.12]} />
        <meshStandardMaterial color={STRIP} roughness={0.5} />
      </mesh>
      {[-9.5, 9.5].map((x, i) => (
        <mesh key={i} position={[x, 6, -12.88]}>
          <boxGeometry args={[0.16, 14, 0.08]} />
          <meshStandardMaterial color={STRIP} roughness={0.5} />
        </mesh>
      ))}

      {/* framed scenery on the wall */}
      <WallArt position={[-5.6, 5.4, -12.8]} color="#2c3f70" />
      <WallArt position={[0, 5.4, -12.8]} color="#6b86c4" size={[2.6, 1.6]} />
      <WallArt position={[5.6, 5.4, -12.8]} color="#b9c6de" />

      {/* desks with laptops + chairs */}
      <Desk position={[-5.6, 0, -6]} />
      <Desk position={[5.6, 0, -6]} />
      <Desk position={[-4, 0, -10]} />
      <Desk position={[4, 0, -10]} />

      {/* plants for life */}
      <Plant position={[11, 0, -6]} />
      <Plant position={[-11.4, 0, -7.5]} />

      {/* soft grounding shadow */}
      <ContactShadows position={[0, 0.02, -5]} scale={40} resolution={512} blur={2.6} opacity={0.35} far={12} color="#000000" />
    </group>
  );
}
