import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/projects", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/writings", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/collection", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/goal", changeFrequency: "weekly" as const, priority: 0.4 },
  ].map(({ path, ...rest }) => ({ url: `${siteConfig.siteUrl}${path}`, lastModified: new Date(), ...rest }));

  const posts: MetadataRoute.Sitemap = (await getAllPosts()).map((post) => ({
    url: `${siteConfig.siteUrl}/writings/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticPages, ...posts];
}
