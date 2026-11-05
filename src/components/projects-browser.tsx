"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ProjectCard, ProjectGrid } from "@/components/project-card";
import { PROJECT_CATEGORIES, type Project, type ProjectCategory } from "@/data/projects";
import { cn } from "@/lib/utils";

type Filter = ProjectCategory | "all";

interface ProjectTabsProps<T extends string> {
  /** Keeps the sliding pill of one set of tabs separate from any other on the page. */
  id: string;
  label: string;
  tabs: { key: T; label: string; count: number }[];
  active: T;
  onChange: (key: T) => void;
}

/** Tabs with a pill that slides to the selected one. */
export function ProjectTabs<T extends string>({ id, label, tabs, active, onChange }: ProjectTabsProps<T>) {
  const reduceMotion = useReducedMotion();

  return (
    <LayoutGroup id={id}>
      <div
        role="tablist"
        aria-label={label}
        className="mb-6 inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-black/10 bg-neutral-100/70 p-1 dark:border-white/10 dark:bg-white/[0.04]"
      >
        {tabs.map((t) => {
          const selected = active === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => onChange(t.key)}
              className={cn(
                "relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 pointer-coarse:py-2.5",
                selected ? "text-foreground" : "text-muted hover:text-foreground"
              )}
            >
              {selected && (
                <motion.span
                  layoutId="project-tab-pill"
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                  className="absolute inset-0 rounded-lg border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/10"
                />
              )}
              <span className="relative inline-flex items-center gap-1.5">
                {t.label}
                <span className="text-[10px] tabular-nums text-muted/70">{t.count}</span>
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

/** A grid of project cards that animates as the list changes. */
export function AnimatedProjects({ projects }: { projects: Project[] }) {
  const reduceMotion = useReducedMotion();
  // an odd number of cards leaves a hole, so the first one takes the full row
  const firstIsWide = projects.length % 2 === 1 && projects.length > 1;

  return (
    <ProjectGrid>
      <AnimatePresence mode="popLayout" initial={false}>
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1], delay: reduceMotion ? 0 : i * 0.04 }}
            className={cn("flex", i === 0 && firstIsWide && "sm:col-span-2")}
          >
            <ProjectCard project={p} wide={i === 0 && firstIsWide} className="w-full" />
          </motion.div>
        ))}
      </AnimatePresence>
    </ProjectGrid>
  );
}

export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Filter>("all");

  // only offer tabs for categories that actually have projects
  const categories = (Object.keys(PROJECT_CATEGORIES) as ProjectCategory[]).filter((c) =>
    projects.some((p) => p.category === c)
  );
  const visible = active === "all" ? projects : projects.filter((p) => p.category === active);

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: projects.length },
    ...categories.map((c) => ({
      key: c as Filter,
      label: PROJECT_CATEGORIES[c],
      count: projects.filter((p) => p.category === c).length,
    })),
  ];

  return (
    <>
      {tabs.length > 2 && <ProjectTabs id="project-filters" label="Filter projects" tabs={tabs} active={active} onChange={setActive} />}
      <AnimatedProjects projects={visible} />
    </>
  );
}
