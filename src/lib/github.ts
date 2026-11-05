/**
 * When you last pushed to any of your public repos (forks excluded), for the footer's "last shipped" line.
 * Uses the repos list rather than the events feed, which only covers the last 90 days.
 * Cached for an hour. Set GITHUB_TOKEN to raise the API rate limit (optional; no scopes needed).
 */
export async function getLastPushAt(username: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&direction=desc&per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        },
        next: { revalidate: 60 * 60 },
      }
    );
    if (!res.ok) return null;
    const repos = (await res.json()) as { fork: boolean; pushed_at: string | null }[];
    return repos.find((r) => !r.fork && r.pushed_at)?.pushed_at ?? null;
  } catch {
    return null;
  }
}

/* ── contribution graph ──────────────────────────────────────────────────── */

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionData {
  total: number;
  days: ContributionDay[];
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  bestDay: ContributionDay | null;
}

/**
 * The last year of GitHub contributions plus a few stats (via the public github-contributions-api,
 * the same source the old calendar widget used). Cached for an hour; null if the lookup fails.
 */
export async function getContributions(username: string): Promise<ContributionData | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, {
      next: { revalidate: 60 * 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { total?: Record<string, number>; contributions?: ContributionDay[] };
    const days = (data.contributions ?? []).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.date));
    if (days.length === 0) return null;

    let longest = 0;
    let run = 0;
    let bestDay: ContributionDay | null = null;
    for (const day of days) {
      run = day.count > 0 ? run + 1 : 0;
      longest = Math.max(longest, run);
      if (day.count > 0 && (!bestDay || day.count > bestDay.count)) bestDay = day;
    }

    // today may simply not have a commit yet, so a streak that ends yesterday is still "current"
    let current = 0;
    let i = days.length - 1;
    if (days[i].count === 0) i -= 1;
    for (; i >= 0 && days[i].count > 0; i--) current += 1;

    return {
      total: Object.values(data.total ?? {}).reduce((a, b) => a + b, 0) || days.reduce((a, d) => a + d.count, 0),
      days,
      activeDays: days.filter((d) => d.count > 0).length,
      currentStreak: current,
      longestStreak: longest,
      bestDay,
    };
  } catch {
    return null;
  }
}
