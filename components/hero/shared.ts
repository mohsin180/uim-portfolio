"use client";

import { createContext, useContext, useEffect, useState } from "react";

/** GLSL-style smoothstep for staging sub-animations off a single progress value. */
export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export type ProgressRefs = {
  /** 0 -> 1 intro reveal, eased after mount. */
  intro: { current: number };
  /** 0 -> 1 scroll progress through the pinned hero. */
  scroll: { current: number };
};

export const ProgressContext = createContext<ProgressRefs | null>(null);

export function useProgress(): ProgressRefs {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressContext");
  return ctx;
}

export type QualityTier = "mobile" | "tablet" | "desktop";

export type Quality = {
  tier: QualityTier;
  dpr: [number, number];
  particleCount: number;
  networkNodes: number;
  streamCount: number;
  dof: boolean;
  noise: boolean;
};

function qualityFor(width: number, reducedMotion: boolean): Quality {
  if (width < 768) {
    return {
      tier: "mobile",
      dpr: [1, 1.5],
      particleCount: 1200,
      networkNodes: 34,
      streamCount: 6,
      dof: false,
      noise: false,
    };
  }
  if (width < 1280) {
    return {
      tier: "tablet",
      dpr: [1, 1.75],
      particleCount: 2400,
      networkNodes: 52,
      streamCount: 9,
      dof: !reducedMotion,
      noise: true,
    };
  }
  return {
    tier: "desktop",
    dpr: [1, 2],
    particleCount: 4200,
    networkNodes: 74,
    streamCount: 14,
    dof: !reducedMotion,
    noise: true,
  };
}

/** Picks a quality tier from viewport width + reduced-motion, updating on resize. */
export function useQuality(): Quality {
  const [quality, setQuality] = useState<Quality>(() =>
    qualityFor(1440, false)
  );

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const compute = () => setQuality(qualityFor(window.innerWidth, reduced));
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return quality;
}
