"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WallItem {
  title: string;
  /** e.g. "1999 · David Fincher" (shown on the marquee) */
  meta?: string;
  /** shown on the ticket stub */
  year?: number | string;
  director?: string;
  kind?: string;
  favorite?: boolean;
  posterSrc?: string | null;
  /** dominant colour of the artwork: lights the panel when the poster is hovered */
  color?: string | null;
  /** what to search for when "Watch trailer" is pressed */
  trailerQuery: string;
}

// stable per-title values so server and client render identically
function hash(input: string): number {
  let h = 0;
  for (const ch of input) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}
const FALLBACK_TONES = ["#1a1a1a", "#2a2522", "#222a25", "#262626", "#2b2230", "#3a3a3a"];
const toneFor = (title: string) => FALLBACK_TONES[hash(title) % FALLBACK_TONES.length];
const seatFor = (title: string) => {
  const h = hash(title);
  // >>> keeps the shifted value unsigned (a plain >> can go negative and gave "seat -5")
  return { row: String.fromCharCode(65 + (h % 12)), seat: 1 + ((h >>> 4) % 24), no: String(1000 + (h % 9000)) };
};
const trailerUrl = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${query} official trailer`)}`;
const glowOf = (color: string | null | undefined, percent: number) =>
  `color-mix(in srgb, ${color ?? "#ffffff"} ${percent}%, transparent)`;

const MAX_TILT = 10; // degrees

/**
 * A dark cinema panel. A theatre marquee with chasing bulbs announces the poster under your cursor, posters tilt
 * in 3D with a travelling glare, the panel glows in the poster's own colour, and a click flips the poster over
 * into a ticket stub with a trailer button. On touch screens, tap to flip.
 */
