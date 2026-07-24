"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Reel from "./Reel";
import type { StudioReel } from "@/content/site";

/**
 * Fanned 3D card deck, ported from Hildén & Kaira's `initFlickCards`.
 * Cards are placed relative to the active index (centre, ±1, ±2, hidden)
 * and snap between positions with an elastic ease. Click a side card, use
 * the arrows, or the keyboard to advance; only the centre reel "plays".
 */
const N_HALF = (n: number) => n / 2;

function offset(i: number, active: number, n: number) {
  let r = i - active;
  if (r > N_HALF(n)) r -= n;
  else if (r < -N_HALF(n)) r += n;
  return r;
}

function place(r: number) {
  switch (r) {
    case 0:
      return { x: 0, y: 0, rot: 0, s: 1, o: 1, z: 5 };
    case 1:
      return { x: 26, y: 1, rot: 8, s: 0.9, o: 1, z: 4 };
    case -1:
      return { x: -26, y: 1, rot: -8, s: 0.9, o: 1, z: 4 };
    case 2:
      return { x: 46, y: 5, rot: 13, s: 0.8, o: 0.9, z: 3 };
    case -2:
      return { x: -46, y: 5, rot: -13, s: 0.8, o: 0.9, z: 3 };
    default: {
      const d = r > 0 ? 1 : -1;
      return { x: 56 * d, y: 6, rot: 18 * d, s: 0.62, o: 0, z: 2 };
    }
  }
}

export default function FlickDeck({ reels }: { reels: StudioReel[] }) {
  const n = reels.length;
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const lock = useRef(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      cards.current.forEach((el, i) => {
        if (!el) return;
        const p = place(offset(i, active, n));
        el.style.zIndex = String(p.z);
        el.style.pointerEvents = offset(i, active, n) === 0 ? "none" : "auto";
        gsap.to(el, {
          xPercent: p.x,
          yPercent: p.y,
          rotate: p.rot,
          scale: p.s,
          autoAlpha: p.o,
          duration: reduce ? 0 : 0.6,
          ease: "elastic.out(1.2, 1)",
        });
      });
    },
    { dependencies: [active], scope: stage },
  );

  const go = (dir: number) => {
    if (lock.current) return;
    lock.current = true;
    setActive((a) => (a + dir + n) % n);
    window.setTimeout(() => (lock.current = false), 640);
  };

  const clickCard = (i: number) => {
    const r = offset(i, active, n);
    if (r > 0) go(1);
    else if (r < 0) go(-1);
  };

  return (
    <div
      className="w-full"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      tabIndex={0}
      role="group"
      aria-label="Client reels — use arrow keys to browse"
    >
      <div ref={stage} className="flick-stage">
        {reels.map((reel, i) => (
          <div
            key={i}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="flick-card"
            onClick={() => clickCard(i)}
            style={{ cursor: offset(i, active, n) === 0 ? "default" : "pointer" }}
          >
            <Reel reel={reel} active={i === active} />
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous reel"
          className="grid h-10 w-10 place-items-center rounded-full border border-current/40 transition-transform duration-300 hover:-translate-x-0.5 hover:border-current"
        >
          ←
        </button>
        <span className="font-mono text-xs tabular-nums opacity-70">
          {active + 1} / {n}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next reel"
          className="grid h-10 w-10 place-items-center rounded-full border border-current/40 transition-transform duration-300 hover:translate-x-0.5 hover:border-current"
        >
          →
        </button>
      </div>
    </div>
  );
}
