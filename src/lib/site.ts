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
    "JavaScript",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "Prisma",
  ],
} as const;
