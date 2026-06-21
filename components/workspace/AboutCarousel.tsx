"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Laptop3D from "./Laptop3D";

type Card = {
  kind: "about" | "dev";
  subtitle: string;
  title: string;
  imgUrl?: string;
  paragraphs: string[];
};

const CARDS: Card[] = [
  {
    kind: "about",
    subtitle: "About us",
    title: "What we build at UIM",
    paragraphs: [
      "UIM is a senior studio of three developers crafting premium digital products. We design and build websites, web applications, mobile apps, and POS systems for businesses that care about quality.",
      "We stay small on purpose. Every project gets our full attention, moves fast, and ships with the polish and reliability your business deserves — no bloated teams, no hand-offs, no compromises.",
      "Our process is simple and transparent: we listen, design, build, and iterate alongside you. From the first prototype to launch and beyond, you work directly with the people writing the code.",
      "Whether you need a high-converting marketing site, a complex real-time platform, a native mobile app, or a dependable point-of-sale system, we bring the same care, craft, and engineering rigor to everything we make.",
      "Above all, we build software that feels effortless — fast, intuitive, and beautiful — because the details are what separate good products from great ones.",
    ],
  },
  {
    kind: "dev",
    subtitle: "Founder & Lead Engineer",
    title: "Ali Hamza",
    imgUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&q=80",
    paragraphs: [
      "Ali leads the technical direction at UIM, turning complex requirements into reliable, scalable products. With years of full-stack experience, he architects the systems that power everything we build.",
      "He specializes in modern web architecture, performance optimization, and taking products from zero to launch. Ali is hands-on with every project, making sure the foundation is solid and the code stays clean.",
      "When he isn't architecting systems, he's exploring new technologies and refining the way we build — always pushing for faster, simpler, and more maintainable solutions that stand the test of time.",
    ],
  },
  {
    kind: "dev",
    subtitle: "Product & Frontend Engineer",
    title: "Hassan Raza",
    imgUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&q=80",
    paragraphs: [
      "Hassan crafts the interfaces and experiences that make our products feel fast, polished, and effortless. He bridges design and engineering, turning ideas into pixel-perfect, interactive realities.",
      "He specializes in React, motion design, and premium user experiences with attention to every detail — from subtle micro-interactions to fully responsive layouts that feel right on any device.",
      "Hassan obsesses over how things feel, not just how they look, making sure every product we ship is a genuine joy to use across every screen size and platform.",
    ],
  },
  {
    kind: "dev",
    subtitle: "Backend & DevOps Engineer",
    title: "Bilal Ahmed",
    imgUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&q=80",
    paragraphs: [
      "Bilal engineers the APIs, databases, and infrastructure that keep everything secure, performant, and always online. He is the backbone behind our most demanding, real-time systems.",
      "He specializes in scalable backend architecture, cloud infrastructure, and automation — hardening every layer so our products stay fast and reliable as they grow in users and data.",
      "From database design to deployment pipelines, Bilal makes sure that what we build runs smoothly under pressure, at any scale, with rock-solid security baked in from day one.",
    ],
  },
];

const ARROW =
  "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white/70 text-[#1a1d23]/70 shadow-lg backdrop-blur-md transition-colors hover:border-black/45 hover:text-black active:scale-95";

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 70 : -70, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -70 : 70, opacity: 0 }),
};

export default function AboutCarousel() {
  const [[active, dir], setActive] = useState<[number, number]>([0, 0]);
  const total = CARDS.length;
  const go = (d: number) =>
    setActive(([a]) => [(a + d + total) % total, d]);
  const card = CARDS[active];

  return (
    <div className="pointer-events-auto relative mx-auto w-full max-w-5xl px-12 sm:px-16">
      <button onClick={() => go(-1)} aria-label="Previous" className={`${ARROW} left-0 sm:left-1`}>
        <Chevron dir="left" />
      </button>
      <button onClick={() => go(1)} aria-label="Next" className={`${ARROW} right-0 sm:right-1`}>
        <Chevron dir="right" />
      </button>

      <div className="relative h-[28rem] overflow-hidden rounded-[2rem] sm:h-[27rem]">
        <AnimatePresence custom={dir} initial={false} mode="wait">
          <motion.div
            key={active}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* Solid white content card */}
            <div className="flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-white/55 shadow-[0_30px_90px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.05] backdrop-blur-2xl md:flex-row">
              {/* left: laptop / photo */}
              <div className="relative flex h-2/5 w-full shrink-0 items-center justify-center overflow-hidden border-b border-white/40 bg-gradient-to-br from-white/50 to-white/10 md:h-full md:w-[42%] md:border-b-0 md:border-r">
                {card.kind === "about" ? (
                  <Laptop3D />
                ) : (
                  <img
                    src={card.imgUrl}
                    alt={card.title}
                    loading="eager"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    className="h-full w-full object-cover object-center"
                  />
                )}
              </div>

              {/* right: scrollable content */}
              <div
                data-lenis-prevent
                className="ws-scroll h-3/5 w-full overflow-y-auto bg-white px-7 py-7 md:h-full md:w-[58%] md:px-9 md:py-9"
              >
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-uim-blue/90">
                  {card.subtitle}
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-[#15171b] sm:text-[1.9rem]">
                  {card.title}
                </h3>
                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-[#3a3d44]">
                  {card.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* dots */}
      <div className="mt-6 flex justify-center gap-2">
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive([i, i > active ? 1 : -1])}
            aria-label={`Go to card ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-uim-blue" : "w-1.5 bg-black/20 hover:bg-black/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}
