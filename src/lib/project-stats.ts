import type { Project } from "@/data/projects";

// a repo with fewer stars than this doesn't get a ribbon: "1 GitHub star" reads worse than nothing
const MIN_STARS = 5;
const HOUR = 60 * 60;

/** Domain rating from the project's public Verified DR badge. */
async function domainRating(project: Project): Promise<string | null> {
  const host = new URL(project.href).hostname.replace(/\./g, "-");
  const res = await fetch(`https://verifieddr.com/badge/${host}.svg`, { next: { revalidate: HOUR } });
  if (!res.ok) return null;
  const rating = (await res.text()).match(/>(\d{1,3})<\/text>/)?.[1];
  return rating ? `DR ${rating}` : null;
}

/** Subscriber count from the project's public YouTube channel page. */
async function youtubeSubscribers(project: Project): Promise<string | null> {
  const res = await fetch(project.href, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36" },
    next: { revalidate: HOUR },
  });
  if (!res.ok) return null;
  return (await res.text()).match(/([\d.,]+[KMB]?) subscribers/)?.[0] ?? null;
}

async function githubStars(project: Project): Promise<string | null> {
  const repo = project.github?.replace("https://github.com/", "");
  if (!repo) return null;
  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
    next: { revalidate: HOUR },
  });
  if (!res.ok) return null;
  const { stargazers_count: stars } = (await res.json()) as { stargazers_count?: number };
  return stars && stars >= MIN_STARS ? `${stars} GitHub stars` : null;
}

const SOURCES = {
  "domain-rating": domainRating,
  "youtube-subscribers": youtubeSubscribers,
  "github-stars": githubStars,
};

/**
 * Fills each project's ribbon with its live number, refreshed hourly. Any lookup that fails just leaves the
 * project without a ribbon, so a site being down can't break the page.
 */
export async function withLiveBadges(projects: Project[]): Promise<Project[]> {
  return Promise.all(
    projects.map(async (project) => {
      if (!project.live) return project;
      try {
        return { ...project, badge: (await SOURCES[project.live](project)) ?? project.badge };
      } catch {
        return project;
      }
    })
  );
}
