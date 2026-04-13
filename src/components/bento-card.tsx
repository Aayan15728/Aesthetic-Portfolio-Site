import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export interface BentoCardProps {
  title: string;
  description: string;
  href: string;
  imageSrc?: string;
  className?: string;
}

export function BentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 group/bento", className)}>
      {children}
    </div>
  );
}

export function BentoCard({ title, description, href, imageSrc, className }: BentoCardProps) {
  return (
    <Link href={href} className={cn("block w-full touch-manipulation group/item", className)}>
      <div 
        className={cn(
          "flex flex-col gap-4 w-full p-2 bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/5 rounded-2xl",
          "transition-all duration-300 ease-out",
          // The spotlight effect: dim all when grid is hovered, highlight specific item
          "group-hover/bento:opacity-50 group-hover/bento:hover:opacity-100",
          "hover:border-black/20 dark:hover:border-white/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20"
        )}
      >
        <div className="relative overflow-hidden rounded-xl w-full aspect-4/3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover/item:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/10 text-muted/50 font-medium">
              Screenshot Placeholder
            </div>
          )}
        </div>
        <div className="w-full px-2 pb-2 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[16px] leading-7 text-foreground/90 font-medium transition-colors duration-300">
              {title}
            </span>
            <ArrowUpRight className="w-4 h-4 text-foreground/50 group-hover/item:text-accent transition-colors duration-300 group-hover/item:translate-x-1 group-hover/item:-translate-y-1" />
          </div>
          <p className="text-sm text-muted/80 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
