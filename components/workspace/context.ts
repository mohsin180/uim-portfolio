"use client";

import { createContext, useContext } from "react";

/** Shared 0->1 scroll progress for travelling through the workspace room. */
export type WSProgress = { scroll: { current: number } };

export const WSContext = createContext<WSProgress | null>(null);

export function useWS(): WSProgress {
  const ctx = useContext(WSContext);
  if (!ctx) throw new Error("useWS must be used within WSContext");
  return ctx;
}

/** Camera travels from `Z_START` (entering) to `Z_END` (deep in the room). */
export const Z_START = 10;
export const Z_END = -44;

/** Depth (z) of each zone's 3D markers — kept ahead of the camera path. */
export const ZONE_Z = {
  services: -10,
  why: -30,
  contact: -48,
};
