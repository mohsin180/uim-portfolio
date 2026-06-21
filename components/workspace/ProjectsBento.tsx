"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Project = {
  title: string;
  category: string;
  desc: string;
  imgUrl: string;
  highlights: string[];
};

const PROJECTS: Project[] = [
  {
    title: "Nimbus Dashboard",
    category: "SaaS Platform",
    imgUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=1100&fit=crop&q=80",
    desc: "A real-time analytics platform built to make sense of huge data streams without ever slowing down. Nimbus ingests millions of events a day and turns them into live dashboards the whole team can act on the moment something changes.",
    highlights: [
      "Live streaming charts & metrics",
      "Role-based access for teams",
      "Scalable real-time event pipeline",
      "Custom reports, exports & alerts",
    ],
  },
  {
    title: "Aurora Commerce",
    category: "E-Commerce",
    imgUrl:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&h=1100&fit=crop&q=80",
    desc: "A blazing-fast storefront engineered for conversion. Aurora pairs a striking, fully responsive design with a frictionless checkout, so shoppers move from browsing to buying in just a few taps.",
    highlights: [
      "Sub-second page loads",
      "One-step secure checkout",
      "Headless, SEO-ready catalog",
      "Payments & live order tracking",
    ],
  },
  {
    title: "Pulse Fitness",
    category: "Mobile App",
    imgUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&h=1100&fit=crop&q=80",
    desc: "A cross-platform fitness companion that works anywhere. Pulse delivers guided workouts, progress tracking, and full offline support so members never miss a session — on iOS and Android from a single codebase.",
    highlights: [
      "iOS & Android from one codebase",
      "Offline-first workouts",
      "Progress & streak tracking",
      "Push reminders & notifications",
    ],
  },
  {
    title: "Vault POS",
    category: "Point of Sale",
    imgUrl:
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=900&h=1100&fit=crop&q=80",
    desc: "A reliable point-of-sale system tailored for modern retail. Vault keeps checkout fast and inventory accurate whether you're online or off, with clear reporting that keeps the business moving even at its busiest.",
    highlights: [
      "Fast, reliable checkout",
      "Real-time inventory sync",
      "Works online & offline",
      "Sales & reporting analytics",
    ],
  },
  {
    title: "Lumen Studio",
    category: "Marketing Site",
    imgUrl:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&h=1100&fit=crop&q=80",
    desc: "A bold, high-converting marketing site for a creative design studio. Lumen blends cinematic visuals with real performance, turning first impressions into booked calls and qualified leads.",
    highlights: [
      "Cinematic, on-brand visuals",
      "Optimised for Core Web Vitals",
      "CMS-driven & easy to edit",
      "Built to convert visitors",
    ],
  },
];

function ArrowUpRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-uim-blue" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Content panel (image LEFT, scrollable content RIGHT) shown for the open card. */
function CardDetail({ p, first }: { p: Project; first?: boolean }) {
  return (
    <div className="flex h-full w-full">
      {/* image */}
      <div className="relative h-full w-[42%] shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-uim-blue/30 to-[#05080f]" />
        <img
          src={p.imgUrl}
          alt={p.title}
          loading="eager"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
      {/* scrollable content */}
      <div
        data-lenis-prevent
        className="ws-scroll h-full w-[58%] overflow-y-auto bg-white px-7 py-7"
      >
        {first && (
          <p className="mb-4 text-xl font-bold tracking-tight text-[#15171b]">
            Projects
          </p>
        )}
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-uim-blue/90">
          {p.category}
        </p>
        <h3 className="text-2xl font-semibold tracking-tight text-[#15171b]">
          {p.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[#3a3d44]">{p.desc}</p>
        <p className="mb-3 mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#5a5d63]">
          Highlights
        </p>
        <ul className="space-y-2.5">
          {p.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3 text-[14px] text-[#2c2f35]">
              <Check />
              {h}
            </li>
          ))}
        </ul>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-uim-blue to-uim-cyan px-5 py-2.5 text-xs font-medium text-white shadow-[0_8px_20px_rgba(60,130,255,0.3)]">
          View project <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

export default function ProjectsBento() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="pointer-events-auto w-full max-w-6xl px-6">
      {/* header — only on mobile (desktop shows the label inside the first card) */}
      <h2 className="mb-6 text-center text-3xl font-semibold tracking-tight text-[#15171b] md:hidden">
        Projects
      </h2>

      {/* expanding panels (desktop) — open card shows image left + content right */}
      <div className="hidden gap-3 md:flex md:h-[27rem]">
        {PROJECTS.map((p, i) => {
          const isActive = active === i;
          return (
            <div
              key={p.title}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              style={{ flexGrow: isActive ? 6 : 1 }}
              className="group relative h-full min-w-0 cursor-pointer overflow-hidden rounded-3xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.22)] ring-1 ring-black/5 transition-[flex-grow] duration-500 ease-out"
            >
              {/* collapsed: image strip + vertical label */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isActive ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-uim-blue/40 to-[#05080f]" />
                <img
                  src={p.imgUrl}
                  alt={p.title}
                  loading="eager"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                  className="absolute inset-0 h-full w-full scale-105 object-cover grayscale"
                />
                <div className="absolute inset-0 bg-black/55" />
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-base font-semibold text-white/90 [writing-mode:vertical-rl] rotate-180">
                  {p.title}
                </span>
              </div>

              {/* open: image left + content right */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <CardDetail p={p} first={i === 0} />
              </div>
            </div>
          );
        })}
      </div>

      {/* compact grid (mobile) — tap to open detail */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {PROJECTS.map((p, i) => (
          <button
            key={p.title}
            type="button"
            onClick={() => setOpen(i)}
            className="relative h-32 overflow-hidden rounded-2xl border border-white/40 text-left shadow-[0_12px_30px_rgba(0,0,0,0.2)] ring-1 ring-black/5 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-uim-blue/40 to-[#05080f]" />
            <img
              src={p.imgUrl}
              alt={p.title}
              loading="eager"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
                {p.category}
              </span>
              <h3 className="text-sm font-semibold leading-tight text-white">{p.title}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* mobile detail sheet */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[82svh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
              data-lenis-prevent
            >
              <div className="relative h-44 w-full shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-uim-blue/40 to-[#05080f]" />
                <img
                  src={PROJECTS[open].imgUrl}
                  alt={PROJECTS[open].title}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  aria-label="Close"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md active:scale-95"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-uim-blue/90">
                  {PROJECTS[open].category}
                </p>
                <h3 className="text-2xl font-semibold leading-tight text-[#15171b]">
                  {PROJECTS[open].title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#3a3d44]">
                  {PROJECTS[open].desc}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {PROJECTS[open].highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-[14px] text-[#2c2f35]">
                      <Check />
                      {h}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-uim-blue to-uim-cyan px-5 py-2.5 text-xs font-medium text-white">
                  View project <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
