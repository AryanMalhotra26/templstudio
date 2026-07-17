"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/content/site";

const DURATION_MS = 1600;

function formatValue(value: number, target: number): string {
  const decimals = Number.isInteger(target) ? 0 : 1;
  return value.toFixed(decimals);
}

/** Counts from 0 to `stat.value` with an ease-out rAF loop when scrolled into view. */
export default function Counter({
  stat,
  className = "",
  valueClassName = "",
  labelClassName = "",
}: {
  stat: Stat;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(formatValue(stat.value, stat.value));
      return;
    }
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(formatValue(stat.value * eased, stat.value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, stat.value]);

  return (
    <div ref={ref} className={className}>
      <div className={`font-display tracking-tight ${valueClassName}`}>
        {stat.prefix}
        {display}
        {stat.suffix}
      </div>
      <div className={`u-label mt-2 ${labelClassName}`}>{stat.label}</div>
    </div>
  );
}
