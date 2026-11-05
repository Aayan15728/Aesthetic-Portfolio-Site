"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ContributionDay } from "@/lib/github";

const GAP = 3;
const TIGHT_GAP = 2; // used when the card is too narrow for the normal gap
const MAX_GAP = 5;
const MIN_CELL = 7;
const MAX_CELL = 14;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Cell = ContributionDay | null;

function formatDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/**
 * The last year of contributions as a week-by-week grid. The cell size is measured from the card, so the whole
 * year always fits without a scrollbar (on very narrow screens it scrolls instead, starting at today).
 * Hover or tap a day for its count and it turns green; the grid fades in column by column when it scrolls into view.
 */
export function ContributionGraph({ days }: { days: ContributionDay[] }) {
  const box = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState<number | null>(null);
  const [gap, setGap] = useState(GAP);
  const [inView, setInView] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);

  // weeks run Sunday to Saturday; pad the first week so day 0 lands on the right row
  const weeks = useMemo(() => {
    const padded: Cell[] = [...Array<Cell>(new Date(`${days[0].date}T00:00:00Z`).getUTCDay()).fill(null), ...days];
    const out: Cell[][] = [];
    for (let i = 0; i < padded.length; i += 7) out.push(padded.slice(i, i + 7));
    return out;
  }, [days]);

  const monthLabels = useMemo(() => {
    const labels: { col: number; text: string }[] = [];
    let last = -1;
    weeks.forEach((week, col) => {
      const first = week.find(Boolean);
      if (!first) return;
      const month = Number(first.date.slice(5, 7)) - 1;
      // skip a label that would collide with the previous one, or run past the right edge
      if (month !== last && col < weeks.length - 2 && (labels.length === 0 || col - labels[labels.length - 1].col >= 3)) {
        labels.push({ col, text: MONTHS[month] });
        last = month;
      }
    });
    return labels;
  }, [weeks]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      // 1px spare, so a hovered cell in the last column can grow without flashing a scrollbar
      const room = el.clientWidth - 1;
      const cellFor = (g: number) => Math.floor((room - g * (weeks.length - 1)) / weeks.length);
      // prefer the roomier gap; fall back to a tighter one before resorting to scrolling
      const useGap = cellFor(GAP) >= MIN_CELL + 1 ? GAP : TIGHT_GAP;
      const size = Math.max(MIN_CELL, Math.min(MAX_CELL, cellFor(useGap)));
      // cells are whole pixels, so hand the leftover width to the gaps and let the grid reach both edges
      const spread = Math.floor(((room - weeks.length * size) / (weeks.length - 1)) * 100) / 100;
      setGap(Math.max(useGap, Math.min(MAX_GAP, spread)));
      setCell(size);
    };
    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(el);
    const visible = new IntersectionObserver(([entry]) => entry.isIntersecting && setInView(true), { threshold: 0.2 });
    visible.observe(el);
    return () => {
      resize.disconnect();
      visible.disconnect();
    };
  }, [weeks.length]);

  // if it had to scroll, start at the latest week
  useEffect(() => {
    const el = scroller.current;
    if (el && cell !== null) el.scrollLeft = el.scrollWidth;
  }, [cell]);

  const size = cell ?? MIN_CELL + 3;
  const width = weeks.length * size + (weeks.length - 1) * gap;

  const show = (day: ContributionDay, target: HTMLElement) => {
    const r = target.getBoundingClientRect();
    const count = day.count === 0 ? "No contributions" : `${day.count} contribution${day.count === 1 ? "" : "s"}`;
    setTip({ x: r.left + r.width / 2, y: r.top, text: `${count} · ${formatDay(day.date)}` });
  };

  return (
    <div ref={box} className="w-full">
      <div ref={scroller} className="overflow-x-auto pb-1" onPointerLeave={() => setTip(null)}>
        <div
          className="relative transition-opacity duration-500"
          style={{ width, opacity: cell === null ? 0 : 1, ["--cell" as string]: `${size}px` }}
        >
          {/* month labels */}
          <div className="relative h-6" aria-hidden>
            {monthLabels.map((m) => (
              <span
                key={`${m.col}-${m.text}`}
                className="absolute top-0 text-[13px] leading-5 text-foreground/80"
                style={{ left: m.col * (size + gap) }}
              >
                {m.text}
              </span>
            ))}
          </div>

          {/* the grid */}
          <div className="flex" style={{ gap }} role="img" aria-label={`${days.reduce((a, d) => a + d.count, 0)} contributions in the last year`}>
            {weeks.map((week, col) => (
              <div key={col} className="flex flex-col" style={{ gap }}>
                {week.map((day, row) =>
                  day ? (
                    <button
                      key={day.date}
                      type="button"
                      tabIndex={-1}
                      aria-label={`${day.count} contributions on ${formatDay(day.date)}`}
                      onPointerEnter={(e) => show(day, e.currentTarget)}
                      onClick={(e) => show(day, e.currentTarget)}
                      className={`gh-cell gh-l${day.level}${inView ? " gh-in" : ""}`}
                      style={{ width: size, height: size, animationDelay: `${col * 9 + row * 4}ms` }}
                    />
                  ) : (
                    <span key={`pad-${row}`} style={{ width: size, height: size }} />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {tip && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background"
          style={{ left: tip.x, top: tip.y - 8 }}
        >
          {tip.text}
        </div>
      )}
    </div>
  );
}
