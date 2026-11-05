"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Lanyard = dynamic(() => import("@/components/reactbits/Lanyard"), { ssr: false });

/**
 * The ID badge is its own layer, not part of the footer panel: a tall strip fixed to the right edge of the
 * screen, so the strap comes from above the window. Reaching the footer drops the badge in from the sky; leaving
 * it fades the badge away (and it falls again next time). Drag it, throw it, click to flip it.
 *
 * `watch` is the footer element whose visibility decides when the badge is shown. Hidden on small screens,
 * where a draggable strip would fight with scrolling.
 */
export function LanyardOverlay({ watch }: { watch: React.RefObject<HTMLElement | null> }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const leaving = useRef<number>(0);

  useEffect(() => {
    const el = watch.current;
    if (!el || !window.matchMedia("(min-width: 640px)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(leaving.current);
        if (entry.isIntersecting) {
          setMounted(true);
          // let it mount hidden first so the fade-in and the drop start together
          requestAnimationFrame(() => setVisible(true));
        } else {
          setVisible(false);
          // unmount after the fade so the next visit drops it in again (and nothing renders offscreen)
          leaving.current = window.setTimeout(() => setMounted(false), 700);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(leaving.current);
    };
  }, [watch]);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-y-0 right-3 z-[35] hidden w-[250px] transition-opacity duration-700 sm:block lg:right-8"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <div className="pointer-events-auto h-full">
        <Lanyard
          frontImage="/assets/lanyard-front.png"
          backImage="/assets/lanyard-back.png"
          cardColor="#ffffff"
          finish="glossy"
          cornerRadius={0.35}
          size={0.34}
          anchor="center"
          strapLength={0.5}
          strapColor="#161616"
          strapWidth={0.6}
          metal="silver"
          breeze={0.3}
        />
      </div>
    </div>
  );
}
