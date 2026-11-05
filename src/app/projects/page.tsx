import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ProjectCard, ProjectGrid } from "@/components/project-card";
import { ProjectsBrowser } from "@/components/projects-browser";
import { projects } from "@/data/projects";
import { withLiveBadges } from "@/lib/project-stats";

export const metadata: Metadata = {
  title: "Projects",
  description: "Web apps, experiments and products I've built and shipped.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const all = await withLiveBadges(projects);
  const openSource = all.filter((p) => p.github);

  return (
    <PageShell title="Projects" description="Things I've built and shipped, from MVPs to experiments.">
      <ProjectsBrowser projects={all.filter((p) => !p.github)} />

      {openSource.length > 0 && (
        <>
          <div className="rule my-10" />
          <section>
            <h2 className="font-serif text-[26px] sm:text-3xl font-normal text-foreground leading-tight mb-5">Open source</h2>
            <ProjectGrid>
              {openSource.map((p) => (
                <ProjectCard key={p.title} project={p} />
              ))}
            </ProjectGrid>
          </section>
        </>
      )}
    </PageShell>
  );
}
