import type { CSSProperties } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const LINKS = [
  { icon: FaGithub, label: "GitHub", action: "See code", href: siteConfig.social.github, brand: "var(--foreground)", ink: "var(--background)" },
  { icon: FaLinkedin, label: "LinkedIn", action: "Connect", href: siteConfig.social.linkedin, brand: "#0A66C2", ink: "#fff" },
  { icon: FaXTwitter, label: "Twitter", action: "Follow", href: siteConfig.social.x, brand: "var(--foreground)", ink: "var(--background)" },
  { icon: Mail, label: "Mail", action: "Say hi", href: siteConfig.social.email, brand: "#EA4335", ink: "#fff" },
];

const arrow = "absolute inset-0 h-3.5 w-3.5 transition-transform duration-300 ease-out motion-reduce:transition-none";

/**
 * Social links as a row of cells running from one edge of the frame to the other, split by dotted lines.
 * On hover the tile fills with the brand color and the label rolls over to an action.
 */
export function Socials() {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-4">
      {LINKS.map(({ icon: Icon, label, action, href, brand, ink }, i) => (
        <li key={label} className="border-dotted border-line even:border-l nth-[n+3]:border-t sm:not-first:border-l sm:nth-[n+3]:border-t-0">
          <a
            href={href}
            aria-label={`${label} profile of ${siteConfig.name}`}
            style={{ "--brand": brand, "--ink": ink } as CSSProperties}
            className={cn(
              "group relative flex items-center gap-2.5 overflow-hidden px-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:px-4",
              i % 2 === 0 ? "pl-6" : "pr-6",
              i === 0 && "sm:pl-10",
              i === LINKS.length - 1 && "sm:pr-10"
            )}
          >
            {/* brand-colored wash that blooms out of the tile */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{ background: "radial-gradient(circle at 20% 50%, color-mix(in srgb, var(--brand) 14%, transparent), transparent 75%)" }}
            />

            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-black/10 bg-white text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors duration-300 group-hover:border-transparent group-hover:bg-(--brand) group-hover:text-(--ink) group-focus-visible:border-transparent group-focus-visible:bg-(--brand) group-focus-visible:text-(--ink) dark:border-white/10 dark:bg-white/[0.04]">
              <Icon className="h-[17px] w-[17px] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-[10deg] group-hover:scale-110 group-focus-visible:-rotate-[10deg] group-focus-visible:scale-110 motion-reduce:transition-none" />
            </span>

            {/* the label rolls up to reveal the action */}
            <span className="relative block h-5 min-w-0 flex-1 overflow-hidden text-sm font-medium leading-5 text-foreground">
              <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-5 group-focus-visible:-translate-y-5 motion-reduce:transition-none">
                <span className="block h-5 truncate">{label}</span>
                <span aria-hidden className="block h-5 truncate">{action}</span>
              </span>
            </span>

            {/* one arrow leaves through the corner as another arrives */}
            <span aria-hidden className="relative h-3.5 w-3.5 shrink-0 overflow-hidden text-muted transition-colors duration-300 group-hover:text-foreground">
              <ArrowUpRight className={`${arrow} group-hover:-translate-y-full group-hover:translate-x-full`} />
              <ArrowUpRight className={`${arrow} -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0`} />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
