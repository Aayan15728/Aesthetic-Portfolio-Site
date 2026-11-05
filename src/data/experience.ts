/**
 * Your career timeline. The Experience section on the home page appears as soon as this has an entry.
 * Newest first. Example entry (delete the leading `//` markers to use it as a template):
 *
 * {
 *   company: "Company name",
 *   href: "https://company.com",
 *   logo: "/assets/company-logo.png",
 *   role: "Full Stack Engineer",
 *   type: "Full-time",
 *   location: "Remote",
 *   start: "2025-06",          // YYYY-MM
 *   end: null,                 // YYYY-MM, or null if it's your current role
 *   bullets: ["What you built or achieved", "Another result, ideally with a number"],
 *   stack: ["Next.js", "TypeScript", "PostgreSQL"],
 * },
 */
export type ExperienceType = "Full-time" | "Part-time" | "Internship" | "Freelance" | "Founder" | "Open source";

export interface Experience {
  company: string;
  href?: string;
  /** Optional square logo; the company's first letter is shown without one. */
  logo?: string;
  role: string;
  /** Optional label shown as a pill (Full-time, Founder, ...). */
  type?: ExperienceType;
  location?: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM, or null for a current role. */
  end: string | null;
  bullets?: string[];
  stack?: string[];
}

export const experience: Experience[] = [
  {
    company: "Buildrship",
    href: "https://buildrship.xyz",
    logo: "/assets/logos/buildrship.png",
    role: "Founder & CEO",
    start: "2026-06",
    end: null,
    bullets: [
      "A curated launch platform for buildrs who ship.",
      "Helps makers launch products, collect feedback and reach early adopters.",
    ],
  },
  {
    company: "Stealth project",
    role: "Founder & CEO",
    start: "2026-01",
    end: "2026-06",
  },
  {
    company: "GenZGames",
    logo: "/assets/logos/genzgames.png",
    role: "Founder & CEO",
    start: "2025-10",
    end: "2026-01",
    bullets: [
      "Fast, simple and addictive web games built for the GenZ internet.",
      "Focused on speed, fun and keeping users coming back.",
    ],
  },
];
