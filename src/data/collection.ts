/**
 * Your living library. Each section is a typed array: adding an item is a one-line change.
 *
 * `favorite: true` highlights an item in red (things that hit hard or you really want).
 * `rating` is 1-5 and optional.
 */
export interface Book {
  title: string;
  author: string;
  /** Cover image: a path under /public, e.g. "/assets/books/atomic-habits.jpg". */
  coverSrc?: string;
  /** Spine colour on the bookshelf (tip: the cover's dominant colour). */
  spineColor?: string;
  href?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  favorite?: boolean;
}

export interface Video {
  title: string;
  /** e.g. "08:25" */
  duration: string;
  href: string;
  favorite?: boolean;
}

export interface Song {
  title: string;
  artist: string;
  /** Spotify track id (the 22 characters in open.spotify.com/track/<id>), used for the "Open in Spotify" link. */
  spotifyId?: string;
  /**
   * Apple Music / iTunes track id (the `i=` number in a music.apple.com link). Provides the album art
   * and a 30-second preview for the record player.
   */
  appleId?: number;
  href?: string;
  favorite?: boolean;
}

export interface Movie {
  title: string;
  year?: number;
  director?: string;
  /** Your own poster image under /public (wins over the automatic lookup). */
  posterSrc?: string;
  /** Exact English Wikipedia article title, used to find the poster (e.g. "Fight_Club"). */
  wikipedia?: string;
  /** Runtime in minutes. */
  minutes?: number;
  href?: string;
  favorite?: boolean;
}

/** Anime and series share one shape; `kind` decides which section they appear in. */
export interface Show {
  title: string;
  kind: "anime" | "series";
  /** Your own poster image under /public (wins over the automatic lookup). */
  posterSrc?: string;
  /** What to search AniList / TVmaze for, if the title alone finds the wrong show. */
  search?: string;
  /** e.g. "partly watched" */
  note?: string;
  favorite?: boolean;
}

export interface WishlistItem {
  title: string;
  note?: string;
  href?: string;
}

export const collectionIntro =
  "this is a living library of the books i've read, the songs, movies and shows i love. i add new things over time.";

export const books: Book[] = [
  {
    title: "The 48 Laws of Power",
    author: "Robert Greene",
    coverSrc: "/assets/books/48-laws-of-power.jpg",
    spineColor: "#c84828",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    coverSrc: "/assets/books/atomic-habits.jpg",
    spineColor: "#f3f1e4",
  },
  {
    title: "Titan: The Life of John D. Rockefeller, Sr.",
    author: "Ron Chernow",
    coverSrc: "/assets/books/titan.jpg",
    spineColor: "#8f8180",
  },
];

// Empty sections are hidden. Add items to bring them back.
export const videos: Video[] = [];

export const songs: Song[] = [
  { title: "The Nights", artist: "Avicii", spotifyId: "0ct6r3EGTcMLPtrXHDvVjc", appleId: 1440829549 },
  { title: "Training Season", artist: "Dua Lipa", spotifyId: "19V4RU6rCmY9afsJB6oawB", appleId: 1727526894 },
  { title: "Eye of the Tiger", artist: "Survivor", spotifyId: "2KH16WveTQWT6KOG9Rg6e2", appleId: 254685026 },
  { title: "Beat It", artist: "Michael Jackson", spotifyId: "1OOtq8tRnDM8kG2gqUPjAj", appleId: 269573341 },
];

export const movies: Movie[] = [
  { title: "Steve Jobs", wikipedia: "Steve_Jobs_(film)", year: 2015, director: "Danny Boyle" },
  { title: "Star Wars", wikipedia: "Star_Wars_(film)", year: 1977, director: "George Lucas" },
  { title: "The Godfather Part II", wikipedia: "The_Godfather_Part_II", year: 1974, director: "Francis Ford Coppola" },
  { title: "Fight Club", posterSrc: "/assets/posters/fight-club.jpg", wikipedia: "Fight_Club", year: 1999, director: "David Fincher" },
  { title: "Harry Potter and the Goblet of Fire", posterSrc: "/assets/posters/harry-potter.jpg", wikipedia: "Harry_Potter_and_the_Goblet_of_Fire_(film)", year: 2005, director: "Mike Newell" },
  { title: "The Dark Knight", wikipedia: "The_Dark_Knight", year: 2008, director: "Christopher Nolan" },
  { title: "WALL-E", wikipedia: "WALL-E", year: 2008, director: "Andrew Stanton" },
  { title: "Back to the Future", wikipedia: "Back_to_the_Future", year: 1985, director: "Robert Zemeckis" },
];

export const shows: Show[] = [
  { title: "Dragon Ball", kind: "anime" },
  { title: "Naruto", kind: "anime" },
  { title: "One Piece", kind: "anime", note: "partly watched" },
  { title: "Attack on Titan", kind: "anime" },
  { title: "Demon Slayer", kind: "anime", search: "Kimetsu no Yaiba" },
  { title: "Suits", kind: "series", posterSrc: "/assets/posters/suits.jpg", favorite: true },
  { title: "Peaky Blinders", kind: "series", favorite: true },
];

export const wishlist: WishlistItem[] = [{ title: "Ferrari SF90 Spyder" }, { title: "MacBook M5 Pro" }];
