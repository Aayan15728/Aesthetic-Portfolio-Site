import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/reveal";
import { HomeProjects } from "@/components/home-projects";
import { GitHubActivity } from "@/components/github-activity";
import { Thoughts, type Thought } from "@/components/thoughts";
import { CommandTrigger } from "@/components/command-trigger";
import { SiteFooter } from "@/components/site-footer";
import { MusicCard } from "@/components/music-card";
import { ExperienceList } from "@/components/experience";
import { QuoteSection } from "@/components/quote-section";
import { Age } from "@/components/age";
import { HandUnderline } from "@/components/hand-underline";
import { RoleSwap } from "@/components/role-swap";
import { Socials } from "@/components/socials";
import { experience } from "@/data/experience";
import { songs } from "@/data/collection";
import { getTrackMedia, spotifyTrackUrl } from "@/lib/tracks";
import { ArrowRight } from "lucide-react";
import { SiReact, SiTypescript, SiNextdotjs, SiNodedotjs, SiPostgresql, SiSupabase } from "react-icons/si";
import type { IconType } from "react-icons";
import { projects } from "@/data/projects";
import { withLiveBadges } from "@/lib/project-stats";
import { ageOn } from "@/lib/age";
import { formatDate, getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

const ROLES = ["Full Stack Developer", "Builder", "Founder", "Web Dev"] as const;

// Next.js is black and white, so it follows the theme
const BRAND = {
  React: "#61DAFB",
  TypeScript: "#3178C6",
  "Next.js": "var(--foreground)",
  "Node.js": "#5FA04E",
  Supabase: "#3ECF8E",
  PostgreSQL: "#4169E1",
} as const;

const SKILLS = [
  { Icon: SiReact, label: "React" },
  { Icon: SiTypescript, label: "TypeScript" },
  { Icon: SiNextdotjs, label: "Next.js" },
  { Icon: SiNodedotjs, label: "Node.js" },
  { Icon: SiSupabase, label: "Supabase" },
  { Icon: SiPostgresql, label: "PostgreSQL" },
] as const;

const THOUGHTS: Thought[] = [
  {
    title: "How I Use AI as a Tool, Not a Crutch",
    body: "AI accelerates my workflow, but I make sure I understand every line it helps produce. I use it for boilerplate, rapid exploration, and ideation - never as a replacement for thinking. The goal is leverage, not dependency.",
  },
  {
    title: "How I Learn New Tech Without Getting Overwhelmed",
    body: "I pick one thing, build something real with it, ship it, then iterate. No tutorial hell - the best way to understand a technology is to break it while building something that matters to you.",
  },
  {
    title: "How I Turn Confusion Into Clear, Working Systems",
    body: "When a problem feels overwhelming I decompose it into atomic units, write down what I don't understand, and work through each piece methodically. Clarity comes from structure, not raw intelligence.",
  },
];

const section = "px-6 sm:px-10 py-10";
const heading = "font-serif text-[26px] sm:text-3xl font-normal text-foreground leading-tight mb-5";
const seeAll =
  "inline-flex items-center gap-1 py-1.5 text-sm text-muted hover:text-foreground transition-colors duration-200 group";

/** Inline tech mention with its logo in brand color, used inside the bio sentence. */
function Tech({ Icon, label }: { Icon: IconType; label: keyof typeof BRAND }) {
  return (
    <span className="inline-flex items-center gap-1 align-baseline font-medium text-foreground whitespace-nowrap">
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: BRAND[label] }} aria-hidden />
      {label}
    </span>
  );
}

