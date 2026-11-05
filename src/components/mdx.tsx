import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ComponentProps } from "react";

/** Element styles for MDX content (kept here so the site needs no typography plugin). */
const components = {
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="font-serif text-[26px] font-normal leading-tight text-foreground mt-10 mb-3" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="text-lg font-medium leading-snug text-foreground mt-8 mb-2" {...props} />
  ),
  p: (props: ComponentProps<"p">) => <p className="text-[15px] sm:text-base leading-[1.85] text-muted my-4" {...props} />,
  a: ({ href = "", ...props }: ComponentProps<"a">) => {
    const cls = "text-foreground underline decoration-neutral-400/60 underline-offset-4 hover:text-accent hover:decoration-accent transition-colors";
    return href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href} className={cls} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...props} />
    );
  },
  ul: (props: ComponentProps<"ul">) => (
    <ul className="my-4 list-disc pl-5 space-y-1.5 text-[15px] sm:text-base leading-[1.8] text-muted marker:text-muted/50" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="my-4 list-decimal pl-5 space-y-1.5 text-[15px] sm:text-base leading-[1.8] text-muted marker:text-muted/60" {...props} />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="my-6 border-l-2 border-neutral-300 dark:border-neutral-700 pl-4 font-serif text-xl italic leading-relaxed text-foreground/80"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-0 border-t border-dashed border-neutral-300/80 dark:border-neutral-700/80" />,
  code: (props: ComponentProps<"code">) => (
    <code
      className="rounded bg-neutral-200/60 dark:bg-white/10 px-1 py-0.5 text-[0.85em] text-foreground [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-inherit"
      {...props}
    />
  ),
  pre: (props: ComponentProps<"pre">) => (
    <pre
      className="my-5 overflow-x-auto rounded-xl border border-black/10 dark:border-white/10 bg-neutral-100/70 dark:bg-white/[0.04] p-4 text-[13px] leading-relaxed text-foreground"
      {...props}
    />
  ),
  table: (props: ComponentProps<"table">) => (
    <div className="my-5 overflow-x-auto">
      <table className="w-full border-collapse text-sm text-muted" {...props} />
    </div>
  ),
  th: (props: ComponentProps<"th">) => (
    <th className="border-b border-neutral-300 dark:border-neutral-700 px-3 py-2 text-left font-medium text-foreground" {...props} />
  ),
  td: (props: ComponentProps<"td">) => (
    <td className="border-b border-dashed border-neutral-300/80 dark:border-neutral-800 px-3 py-2" {...props} />
  ),
  strong: (props: ComponentProps<"strong">) => <strong className="font-semibold text-foreground" {...props} />,
};

export function Mdx({ source }: { source: string }) {
  // blockJS: articles can be written on the site, so never evaluate JavaScript expressions inside them
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{ blockJS: true, blockDangerousJS: true, mdxOptions: { remarkPlugins: [remarkGfm] } }}
    />
  );
}
