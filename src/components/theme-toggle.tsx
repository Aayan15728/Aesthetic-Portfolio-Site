"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full" />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className={cn(
        "relative w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300",
        "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-95",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0 text-foreground/80" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-foreground/80" />
    </button>
  );
}
