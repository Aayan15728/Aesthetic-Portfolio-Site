"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";

const INTERVAL = 3000;
const STAGGER = 0.018;

const word: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: STAGGER } },
  gone: { transition: { staggerChildren: STAGGER } },
};

const letter: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.28, ease: "easeOut" } },
  gone: { opacity: 0, transition: { duration: 0.28, ease: "easeIn" } },
};

/**
 * Cycles through a list of words: each one fades away from left to right, and the next fades in the same way.
 * Holds the first word when reduced motion is on.
 */
export function RoleSwap({ roles }: { roles: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || roles.length < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), INTERVAL);
    return () => window.clearInterval(timer);
  }, [reduceMotion, roles.length]);

  return (
    <span className="block h-[1.5em] leading-[1.5em]">
      <span className="sr-only">{roles.join(", ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={roles[index]} aria-hidden className="inline-block whitespace-pre" variants={word} initial="hidden" animate="shown" exit="gone">
          {roles[index].split("").map((char, i) => (
            <motion.span key={i} className="inline-block" variants={letter}>
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
