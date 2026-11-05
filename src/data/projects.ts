/**
 * Add your projects here. They appear on the home page and on /projects.
 * Drop screenshots in /public/assets and reference them with `imageSrc`.
 */
export type ProjectCategory = "web" | "hackathon" | "content" | "other";
export type ProjectStatus = "Live" | "In progress" | "Completed" | "Archived" | "Discontinued";

export interface Project {
  title: string;
  /** Short line shown under the title. */
  tagline?: string;
  description: string;
  /** Live URL (or the main link for the project). */
  href: string;
  /** Optional source repository. */
  github?: string;
  imageSrc?: string;
  /**
   * Crops the screenshot to the app window, in percent of the image: where the crop starts (`x`, `y`) and how
   * wide it is (`w`). Use it when a screenshot has its own background or frame baked in.
   */
  shot?: { x: number; y: number; w: number };
  /** Color of the card's gradient. */
  accent?: string;
  /** Text on a diagonal ribbon across the card's corner, e.g. "800+ active users". Keep it real. */
  badge?: string;
  /** Fills the ribbon with a live number instead (see src/lib/project-stats.ts). */
  live?: "domain-rating" | "youtube-subscribers" | "github-stars";
  /** More ribbon text. With more than one item, the ribbon scrolls through them one at a time. */
  moreBadges?: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  /** Free-form date label, e.g. "May 2026" or "8-11 May, 2026". */
  date?: string;
  tags?: string[];
}

export const PROJECT_CATEGORIES: Record<ProjectCategory, string> = {
  web: "Web Apps",
  hackathon: "Hackathons",
  content: "Content",
  other: "Other",
};

export const projects: Project[] = [
  {
    title: "Buildrship",
    tagline: "Curated launch platform for buildrs.",
    description:
      "Discover the curated launch platform for buildrs who ship. Launch products, collect feedback, and reach early adopters. Submit your product today.",
    href: "https://buildrship.xyz",
    imageSrc: "/assets/buildrship-app.png",
    shot: { x: 3, y: 0, w: 74 },
    accent: "#f59e0b",
    live: "domain-rating",
    moreBadges: ["3k+ monthly users", "500+ signed users"],
    category: "web",
    status: "Live",
  },
  {
    title: "ZeroMRR",
    tagline: "Building in public, with real progress.",
    description:
      "A platform where founders share their journey and compete through real progress. Built to make building in public more engaging, consistent, and real.",
    href: "https://zeromrr.netlify.app",
    imageSrc: "/assets/zeromrr.png",
    shot: { x: 18, y: 12, w: 64 },
    accent: "#10b981",
    category: "web",
    status: "Live",
  },
  {
    title: "Awesome Portfolio Site",
    tagline: "An open-source portfolio to fork.",
    description:
      "The open-source portfolio you're looking at: projects, writings, a living collection and a public goals tracker, built to be forked and made your own.",
    href: "https://aayansharma.netlify.app",
    github: "https://github.com/Aayan15728/awesome-portfolio-site",
    accent: "#6366f1",
    live: "github-stars",
    category: "web",
    status: "Live",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
  },
  {
    title: "GenZGames",
    tagline: "Addictive web games for GenZ.",
    description:
      "Fast, simple, and addictive web games built for the GenZ internet. Focused on speed, fun, and keeping users coming back.",
    href: "https://genzgames.fun",
    github: "https://github.com/Aayan15728/GenzGames",
    imageSrc: "/assets/genzgames.png",
    shot: { x: 15, y: 11.4, w: 68 },
    accent: "#fb6f5b",
    live: "github-stars",
    category: "web",
    status: "Discontinued",
  },
  {
    title: "FUTSnaps91",
    tagline: "A football content brand.",
    description:
      "A football content brand built around edits, highlights, and audience engagement. Exploring content, distribution, and building an online audience.",
    href: "https://youtube.com/@futsnaps91",
    imageSrc: "/assets/futsnaps91.png",
    shot: { x: 20, y: 11.4, w: 66 },
    accent: "#ef4444",
    live: "youtube-subscribers",
    category: "content",
    status: "Live",
  },
  {
    title: "SwiftYourLink",
    tagline: "All your links in one clean profile.",
    description:
      "A simple tool to manage and share multiple links through one clean profile. Built for creators who want speed and simplicity.",
    href: "https://swiftyourlink.vercel.app",
    imageSrc: "/assets/swiftyourlink.png",
    shot: { x: 12, y: 0, w: 72 },
    accent: "#06b6d4",
    category: "web",
    status: "Live",
  },
];
