"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Live-growth" counter, ported from Hildén & Kaira's `DynamicCounter`.
 * Instead of counting from zero it starts a little BELOW the real figure
 * and ticks UP with randomised increments + delays, so the number looks
 * like it's updating in real time. Starts when scrolled into view.
 */
interface LiveCounterProps {
  /** Final value as a display string, e.g. "1 413 394" or "55 994". */
  value: string;
  /** Likes tick +1 slowly; views tick +1–3 a bit faster. */
  kind?: "views" | "likes";
  className?: string;
}

function parse(value: string) {
  return parseInt(value.replace(/[.,\s]/g, ""), 10) || 0;
}
function format(n: number) {
  return Math.floor(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function LiveCounter({
  value,
  kind = "views",
  className = "",
}: LiveCounterProps) {
  const final = parse(value);
  const offset = kind === "likes" ? 20 : 50;
  const [display, setDisplay] = useState(() => format(Math.max(final - offset, 0)));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(format(final));
      return;
    }

    let current = Math.max(final - offset, 0);
    let timer: number | undefined;
    let started = false;

    const increment = () =>
      kind === "likes" ? 1 : Math.random() < 0.6 ? 1 : Math.random() < 0.9 ? 2 : 3;
    const delay = () =>
      kind === "likes"
        ? Math.floor(Math.random() * 5000) + 3000
        : Math.floor(Math.random() * 4000) + 2500;

    const step = () => {
      if (current >= final) return;
      current = Math.min(current + increment(), final);
      setDisplay(format(current));
      if (current < final) timer = window.setTimeout(step, delay());
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          timer = window.setTimeout(step, 500);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [final, offset, kind]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
