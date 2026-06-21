"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import WorkspaceCanvas from "./WorkspaceCanvas";
import {
  AboutOverlay,
  ServicesOverlay,
  ProjectsOverlay,
  WhyOverlay,
  ContactOverlay,
} from "./Overlays";
import { useQuality } from "../hero/shared";
import type { WSProgress } from "./context";

export default function Workspace() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quality = useQuality();

  // Shared scroll progress handed to the WebGL camera.
  const progress = useMemo<WSProgress>(() => ({ scroll: { current: 0 } }), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Mount the canvas only when the section is near the viewport (perf).
  const inView = useInView(sectionRef, { margin: "40% 0px 40% 0px" });

  // Render-gating so off-screen overlays don't intercept pointer events.
  // About starts visible so it shows immediately on entry (before any scroll).
  const [vis, setVis] = useState({
    a: true,
    s: false,
    p: false,
    w: false,
    c: false,
  });
  const visRef = useRef(vis);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.scroll.current = v;
    const next = {
      a: v < 0.2,
      s: v > 0.19 && v < 0.4,
      p: v > 0.39 && v < 0.6,
      w: v > 0.59 && v < 0.8,
      c: v > 0.8,
    };
    if (
      next.a !== visRef.current.a ||
      next.s !== visRef.current.s ||
      next.p !== visRef.current.p ||
      next.w !== visRef.current.w ||
      next.c !== visRef.current.c
    ) {
      visRef.current = next;
      setVis(next);
    }
  });

  // About — first zone, visible immediately on entry (no scroll).
  const aOpacity = useTransform(scrollYProgress, [0, 0.13, 0.18], [1, 1, 0]);
  const aY = useTransform(scrollYProgress, [0, 0.13, 0.18], [0, 0, -40]);

  // Services.
  const sOpacity = useTransform(scrollYProgress, [0.21, 0.26, 0.34, 0.39], [0, 1, 1, 0]);
  const sY = useTransform(scrollYProgress, [0.21, 0.26, 0.34, 0.39], [40, 0, 0, -40]);

  // Projects (bento grid).
  const pOpacity = useTransform(scrollYProgress, [0.41, 0.46, 0.54, 0.59], [0, 1, 1, 0]);
  const pY = useTransform(scrollYProgress, [0.41, 0.46, 0.54, 0.59], [40, 0, 0, -40]);

  // Why.
  const wOpacity = useTransform(scrollYProgress, [0.61, 0.66, 0.74, 0.79], [0, 1, 1, 0]);
  const wY = useTransform(scrollYProgress, [0.61, 0.66, 0.74, 0.79], [40, 0, 0, -40]);

  // Contact.
  const cOpacity = useTransform(scrollYProgress, [0.82, 0.88], [0, 1]);
  const cY = useTransform(scrollYProgress, [0.82, 0.88], [50, 0]);

  return (
    <section ref={sectionRef} className="relative h-[580vh] bg-[#e7e6e3]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* WebGL corridor */}
        <div className="absolute inset-0">
          {inView && <WorkspaceCanvas progress={progress} quality={quality} />}
        </div>

        {/* Glass overlays */}
        {vis.a && (
          <motion.div
            style={{ opacity: aOpacity, y: aY }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <AboutOverlay />
          </motion.div>
        )}
        {vis.s && (
          <motion.div
            style={{ opacity: sOpacity, y: sY }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <ServicesOverlay />
          </motion.div>
        )}
        {vis.p && (
          <motion.div
            style={{ opacity: pOpacity, y: pY }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <ProjectsOverlay />
          </motion.div>
        )}
        {vis.w && (
          <motion.div
            style={{ opacity: wOpacity, y: wY }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <WhyOverlay />
          </motion.div>
        )}
        {vis.c && (
          <motion.div
            style={{ opacity: cOpacity, y: cY }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <ContactOverlay />
          </motion.div>
        )}
      </div>
    </section>
  );
}
