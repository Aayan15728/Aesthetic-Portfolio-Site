"use client";

import { useState } from "react";
import { AnimatedProjects, ProjectTabs } from "@/components/projects-browser";
import type { Project } from "@/data/projects";

type View = "projects" | "opensource";

/** The home page's projects: everything by default, with a switcher to narrow it to the open-source ones. */
export function HomeProjects({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<View>("projects");
  const openSource = projects.filter((p) => p.github);

  const tabs: { key: View; label: string; count: number }[] = [
    { key: "projects", label: "Projects", count: projects.length },
    { key: "opensource", label: "Open source", count: openSource.length },
  ];

  return (
    <>
      {openSource.length > 0 && <ProjectTabs id="home-projects" label="Switch projects" tabs={tabs} active={view} onChange={setView} />}
      <AnimatedProjects projects={view === "projects" ? projects : openSource} />
    </>
  );
}
