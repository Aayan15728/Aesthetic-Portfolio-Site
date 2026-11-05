"use client";

import { motion, useReducedMotion } from "framer-motion";

/** A hand-drawn line under some text, which draws itself in from left to right once the page has loaded. */
export function HandUnderline() {
  const reduceMotion = useReducedMotion();
  const delay = reduceMotion ? 0 : 0.6;

  return (
    <svg aria-hidden viewBox="0 0 100 8" preserveAspectRatio="none" className="absolute left-0 -bottom-1 w-full h-2 text-foreground/50">
      <motion.path
        d="M1 5.5 C 22 1.5, 48 7.5, 99 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { delay, duration: reduceMotion ? 0 : 0.9, ease: "easeInOut" },
          // only hides the round dot the line would otherwise show before it starts
          opacity: { delay, duration: 0.01 },
        }}
      />
    </svg>
  );
}
