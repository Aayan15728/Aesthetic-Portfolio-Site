"use client";

import { useState } from "react";
import Image from "next/image";
import type { Book } from "@/data/collection";
import { cn } from "@/lib/utils";

// slightly different heights make the shelf look real
const HEIGHTS = [212, 226, 204, 218, 208];
const SPINE_WIDTH = 42;
const FALLBACK_SPINES = ["#3f3f46", "#7c2d12", "#1e3a8a", "#14532d", "#78350f"];

// light along the left edge, shadow on the right: reads as a rounded spine
const SPINE_SHADE =
  "linear-gradient(90deg, rgba(0,0,0,0.22) 0%, rgba(255,255,255,0.14) 14%, rgba(255,255,255,0) 38%, rgba(0,0,0,0.08) 78%, rgba(0,0,0,0.25) 100%)";

function isLight(hex: string): boolean {
  const n = parseInt(hex.replace("#", ""), 16);
  if (Number.isNaN(n)) return false;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.6;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm tracking-tight text-amber-500" role="img" aria-label={`${rating} out of 5`}>
      {"★".repeat(rating)}
      <span className="text-neutral-300 dark:text-neutral-600">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

/** Books as spines on a shelf. One is always pulled out showing its cover; hover or tap another to swap to it. */
export function Bookshelf({ books }: { books: Book[] }) {
  const [active, setActive] = useState(0);
  const current = books[active];

  return (
    <div>
      <div className="flex items-end gap-2 overflow-x-auto px-3 pt-4" role="list" aria-label="Bookshelf">
        {books.map((book, i) => {
          const isActive = active === i;
          const height = HEIGHTS[i % HEIGHTS.length];
          const spine = book.spineColor ?? FALLBACK_SPINES[i % FALLBACK_SPINES.length];
          const spineTitle = book.title.split(":")[0];

          return (
            <div key={book.title} role="listitem" className="shrink-0">
              <button
                type="button"
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={isActive}
                aria-label={`${book.title} by ${book.author}`}
                className="relative block overflow-hidden rounded-[3px] shadow-[2px_0_6px_-2px_rgba(0,0,0,0.35)] outline-none transition-[width,transform] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                style={{
                  height,
                  width: isActive ? Math.round((height * 2) / 3) : SPINE_WIDTH,
                  transform: isActive ? "translateY(-10px)" : "none",
                  backgroundColor: spine,
                }}
              >
                {/* spine */}
                <span
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-between py-3 transition-opacity duration-300",
                    isActive && "opacity-0"
                  )}
                  style={{ color: isLight(spine) ? "#262626" : "#fafafa", backgroundImage: SPINE_SHADE }}
                >
                  <span className="h-px w-5 bg-current opacity-40" />
                  <span
                    className="max-h-[70%] overflow-hidden text-ellipsis whitespace-nowrap font-geist text-[13px] font-medium leading-none"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    {spineTitle}
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.15em] opacity-70" style={{ writingMode: "vertical-rl" }}>
                    {book.author.split(" ").at(-1)}
                  </span>
                </span>

                {/* cover */}
                {book.coverSrc && (
                  <Image
                    src={book.coverSrc}
                    alt={`Cover of ${book.title}`}
                    fill
                    sizes="160px"
                    className={cn("object-cover transition-opacity duration-300", isActive ? "opacity-100" : "opacity-0")}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* the shelf itself */}
      <div className="h-3 rounded-sm bg-gradient-to-b from-stone-300 to-stone-400 shadow-[0_8px_14px_-6px_rgba(0,0,0,0.3)] dark:from-stone-700 dark:to-stone-800" />

      <div className="mt-4 min-h-[3.75rem]" aria-live="polite">
        {current && (
          <>
            <p className={cn("font-geist text-lg font-medium leading-snug tracking-tight", current.favorite ? "text-red-600 dark:text-red-400" : "text-foreground")}>
              {current.href ? (
                <a href={current.href} target="_blank" rel="noopener noreferrer" className="underline decoration-neutral-400/50 underline-offset-4 hover:text-accent">
                  {current.title}
                </a>
              ) : (
                current.title
              )}
            </p>
            <p className="mt-0.5 flex items-center gap-2 text-sm text-muted">
              {current.author}
              {current.rating && <Stars rating={current.rating} />}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
