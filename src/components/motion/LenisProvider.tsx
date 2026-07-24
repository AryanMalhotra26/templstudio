"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

declare global {
  interface Window {
    // Private handle (the `lenis` package already types `window.lenis`).
    __studioLenis?: Lenis;
  }
}

/**
 * Smooth scrolling on desktop, wired as the master clock for GSAP so
 * pinned/scrubbed animations track the smooth scroll.
 *
 * On touch devices (and reduced-motion) we deliberately DON'T run Lenis:
 * Lenis doesn't drive scroll on touch, which left GSAP ScrollTrigger without
 * scroll updates — so scroll-in reveals never fired on mobile. With native
 * scrolling, ScrollTrigger attaches to the window itself and the exact same
 * reveals fire reliably on touch. The instance is exposed on
 * `window.__studioLenis` for overlays; on mobile it's simply undefined and
 * callers fall back to native scroll.
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerGsap();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smoothOk = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;

    // Mobile / touch / reduced-motion → native scroll. ScrollTrigger listens
    // to the window on its own, so reveals still fire on scroll.
    if (reduce || !smoothOk) {
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      const t = window.setTimeout(refresh, 600);
      return () => {
        window.removeEventListener("load", refresh);
        window.clearTimeout(t);
      };
    }

    // Desktop → Lenis smooth scroll drives ScrollTrigger.
    const lenis = new Lenis({ lerp: 0.12 });
    window.__studioLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 600);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__studioLenis;
    };
  }, []);

  return <>{children}</>;
}
