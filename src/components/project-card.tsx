"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import { ArrowRight, Globe } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

const STATUS: Record<Project["status"], { dot: string; pulse: boolean }> = {
  Live: { dot: "bg-emerald-500", pulse: true },
  Completed: { dot: "bg-emerald-500", pulse: false },
  "In progress": { dot: "bg-amber-500", pulse: true },
  Archived: { dot: "bg-neutral-400", pulse: false },
  Discontinued: { dot: "bg-neutral-400", pulse: false },
};

const NEUTRAL_ACCENT = "#737373";
const MAX_TILT_X = 5;
const MAX_TILT_Y = 8;
const SECONDS_PER_BADGE = 4.5;

/**
 * Wrapper that dims the other cards while one is hovered (spotlight effect). The negative margin cancels the
 * cards' padding, so the images line up with the section heading and the dashed boxes hang outside it.
 */
export function ProjectGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("group/grid -mx-3 grid grid-cols-1 gap-4 sm:-mx-5 sm:grid-cols-2 sm:gap-5", className)}>{children}</div>;
}

interface ProjectCardProps {
  project: Project;
  /** Spans both grid columns with a wider stage. */
  wide?: boolean;
  className?: string;
}

/** A diagonal ribbon across the corner. With several items, each scrolls fully out before the next comes in. */
function Ribbon({ project }: { project: Project }) {
  const items = [
    ...(project.badge ? [{ text: project.badge, live: Boolean(project.live) }] : []),
    ...(project.moreBadges ?? []).map((text) => ({ text, live: false })),
  ];
  if (items.length === 0) return null;

  const label = (item: (typeof items)[number]) => (
    <>
      {item.live && <i aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-600 align-[1px]" />}
      {item.text}
    </>
  );

  return (
    <div className="project-stage__ribbon">
      {items.length === 1 ? (
        <span>{label(items[0])}</span>
      ) : (
        <span>
          {/* the list runs twice so the loop has no seam: the track moves left by exactly one copy */}
          <span className="project-stage__marquee" style={{ animationDuration: `${items.length * SECONDS_PER_BADGE}s` }}>
            {[...items, ...items].map((item, i) => (
              <span key={i} aria-hidden={i >= items.length}>
                {label(item)}
              </span>
            ))}
          </span>
        </span>
      )}
    </div>
  );
}

/** The accent gradient with the screenshot inset, cropped to `project.shot` and running off the right and bottom. */
function Stage({ project, wide }: { project: Project; wide: boolean }) {
  const { x = 0, y = 0, w = 100 } = project.shot ?? {};

  return (
    <div className={cn("project-stage", wide ? "aspect-[5/2]" : "aspect-[14/9]")}>
      {project.imageSrc ? (
        <div className="project-stage__shot">
          {/* the width and height only set the starting ratio: the height follows the image once it loads */}
          <Image
            src={project.imageSrc}
            alt={`${project.title} screenshot`}
            width={2000}
            height={1125}
            sizes={wide ? "(min-width: 640px) 900px, 130vw" : "(min-width: 640px) 450px, 130vw"}
            className="block h-auto"
            style={{ width: `${(100 / w) * 100}%`, maxWidth: "none", marginLeft: `-${(x / w) * 100}%`, transform: `translateY(-${y}%)` }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <span className="text-center font-serif text-3xl text-white">{project.title}</span>
        </div>
      )}
      <div className="project-stage__spot" />
      <Ribbon project={project} />
    </div>
  );
}

const iconLink = "relative z-10 p-1.5 text-muted transition-colors duration-200 hover:text-foreground active:scale-95 pointer-coarse:p-2.5";

// on hover the button widens and an arrow slides in
const visitLink =
  "group relative z-10 inline-flex h-9 shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-3 border-[#8da7ff] bg-white px-8 py-2 text-sm font-medium text-neutral-900 shadow-sm outline-none transition-all duration-300 hover:bg-neutral-50 hover:pr-12 focus-visible:ring-[3px] focus-visible:ring-[#8da7ff]/50 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800";

/**
 * A project in a dashed box: the screenshot tilts toward the mouse with a spotlight following it, and the image
 * blooms in the project's accent color. The whole card is clickable; the icon links sit above the stretched link.
 */
export function ProjectCard({ project, wide = false, className }: ProjectCardProps) {
  const card = useRef<HTMLElement>(null);
  const status = STATUS[project.status];
  // a discontinued project's site is gone, so the card leads to its code instead (if there is any)
  const discontinued = project.status === "Discontinued";
  const mainHref = discontinued ? project.github : project.href;

  // written straight to CSS variables, so following the mouse never re-renders the card
  const onMove = (event: PointerEvent<HTMLElement>) => {
    const el = card.current;
    if (!el || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    el.style.setProperty("--mx", `${nx * 100}%`);
    el.style.setProperty("--my", `${ny * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - ny) * 2 * MAX_TILT_X}deg`);
    el.style.setProperty("--ry", `${(nx - 0.5) * 2 * MAX_TILT_Y}deg`);
  };

  const onLeave = () => {
    const el = card.current;
    if (!el) return;
    for (const name of ["--mx", "--my", "--rx", "--ry"]) el.style.removeProperty(name);
  };

  return (
    <article
      ref={card}
      data-cursor={discontinued ? "GitHub" : "Visit"}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ "--card-accent": project.accent ?? NEUTRAL_ACCENT } as CSSProperties}
      className={cn(
        "project-card group/card relative flex flex-col border border-dashed border-neutral-300/80 p-[11px] transition-all duration-300 ease-out group-has-[article:hover]/grid:not-hover:opacity-60 sm:p-[19px] dark:border-neutral-700/80",
        wide && "sm:col-span-2",
        className
      )}
    >
      <Stage project={project} wide={wide} />

      <div className="flex flex-1 flex-col gap-3 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold leading-6 tracking-tight text-foreground">
              {/* stretched link: the whole card is clickable */}
              {mainHref ? (
                <a
                  href={mainHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-accent"
                >
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h3>
            {project.tagline && <p className="mt-0.5 truncate text-[13px] text-muted">{project.tagline}</p>}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold tabular-nums text-muted">
            <span className="relative flex h-1.5 w-1.5">
              {status.pulse && (
                <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:animate-none", status.dot)} />
              )}
              <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", status.dot)} />
            </span>
            {discontinued ? project.status : (project.date ?? project.status)}
          </span>
        </div>

        <p className={cn("text-sm leading-relaxed text-muted", wide ? "line-clamp-2" : "line-clamp-3")}>{project.description}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <ul className="flex flex-wrap gap-1.5">
            {project.tags?.map((tag) => (
              <li key={tag} className="rounded-lg bg-neutral-100 px-2.5 py-1.5 text-xs text-foreground/80 dark:bg-white/[0.06]">
                {tag}
              </li>
            ))}
          </ul>
          {/* the negative margin lines an icon's glyph up with the text edge; the Visit button needs no help */}
          <div className={cn("flex shrink-0 items-center gap-1", (project.github || project.category !== "web") && "-mr-1.5")}>
            {discontinued ? null : project.category === "web" ? (
              <a href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`} className={visitLink}>
                Visit
                <ArrowRight
                  aria-hidden
                  className="absolute right-4 w-4 translate-x-[-20px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </a>
            ) : (
              <a href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`} className={iconLink}>
                <Globe className="h-5 w-5" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on GitHub`}
                data-cursor="GitHub"
                className={iconLink}
              >
                <FaGithub className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
