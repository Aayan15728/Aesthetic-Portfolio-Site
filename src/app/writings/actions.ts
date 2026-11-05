"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { createPost, deletePost } from "@/lib/posts";

// Server Actions are reachable by direct POST, so each one re-checks the owner session.

const field = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
};

export async function createPostAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/writings/new");

  const result = await createPost({
    title: field(formData, "title"),
    slug: field(formData, "slug"),
    date: field(formData, "date"),
    summary: field(formData, "summary"),
    tags: field(formData, "tags"),
    cover: field(formData, "cover"),
    content: field(formData, "content"),
    draft: formData.get("draft") === "on",
  });

  if (!result.ok) redirect(`/writings/new?error=${encodeURIComponent(result.error)}`);

  revalidatePath("/writings");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
  redirect(`/writings/${result.slug}`);
}

export async function deletePostAction(formData: FormData) {
  if (!(await isAdmin())) return;
  const slug = field(formData, "slug");
  if (slug) await deletePost(slug);

  revalidatePath("/writings");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
  // deleting from an article page leaves nothing to show: go back to the list
  if (field(formData, "from") === "post") redirect("/writings");
}
