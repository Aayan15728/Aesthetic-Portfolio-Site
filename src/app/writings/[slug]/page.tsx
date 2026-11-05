import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/confirm-button";
import { Mdx } from "@/components/mdx";
import { PostCover } from "@/components/post-cover";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { isAdmin } from "@/lib/auth";
import { formatDate, getPost } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { deletePostAction } from "../actions";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug, { includeDrafts: await isAdmin() });
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/writings/${post.slug}` },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const admin = await isAdmin();
  const post = await getPost(slug, { includeDrafts: admin });
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.siteUrl },
    mainEntityOfPage: `${siteConfig.siteUrl}/writings/${post.slug}`,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="h-14 sm:h-24" />
      <div className="rule" />
      <header className="px-6 sm:px-10 pt-8 pb-8">
        <Link
          href="/writings"
          className="inline-flex items-center gap-1.5 py-2 -my-2 mb-3 text-xs text-muted hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All writings
        </Link>
        <h1 className="font-serif text-[32px] sm:text-[42px] font-normal leading-[1.15] text-foreground">{post.title}</h1>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          <span>
            {formatDate(post.date)} &middot; {post.readingMinutes} min read
          </span>
          {post.tags.length > 0 && <span>&middot; {post.tags.map((t) => `#${t}`).join(" ")}</span>}
          {post.draft && (
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-400">Draft: only you can see this</span>
          )}
        </p>
        {post.cover && <PostCover title={post.title} cover={post.cover} className="group/post mt-6 aspect-[2/1]" />}
      </header>
      <div className="rule" />
      <Reveal>
        <article className="px-6 sm:px-10 py-6">
          <Mdx source={post.content} />
        </article>
      </Reveal>

      {admin && post.source === "stored" && (
        <>
          <div className="rule" />
          <div className="px-6 sm:px-10 py-6">
            <form action={deletePostAction}>
              <input type="hidden" name="slug" value={post.slug} />
              <input type="hidden" name="from" value="post" />
              <ConfirmButton
                message={`Delete "${post.title}"? This can't be undone.`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 px-3.5 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-600 hover:text-white dark:text-red-400"
              >
                <Trash2 className="h-4 w-4" /> Delete this article
              </ConfirmButton>
            </form>
          </div>
        </>
      )}

      <div className="rule" />
      <SiteFooter />
    </main>
  );
}
