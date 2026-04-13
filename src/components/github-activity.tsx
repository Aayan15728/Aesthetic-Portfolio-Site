"use client";

import { useEffect, useMemo, useState } from "react";

// ⚙️  Set your GitHub username here (leave empty for demo data)
const GITHUB_USERNAME = "";

/* ── types ─────────────────────────────────────────────────────────────── */
type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

/* ── colour map mirrors GitHub's palette ─────────────────────────────── */
const COLOR: Record<number, string> = {
  0: "bg-[#ebedf0] dark:bg-[#161b22]",
  1: "bg-[#9be9a8] dark:bg-[#0e4429]",
  2: "bg-[#40c463] dark:bg-[#006d32]",
  3: "bg-[#30a14e] dark:bg-[#26a641]",
  4: "bg-[#216e39] dark:bg-[#39d353]",
};

/* ── deterministic mock that looks realistic ─────────────────────────── */
function buildMock(): { weeks: Day[][]; total: number } {
  const n = (x: number) => Math.abs(Math.sin(x * 9301 + 49297) * 233280) % 1;
  const days: Day[] = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364 - start.getDay()); // align to Sunday
  const cur = new Date(start);
  let total = 0;

  while (cur <= today) {
    const dow = cur.getDay();
    const wi = Math.floor(days.length / 7);
    const weekBurst = n(wi * 0.37) > 0.35;
    const dayActive = (dow > 0 && dow < 6) ? n(wi + dow * 0.77) > 0.4 : n(wi + dow) > 0.82;
    const count = weekBurst && dayActive ? Math.ceil(n(wi * 7 + dow) * 12) : 0;
    const level: Day["level"] = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4;
    total += count;
    days.push({ date: cur.toISOString().split("T")[0], count, level });
    cur.setDate(cur.getDate() + 1);
  }

  const weeks: Day[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return { weeks, total };
}

/* ── component ──────────────────────────────────────────────────────── */
export function GitHubActivity() {
  const [weeks, setWeeks] = useState<Day[][]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!GITHUB_USERNAME) {
      const { weeks: w, total: t } = buildMock();
      setWeeks(w); setTotal(t); setIsMock(true); setLoading(false);
      return;
    }
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`)
      .then(r => r.json())
      .then((data: { contributions: Day[]; total: Record<string, number> }) => {
        const raw = data.contributions;
        const firstDow = new Date(raw[0]?.date + "T00:00:00").getDay();
        const pad: Day[] = Array.from({ length: firstDow }, () => ({ date: "", count: 0, level: 0 }));
        const all = [...pad, ...raw];
        const w: Day[][] = [];
        for (let i = 0; i < all.length; i += 7) w.push(all.slice(i, i + 7));
        setWeeks(w);
        setTotal(Object.values(data.total).reduce((a, b) => a + b, 0));
        setLoading(false);
      })
      .catch(() => {
        const { weeks: w, total: t } = buildMock();
        setWeeks(w); setTotal(t); setIsMock(true); setLoading(false);
      });
  }, []);

  /* month label per column */
  const monthLabels = useMemo(() => {
    const out: Record<number, string> = {};
    let last = -1;
    weeks.forEach((week, wi) => {
      const first = week.find(d => d.date);
      if (!first) return;
      const m = new Date(first.date + "T00:00:00").getMonth();
      if (m !== last) {
        out[wi] = new Date(first.date + "T00:00:00").toLocaleString("en-US", { month: "short" });
        last = m;
      }
    });
    return out;
  }, [weeks]);

  return (
    <section className="mb-16">
      {/* label */}
      <p className="text-xs font-semibold tracking-widest text-muted/50 uppercase mb-1">Featured</p>
      <h2 className="font-serif text-xl sm:text-2xl -tracking-[0.01em] text-foreground mb-1">
        GitHub Activity
      </h2>
      {!loading && (
        <p className="text-sm text-muted mb-5">
          Total:{" "}
          <span className="font-semibold text-[#30a14e] dark:text-[#39d353]">
            {total.toLocaleString()}
          </span>{" "}
          contributions{isMock ? " (demo)" : ""}
        </p>
      )}

      {/* card */}
      <div className="relative rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm overflow-hidden">
        <div className="p-4 sm:p-5 overflow-x-auto">
          {loading ? (
            /* skeleton */
            <div className="flex gap-[3px] min-w-max">
              {Array.from({ length: 26 }).map((_, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }).map((_, di) => (
                    <div
                      key={di}
                      className="w-[11px] h-[11px] rounded-[2px] bg-[#ebedf0] dark:bg-[#161b22] animate-pulse"
                      style={{ animationDelay: `${(wi * 7 + di) * 5}ms` }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="relative"
              onMouseLeave={() => setTooltip(null)}
            >
              {/* month labels row */}
              <div className="flex gap-[3px] mb-[5px] min-w-max">
                {weeks.map((_, wi) => (
                  <div
                    key={wi}
                    className="w-[11px] overflow-visible whitespace-nowrap text-[9px] text-muted/40 leading-none select-none"
                  >
                    {monthLabels[wi] ?? ""}
                  </div>
                ))}
              </div>

              {/* grid */}
              <div className="flex gap-[3px] min-w-max">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day, di) => (
                      <div
                        key={di}
                        className={[
                          "w-[11px] h-[11px] rounded-[2px] cursor-default",
                          "transition-transform duration-100 hover:scale-[1.5] hover:z-10",
                          day.date
                            ? `${COLOR[day.level]} hover:ring-1 hover:ring-black/20 dark:hover:ring-white/20`
                            : "opacity-0 pointer-events-none",
                        ].join(" ")}
                        onMouseEnter={e => {
                          if (!day.date) return;
                          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          setTooltip({
                            text: `${day.count} contribution${day.count !== 1 ? "s" : ""} · ${new Date(day.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
                            x: r.left + r.width / 2,
                            y: r.top,
                          });
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* card bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white dark:from-[#0A0A0A] to-transparent rounded-b-2xl" />
      </div>

      {/* tooltip — fixed so it is never clipped */}
      {tooltip && (
        <div
          className="fixed z-[200] pointer-events-none -translate-x-1/2 -translate-y-full px-2 py-[5px] rounded-md bg-foreground text-background text-[10px] font-medium shadow-lg whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y - 6 }}
        >
          {tooltip.text}
        </div>
      )}
    </section>
  );
}
