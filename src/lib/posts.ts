import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getJSON, setJSON } from "@/lib/store";

/**
 * Articles come from two places:
 *  - MDX files in /content/writings (committed to the repo), and
 *  - articles written on the site by the owner, kept in the storage adapter (Supabase / local file).
 *
 * File frontmatter:
 *   ---
 *   title: "My post"
 *   date: "2026-05-01"
 *   summary: "One sentence shown in lists and link previews."
 *   tags: ["nextjs", "notes"]
 *   cover: "https://example.com/cover.jpg"   # optional
 *   draft: false                              # drafts are hidden in production
 *   ---
 */
const POSTS_DIR = path.join(process.cwd(), "content", "writings");
const STORE_KEY = "posts";

export const LIMITS = { title: 120, summary: 300, content: 100_000, tags: 8, tagLength: 24, posts: 500 } as const;

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  cover?: string;
  readingMinutes: number;
  draft: boolean;
  /** "file" posts live in the repo; "stored" posts were written on the site and can be deleted there. */
  source: "file" | "stored";
}

export interface Post extends PostMeta {
  content: string;
}

type StoredPost = Omit<Post, "readingMinutes" | "source">;

/* ── file posts ──────────────────────────────────────────────────────────── */

function parseFile(file: string): Post | null {
  const slug = file.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
  const { data, content } = matter(raw);

  if (typeof data.title !== "string" || !data.date) {
    console.warn(`[writings] skipping ${file}: frontmatter needs "title" and "date"`);
    return null;
  }

  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);

  return {
    slug,
    title: data.title,
    date,
    summary: typeof data.summary === "string" ? data.summary : "",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: typeof data.cover === "string" ? data.cover : undefined,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    draft: Boolean(data.draft),
    source: "file",
    content,
  };
}

function filePosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(parseFile)
    .filter((p): p is Post => p !== null);
}

/* ── stored posts ────────────────────────────────────────────────────────── */

async function readStored(): Promise<StoredPost[]> {
  try {
    return await getJSON<StoredPost[]>(STORE_KEY, []);
  } catch {
    // storage down: the site still serves the file posts
    return [];
  }
}

function fromStored(p: StoredPost): Post {
  return { ...p, tags: p.tags ?? [], draft: Boolean(p.draft), readingMinutes: Math.max(1, Math.round(readingTime(p.content).minutes)), source: "stored" };
}

/* ── reading ─────────────────────────────────────────────────────────────── */

const toMeta = (p: Post): PostMeta => ({
  slug: p.slug,
  title: p.title,
  date: p.date,
  summary: p.summary,
  tags: p.tags,
  cover: p.cover,
  readingMinutes: p.readingMinutes,
  draft: p.draft,
  source: p.source,
});

function visible(posts: Post[], includeDrafts: boolean): Post[] {
  // drafts are only ever shown to the owner (stored posts) or in local development (file posts)
  return posts.filter((p) => !p.draft || includeDrafts || (p.source === "file" && process.env.NODE_ENV !== "production"));
}

export async function getAllPosts({ includeDrafts = false }: { includeDrafts?: boolean } = {}): Promise<PostMeta[]> {
  const all = [...filePosts(), ...(await readStored()).map(fromStored)];
  return visible(all, includeDrafts)
    .map(toMeta)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getPost(slug: string, { includeDrafts = false }: { includeDrafts?: boolean } = {}): Promise<Post | null> {
  // slugs come from the URL: only allow plain file names
  if (!/^[a-z0-9][a-z0-9-_]*$/i.test(slug)) return null;
  const all = [...filePosts(), ...(await readStored()).map(fromStored)];
  return visible(all, includeDrafts).find((p) => p.slug === slug) ?? null;
}

/* ── writing ─────────────────────────────────────────────────────────────── */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export interface NewPostInput {
  title: string;
  slug?: string;
  date?: string;
  summary?: string;
  tags?: string;
  cover?: string;
  content: string;
  draft?: boolean;
}

export type CreateResult = { ok: true; slug: string } | { ok: false; error: string };

export async function createPost(input: NewPostInput): Promise<CreateResult> {
  const title = input.title.trim();
  const content = input.content.replace(/\r\n/g, "\n").trim();
  if (!title) return { ok: false, error: "Add a title." };
  if (title.length > LIMITS.title) return { ok: false, error: `Title is too long (max ${LIMITS.title}).` };
  if (!content) return { ok: false, error: "Write something first." };
  if (content.length > LIMITS.content) return { ok: false, error: "That article is too long." };

  const summary = (input.summary ?? "").trim();
  if (summary.length > LIMITS.summary) return { ok: false, error: `Summary is too long (max ${LIMITS.summary}).` };

  const date = input.date && /^\d{4}-\d{2}-\d{2}$/.test(input.date) ? input.date : new Date().toISOString().slice(0, 10);

  const tags = [
    ...new Set(
      (input.tags ?? "")
        .split(",")
        .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
        .filter(Boolean)
        .map((t) => t.slice(0, LIMITS.tagLength))
    ),
  ].slice(0, LIMITS.tags);

  const cover = (input.cover ?? "").trim();
  if (cover && !(/^https:\/\//i.test(cover) || /^\/(?!\/)/.test(cover))) {
    return { ok: false, error: "Cover must be an https:// image URL." };
  }
  if (cover.length > 500) return { ok: false, error: "Cover URL is too long." };

  const stored = await readStored();
  if (stored.length >= LIMITS.posts) return { ok: false, error: "Article limit reached." };

  // "new" is the editor route
  const taken = new Set(["new", ...filePosts().map((p) => p.slug), ...stored.map((p) => p.slug)]);
  let slug = slugify(input.slug?.trim() || title);
  if (!slug) return { ok: false, error: "Use letters or numbers in the title or slug." };
  if (input.slug?.trim() && taken.has(slug)) return { ok: false, error: `The slug "${slug}" is already used.` };
  const base = slug;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

  stored.push({ slug, title, date, summary, tags, cover: cover || undefined, content, draft: Boolean(input.draft) });
  await setJSON(STORE_KEY, stored);
  return { ok: true, slug };
}

/** Deletes an article written on the site. Repo (MDX) posts are removed by deleting their file. */
export async function deletePost(slug: string): Promise<boolean> {
  const stored = await readStored();
  const next = stored.filter((p) => p.slug !== slug);
  if (next.length === stored.length) return false;
  await setJSON(STORE_KEY, next);
  return true;
}

export { formatDate, formatDateShort } from "@/lib/dates";