function VerifiedTick() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Verified"
      className="size-[17px] sm:size-[21px] text-[#1d9bf0] select-none shrink-0 inline-block translate-y-[-1px] align-baseline"
    >
      <path
        fill="currentColor"
        d="M24 12a4.454 4.454 0 0 0-2.564-3.91 4.437 4.437 0 0 0-.948-4.578 4.436 4.436 0 0 0-4.577-.948A4.44 4.44 0 0 0 12 0a4.423 4.423 0 0 0-3.9 2.564 4.434 4.434 0 0 0-2.43-.178 4.425 4.425 0 0 0-2.158 1.126 4.42 4.42 0 0 0-1.12 2.156 4.42 4.42 0 0 0 .183 2.421A4.456 4.456 0 0 0 0 12a4.465 4.465 0 0 0 2.576 3.91 4.433 4.433 0 0 0 .936 4.577 4.459 4.459 0 0 0 4.577.95A4.454 4.454 0 0 0 12 24a4.439 4.439 0 0 0 3.91-2.563 4.26 4.26 0 0 0 5.526-5.526A4.453 4.453 0 0 0 24 12Zm-13.709 4.917-4.38-4.378 1.652-1.663 2.646 2.646L15.83 7.4l1.72 1.591-7.258 7.926Z"
      />
    </svg>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <h2 className={`${heading} !mb-0`}>{title}</h2>
      <Link href={href} className={seeAll}>
        See all <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

