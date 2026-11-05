"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { Experience } from "@/data/experience";
import { cn } from "@/lib/utils";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function monthYear(ym: string) {
  const [year, m] = ym.split("-").map(Number);
  return `${MONTHS[(m || 1) - 1] ?? ""} ${year}`;
}

/** The company logo, or its first letter until one is added. */
function Logo({ job }: { job: Experience }) {
  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-black/10 bg-white font-serif text-xl text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-white/[0.04]">
      {job.logo ? <Image src={job.logo} alt="" fill sizes="40px" className="object-cover" /> : job.company.charAt(0)}
    </span>
  );
}

function Row({ job }: { job: Experience }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const reduceMotion = useReducedMotion();

  const range = `${monthYear(job.start)} – ${job.end ? monthYear(job.end) : "Present"}`;
  const hasDetails = Boolean(job.bullets?.length || job.stack?.length);

  const summary = (
    <>
      <Logo job={job} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[15px] font-semibold leading-5 text-foreground">
          <span className="truncate">{job.company}</span>
          {job.end === null && <span aria-label="Current role" className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />}
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-muted">{job.role}</span>
        <span className="mt-1 block text-xs tabular-nums text-muted sm:hidden">{range}</span>
      </span>
      <span className="hidden whitespace-nowrap text-[13px] tabular-nums text-muted sm:block">{range}</span>
      {/* always takes up room, so the dates line up whether or not a row can expand */}
      <span aria-hidden className="w-4 shrink-0">
        {hasDetails && <ChevronDown className={cn("h-4 w-4 text-muted transition-transform duration-300", open && "rotate-180")} />}
      </span>
    </>
  );

  const rowClass = "flex w-full items-center gap-3.5 py-3.5 text-left";

  return (
    // the negative margin takes the line between rows out to both edges of the frame
    <li className="-mx-6 border-dotted border-line px-6 not-first:border-t sm:-mx-10 sm:px-10">
      {hasDetails ? (
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)} className={rowClass}>
          {summary}
        </button>
      ) : job.href ? (
        <a href={job.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
          {summary}
        </a>
      ) : (
        <div className={rowClass}>{summary}</div>
      )}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-[54px] pr-[30px]">
              {job.bullets && job.bullets.length > 0 && (
                <ul className="space-y-1.5">
                  {job.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5 text-[14px] leading-relaxed text-muted">
                      <span aria-hidden className="text-muted/60">&ndash;</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {job.stack && job.stack.length > 0 && <p className="mt-3 text-xs text-muted/80">{job.stack.join(", ")}</p>}
              {job.href && (
                <a
                  href={job.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-foreground"
                >
                  {job.href.replace(/^https?:\/\//, "")}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:-translate-y-px group-hover/link:translate-x-px" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/** Career history as a list of rows: logo, company, role and dates. A row with details expands to show them. */
export function ExperienceList({ items }: { items: Experience[] }) {
  return (
    <ul>
      {items.map((job) => (
        <Row key={`${job.company}-${job.start}`} job={job} />
      ))}
    </ul>
  );
}
