"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/**
 * Wraps a group of cards and gives them momentum-based hover (Hildén &
 * Kaira's `initMomentumBasedHover`): cursor velocity flicks the hovered
 * card's `[data-momentum-target]` with InertiaPlugin, decaying back to rest.
 * Mark each card with `data-momentum-el` and its moving inner with
 * `data-momentum-target`. Desktop + fine-pointer only; a no-op otherwise.
 */
export default function MomentumGroup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const container = root.current;
      if (!container) return;

      const clampV = gsap.utils.clamp(-1080, 1080);
      const clampR = gsap.utils.clamp(-60, 60);
      let px = 0, py = 0, vx = 0, vy = 0, raf = 0;

      const onMove = (e: MouseEvent) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          vx = e.clientX - px;
          vy = e.clientY - py;
          px = e.clientX;
          py = e.clientY;
          raf = 0;
        });
      };
      container.addEventListener("mousemove", onMove);

      const els = gsap.utils.toArray<HTMLElement>("[data-momentum-el]");
      const cleanups: Array<() => void> = [];
      els.forEach((el) => {
        const inner = el.querySelector<HTMLElement>("[data-momentum-target]");
        if (!inner) return;
        const onEnter = (e: MouseEvent) => {
          const r = inner.getBoundingClientRect();
          const gx = e.clientX - (r.left + r.width / 2);
          const gy = e.clientY - (r.top + r.height / 2);
          const cross = (gx * vy - gy * vx) / (Math.hypot(gx, gy) || 1);
          gsap.to(inner, {
            inertia: {
              x: { velocity: clampV(vx * 30), end: 0 },
              y: { velocity: clampV(vy * 30), end: 0 },
              rotation: { velocity: clampR(cross * 20), end: 0 },
              resistance: 200,
            },
          });
        };
        el.addEventListener("mouseenter", onEnter);
        cleanups.push(() => el.removeEventListener("mouseenter", onEnter));
      });

      return () => {
        container.removeEventListener("mousemove", onMove);
        cleanups.forEach((c) => c());
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
