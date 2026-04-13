"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Reveal } from "@/components/reveal";
import { BentoGrid, BentoCard } from "@/components/bento-card";
import { VisitorCount } from "@/components/visitor-count";
import GitHubContributions from "@/components/github-contributions";
import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { Mail, ChevronDown, Eye } from "lucide-react";
import {
  SiReact, SiJavascript, SiTypescript, SiMongodb,
  SiNextdotjs, SiNodedotjs, SiPostgresql, SiPrisma,
} from "react-icons/si";
import Image from "next/image";

const BIRTH_DATE = { year: 2011, month: 10, day: 4 };

function getCurrentAge(referenceDate = new Date()) {
  const birthDate = new Date(BIRTH_DATE.year, BIRTH_DATE.month, BIRTH_DATE.day);
  let age = referenceDate.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    referenceDate.getMonth() > birthDate.getMonth() ||
    (referenceDate.getMonth() === birthDate.getMonth() &&
      referenceDate.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

/* â”€â”€ simple thin section separator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Divider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-black/[0.07] dark:via-white/[0.07] to-transparent my-12" />
  );
}

/* â”€â”€ Thoughts accordion data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const THOUGHTS = [
  {
    title: "How I Use AI as a Tool, Not a Crutch",
    body: "AI accelerates my workflow, but I make sure I understand every line it helps produce. I use it for boilerplate, rapid exploration, and ideation - never as a replacement for thinking. The goal is leverage, not dependency.",
  },
  {
    title: "How I Learn New Tech Without Getting Overwhelmed",
    body: "I pick one thing, build something real with it, ship it, then iterate. No tutorial hell - the best way to understand a technology is to break it while building something that matters to you.",
  },
  {
    title: "How I Turn Confusion Into Clear, Working Systems",
    body: "When a problem feels overwhelming I decompose it into atomic units, write down what I don't understand, and work through each piece methodically. Clarity comes from structure, not raw intelligence.",
  },
];

export default function Home() {
  const [openThought, setOpenThought] = useState<number | null>(null);
  const currentAge = getCurrentAge();

  return (
    <main className="pb-0 pt-12 sm:pt-20">

      {/* â”€â”€ HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Reveal delay={0.1}>
        <header className="flex items-center justify-between mb-16 sm:mb-24">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-[3px] border-background shadow-lg ring-1 ring-border">
              <Image
                src="/assets/mainphotoofaayan.jpg"
                alt="Aayan Sharma"
                fill
                sizes="80px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-foreground !tracking-[0.01em] italic font-medium leading-none">
                Aayan Sharma
              </h1>
              <p className="text-muted text-sm mt-1">{currentAge} | Developer | Builder | Web Dev</p>
            </div>
          </div>
          <ThemeToggle />
        </header>
      </Reveal>

      {/* â”€â”€ BIO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Reveal delay={0.2}>
        <section className="mb-6">
          <div className="text-lg sm:text-xl text-muted leading-relaxed font-sans -tracking-[0.02em] max-w-3xl space-y-3">
            <p>
              <span className="font-medium text-foreground">I turn ideas into real products on the internet.</span>
            </p>
            <p>
              While most people are still planning, I&apos;m already shipping - building full-stack apps, experimenting with AI, and launching things people can actually use.
            </p>
            <p>
              I don&apos;t care about hype or perfect code. I care about execution - taking something from zero to live, testing it with real users, and improving it fast. Every project I build is part of that process.
            </p>
          </div>

          <div className="mt-8 flex gap-3">
            {[
              { icon: FaGithub,   href: "https://github.com/Aayan15728" },
              { icon: FaXTwitter, href: "https://x.com/aayanships" },
              { icon: FaLinkedin, href: "https://www.linkedin.com/in/aayan-sharma91/" },
              { icon: Mail,       href: "mailto:realgenz11@gmail.com" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="w-10 h-10 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all duration-300 rounded-full flex items-center justify-center text-foreground hover:scale-105 active:scale-95"
              >
                <social.icon className="w-[18px] h-[18px]" />
              </a>
            ))}
          </div>
        </section>
      </Reveal>

      {/* â”€â”€ SPOTIFY EMBED â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Reveal delay={0.25}>
        <div className="mt-6 mb-2">
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/track/3LlmKSHR3Rs0Y3KHQLAYDk?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      </Reveal>


      <Divider />

      {/* â”€â”€ PROJECTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Reveal delay={0.4}>
        <section className="mb-16">
          <p className="text-xs font-semibold tracking-widest text-muted/50 uppercase mb-1">Featured</p>
          <h2 className="font-serif text-xl sm:text-2xl text-foreground -tracking-[0.01em] mb-6">
            🚀 Featured Projects
          </h2>
          <BentoGrid>
            <BentoCard
              title="ZeroMRR"
              description="A platform where founders share their journey and compete through real progress. Built to make building in public more engaging, consistent, and real."
              href="https://zeromrr.netlify.app"
              imageSrc="/assets/zeromrr.png"
            />
            <BentoCard
              title="GenZGames"
              description="Fast, simple, and addictive web games built for the GenZ internet. Focused on speed, fun, and keeping users coming back."
              href="https://genzgames.fun"
              imageSrc="/assets/genzgames.png"
            />
            <BentoCard
              title="FUTSnaps91"
              description="A football content brand built around edits, highlights, and audience engagement. Exploring content, distribution, and building an online audience."
              href="https://youtube.com/@futsnaps91"
              imageSrc="/assets/futsnaps91.png"
            />
            <BentoCard
              title="SwiftYourLink"
              description="A simple tool to manage and share multiple links through one clean profile. Built for creators who want speed and simplicity."
              href="https://swiftyourlink.vercel.app"
              imageSrc="/assets/swiftyourlink.png"
            />
          </BentoGrid>
        </section>
      </Reveal>

      <Divider />

      {/* â”€â”€ ABOUT ME â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Reveal delay={0.45}>
        <section className="mb-16">
          {/* label */}
          <p className="text-xs font-semibold tracking-widest text-muted/50 uppercase mb-1">About</p>
          <h2 className="font-serif text-xl sm:text-2xl text-foreground -tracking-[0.01em] mb-6">Me</h2>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Square avatar */}
            <div className="relative flex-shrink-0 w-[130px] h-[130px] rounded-2xl overflow-hidden border border-black/[0.07] dark:border-white/[0.07] shadow-sm">
              <Image
                src="/assets/mainphotoofaayan.jpg"
                alt="Aayan Sharma"
                fill
                sizes="130px"
                className="object-cover"
              />
            </div>

            {/* Text + skills */}
            <div className="flex flex-col justify-center gap-3">
              <h3 className="font-serif text-2xl sm:text-3xl text-foreground italic -tracking-[0.01em] leading-none">
                Aayan Sharma
              </h3>
              <p className="text-sm sm:text-base text-muted leading-relaxed max-w-md">
                I'm a{" "}
                <span className="text-foreground font-medium">Full Stack Developer</span> &amp; Open Source Contributor.
                  Also a Student, {currentAge} Years. I love building products to solve
                  real-world problems.{" "}
                <span className="text-foreground/70">I'm specialized in building MVPs.</span>
              </p>

              {/* Skills */}
              <div>
                <p className="text-xs text-muted/50 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {([
                    { Icon: SiReact,      label: "React",      color: "#61DAFB" },
                    { Icon: SiJavascript, label: "JavaScript", color: "#F7DF1E" },
                    { Icon: SiTypescript, label: "TypeScript", color: "#3178C6" },
                    { Icon: SiMongodb,    label: "MongoDB",    color: "#47A248" },
                    { Icon: SiNextdotjs,  label: "Next.js",    color: "currentColor" },
                    { Icon: SiNodedotjs,  label: "Node.js",    color: "#339933" },
                    { Icon: SiPostgresql, label: "PostgreSQL", color: "#336791" },
                    { Icon: SiPrisma,     label: "Prisma",     color: "currentColor" },
                  ] as const).map(({ Icon, label, color }) => (
                    <div key={label} className="group relative">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/8 hover:bg-black/10 dark:hover:bg-white/15 transition-all duration-200 hover:scale-110 cursor-default"
                        style={{ color }}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </div>
                      {/* tooltip */}
                      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-foreground text-background text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md z-10">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Divider />

      {/* â”€â”€ GITHUB ACTIVITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Reveal delay={0.5}>
        <section className="mb-16">
          <p className="text-xs font-semibold tracking-widest text-muted/50 uppercase mb-1">Featured</p>
          <h2 className="font-serif text-xl sm:text-2xl text-foreground -tracking-[0.01em] mb-6">
            GitHub Activity
          </h2>
          <div className="rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm p-4 sm:p-5">
            <GitHubContributions username="aayan15728" />
          </div>
        </section>
      </Reveal>

      <Divider />

      {/* â”€â”€ THOUGHTS (accordion) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Reveal delay={0.55}>
        <section className="mb-16">
          <h2 className="font-serif text-xl sm:text-2xl text-muted/60 -tracking-[0.01em] mb-6">Thoughts</h2>
          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
            {THOUGHTS.map((t, i) => {
              const isOpen = openThought === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenThought(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-4 gap-4 text-left group"
                  >
                    <span className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                      isOpen ? "text-accent" : "text-foreground/80 group-hover:text-foreground"
                    }`}>
                      {t.title}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 text-muted/50 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </button>
                  {/* Animated expand */}
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? "200px" : "0px", opacity: isOpen ? 1 : 0 }}
                  >
                    <p className="pb-5 text-sm text-muted leading-relaxed max-w-2xl">
                      {t.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Divider />

      {/* â”€â”€ QUOTE CARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
	      <Reveal delay={0.6}>
	        <div className="mb-16 rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8">
	          <div className="font-serif text-5xl text-muted/20 leading-none mb-4 select-none">&ldquo;&ldquo;</div>
	          <p className="font-serif italic text-xl sm:text-2xl text-foreground/80 leading-relaxed mb-4">
	            &ldquo;Just Become Irreplaceable.&rdquo;
	          </p>
	          <p className="text-sm text-right text-muted">
	            &mdash; <span className="text-accent font-medium">Aayan Sharma</span>
	          </p>
	        </div>
	      </Reveal>

      {/* â”€â”€ LET'S CONNECT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Reveal delay={0.65}>
        <section className="mb-10">
          <h2 className="font-serif text-xl sm:text-2xl text-foreground -tracking-[0.01em] mb-1">
            Let&apos;s connect
          </h2>
	          <p className="text-sm text-muted mb-6">Find me on these platforms</p>
	          <div className="flex flex-wrap gap-3">
	            {[
	              { Icon: FaGithub,   label: "GitHub",   href: "https://github.com/Aayan15728" },
	              { Icon: FaXTwitter, label: "X",        href: "https://x.com/aayanships" },
	              { Icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/aayan-sharma91/" },
	            ].map(({ Icon, label, href }) => (
	              <a
	                key={label}
	                href={href}
                className="flex items-center gap-2 px-4 py-[9px] rounded-full border border-black/[0.09] dark:border-white/[0.09] bg-white/70 dark:bg-white/[0.04] hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 text-sm font-medium text-foreground/80 hover:text-foreground hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                <Icon className="w-[15px] h-[15px]" />
                {label}
              </a>
            ))}
          </div>
        </section>
      </Reveal>

      {/* â”€â”€ FOOTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <footer className="pt-6 pb-10 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            Design &amp; Developed by{" "}
            <span className="text-accent font-medium">Aayan</span>
          </p>
          <p className="text-xs text-muted/50 mt-0.5">&copy; 2026. All rights reserved.</p>
        </div>
        <VisitorCount />
      </footer>

    </main>
  );
}


