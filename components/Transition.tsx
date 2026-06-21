"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type TransitionCtx = { navigate: (href: string) => void };

const TransitionContext = createContext<TransitionCtx | null>(null);

export function useTransitionNav(): TransitionCtx {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransitionNav must be used within TransitionProvider");
  return ctx;
}

/**
 * Persistent "curtain" that fades to black on navigate, pushes the route once
 * black, and fades out only when the target route has actually committed — so
 * it doubles as a loading guard over the (dev-only) compile delay.
 */
export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [covering, setCovering] = useState(false);
  const targetRef = useRef<string | null>(null);
  const coverAt = useRef(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || targetRef.current) return;
      targetRef.current = href;
      coverAt.current = Date.now();
      setCovering(true);
      // Kick off navigation immediately; the curtain hides the swap and the
      // route only commits (pathname change) once it's actually ready.
      router.push(href);
      // Safety: never stay stuck on black.
      timers.current.push(
        window.setTimeout(() => {
          targetRef.current = null;
          setCovering(false);
        }, 12000)
      );
    },
    [pathname, router]
  );

  // Uncover once the target route has committed (with a minimum cover time so
  // the fade-to-black always completes, even on a fast navigation).
  useEffect(() => {
    if (targetRef.current && pathname === targetRef.current) {
      targetRef.current = null;
      clearTimers();
      const wait = Math.max(650 - (Date.now() - coverAt.current), 200);
      timers.current.push(window.setTimeout(() => setCovering(false), wait));
    }
    return () => undefined;
  }, [pathname]);

  useEffect(() => () => clearTimers(), []);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      <AnimatePresence>
        {covering && (
          <motion.div
            key="curtain"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* warp glow that rushes toward the viewer */}
            <motion.span
              className="block h-44 w-44 rounded-full bg-uim-blue/25 blur-3xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.8, opacity: 0.6 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
            <motion.span
              className="absolute font-mono text-[10px] uppercase tracking-[0.5em] text-uim-glow/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Entering
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
