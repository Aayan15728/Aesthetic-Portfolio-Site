"use client";

import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { RebuildButton } from "@/components/rebuild-button";
import { OPEN_PALETTE_EVENT } from "@/components/command-palette";

// 36px on mouse devices, 44px (the recommended touch size) on touch screens
const touchSize = "pointer-coarse:h-11 pointer-coarse:w-11";

/** Fixed bottom-right action rail: command palette + theme toggle + swarm rebuild. */
export function FloatingRail() {
  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] sm:right-[max(1.5rem,env(safe-area-inset-right))] z-40 flex flex-col gap-2 print:hidden">
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
        aria-label="Open command palette"
        className={`w-9 h-9 ${touchSize} flex items-center justify-center rounded-lg border border-dashed border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-100/60 dark:bg-neutral-900/60 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-all duration-200 active:scale-95`}
      >
        <Search className="h-4 w-4 text-foreground/80" />
      </button>
      <ThemeToggle className={touchSize} />
      <RebuildButton className={touchSize} />
    </div>
  );
}
