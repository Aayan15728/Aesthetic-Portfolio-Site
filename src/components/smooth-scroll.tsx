"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Inertial, eased wheel scrolling (Lenis). Touch scrolling stays native, the effect is skipped for
 * people who prefer reduced motion, and dialogs (the command palette) keep their own scrolling.
 */
export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      prevent: (node) => !!node.closest('[role="dialog"], [data-lenis-prevent]'),
    });
    lenis.current = instance;
    return () => {
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  // new page: start at the top instead of keeping the old scroll position
  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
