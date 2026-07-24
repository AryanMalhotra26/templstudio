"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { studioStory } from "@/content/site";
import SplitReveal from "./SplitReveal";

const { hero } = studioStory;

/** Scattered tilted placeholder photos with a scrub parallax — swap the
 *  gradient blocks for real founder/behind-the-scenes photography. */
const PHOTOS = [
  { tone: 1, className: "left-[4%] top-[42%] w-[16vw] max-w-[190px] -rotate-6", depth: 0.5 },
  { tone: 2, className: "right-[6%] top-[24%] w-[14vw] max-w-[170px] rotate-6", depth: 0.9 },
  { tone: 3, className: "right-[16%] bottom-[10%] w-[12vw] max-w-[150px] -rotate-3", depth: 0.3 },
  { tone: 4, className: "left-[15%] bottom-[8%] w-[11vw] max-w-[140px] rotate-3", depth: 0.7 },
];

export default function StoryHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>("[data-story-photo]").forEach((el) => {
        const depth = Number(el.dataset.depth) || 0.5;
        gsap.to(el, {
          yPercent: -60 * depth,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  const onReadStory = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector("#story");
    if (!target) return;
    if (window.__studioLenis) window.__studioLenis.scrollTo(target as HTMLElement);
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      ref={root}
      data-studio-theme="ink"
      data-nav-theme="ink"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-32 text-center"
    >
      {/* floating placeholder photos */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {PHOTOS.map((p, i) => (
          <div
            key={i}
            data-story-photo
            data-depth={p.depth}
            className={`absolute overflow-hidden rounded-xl shadow-2xl ${p.className}`}
          >
            <div className={`aspect-[3/4] tone-${p.tone}`} />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl">
        <p className="u-label text-[color:var(--muted)]">{hero.label}</p>
        <SplitReveal
          as="h1"
          text={hero.headline}
          className="mt-6 font-display text-[clamp(3rem,10vw,9rem)] leading-[0.92] tracking-tight"
          start="top 95%"
        />
        <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-[color:var(--muted)]">
          {hero.body}
        </p>
        <a
          href={hero.cta.href}
          onClick={onReadStory}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 font-mono text-xs uppercase tracking-widest text-ivory transition-transform duration-300 hover:-translate-y-0.5"
        >
          {hero.cta.label}
          <span aria-hidden className="animate-bounce">↓</span>
        </a>
      </div>
    </header>
  );
}
