/**
 * Poster artwork for the collection page, resolved on the server and cached for a week.
 *
 *  - Anime:  AniList (free, no key), full-size portrait covers plus their dominant colour.
 *  - Series: TVmaze (free, no key), high-resolution posters.
 *  - Movies: TMDB when TMDB_API_KEY is set (best quality); otherwise the film's Wikipedia poster.
 *
 * Every lookup fails soft: no artwork simply means the UI draws a typographic poster instead.
 * Artwork belongs to its studios/publishers; it is only linked to, never stored in this repo.
 */
import { readFile } from "fs/promises";
import path from "path";
import { unstable_cache } from "next/cache";

const USER_AGENT = "awesome-portfolio-site/1.0 (https://github.com/Aayan15728/awesome-portfolio-site)";
const WEEK = 60 * 60 * 24 * 7;

export interface Artwork {
  src: string | null;
  /** Dominant colour of the artwork, when the source provides one (used for the hover glow). */
  color: string | null;
}

const NONE: Artwork = { src: null, color: null };

/* ── dominant colour (for the ambient glow behind a hovered poster) ──────── */

async function computeDominantColor(src: string): Promise<string | null> {
  try {
    let input: Buffer;
    if (src.startsWith("/")) {
      input = await readFile(path.join(process.cwd(), "public", src));
    } else {
      const res = await fetch(src, { headers: { "User-Agent": USER_AGENT }, cache: "no-store" });
      if (!res.ok) return null;
      input = Buffer.from(await res.arrayBuffer());
    }
    const sharp = (await import("sharp")).default;
    const { dominant } = await sharp(input).resize(48, 48, { fit: "cover" }).stats();
    // keep the hue but lift dark tones, or the glow would vanish against the black panel
    const peak = Math.max(dominant.r, dominant.g, dominant.b);
    if (peak < 40) return "#9a9a9a";
    const lift = peak < 200 ? 200 / peak : 1;
    const hex = (v: number) => Math.min(255, Math.round(v * lift)).toString(16).padStart(2, "0");
    return `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`;
  } catch {
    return null;
  }
}

/** Cached for a week so poster images aren't re-downloaded on every page refresh. */
const getDominantColor = unstable_cache(computeDominantColor, ["dominant-color"], { revalidate: WEEK });

/**
 * Picks the final artwork for one item: your own image (if you set `posterSrc`) wins over the automatic
 * lookup, and every poster gets a glow colour.
 */
export async function withGlow(local: string | undefined, found: Artwork): Promise<Artwork> {
  const src = local ?? found.src;
  if (!src) return NONE;
  const color = !local && found.color ? found.color : await getDominantColor(src);
  return { src, color };
}

async function getJson<T>(url: string, init: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { "User-Agent": USER_AGENT, Accept: "application/json", ...init.headers },
      next: { revalidate: WEEK },
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

/* ── movies ──────────────────────────────────────────────────────────────── */

interface TmdbSearch {
  results?: { poster_path?: string | null }[];
}
interface WikiSummary {
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string; width: number; height: number };
}

export async function getMoviePoster(movie: { title: string; year?: number; wikipedia?: string }): Promise<Artwork> {
  const key = process.env.TMDB_API_KEY;
  if (key) {
    const query = new URLSearchParams({ query: movie.title });
    if (movie.year) query.set("year", String(movie.year));
    // v3 keys are 32 hex characters; anything longer is a v4 read-access token
    const bearer = key.length > 40;
    if (!bearer) query.set("api_key", key);
    const data = await getJson<TmdbSearch>(`https://api.themoviedb.org/3/search/movie?${query}`, {
      headers: bearer ? { Authorization: `Bearer ${key}` } : {},
    });
    const path = data?.results?.[0]?.poster_path;
    if (path) return { src: `https://image.tmdb.org/t/p/w500${path}`, color: null };
  }

  if (movie.wikipedia) {
    const data = await getJson<WikiSummary>(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(movie.wikipedia)}`);
    // only accept portrait images: some articles lead with a landscape still instead of the poster
    const image = [data?.originalimage, data?.thumbnail].find((i) => i && i.height > i.width * 1.2);
    if (image) return { src: image.source, color: null };
  }
  return NONE;
}

/* ── anime ───────────────────────────────────────────────────────────────── */

interface AniListResponse {
  data?: { Media?: { coverImage?: { extraLarge?: string; color?: string | null } } };
}

export async function getAnimePoster(search: string): Promise<Artwork> {
  const data = await getJson<AniListResponse>("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "query($s:String){Media(search:$s,type:ANIME,sort:SEARCH_MATCH){coverImage{extraLarge color}}}",
      variables: { s: search },
    }),
  });
  const cover = data?.data?.Media?.coverImage;
  return cover?.extraLarge ? { src: cover.extraLarge, color: cover.color ?? null } : NONE;
}

/* ── series ──────────────────────────────────────────────────────────────── */

interface TvMazeShow {
  image?: { original?: string; medium?: string };
}

export async function getSeriesPoster(search: string): Promise<Artwork> {
  const data = await getJson<TvMazeShow>(`https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(search)}`);
  const src = data?.image?.original ?? data?.image?.medium;
  return src ? { src, color: null } : NONE;
}
