import Link from "next/link";
import { VisitorCount } from "@/components/visitor-count";
import { FooterLive } from "@/components/footer-live";
import { FooterArt } from "@/components/footer-art";
import { getLastPushAt } from "@/lib/github";
import { NAV } from "@/lib/nav";
import { siteConfig } from "@/lib/site";

export async function SiteFooter() {
  const lastPushAt = await getLastPushAt(siteConfig.githubUsername);

  return (
    <footer className="pt-8">
      <div className="px-6 sm:px-10">
        <nav aria-label="Footer" className="mb-5 flex flex-wrap gap-x-4 gap-y-0.5 sm:gap-x-5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center py-1.5 pointer-coarse:py-3 text-sm text-muted hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <FooterLive
          place={siteConfig.location.label}
          timeZone={siteConfig.location.timeZone}
          lastPushAt={lastPushAt}
          githubUrl={siteConfig.social.github}
        />

        {/* everything stays on the left: the right edge is where the ID badge hangs */}
        <div className="mt-4 flex flex-col items-start gap-4">
          <div>
            <p className="text-sm text-muted">
              Designed &amp; developed by <span className="font-medium text-foreground">{siteConfig.name}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted/60">&copy; {new Date().getFullYear()}. All rights reserved.</p>
          </div>
          <VisitorCount />
        </div>
      </div>

      <FooterArt name={siteConfig.name} />
    </footer>
  );
}
