const fallbackSiteUrl = "https://aayansharma.netlify.app";

function normalizeUrl(rawUrl?: string): string {
  if (!rawUrl) {
    return fallbackSiteUrl;
  }

  const withProtocol = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.origin;
  } catch {
    return fallbackSiteUrl;
  }
}

export const siteConfig = {
  name: "Aayan Sharma",
  /** ISO date; the age shown on the home page is calculated from it automatically. */
  birthDate: "2011-11-04",
  keywordName: "aayan sharma",
  title: "Aayan Sharma | Full Stack Developer Portfolio",
  description:
    "Aayan Sharma is a full stack developer building MVPs, AI projects, and high-performance web products. Explore the portfolio, projects, and contact links.",
  siteUrl: normalizeUrl(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.URL ??
      process.env.DEPLOY_PRIME_URL ??
      process.env.VERCEL_URL
  ),
  image: "/assets/og-image.png",
  /** Song (by title, from src/data/collection.ts) shown in the home-page music card. */
  featuredSongTitle: "The Nights",
  /** Used for the contribution graph and "last shipped" in the footer. */
  githubUsername: "Aayan15728",
  /** Shown as local time in the footer. */
  location: { label: "India", timeZone: "Asia/Kolkata" },
  social: {
    github: "https://github.com/Aayan15728",
    x: "https://x.com/aayanships",
    linkedin: "https://www.linkedin.com/in/aayan-sharma91/",
    email: "mailto:realgenz11@gmail.com",
  },
} as const;

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  image: `${siteConfig.siteUrl}${siteConfig.image}`,
  sameAs: [siteConfig.social.github, siteConfig.social.x, siteConfig.social.linkedin],
  jobTitle: "Full Stack Developer",
  description: siteConfig.description,
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Supabase",
    "PostgreSQL",
  ],
} as const;
