import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

// articles can be added or deleted on the site, so build the feed per request (cheap, and cached by the host)
export const dynamic = "force-dynamic";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const items = (await getAllPosts())
    .map((post) => {
      const url = `${siteConfig.siteUrl}/writings/${post.slug}`;
      return `<item>
<title>${escape(post.title)}</title>
<link>${url}</link>
<guid>${url}</guid>
<pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
<description>${escape(post.summary)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escape(siteConfig.name)} - Writings</title>
<link>${siteConfig.siteUrl}/writings</link>
<description>${escape(siteConfig.description)}</description>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" },
  });
}
