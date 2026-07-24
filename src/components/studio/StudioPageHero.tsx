"use client";

import type { ReactNode } from "react";
import SplitReveal from "./SplitReveal";

/**
 * Themed hero for interior pages — the same visual language as the homepage
 * sections. Sets a `data-studio-theme` so the palette applies and the nav
 * re-themes against it, and reveals the headline with SplitText masked lines.
 */
interface StudioPageHeroProps {
  label: string;
  headline: string;
  subhead?: string;
  theme?: "accent" | "ink" | "chrome" | "ivory";
  align?: "left" | "center";
  accentClassName?: string;
  children?: ReactNode;
}

export default function StudioPageHero({
  label,
  headline,
  subhead,
  theme = "ink",
  align = "left",
  accentClassName,
  children,
}: StudioPageHeroProps) {
  const accent =
    accentClassName ??
    (theme === "accent" ? "italic text-ivory" : "font-display italic text-terracotta");
  const centered = align === "center";

  return (
    <header
      data-studio-theme={theme}
      data-nav-theme={theme}
      className={`relative overflow-hidden px-6 pb-20 pt-40 md:px-10 md:pb-28 md:pt-52 ${
        centered ? "text-center" : ""
      }`}
    >
      <div className="mx-auto max-w-site">
        <p className="u-label text-[color:var(--muted)]">{label}</p>
        <SplitReveal
          as="h1"
          text={headline}
          accentClassName={accent}
          start="top 95%"
          className={`mt-6 max-w-5xl font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[1.0] tracking-tight ${
            centered ? "mx-auto" : ""
          }`}
        />
        {subhead && (
          <p
            className={`mt-8 max-w-xl text-lg text-[color:var(--muted)] ${
              centered ? "mx-auto" : ""
            }`}
          >
            {subhead}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
