"use client";

import Link from "next/link";
import { studioHome } from "@/content/site";
import SplitReveal from "./SplitReveal";

const { closing } = studioHome;

/**
 * Big closing statement with two CTAs — the "manifesto" beat, mirroring
 * Hildén & Kaira's about/statement section.
 */
export default function ClosingStatement() {
  return (
    <section
      data-studio-theme="accent"
      data-nav-theme="accent"
      className="px-6 py-32 text-center md:px-10 md:py-48"
    >
      <div className="mx-auto max-w-4xl">
        <p className="u-label text-[color:var(--muted)]">{closing.label}</p>
        <SplitReveal
          as="h2"
          text={closing.headline}
          className="mx-auto mt-6 max-w-3xl font-display text-5xl leading-[0.98] tracking-tight sm:text-7xl"
          accentClassName=""
        />
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[color:var(--muted)]">
          {closing.body}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={closing.primaryCta.href}
            className="rounded-full bg-ivory px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            {closing.primaryCta.label}
          </Link>
          <Link
            href={closing.secondaryCta.href}
            className="group inline-flex items-center gap-2 rounded-full border border-current/50 px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors duration-300 hover:border-current"
          >
            {closing.secondaryCta.label}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
