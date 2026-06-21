"use client";

import { useState } from "react";

type Reason = {
  title: string;
  desc: string;
  tag: string;
};

const REASONS: Reason[] = [
  {
    title: "Fast Development",
    tag: "Speed",
    desc: "We move fast without breaking things. Lean senior teams, no bloated process, and battle-tested tooling mean production-grade software in weeks — not the months agencies quote.",
  },
  {
    title: "Custom Solutions",
    tag: "Tailored",
    desc: "Nothing off a shelf. Every screen, API, and workflow is engineered around how your business actually runs — so the product fits you, instead of forcing you to adapt to it.",
  },
  {
    title: "Secure & Scalable",
    tag: "Built to last",
    desc: "Security and scale are baked in from day one — hardened auth, sensible architecture, and infrastructure that stays fast and reliable whether you have a hundred users or a million.",
  },
  {
    title: "Dedicated Support",
    tag: "Always on",
    desc: "We don't disappear at launch. You get a senior team that knows your codebase inside-out and stays in your corner for fixes, iterations, and whatever comes next.",
  },
];

export default function WhyGrid() {
  const [active, setActive] = useState(0);

  return (
    <div className="pointer-events-auto w-full max-w-3xl px-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white px-6 py-6 shadow-[0_30px_90px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.05] sm:px-9 sm:py-8">
        {/* header */}
        <div className="mb-4 sm:mb-6">
          <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.5em] text-uim-blue/90">
            The UIM difference
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-[#15171b] sm:text-4xl">
            Why Choose Us
          </h2>
        </div>

        {/* expanding rows */}
        <div>
          {REASONS.map((r, i) => {
            const isActive = active === i;
            return (
              <div
                key={r.title}
                className="relative border-t border-black/10 first:border-t-0"
              >
                {/* left gradient accent */}
                <span
                  className={`absolute left-0 top-1/2 h-[60%] w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-uim-blue to-uim-cyan transition-all duration-500 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="flex w-full items-center gap-4 py-4 pl-4 pr-1 text-left sm:gap-6 sm:py-5"
                >
                  <span
                    className={`font-mono text-sm tabular-nums transition-colors duration-300 ${
                      isActive ? "text-uim-blue" : "text-black/30"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <h3
                    className={`text-xl font-semibold tracking-tight transition-colors duration-300 sm:text-3xl ${
                      isActive ? "text-[#15171b]" : "text-[#15171b]/45"
                    }`}
                  >
                    {r.title}
                  </h3>
                  <span
                    className={`ml-auto hidden font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 sm:block ${
                      isActive ? "text-uim-blue/90" : "text-black/25"
                    }`}
                  >
                    {r.tag}
                  </span>
                  {/* plus / minus */}
                  <span
                    className={`relative ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:ml-0 ${
                      isActive
                        ? "border-transparent bg-gradient-to-br from-uim-blue to-uim-cyan text-white"
                        : "border-black/15 text-black/40"
                    }`}
                  >
                    <span className="absolute h-0.5 w-3.5 rounded bg-current" />
                    <span
                      className={`absolute h-3.5 w-0.5 rounded bg-current transition-transform duration-300 ${
                        isActive ? "scale-y-0" : "scale-y-100"
                      }`}
                    />
                  </span>
                </button>

                {/* expanding description */}
                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-out"
                  style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-5 pl-4 pr-2 text-sm leading-relaxed text-[#3a3d44] sm:pl-[3.75rem] sm:text-[15px]">
                      {r.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
