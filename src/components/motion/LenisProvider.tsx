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
 * Smooth scrolling for the whole site, wired as the master clock for GSAP:
 * one loop drives Lenis + ScrollTrigger so pinned/scrubbed animations never
 * fight the smooth-scroll (the same integration Hildén & Kaira use via
 * Locomotive). The instance is exposed on `window.lenis` so overlays can
 * `stop()` / `start()` the scroll. Reduced-motion users get native scroll,
 * but ScrollTrigger is still registered so reveals still fire on plain scroll.
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerGsap();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({ lerp: 0.12 });
    window.__studioLenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions once fonts/media settle.
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
