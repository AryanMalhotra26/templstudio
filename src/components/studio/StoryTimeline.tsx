"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { studioStory } from "@/content/site";
import SplitReveal from "./SplitReveal";
import FadeUp from "@/components/motion/FadeUp";

const { chapters, chaptersLabel } = studioStory;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial scroll timeline with a sticky year rail — the "Our Story"
 * mechanic from Hildén & Kaira, rebuilt as a richer layout: a clickable
 * year spine + filling progress on the left, and chapters on the right with
 * ghost index numerals, alternating media panels, and bold stat tiles. As a
 * chapter crosses mid-viewport it becomes active; the pinned year swaps with
 * a masked slide.
 */
export default function StoryTimeline() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jump = (i: number) => {
    const el = refs.current[i];
    if (!el) return;
    if (window.__studioLenis) window.__studioLenis.scrollTo(el, { offset: -120 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const progress = ((active + 1) / chapters.length) * 100;

  return (
    <section
      id="story"
      data-studio-theme="ink"
      data-nav-theme="ink"
      className="border-t px-6 py-24 [border-color:var(--hair)] md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-site">
        <div className="flex items-baseline justify-between gap-6 border-b pb-6 [border-color:var(--hair)]">
          <p className="u-label text-[color:var(--muted)]">{chaptersLabel}</p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">
            {chapters[0].year} — {chapters[chapters.length - 1].year}
          </p>
        </div>

        <div className="mt-4 grid gap-x-16 md:grid-cols-[minmax(0,280px)_1fr]">
          {/* ── Sticky year rail ───────────────────────────── */}
          <aside className="hidden md:block">
            <div className="sticky top-[16vh] py-16">
              <div className="relative h-[1.05em] overflow-hidden font-display text-[clamp(4rem,7vw,7rem)] leading-none tracking-tight">
                <AnimatePresence initial={false}>
                  <motion.span
                    key={chapters[active].year}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-110%" }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="absolute inset-0 block text-terracotta"
                  >
                    {chapters[active].year}
                  </motion.span>
                </AnimatePresence>
              </div>

              <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">
                Chapter {String(active + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
              </p>

              {/* progress bar */}
              <div className="mt-6 h-px w-full bg-[color:var(--hair)]">
                <motion.div
                  className="h-px bg-terracotta"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </div>

              {/* clickable year spine */}
              <ul className="relative mt-8 space-y-1">
                {chapters.map((c, i) => {
                  const done = i <= active;
                  const on = i === active;
                  return (
                    <li key={c.year + i}>
                      <button
                        type="button"
                        onClick={() => jump(i)}
                        className="group flex w-full items-center gap-3 py-1 text-left"
                      >
                        <span
                          className={`h-[7px] w-[7px] shrink-0 rounded-full transition-colors duration-300 ${
                            done ? "bg-terracotta" : "bg-[color:var(--hair)] group-hover:bg-[color:var(--muted)]"
                          }`}
                        />
                        <span
                          className={`font-mono text-xs tracking-widest transition-colors duration-300 ${
                            on ? "text-ivory" : "text-[color:var(--muted)] group-hover:text-ivory"
                          }`}
                        >
                          {c.year}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* ── Chapters ───────────────────────────────────── */}
          <div>
            {chapters.map((chapter, i) => {
              const mediaLeft = i % 2 === 1;
              const on = i === active;
              const tone = (i % 4) + 1;
              return (
                <article
                  key={chapter.year + chapter.title}
                  data-index={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  className="border-t py-16 first:border-t-0 first:pt-4 [border-color:var(--hair)] md:py-24"
                >
                  {/* index + year header */}
                  <div className="flex items-center gap-5">
                    <span
                      className={`font-display text-5xl leading-none tracking-tight transition-colors duration-500 sm:text-7xl ${
                        on ? "text-terracotta" : "u-outline-text text-[color:var(--muted)]"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-[color:var(--hair)]" />
                    <span className="font-mono text-xs uppercase tracking-widest text-[color:var(--muted)]">
                      {chapter.year}
                    </span>
                  </div>

                  <SplitReveal
                    as="h2"
                    text={chapter.title}
                    className="mt-8 max-w-2xl font-display text-3xl leading-[1.02] tracking-tight sm:text-5xl"
                  />

                  <div className="mt-8 grid items-start gap-10 md:grid-cols-2 md:gap-14">
                    {/* text */}
                    <div className={mediaLeft ? "md:order-2" : ""}>
                      <div className="max-w-lg space-y-4 text-[color:var(--muted)] md:text-lg">
                        {chapter.body.map((p, j) => (
                          <FadeUp key={j} delay={j * 0.05}>
                            <p>{p}</p>
                          </FadeUp>
                        ))}
                      </div>

                      {chapter.stat && (
                        <FadeUp className="mt-8 inline-flex items-center gap-5 rounded-2xl border border-terracotta/40 px-7 py-5">
                          <span className="font-display text-5xl leading-none tracking-tight text-terracotta sm:text-6xl">
                            {chapter.stat.value}
                          </span>
                          <span className="max-w-[11rem] font-mono text-[11px] uppercase leading-snug tracking-widest text-[color:var(--muted)]">
                            {chapter.stat.label}
                          </span>
                        </FadeUp>
                      )}
                    </div>

                    {/* media panel */}
                    <FadeUp className={mediaLeft ? "md:order-1" : ""}>
                      <div
                        className={`relative aspect-[4/3] overflow-hidden rounded-2xl tone-${tone} transition-opacity duration-500 ${
                          on ? "opacity-100" : "opacity-70"
                        }`}
                      >
                        <span className="absolute right-5 top-4 font-mono text-[10px] uppercase tracking-widest text-ivory/50">
                          Ch. {String(i + 1).padStart(2, "0")} · placeholder
                        </span>
                        <span className="absolute bottom-3 left-5 font-display text-7xl leading-none text-ivory/20">
                          {chapter.year}
                        </span>
                      </div>
                    </FadeUp>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
