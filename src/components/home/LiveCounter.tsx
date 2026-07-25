"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The counters on the client cards, ported from the reference's
 * `DynamicCounter`: they start a little short of the real figure and tick up
 * to it at irregular intervals, so the numbers feel live rather than static.
 *
 * Visits climb by 1–3 every 2.5–6.5s; leads climb by 1 every 3–8s.
 */

const parse = (value: string) => parseInt(value.replace(/[.,\s]/g, ""), 10);
const format = (n: number) =>
  Math.floor(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export default function LiveCounter({
  value,
  type,
  className,
}: {
  value: string;
  type: "views" | "likes";
  className?: string;
}) {
  const target = parse(value);
  const offset = type === "likes" ? 20 : 50;
  const [current, setCurrent] = useState(target - offset);
  const timer = useRef<number>();

  useEffect(() => {
    let n = target - offset;
    setCurrent(n);

    const increment = () => {
      if (type === "likes") return 1;
      const r = Math.random();
      return r < 0.6 ? 1 : r < 0.9 ? 2 : 3;
    };
    const delay = () =>
      type === "likes"
        ? Math.floor(Math.random() * 5000) + 3000
        : Math.floor(Math.random() * 4000) + 2500;

    const step = () => {
      n = Math.min(n + increment(), target);
      setCurrent(n);
      if (n < target) timer.current = window.setTimeout(step, delay());
    };

    timer.current = window.setTimeout(step, 500);
    return () => window.clearTimeout(timer.current);
  }, [target, offset, type]);

  return <div className={className}>{format(current)}</div>;
}
