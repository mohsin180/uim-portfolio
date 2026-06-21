"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Phone3D from "./Phone3D";

type Card = {
  kind: "overview" | "service";
  subtitle: string;
  title: string;
  imgUrl?: string;
  desc?: string;
  paragraphs?: string[];
  features?: string[];
};

const CARDS: Card[] = [
  {
    kind: "overview",
    subtitle: "What we do",
    title: "Our Services",
    paragraphs: [
      "We design and build the full range of digital products your business needs — websites, web applications, mobile apps, and point-of-sale systems — all under one roof, with one senior team.",
      "Every product is built with the same obsession for speed, polish, and reliability. Whether it's a marketing site that needs to convert or a complex platform that needs to scale, we bring the same craft and engineering rigor to all of it.",
      "Because we handle design, frontend, backend, and infrastructure ourselves, everything fits together seamlessly — no mismatched vendors, no gaps, no finger-pointing. Just one team accountable for the whole product.",
      "Browse through to see exactly what each service includes and how we can help bring your idea to life.",
    ],
  },
  {
    kind: "service",
    subtitle: "Marketing & brand sites",
    title: "Websites",
    imgUrl:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&h=900&fit=crop&q=80",
    desc: "High-performance websites engineered to convert visitors into customers. We build fast, striking, SEO-ready sites that load instantly and look flawless on every device — the kind of first impression that wins trust and drives real results.",
    features: [
      "Lightning-fast load times",
      "SEO & performance optimised",
      "Fully responsive on every device",
      "Easy content editing via CMS",
    ],
  },
  {
    kind: "service",
    subtitle: "Platforms & dashboards",
    title: "Web Applications",
    imgUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&h=900&fit=crop&q=80",
    desc: "Scalable web platforms built for demanding, real-time workflows. From dashboards and portals to full SaaS products, we engineer robust applications that handle complex logic and heavy traffic without breaking a sweat.",
    features: [
      "Real-time data & live updates",
      "Secure auth & role management",
      "Scalable cloud architecture",
      "Clean, intuitive interfaces",
    ],
  },
  {
    kind: "service",
    subtitle: "iOS & Android apps",
    title: "Mobile Applications",
    imgUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=700&h=900&fit=crop&q=80",
    desc: "Native-feeling mobile apps crafted for a seamless experience. One codebase, both platforms — we build smooth, responsive apps that feel right at home on iPhone and Android, with offline support and native performance.",
    features: [
      "iOS & Android from one codebase",
      "Native performance & feel",
      "Offline-first support",
      "Push notifications",
    ],
  },
  {
    kind: "service",
    subtitle: "Point of sale",
    title: "POS Systems",
    imgUrl:
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=700&h=900&fit=crop&q=80",
    desc: "Reliable point-of-sale systems tailored for modern retail. Fast checkout, real-time inventory, and clear reporting — built to keep your business running smoothly even when it's busy, whether you're online or off.",
    features: [
      "Fast, reliable checkout",
      "Real-time inventory tracking",
      "Sales & reporting analytics",
      "Works online & offline",
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

export default function ServicesCarousel() {
  const [[active, dir], setActive] = useState<[number, number]>([0, 0]);
  const total = CARDS.length;
  const go = (d: number) => setActive(([a]) => [(a + d + total) % total, d]);
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
            {/* Content LEFT, media/3D RIGHT — glass behind the 3D model, white text */}
            <div className="flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-white/55 shadow-[0_30px_90px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.05] backdrop-blur-2xl md:flex-row-reverse">
              {/* media: 3D phone (overview) or image (service) */}
              <div className="relative flex h-2/5 w-full shrink-0 items-center justify-center overflow-hidden border-b border-white/40 bg-gradient-to-br from-white/50 to-white/10 md:h-full md:w-[42%] md:border-b-0 md:border-l">
                {card.kind === "overview" ? (
                  <Phone3D />
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

              {/* scrollable content */}
              <div
                data-lenis-prevent
                className="ws-scroll h-3/5 w-full overflow-y-auto bg-white px-7 py-7 md:h-full md:w-[58%] md:px-9 md:py-8"
              >
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-uim-blue/90">
                  {card.subtitle}
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-[#15171b] sm:text-[1.9rem]">
                  {card.title}
                </h3>

                {card.kind === "overview" ? (
                  <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-[#3a3d44]">
                    {card.paragraphs?.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="mt-4 text-[15px] leading-relaxed text-[#3a3d44]">
                      {card.desc}
                    </p>
                    <p className="mb-3 mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#5a5d63]">
                      What&apos;s included
                    </p>
                    <ul className="space-y-2.5">
                      {card.features?.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-[14px] text-[#2c2f35]">
                          <Check />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
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

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="mt-0.5 h-4 w-4 shrink-0 text-uim-blue"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
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
