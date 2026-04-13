"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { getOrCreateVisitorId } from "@/lib/fingerprint";

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getOrCreateVisitorId();

    // POST to register this browser, then use the returned count
    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint: id }),
    })
      .then((r) => r.json())
      .then((data: { count: number }) => {
        setCount(data.count);
        setLoading(false);
      })
      .catch(() => {
        // On error fall back to a GET so we still show something
        fetch("/api/visitors")
          .then((r) => r.json())
          .then((data: { count: number }) => setCount(data.count))
          .finally(() => setLoading(false));
      });
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-black/[0.07] dark:border-white/[0.07] bg-white/60 dark:bg-white/[0.03] text-sm text-muted">
      <Eye className="w-4 h-4 text-muted/60 flex-shrink-0" />
      {loading ? (
        <span className="animate-pulse text-muted/50">counting…</span>
      ) : (
        <span>
          You are the{" "}
          <strong className="text-foreground font-semibold">
            {count?.toLocaleString()}
          </strong>
          <sup>th</sup> visitor
        </span>
      )}
    </div>
  );
}