export function PosterWall({ items }: { items: WallItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [flipped, setFlipped] = useState<number | null>(null);
  const focus = flipped ?? hovered;
  const current = focus === null ? null : items[focus];
  const columns = items.length % 4 === 0 ? "sm:grid-cols-4" : "sm:grid-cols-3";

  const tilt = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width; // 0..1
    const py = (event.clientY - box.top) / box.height;
    el.style.setProperty("--ry", `${((px - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - py) * 2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };

  const untilt = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      className="group/wall relative isolate overflow-hidden rounded-xl bg-neutral-950 ring-1 ring-black/20 dark:ring-white/10"
      onPointerLeave={() => setHovered(null)}
    >
      {/* projector spill from above, plus a glow in the hovered poster's colour */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,0.07), transparent 70%)" }}
      />
      {items.map((item, i) => (
        <div
          key={item.title}
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700"
          style={{
            opacity: focus === i ? 1 : 0,
            background: `radial-gradient(ellipse 75% 60% at 50% 18%, ${glowOf(item.color, 38)}, transparent 72%)`,
          }}
        />
      ))}

      <div aria-hidden className="film-strip" />

      {/* theatre marquee */}
      <div className="relative mx-4 mt-5 rounded-lg border border-white/10 bg-neutral-900/70 px-5 py-5 backdrop-blur-[2px]">
        <span aria-hidden className="marquee-bulbs marquee-bulbs--top" />
        <span aria-hidden className="marquee-bulbs marquee-bulbs--bottom" />
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0" aria-live="polite">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-amber-100/55">
              {current ? "Now showing" : "Tonight's programme"}
            </p>
            <div key={current?.title ?? "idle"} className="marquee-swap mt-1.5">
              <p className="truncate font-serif text-[26px] leading-tight text-amber-50">{current ? current.title : "Pick a poster"}</p>
              <p className="mt-0.5 truncate text-xs text-neutral-400">
                {current ? (current.meta ?? " ") : (
                  <>
                    <span className="pointer-coarse:hidden">Hover</span>
                    <span className="hidden pointer-coarse:inline">Tap</span> to preview &middot; click to flip into a ticket
                  </>
                )}
              </p>
            </div>
          </div>
          {current && (
            <a
              href={trailerUrl(current.trailerQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-2 text-xs font-medium text-neutral-950 transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <Play className="h-3 w-3" fill="currentColor" /> Trailer
            </a>
          )}
        </div>
      </div>

      <ul className={cn("grid grid-cols-2 gap-3 px-4 pb-6 pt-6 sm:gap-4", columns)} style={{ perspective: "1000px" }}>
        {items.map((item, i) => {
          const isFlipped = flipped === i;
          const ticket = seatFor(item.title);
          return (
            <li key={item.title}>
              {/* outer card: 3D tilt, glow and spotlight dimming */}
              <div
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
                onPointerMove={tilt}
                onPointerLeave={untilt}
                style={{ "--glow": item.color ?? "rgba(255,255,255,0.35)" } as React.CSSProperties}
                className={cn(
                  "poster group/p relative aspect-[2/3] w-full rounded-md",
                  "[transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))_scale(var(--s,1))] [transform-style:preserve-3d]",
                  "transition-[transform,opacity,box-shadow] duration-200 ease-out hover:[--s:1.05]",
                  "shadow-[0_10px_26px_-14px_rgba(0,0,0,0.9)] hover:shadow-[0_26px_54px_-16px_var(--glow)]",
                  "group-has-[.poster:hover]/wall:not-hover:opacity-40"
                )}
              >
                {/* inner card: the flip */}
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d] motion-reduce:duration-0"
                  style={{ transform: isFlipped ? "rotateY(180deg)" : "none" }}
                >
                  {/* front: the poster */}
                  <button
                    type="button"
                    aria-label={`${item.title}${item.meta ? `, ${item.meta}` : ""}. ${isFlipped ? "Flip back" : "Flip to see the ticket"}`}
                    aria-pressed={isFlipped}
                    onFocus={() => setHovered(i)}
                    onClick={() => setFlipped(isFlipped ? null : i)}
                    className="absolute inset-0 overflow-hidden rounded-md bg-neutral-900 text-left outline-none ring-1 ring-white/10 [backface-visibility:hidden] focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {item.posterSrc ? (
                      <Image src={item.posterSrc} alt="" fill sizes="(min-width: 640px) 200px, 45vw" className="object-cover" />
                    ) : (
                      <span
                        className="absolute inset-0 flex flex-col justify-between p-3.5 text-neutral-100"
                        style={{ backgroundImage: `linear-gradient(160deg, ${toneFor(item.title)}, #0a0a0a)` }}
                      >
                        <span aria-hidden className="h-px w-7 bg-current opacity-40" />
                        <span className="font-serif text-[22px] leading-[1.05]">{item.title}</span>
                      </span>
                    )}
                    {/* travelling glare */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/p:opacity-100"
                      style={{
                        background: "radial-gradient(circle at var(--gx,50%) var(--gy,0%), rgba(255,255,255,0.3), transparent 55%)",
                        mixBlendMode: "overlay",
                      }}
                    />
                    {item.favorite && (
                      <span
                        aria-label="favourite"
                        className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.6)]"
                      />
                    )}
                  </button>

                  {/* back: a ticket stub */}
                  <div
                    aria-hidden={!isFlipped}
                    onClick={(e) => {
                      if (!(e.target as HTMLElement).closest("a")) setFlipped(null);
                    }}
                    className="ticket absolute inset-0 flex cursor-pointer flex-col rounded-md bg-[#efe8d8] p-3.5 text-neutral-900 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.28em]">Admit one</span>
                      <span className="text-[9px] tabular-nums text-neutral-500">No. {ticket.no}</span>
                    </div>
                    <p className="mt-2.5 line-clamp-4 font-serif text-[21px] leading-[1.05]">{item.title}</p>
                    <p className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-neutral-500">{item.kind ?? "Feature presentation"}</p>

                    {/* perforation sits at the notches */}
                    <div aria-hidden className="my-auto border-t border-dashed border-neutral-400/80" />

                    <dl className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px]">
                      {item.year && (
                        <div>
                          <dt className="text-[8px] uppercase tracking-[0.18em] text-neutral-500">Year</dt>
                          <dd className="font-medium">{item.year}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-[8px] uppercase tracking-[0.18em] text-neutral-500">Row · Seat</dt>
                        <dd className="font-medium">
                          {ticket.row} · {ticket.seat}
                        </dd>
                      </div>
                      {item.director && (
                        <div className="col-span-2">
                          <dt className="text-[8px] uppercase tracking-[0.18em] text-neutral-500">Directed by</dt>
                          <dd className="truncate font-medium">{item.director}</dd>
                        </div>
                      )}
                    </dl>

                    <div aria-hidden className="barcode mt-3 h-6" />
                    <a
                      href={trailerUrl(item.trailerQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isFlipped ? 0 : -1}
                      className="mt-2.5 inline-flex items-center justify-center gap-1 rounded-full bg-neutral-900 py-1.5 pointer-coarse:py-2.5 text-[10px] font-medium text-[#efe8d8] transition-transform duration-200 hover:scale-[1.03] active:scale-95"
                    >
                      Watch trailer <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div aria-hidden className="film-strip" />
    </div>
  );
}