export default async function Home() {
  const featuredSong = songs.find((s) => s.title === siteConfig.featuredSongTitle) ?? songs[0];
  const featuredMedia = await getTrackMedia(featuredSong?.appleId);
  const latestPosts = (await getAllPosts()).slice(0, 3);

  return (
    <main>
      {/* breathing room + top boundary */}
      <div className="h-20 sm:h-36" />
      <div className="rule" />

      {/* HERO */}
      <Reveal delay={0.05}>
        <section className="px-6 sm:px-10 pt-10 pb-10">
          <header className="flex items-start gap-4 sm:gap-6 mb-8">
            <div className="liquid-glass shrink-0 w-[84px] h-[84px] sm:w-[104px] sm:h-[104px] rounded-2xl p-[7px]">
              {/* a blurred, mirrored copy of the picture is what the glass frame reflects */}
              <Image src="/assets/profile.jpg" alt="" fill sizes="104px" className="liquid-glass__reflection object-cover" />
              <div className="relative z-[2] w-full h-full rounded-[10px] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_1px_4px_rgba(0,0,0,0.3)]">
                <Image src="/assets/profile.jpg" alt={siteConfig.name} fill sizes="104px" className="object-cover" priority />
              </div>
            </div>

            <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="font-serif text-[26px] sm:text-[42px] font-normal leading-[1.15] text-foreground">
                  {/* kept together so the tick can never drop onto a line of its own */}
                  Hi, I&apos;m{" "}
                  <span className="whitespace-nowrap">
                    {siteConfig.name} <VerifiedTick />
                  </span>
                </h1>
                <p className="mt-0.5 text-[15px] sm:text-lg font-semibold tracking-[0.01em] text-muted">
                  <RoleSwap roles={ROLES} />
                </p>
                <p className="mt-0.5 text-xs sm:text-[13px] font-medium text-muted">
                  <Age birthDate={siteConfig.birthDate} serverAge={ageOn(siteConfig.birthDate, new Date())} />, {siteConfig.location.label}
                </p>
              </div>
              <CommandTrigger className="shrink-0 hidden sm:inline-flex" />
            </div>
          </header>

          <div className="text-[15px] sm:text-base text-muted leading-[1.85] space-y-4">
            <p>
              I&apos;m a{" "}
              <span className="relative inline-block font-medium text-foreground">
                Full Stack Developer
                <HandUnderline />
              </span>{" "}
              focused on shipping real products, fast. I use <Tech Icon={SiReact} label="React" /> and{" "}
              <Tech Icon={SiNextdotjs} label="Next.js" /> to build frontends, <Tech Icon={SiNodedotjs} label="Node.js" /> for
              backends, with <Tech Icon={SiSupabase} label="Supabase" /> for data and auth.
            </p>
            <p>
              While most people are still planning, I&apos;m already shipping - building full-stack apps, experimenting with
              AI, and launching things people can actually use.
            </p>
            <p>
              I don&apos;t care about hype or perfect code. I care about execution - taking something from zero to live,
              testing it with real users, and improving it fast.
            </p>
          </div>

          <ul className="mt-6 space-y-1.5 text-[15px] text-muted">
            <li className="flex items-center gap-2.5">
              <span aria-hidden className="text-muted/60">&#10022;</span>
              <span>
                <span className="text-foreground font-medium">Open source</span> contributor
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <span aria-hidden className="text-muted/60">&#10022;</span>
              <span>
                Specialized in building <span className="text-foreground font-medium">MVPs</span>
              </span>
            </li>
          </ul>
        </section>
      </Reveal>

      <div className="rule" />

      {/* SOCIALS */}
      <Reveal>
        <section>
          <h2 className={`${heading} !mb-3 px-6 sm:px-10 pt-4`}>Socials</h2>
          <div className="rule" />
          <Socials />
        </section>
      </Reveal>

      <div className="rule" />

      {/* MUSIC */}
      <Reveal>
        <section className="px-6 sm:px-10 py-8">
          {featuredSong && (
            <MusicCard
              title={featuredSong.title}
              artist={featuredSong.artist}
              artworkUrl={featuredMedia.artworkUrl}
              previewUrl={featuredMedia.previewUrl}
              spotifyUrl={spotifyTrackUrl(featuredSong.spotifyId) ?? featuredSong.href ?? null}
            />
          )}
        </section>
      </Reveal>

      <div className="rule" />

      {/* EXPERIENCE (appears once src/data/experience.ts has an entry) */}
      {experience.length > 0 && (
        <>
          <Reveal>
            <section className="px-6 sm:px-10 pt-10 pb-7">
              <h2 className={`${heading} !mb-2`}>Experience</h2>
              <ExperienceList items={experience} />
            </section>
          </Reveal>
          <div className="rule" />
        </>
      )}

      {/* SKILLS */}
      <Reveal>
        <section className={section}>
          <h2 className={heading}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(({ Icon, label }) => (
              <div key={label} className="group relative" style={{ "--brand": BRAND[label] } as CSSProperties}>
                {/* focusable so the label also shows on tap (touch) and keyboard focus, not just mouse hover */}
                <div
                  tabIndex={0}
                  role="img"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center border border-dashed border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-100/50 dark:bg-white/[0.04] hover:bg-neutral-200/60 dark:hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-accent transition-all duration-200 hover:-translate-y-0.5 cursor-default"
                >
                  <Icon
                    className="w-[18px] h-[18px] text-muted/70 transition-colors duration-300 group-hover:text-(--brand) group-focus-within:text-(--brand)"
                    aria-hidden
                  />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-foreground text-background text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 shadow-md z-10"
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <div className="rule" />

      {/* PROJECTS */}
      <Reveal>
        <section className={section}>
          <SectionHeader title="Projects" href="/projects" />
          <HomeProjects projects={await withLiveBadges(projects)} />
        </section>
      </Reveal>

      {latestPosts.length > 0 && (
        <>
          <div className="rule" />
          {/* WRITINGS */}
          <Reveal>
            <section className={section}>
              <SectionHeader title="Writings" href="/writings" />
              <ul className="-mt-2 divide-y divide-dashed divide-neutral-300/80 dark:divide-neutral-700/80">
                {latestPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/writings/${post.slug}`} className="flex items-baseline justify-between gap-4 py-3.5 group">
                      <span className="text-[15px] font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-200">
                        {post.title}
                      </span>
                      <span className="text-xs text-muted whitespace-nowrap">{formatDate(post.date)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </>
      )}

      <div className="rule" />

      {/* GITHUB ACTIVITY */}
      <Reveal>
        <section className={section}>
          <h2 className={heading}>GitHub Activity</h2>
          <GitHubActivity username={siteConfig.githubUsername} />
        </section>
      </Reveal>

      <div className="rule" />

      {/* THOUGHTS */}
      <Reveal>
        <section className={section}>
          <h2 className={heading}>Thoughts</h2>
          <Thoughts items={THOUGHTS} />
        </section>
      </Reveal>

      <div className="rule" />

      {/* QUOTE */}
      <Reveal>
        <QuoteSection text="Just Become Irreplaceable." author={siteConfig.name} />
      </Reveal>

      <div className="rule" />

      <SiteFooter />
    </main>
  );
}
