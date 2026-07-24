"use client";

import { createElement, useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";

/**
 * Masked line (or word) reveal — the studio's signature entrance, ported
 * from Hildén & Kaira's `initMaskTextScrollReveal`. GSAP SplitText clips
 * each line in an overflow-hidden mask and slides it up from 110% on scroll.
 *
 * `*asterisks*` in the text become italic serif accent words (same
 * convention as the rest of site.ts).
 */
interface SplitRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  type?: "lines" | "words";
  stagger?: number;
  duration?: number;
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
  start = "top 85%",
  delay = 0,
  accentClassName = "font-display italic text-terracotta",
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      gsap.set(el, { autoAlpha: 1 });
      const split = SplitText.create(el, {
        type,
        mask: type,
        linesClass: "split-line",
      });
      const targets = type === "lines" ? split.lines : split.words;

      gsap.from(targets, {
        yPercent: 110,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start, once: true },
      });
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
