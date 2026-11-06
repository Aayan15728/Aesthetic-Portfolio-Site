"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MousePointer2 } from "lucide-react";

type SwarmApi = { start(): void; stop(reveal?: boolean): void; isRunning(): boolean };

declare global {
  interface Window {
    SwarmCursors?: SwarmApi;
    SwarmCursorsConfig?: { trigger: string; hotkey: string };
  }
}

const CUSTOM_CURSOR_CLASS = "has-custom-cursor";

let engine: Promise<SwarmApi> | null = null;

/** The engine is about 157 KB, so it is only fetched the first time someone asks for a rebuild. */
function loadEngine(): Promise<SwarmApi> {
  if (engine) return engine;
  engine = new Promise<SwarmApi>((resolve, reject) => {
    // this button is the only trigger: no floating button of its own, no hotkey
    window.SwarmCursorsConfig = { trigger: "none", hotkey: "" };
    const script = document.createElement("script");
    script.src = "/swarm-cursors.js";
    script.onload = () => (window.SwarmCursors ? resolve(window.SwarmCursors) : reject(new Error("Swarm engine did not start")));
    script.onerror = () => reject(new Error("Could not load the swarm engine"));
    document.body.appendChild(script);
  }).catch((error) => {
    engine = null; // let the next click try again
    throw error;
  });
  return engine;
}

/**
 * Wipes the page to a blank canvas and lets a swarm of multiplayer cursors rebuild it, with a toolbar for
 * auto-scroll, speed, sound and exit. It overlays the page, so the real DOM is untouched and Go live fades back to it.
 */
export function RebuildButton({ className }: { className?: string }) {
  const pathname = usePathname();

  useEffect(() => {
    // the custom cursor sits below the swarm's overlay, so hand back the system cursor while it runs
    const html = document.documentElement;
    let restore = false;
    const onStart = () => {
      restore = html.classList.contains(CUSTOM_CURSOR_CLASS);
      html.classList.remove(CUSTOM_CURSOR_CLASS);
    };
    const onExit = () => {
      if (restore) html.classList.add(CUSTOM_CURSOR_CLASS);
      restore = false;
    };
    window.addEventListener("swarm:start", onStart);
    window.addEventListener("swarm:exit", onExit);
    return () => {
      window.removeEventListener("swarm:start", onStart);
      window.removeEventListener("swarm:exit", onExit);
    };
  }, []);

  // browser back/forward during a rebuild: don't leave the old page's overlay on top of the new one
  useEffect(() => {
    if (window.SwarmCursors?.isRunning()) window.SwarmCursors.stop(false);
  }, [pathname]);

  return (
    <button
      type="button"
      onClick={() => loadEngine().then((swarm) => swarm.start()).catch(console.error)}
      aria-label="Rebuild this page"
      data-cursor="Rebuild"
      className={`w-9 h-9 flex items-center justify-center rounded-lg border border-dashed border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-100/60 dark:bg-neutral-900/60 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-all duration-200 active:scale-95 ${className ?? ""}`}
    >
      <MousePointer2 className="h-4 w-4 text-foreground/80" />
    </button>
  );
}
