"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { studioHome } from "@/content/site";
import SplitReveal from "./SplitReveal";

const { hero } = studioHome;

/**
 * Ambient rising media behind the wordmark — ported from Hildén & Kaira's
 * hero float loop. Placeholder gradient cards drift up from below on
 * staggered infinite timelines, fading in/out. Swap the gradient blocks
 * for real client thumbnails/CMS media.
 */
function HeroFloat({ count }: { count: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const items = gsap.utils.toArray<HTMLElement>(".hero-float__item");
      const H = window.innerHeight;
      const rand = (a: number, b: number) => a + Math.random() * (b - a);

      items.forEach((el, i) => {
        const zone =
          i % 2 === 0 ? rand(-42, -20) : rand(20, 42); // left / right lanes
        const dur = rand(12, 15);
        const rot = rand(-12, 12);
        const scale = 1 + rand(-0.08, 0.08);

        gsap.set(el, { xPercent: -50, x: `${zone}vw`, y: H + 300, opacity: 0 });

        const tl = gsap.timeline({
          delay: i * 2.5,
          repeat: -1,
          onRepeat: () => gsap.set(el, { x: `${zone}vw`, y: H + 300, opacity: 0 }),
        });
        const rise = gsap.to(el, {
          y: -(H + 300),
          rotation: rot,
          scale,
          duration: dur,
          ease: "none",
          onUpdate: () => {
            const p = rise.progress();
            const o = p < 0.1 ? p / 0.1 : p > 0.82 ? 1 - (p - 0.82) / 0.18 : 1;
            gsap.set(el, { opacity: o * 0.4 });
          },
        });
        tl.add(rise);
        tl.to(el, { rotation: rot + rand(-3, 3), duration: dur / 3, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="hero-float__item">
          <div className={`hero-float__media tone-${(i % 4) + 1}`} />
        </div>
      ))}
    </div>
  );
}

export default function StudioHero() {
  const markRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".chrome-glyph", { autoAlpha: 1, yPercent: 0 });
        return;
      }
      gsap.from(".chrome-glyph", {
        yPercent: 120,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.045,
        ease: "power4.out",
        delay: 0.15,
      });
    },
    { scope: markRef },
  );

  const letters = (word: string, keyBase: string) =>
    word.split("").map((c, i) => (
      <span key={`${keyBase}-${i}`} className="chrome-glyph inline-block">
        {c}
      </span>
    ));

  return (
    <header
      data-studio-theme="accent"
      data-nav-theme="accent"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-32 text-center"
    >
      <HeroFloat count={hero.floatingMediaCount} />

      {/* Chrome wordmark — placeholder for a rendered 3D metal logo */}
      <div
        ref={markRef}
        className="chrome-text chrome-shimmer relative z-10 flex select-none items-center justify-center font-display font-medium leading-[0.82] tracking-tight"
        style={{ fontSize: "clamp(3.5rem, 15vw, 15rem)" }}
        aria-label={`${hero.wordmarkLeft}${hero.wordmarkGlyph}${hero.wordmarkRight}`}
      >
        <span aria-hidden className="flex">
          {letters(hero.wordmarkLeft, "l")}
          <span className="chrome-glyph inline-block px-[0.06em]">{hero.wordmarkGlyph}</span>
          {letters(hero.wordmarkRight, "r")}
        </span>
      </div>

      <div className="relative z-10 mt-10 max-w-3xl">
        <SplitReveal
          as="h1"
          text={hero.tagline}
          type="lines"
          className="font-display text-3xl leading-[1.05] tracking-tight sm:text-5xl"
          accentClassName="italic text-ivory"
          start="top 95%"
          delay={0.5}
        />
        <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-[color:var(--muted)]">
          {hero.subhead}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={hero.primaryCta.href}
            className="rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-ivory transition-transform duration-300 hover:-translate-y-0.5"
          >
            {hero.primaryCta.label}
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="group inline-flex items-center gap-2 rounded-full border border-current/40 px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors duration-300 hover:border-current"
          >
            {hero.secondaryCta.label}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
