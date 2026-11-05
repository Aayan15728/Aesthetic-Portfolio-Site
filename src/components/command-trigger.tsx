"use client";

import { Command } from "lucide-react";
import { OPEN_PALETTE_EVENT } from "@/components/command-palette";
import { cn } from "@/lib/utils";

/** Small "⌘ K" badge that opens the command palette. */
export function CommandTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
      aria-label="Open command palette"
      className={cn(
        "liquid-glass inline-flex items-center gap-1 rounded-[10px] px-2.5 py-1.5 text-[11px] font-medium text-foreground/70",
        "hover:text-foreground transition-[color,scale] duration-200 active:scale-95 [&>*]:relative [&>*]:z-[2]",
        className
      )}
    >
      <Command className="w-3 h-3" />
      <span>K</span>
    </button>
  );
}
