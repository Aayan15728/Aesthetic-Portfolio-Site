"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { FaSpotify } from "react-icons/fa6";
import { toggleTrack, useTrack } from "@/lib/player";
import { cn } from "@/lib/utils";

export interface VinylRecordProps {
  title: string;
  artist: string;
  artworkUrl: string | null;
  previewUrl: string | null;
  spotifyUrl: string | null;
}

/**
 * An album sleeve with its record peeking out. Hover slides the record out; click plays a 30s preview,
 * and the record keeps spinning (and stays out) while it plays.
 */
export function VinylRecord({ title, artist, artworkUrl, previewUrl, spotifyUrl }: VinylRecordProps) {
  const { playing, progress } = useTrack(previewUrl);
  const canPlay = !!previewUrl;

  return (
    <div className="group/vinyl">
      <button
        type="button"
        onClick={() => previewUrl && toggleTrack(previewUrl)}
        disabled={!canPlay}
        aria-pressed={playing}
        aria-label={canPlay ? `${playing ? "Pause" : "Play a preview of"} ${title} by ${artist}` : `${title} by ${artist}`}
        className="relative block aspect-[100/64] w-full rounded-md text-left outline-none disabled:cursor-default focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        {/* record (behind the sleeve) */}
        <span
          className={cn(
            "absolute left-[22%] top-[3.125%] block aspect-square w-[60%] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            "group-hover/vinyl:translate-x-[30%] group-focus-visible/vinyl:translate-x-[30%]",
            playing && "translate-x-[30%]"
          )}
        >
          <span className="vinyl-disc absolute inset-0 rounded-full shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]" data-playing={playing}>
            {/* centre label with the album art */}
            <span className="absolute left-1/2 top-1/2 block aspect-square w-[38%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-1 ring-black/40">
              {artworkUrl ? (
                <Image src={artworkUrl} alt="" fill sizes="80px" className="object-cover" />
              ) : (
                <span className="block h-full w-full bg-red-700" />
              )}
              <span className="absolute left-1/2 top-1/2 block h-[12%] w-[12%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background ring-1 ring-black/30" />
            </span>
          </span>
          <span className="vinyl-sheen pointer-events-none absolute inset-0 rounded-full" />
        </span>

        {/* sleeve */}
        <span className="absolute left-0 top-0 z-10 block aspect-square w-[64%] overflow-hidden rounded-md border border-black/10 bg-neutral-200 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.45)] dark:border-white/10 dark:bg-white/10">
          {artworkUrl && <Image src={artworkUrl} alt={`${title} cover art`} fill sizes="(min-width: 640px) 220px, 60vw" className="object-cover" />}
          {canPlay && (
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300",
                "group-hover/vinyl:bg-black/25",
                playing && "bg-black/25"
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-lg transition-all duration-300",
                  "scale-90 opacity-0 group-hover/vinyl:scale-100 group-hover/vinyl:opacity-100 pointer-coarse:scale-100 pointer-coarse:opacity-90",
                  playing && "scale-100 opacity-100"
                )}
              >
                {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="ml-0.5 h-4 w-4" fill="currentColor" />}
              </span>
            </span>
          )}
        </span>
      </button>

      {/* caption */}
      <div className="mt-3 flex items-start justify-between gap-3 pr-[36%]">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
          <p className="truncate text-xs text-muted">{artist}</p>
        </div>
        {spotifyUrl && (
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${title} on Spotify`}
            className="-m-1.5 shrink-0 p-1.5 pointer-coarse:-m-3 pointer-coarse:p-3 text-muted transition-colors hover:text-[#1DB954]"
          >
            <FaSpotify className="h-4 w-4" />
          </a>
        )}
      </div>
      <div className="mt-2 mr-[36%] h-[2px] overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10" aria-hidden>
        <div className="h-full bg-foreground/80 transition-[width] duration-300 ease-linear" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}
