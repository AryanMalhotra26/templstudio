"use client";

import { createElement, useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";

/**
 * Masked line (or word) reveal — the studio's signature entrance. GSAP
 * SplitText clips each line in an overflow-hidden mask and slides it up
 * from 110%.
 *
 * Triggered by IntersectionObserver rather than ScrollTrigger: it fires on
 * native scroll on every device (desktop wheel, mobile touch) with no
 * dependency on the smooth-scroll driver, which is what makes it reliable
 * on mobile. `*asterisks*` become italic serif accent words.
 */
interface SplitRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  type?: "lines" | "words";
  stagger?: number;
  duration?: number;
  /** Kept for API compatibility; the trigger point is set via rootMargin. */
  start?: string;
  delay?: number;
  /** Class applied to *asterisk* accent words. Override on dark/accent themes
   *  where terracotta-on-terracotta would vanish. */
  accentClassName?: string;
}

function toHtml(text: string, accentClassName: string) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return escaped.replace(
    /\*([^*]+)\*/g,
    `<em class="${accentClassName}">$1</em>`,
  );
}

export default function SplitReveal({
  text,
  as = "p",
  className = "",
  type = "lines",
  stagger = 0.08,
  duration = 0.8,
  delay = 0,
  accentClassName = "font-display italic text-terracotta",
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.set(el, { autoAlpha: 1 });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const split = SplitText.create(el, {
        type,
        mask: type,
        linesClass: "split-line",
      });
      const targets = type === "lines" ? split.lines : split.words;

      // Start hidden below the mask; reveal when the element enters the viewport.
      gsap.set(targets, { yPercent: 110 });

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        gsap.to(targets, {
          yPercent: 0,
          duration,
          delay,
          stagger,
          ease: "power3.out",
        });
      };

      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            play();
            io.disconnect();
          }
        },
        { threshold: 0, rootMargin: "0px 0px -12% 0px" },
      );
      io.observe(el);

      return () => io.disconnect();
    },
    { scope: ref },
  );

  return createElement(as, {
    ref,
    className,
    style: { visibility: "hidden" as const },
    dangerouslySetInnerHTML: { __html: toHtml(text, accentClassName) },
  });
}
