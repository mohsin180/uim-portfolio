"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroCanvas from "./HeroCanvas";
import { useQuality, type ProgressRefs } from "./shared";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const quality = useQuality();

  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  // Shared progress, created once and shared with the WebGL scene.
  const progress = useMemo<ProgressRefs>(
    () => ({ intro: { current: 0 }, scroll: { current: 0 } }),
    []
  );

  useEffect(() => setMounted(true), []);

  // Scroll experience: pin the hero, drive scroll progress into the scene,
  // and fade the copy + scroll cue out as the room comes into view below.
  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=110%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            progress.scroll.current = self.progress;
          },
        },
      });

      tl.to(textRef.current, { autoAlpha: 0, y: -70, ease: "none", duration: 0.4 }, 0);
      tl.to(cueRef.current, { autoAlpha: 0, ease: "none", duration: 0.2 }, 0);
      // The office itself is NOT faded out — it stays visible and simply zooms
      // out (camera) then scrolls away into the room, so there's no blank gap.
    }, sectionRef);

    return () => ctx.revert();
  }, [progress]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-[#e7e6e3]"
    >
      {/* WebGL universe */}
      <div ref={sceneRef} className="absolute inset-0">
        {mounted && <HeroCanvas progress={progress} quality={quality} />}
      </div>

      {/* Soft edge framing to match the room's clean light feel */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_58%,_rgba(20,23,27,0.08)_100%)]" />

      {/* Overlay copy (logo itself lives in the 3D scene as the focal point) */}
      <div
        ref={textRef}
        className="pointer-events-none absolute inset-x-0 bottom-[13%] z-10 flex flex-col items-center px-6 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-b from-[#15171b] via-[#1a1d23] to-uim-blue/80 bg-clip-text text-4xl font-semibold leading-[1.05] tracking-tight text-transparent sm:text-6xl"
        >
          We Build Digital Solutions
        </motion.h1>
      </div>

      {/* Scroll cue — invites the user down into the room */}
      <div
        ref={cueRef}
        className="pointer-events-none absolute inset-x-0 bottom-7 z-20 flex flex-col items-center gap-2 text-[#15171b]/60"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.4em]">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-5 items-start justify-center rounded-full border border-black/25 p-1"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#15171b]/70" />
        </motion.span>
      </div>
    </section>
  );
}
