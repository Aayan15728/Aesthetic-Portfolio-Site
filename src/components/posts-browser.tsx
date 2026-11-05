"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/confirm-button";
import { PostCover } from "@/components/post-cover";
import { deletePostAction } from "@/app/writings/actions";
import { formatDateShort } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";

const chip =
  "rounded-md border border-black/10 bg-white px-2 py-0.5 text-[11px] text-muted dark:border-white/10 dark:bg-white/[0.04]";

function PostCard({ post, admin }: { post: PostMeta; admin: boolean }) {
  return (
    <article className="group/post relative flex h-full w-full flex-col gap-3 rounded-2xl border border-dashed border-neutral-300/80 bg-white/60 p-2 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-lg hover:shadow-black/[0.06] dark:border-neutral-700/80 dark:bg-white/[0.03] dark:hover:border-neutral-500">
      <PostCover title={post.title} cover={post.cover} />

      <div className="flex flex-1 flex-col gap-2 px-1.5 pb-1.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-medium leading-snug text-foreground">
            {/* stretched link: the whole card is clickable */}
            <Link
              href={`/writings/${post.slug}`}
              className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-accent"
            >
              {post.title}
            </Link>
          </h3>
          <time dateTime={post.date} className="shrink-0 pt-0.5 text-xs tabular-nums text-muted">
            {formatDateShort(post.date)}
          </time>
        </div>

        {post.summary && <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">{post.summary}</p>}

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          {post.draft && (
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
              Draft
            </span>
          )}
          {post.tags.map((tag) => (
            <span key={tag} className={chip}>
              {tag}
            </span>
          ))}
          <span className="ml-auto text-[11px] text-muted/70">{post.readingMinutes} min</span>
        </div>
      </div>

      {admin && post.source === "stored" && (
        <form action={deletePostAction} className="absolute right-3.5 top-3.5 z-10">
          <input type="hidden" name="slug" value={post.slug} />
          <ConfirmButton
            message={`Delete "${post.title}"? This can't be undone.`}
            aria-label={`Delete ${post.title}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-neutral-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-red-600 hover:text-white dark:bg-neutral-900/90 dark:text-neutral-200"
          >
            <Trash2 className="h-4 w-4" />
          </ConfirmButton>
        </form>
      )}
    </article>
  );
}

export function PostsBrowser({ posts, admin }: { posts: PostMeta[]; admin: boolean }) {
  const [active, setActive] = useState<string>("all");
  const reduceMotion = useReducedMotion();

  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  const visible = active === "all" ? posts : posts.filter((p) => p.tags.includes(active));

  const filter = (key: string, label: string) => (
    <button
      key={key}
      type="button"
      onClick={() => setActive(key)}
      aria-pressed={active === key}
      className={cn(
        "rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 active:scale-95 pointer-coarse:px-3 pointer-coarse:py-2",
        active === key
          ? "bg-foreground text-background"
          : "border border-black/10 bg-white text-muted hover:text-foreground dark:border-white/10 dark:bg-white/[0.04]"
      )}
    >
      {label}
    </button>
  );

  return (
    <>
      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs text-muted">Filter:</span>
          {filter("all", "All")}
          {tags.map((t) => filter(t, t))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-sm text-muted">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((post, i) => (
              <motion.div
                key={post.slug}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1], delay: reduceMotion ? 0 : i * 0.04 }}
              >
                <PostCard post={post} admin={admin} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
