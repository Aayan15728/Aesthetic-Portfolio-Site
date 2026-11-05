import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { AdminLogin } from "@/components/admin-login";
import { isAdmin } from "@/lib/auth";
import { LIMITS } from "@/lib/posts";
import { createPostAction } from "../actions";

export const metadata: Metadata = {
  title: "New article",
  robots: { index: false, follow: false },
};

const label = "mb-1.5 block text-xs font-medium text-muted";
const input =
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-foreground dark:border-white/10 dark:bg-white/5";

export default async function NewArticlePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, admin] = await Promise.all([searchParams, isAdmin()]);

  if (!admin) {
    return (
      <PageShell title="New article" description="Sign in as the owner to write an article.">
        <AdminLogin next="/writings/new" error={error === "1"} />
      </PageShell>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <PageShell title="New article" description="Write in Markdown. Publishing is instant; drafts stay visible only to you.">
      {error && error !== "1" && (
        <p role="alert" className="mb-6 rounded-lg border border-dashed border-red-500/50 bg-red-500/5 px-3 py-2 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}

      <form action={createPostAction} className="space-y-5">
        <div>
          <label htmlFor="title" className={label}>
            Title
          </label>
          <input id="title" name="title" required maxLength={LIMITS.title} className={input} placeholder="What's this about?" />
        </div>

        <div>
          <label htmlFor="summary" className={label}>
            Summary <span className="font-normal text-muted/70">(shown in lists and link previews)</span>
          </label>
          <input id="summary" name="summary" maxLength={LIMITS.summary} className={input} placeholder="One sentence" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tags" className={label}>
              Tags <span className="font-normal text-muted/70">(comma separated)</span>
            </label>
            <input id="tags" name="tags" className={input} placeholder="nextjs, notes" />
          </div>
          <div>
            <label htmlFor="date" className={label}>
              Date
            </label>
            <input id="date" name="date" type="date" defaultValue={today} className={input} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cover" className={label}>
              Cover image URL <span className="font-normal text-muted/70">(optional, https)</span>
            </label>
            <input id="cover" name="cover" type="url" className={input} placeholder="https://…" />
          </div>
          <div>
            <label htmlFor="slug" className={label}>
              URL slug <span className="font-normal text-muted/70">(optional)</span>
            </label>
            <input id="slug" name="slug" className={input} placeholder="made-from-the-title" pattern="[a-zA-Z0-9\- ]*" />
          </div>
        </div>

        <div>
          <label htmlFor="content" className={label}>
            Article <span className="font-normal text-muted/70">(Markdown: headings, lists, links, code, tables)</span>
          </label>
          <textarea
            id="content"
            name="content"
            required
            maxLength={LIMITS.content}
            rows={16}
            className={`${input} min-h-[320px] resize-y font-mono text-[13px] leading-relaxed`}
            placeholder={"## A heading\n\nStart writing…"}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="draft" className="h-4 w-4 accent-neutral-900 dark:accent-white" /> Save as draft
          </label>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
          >
            Publish
          </button>
        </div>
      </form>
    </PageShell>
  );
}
