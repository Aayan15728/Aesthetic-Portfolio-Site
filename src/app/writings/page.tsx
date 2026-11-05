import type { Metadata } from "next";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PostsBrowser } from "@/components/posts-browser";
import { isAdmin } from "@/lib/auth";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writings",
  description: "Notes, essays and things I've learned while building.",
  alternates: { canonical: "/writings", types: { "application/rss+xml": "/rss.xml" } },
};

export default async function WritingsPage() {
  const admin = await isAdmin();
  const posts = await getAllPosts({ includeDrafts: admin });

  return (
    <PageShell title="Writings" description="Articles on building software, learning in public, and ideas from shipping real projects.">
      {admin && (
        <Link
          href="/writings/new"
          className="mb-6 inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
        >
          <PenLine className="h-4 w-4" /> New article
        </Link>
      )}
      {posts.length === 0 ? <p className="text-sm text-muted">Nothing here yet. Check back soon.</p> : <PostsBrowser posts={posts} admin={admin} />}
    </PageShell>
  );
}
