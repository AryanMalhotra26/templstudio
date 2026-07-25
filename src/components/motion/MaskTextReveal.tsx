"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { registerGsap, gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

/**
 * Site-wide masked line reveal — a port of the reference's
 * `initMaskTextScrollReveal`.
 *
 * Every heading and paragraph is split into lines, each line wrapped in an
 * overflow-hidden mask, then slid up from `yPercent: 110`. Copy already in
 * view when the script runs animates immediately; everything else waits for a
 * ScrollTrigger at 80% of the viewport and fires once.
 *
 * Opt a subtree out with `data-gsap-ignore` — used by anything that animates
 * its own text (the flick-card meta, the testimonial slider, the hero, which
 * is choreographed by its own page-load timeline).
 */

const SPLIT_CONFIG = {
  heading: { duration: 0.8, stagger: 0.08 },
  paragraph: { duration: 0.6, stagger: 0.04 },
};

export default function MaskTextReveal() {
  const pathname = usePathname();

  useEffect(() => {
    registerGsap();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.remove("split-ready");
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const splits: SplitText[] = [];
    let cancelled = false;

    const isInView = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };

    const isIgnored = (el: Element) =>
      el.hasAttribute("data-gsap-ignore") || !!el.closest("[data-gsap-ignore]");

    const reveal = (
      selector: string,
      cfg: { duration: number; stagger: number }
    ) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        gsap.set(el, { autoAlpha: 1 });
        if (isIgnored(el) || !el.textContent?.trim()) return;

        splits.push(
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: !isMobile,
            linesClass: "gsap-line",
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: cfg.duration,
                stagger: cfg.stagger,
                ease: "power3.out",
                scrollTrigger: isInView(el)
                  ? undefined
                  : { trigger: el, start: "clamp(top 80%)", once: true },
              }),
          })
        );
      });
    };

    // Failsafe. Copy is hidden by CSS until this runs, and once split it sits
    // masked at yPercent 110 until a tween moves it — so there are two ways to
    // end up with invisible text: the split never happening, or the frame loop
    // stalling after it did (cheap phones under load). Cover both: if the
    // reveal hasn't run, un-hide everything; if it ran but GSAP isn't ticking,
    // throw the splits away and fall back to plain, visible text.
    let done = false;
    const startFrame = gsap.ticker.frame;
    const failsafe = window.setTimeout(() => {
      if (!done) {
        document.documentElement.classList.remove("split-ready");
        return;
      }
      if (gsap.ticker.frame - startFrame < 2) {
        splits.forEach((s) => s.revert());
        splits.length = 0;
        document.documentElement.classList.remove("split-ready");
      }
    }, 2500);

    const run = () => {
      if (cancelled) return;
      try {
        reveal("h1, h2, h3, h4, h5, h6", SPLIT_CONFIG.heading);
        reveal("p", SPLIT_CONFIG.paragraph);
      } catch {
        document.documentElement.classList.remove("split-ready");
      }
      done = true;
      window.clearTimeout(failsafe);
      ScrollTrigger.refresh();
    };

    // Splitting before the webfonts land measures the fallback face and leaves
    // lines in the wrong places, so wait for fonts, then two frames.
    const start = () =>
      requestAnimationFrame(() => requestAnimationFrame(run));

    if (document.fonts?.status === "loaded") start();
    else document.fonts?.ready.then(start) ?? start();

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      splits.forEach((s) => s.revert());
    };
  }, [pathname]);

  return null;
}
