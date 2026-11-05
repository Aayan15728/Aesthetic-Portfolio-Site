import { Quote } from "lucide-react";

interface QuoteSectionProps {
  text: string;
  author: string;
}

/** Centered pull-quote between two hatched bands, like a printed pull-quote on graph paper. */
export function QuoteSection({ text, author }: QuoteSectionProps) {
  return (
    <figure>
      <div aria-hidden className="hatch h-7 border-y border-dashed border-neutral-300/80 dark:border-neutral-700/80" />
      <div className="px-6 py-8 text-center sm:px-10 sm:py-10">
        <Quote aria-hidden className="mx-auto h-7 w-7 rotate-180 fill-neutral-300 text-neutral-300 dark:fill-neutral-700 dark:text-neutral-700" strokeWidth={0} />
        <blockquote className="mx-auto mt-3 max-w-xl text-balance text-xl font-medium italic leading-relaxed text-foreground/90 sm:text-[26px] sm:leading-[1.45]">
          &ldquo;{text}&rdquo;
        </blockquote>
        <figcaption className="mt-4 flex items-center justify-center gap-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          <span aria-hidden className="h-px w-10 bg-neutral-300 dark:bg-neutral-700" />
          {author}
          <span aria-hidden className="h-px w-10 bg-neutral-300 dark:bg-neutral-700" />
        </figcaption>
      </div>
      <div aria-hidden className="hatch h-7 border-y border-dashed border-neutral-300/80 dark:border-neutral-700/80" />
    </figure>
  );
}
