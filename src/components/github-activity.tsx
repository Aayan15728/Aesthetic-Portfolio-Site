import { ContributionGraph } from "@/components/contribution-graph";
import { getContributions } from "@/lib/github";

const frame = "rounded-xl border border-dashed border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-100/40 dark:bg-white/[0.03]";

/** The year of GitHub contributions: a flat grey grid whose dots turn green on hover. */
export async function GitHubActivity({ username }: { username: string }) {
  const data = await getContributions(username);
  const profile = `https://github.com/${username}`;

  if (!data) {
    return (
      <div className={`${frame} p-5 text-sm text-muted`}>
        Couldn&apos;t load GitHub activity right now.{" "}
        <a href={profile} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4">
          View the profile
        </a>
        .
      </div>
    );
  }

  return (
    <div>
      <ContributionGraph days={data.days} />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13px] text-foreground/80">
        <p className="tabular-nums">{data.total.toLocaleString()} contributions in the last year</p>
        <div className="flex items-center gap-1.5">
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} aria-hidden className={`gh-legend gh-l${l}`} />
          ))}
          More
        </div>
      </div>
    </div>
  );
}
