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
    subtitle: "Client Lead & Full-Stack Developer",
    title: "Umer Bhatti",
    imgUrl: "/team/umer-bhatti.png",
    paragraphs: [
      "Umer is the first person you talk to at UIM. He sits down with every client to understand the real problem, translate it into a clear plan, and make sure expectations and timelines line up from day one.",
      "He pairs that client focus with hands-on engineering, building full-stack features himself so nothing is lost between the conversation and the code. Umer keeps projects moving and communication honest at every step.",
      "From the first call to launch and beyond, he stays your point of contact — making sure what we ship is exactly what your business needs, and that you always know where things stand.",
    ],
  },
  {
    kind: "dev",
    subtitle: "Marketing Strategist & Developer",
    title: "Ikram Javed",
    imgUrl: "/team/ikram-javed.png",
    paragraphs: [
      "Ikram makes sure the products we build actually reach the people they're meant for. He owns marketing strategy at UIM — positioning, messaging, and growth — turning great software into results you can measure.",
      "He's also a developer, so his marketing decisions are grounded in how the product really works. That blend lets him build landing pages, campaigns, and funnels that are fast, on-brand, and built to convert.",
      "Ikram bridges the gap between engineering and growth, making sure every product launches with a clear story and the momentum it deserves.",
    ],
  },
  {
    kind: "dev",
    subtitle: "Developer & Social Media Manager",
    title: "Mohsin Karim",
    imgUrl: "/team/mohsin-karim.png",
    paragraphs: [
      "Mohsin builds the features that make our products work and manages the social presence that keeps UIM visible. He moves comfortably between writing clean, reliable code and shaping how we show up online.",
      "As a developer, he focuses on solid implementation and attention to detail; as social media manager, he plans content, engages our audience, and keeps the brand consistent across every channel.",
      "That dual role lets Mohsin connect what we build with the people who follow our work — turning real engineering progress into a story worth sharing.",
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

      <div className="relative h-[36rem] overflow-hidden rounded-[2rem] sm:h-[34rem] md:h-[27rem]">
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
              <div className="relative flex h-[62%] w-full shrink-0 items-center justify-center overflow-hidden border-b border-white/40 bg-gradient-to-br from-white/50 to-white/10 md:h-full md:w-[42%] md:border-b-0 md:border-r">
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
                    style={{ objectPosition: "50% 18%" }}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* right: scrollable content */}
              <div
                data-lenis-prevent
                className="ws-scroll h-[38%] w-full overflow-y-auto bg-white px-7 py-7 md:h-full md:w-[58%] md:px-9 md:py-9"
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
