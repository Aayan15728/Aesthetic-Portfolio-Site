"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { LanyardOverlay } from "@/components/lanyard-overlay";

// the wave field is heavy (WebGPU), so it loads in its own chunk and only when the footer is near
const ShapeWaves = dynamic(() => import("@/components/reactbits/ShapeWaves"), { ssr: false });

/**
 * The page's closing panel: a field of waving shapes with the name carved out of it. Without WebGPU the static
 * wordmark remains. The ID badge that falls from above is a separate layer (LanyardOverlay).
 */
export function FooterArt({ name }: { name: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [waveFailed, setWaveFailed] = useState(false);
  const [fontFamily, setFontFamily] = useState("serif");

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // next/font exposes the real (hashed) family name through this variable; the canvas needs it by name
        const family = getComputedStyle(document.documentElement).getPropertyValue("--font-instrument-serif").trim();
        if (family) setFontFamily(family);
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={panel}
        data-footer-wordmark
        className="relative mx-6 mt-10 h-[300px] overflow-hidden rounded-t-2xl bg-black sm:mx-10 sm:h-[360px]"
      >
        {/* static wordmark: shown while loading and wherever WebGPU is unavailable */}
        <span
          aria-hidden
          className="absolute inset-0 flex select-none items-center justify-center font-serif text-[clamp(44px,12vw,112px)] leading-none text-white/25"
        >
          {name}
        </span>
        <span className="sr-only">{name}</span>

        {near && !waveFailed && (
          <div className="absolute inset-0">
            <ShapeWaves
              text={name}
              fontFamily={fontFamily}
              fontWeight={400}
              textSize={0.52}
              shapes="mixed"
              cellSize={9}
              dotSize={0.72}
              color="#8a8a8a"
              hoverColor="#ffffff"
              backgroundColor="#000000"
              speed={0.8}
              fade={0.3}
              glow={0.25}
              onError={() => setWaveFailed(true)}
            />
          </div>
        )}
      </div>

      <LanyardOverlay watch={panel} />
    </>
  );
}
