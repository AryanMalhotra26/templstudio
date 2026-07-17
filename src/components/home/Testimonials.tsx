"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import SectionLabel from "@/components/ui/SectionLabel";

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTO_ADVANCE_MS = 6000;

/**
 * One giant italic quote at a time on ink. Auto-advances every 6s,
 * manual prev/next arrows, terracotta progress dots.
 */
export default function Testimonials() {
  const { testimonials, home } = site;
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => {
      setIndex((next + testimonials.length) % testimonials.length);
    },
    [testimonials.length]
  );

  const resetTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);
  }, [testimonials.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [resetTimer]);

  const current = testimonials[index];

  return (
    <section className="bg-ink text-ivory">
      <div className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-40">
        <div className="flex items-baseline justify-between gap-6">
          <SectionLabel text={home.testimonials.label} tone="stone" />
          <p className="u-label text-stone">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(testimonials.length).padStart(2, "0")}
          </p>
        </div>

        <p
          aria-hidden
          className="u-outline-text mt-8 select-none font-display text-8xl italic leading-none text-terracotta md:text-9xl"
        >
          “
        </p>

        <div className="relative mt-2 flex min-h-[320px] flex-col justify-between md:min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={current.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <blockquote className="max-w-5xl font-display text-[clamp(1.75rem,4vw,3.5rem)] italic leading-[1.15] tracking-[-0.02em]">
                {current.quote}
              </blockquote>
              <figcaption className="u-label mt-10 text-stone">
                {current.author} — {current.role},{" "}
                <span className="text-ivory">{current.business}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="mt-14 flex items-center justify-between border-t u-hairline-inverse pt-6">
            {/* progress dots */}
            <div className="flex items-center gap-3" role="tablist" aria-label="Testimonials">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonial from ${t.business}`}
                  onClick={() => {
                    go(i);
                    resetTimer();
                  }}
                  className={`h-2 rounded-full transition-all duration-500 ease-studio ${
                    i === index
                      ? "w-8 bg-terracotta"
                      : "w-2 bg-ivory/25 hover:bg-ivory/50"
                  }`}
                />
              ))}
            </div>

            {/* arrows */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => {
                  go(index - 1);
                  resetTimer();
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border u-hairline-inverse text-ivory transition-colors duration-300 hover:border-terracotta hover:text-terracotta"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => {
                  go(index + 1);
                  resetTimer();
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border u-hairline-inverse text-ivory transition-colors duration-300 hover:border-terracotta hover:text-terracotta"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
