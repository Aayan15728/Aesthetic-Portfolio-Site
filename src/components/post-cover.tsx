import { cn } from "@/lib/utils";

interface PostCoverProps {
  title: string;
  cover?: string;
  className?: string;
}

/**
 * Cover image for an article. Without one it falls back to a hatched monochrome tile with the title,
 * so every card in a list still looks designed.
 */
export function PostCover({ title, cover, className }: PostCoverProps) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-xl border border-black/5 bg-neutral-100 dark:border-white/5 dark:bg-white/5",
        className
      )}
    >
      {cover ? (
        // covers can be any https image, so they bypass the Next image optimizer's host allowlist
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/post:scale-[1.04]"
        />
      ) : (
        <div className="hatch absolute inset-0 flex items-end p-4">
          <span className="line-clamp-3 font-serif text-[28px] leading-[1.05] text-foreground/85">{title}</span>
        </div>
      )}
    </div>
  );
}
