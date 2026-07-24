"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { site, studioHome } from "@/content/site";

const testimonials = site.testimonials;

/**
 * Line-reveal testimonial slider — ported from Hildén & Kaira's
 * `initLineRevealTestimonials`. One quote at a time; on change the quote is
 * SplitText-split into lines that stagger up, with a counter + arrows.
 */
export default function TestimonialSlider() {
  const [i, setI] = useState(0);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const n = testimonials.length;
  const t = testimonials[i];

  useGSAP(
    () => {
      const el = quoteRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([el, metaRef.current], { autoAlpha: 1 });
        return;
      }
      const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
      gsap.set(el, { autoAlpha: 1 });
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 0.7,
        stagger: 0.07,
        ease: "power3.out",
      });
      gsap.from(metaRef.current, { autoAlpha: 0, y: 12, duration: 0.5, delay: 0.25 });
    },
    { dependencies: [i], scope: quoteRef },
  );

  const go = (dir: number) => setI((v) => (v + dir + n) % n);

  return (
    <section
      data-studio-theme="ivory"
      data-nav-theme="ivory"
      className="px-6 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <p className="u-label text-stone">{studioHome.testimonials.label}</p>
          <p className="font-mono text-xs tabular-nums text-stone">
            {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>
        </div>

        <blockquote className="mt-10 min-h-[220px]">
          <p
            ref={quoteRef}
            className="font-display text-2xl leading-[1.18] tracking-tight sm:text-4xl"
            style={{ visibility: "hidden" }}
          >
            “{t.quote}”
          </p>
          <div ref={metaRef} className="mt-8">
            <p className="font-display text-lg italic text-terracotta">{t.author}</p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-stone">
              {t.role} · {t.business}
            </p>
          </div>
        </blockquote>

        <div className="mt-10 flex gap-3 border-t u-hairline pt-8">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="grid h-11 w-11 place-items-center rounded-full border border-ink/30 transition-all duration-300 hover:-translate-x-0.5 hover:border-ink"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="grid h-11 w-11 place-items-center rounded-full border border-ink/30 transition-all duration-300 hover:translate-x-0.5 hover:border-ink"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
