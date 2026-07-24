"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site, studioHome } from "@/content/site";
import SplitReveal from "./SplitReveal";

const services = site.services;

/**
 * Pinned 3D service stack — ported from Hildén & Kaira's `section_services`
 * scroll. The stack is pinned; as you scroll, the front card peels up and
 * away (random tilt) while the cards behind advance forward one slot. Each
 * card carries one service. Falls back to a plain list for reduced motion.
 */
export default function ServicesPinned() {
  const pinHeight = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const n = services.length;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const cards = gsap.utils.toArray<HTMLElement>(".services-card");

      // Initial stacked layout (front = index 0).
      cards.forEach((card, i) => {
        gsap.set(card, {
          y: i * 16,
          z: -i * 60,
          scale: 1 - i * 0.05,
          opacity: i < 4 ? 1 : 0,
          zIndex: n - i,
          transformOrigin: "50% 50%",
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinHeight.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          pin: stage.current,
          anticipatePin: 1,
        },
        defaults: { ease: "none", duration: 1 },
      });

      for (let k = 0; k < n - 1; k++) {
        // Front card peels away.
        tl.to(
          cards[k],
          {
            yPercent: -125,
            y: "-=40",
            rotation: (Math.random() - 0.5) * 26,
            scale: 1.12,
            opacity: 0,
            ease: "power3.in",
          },
          k,
        );
        // Cards behind advance one slot toward the viewer.
        for (let j = k + 1; j < n; j++) {
          tl.to(
            cards[j],
            {
              y: `-=16`,
              z: `+=60`,
              scale: `+=0.05`,
              opacity: j <= k + 4 ? 1 : 0,
            },
            k,
          );
        }
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: pinHeight },
  );

  return (
    <section
      data-studio-theme="ink"
      data-nav-theme="ink"
      className="relative"
    >
      {/* intro */}
      <div className="mx-auto max-w-site px-6 pt-28 md:px-10 md:pt-40">
        <p className="u-label text-[color:var(--muted)]">{studioHome.services.label}</p>
        <SplitReveal
          as="h2"
          text={studioHome.services.headline}
          className="mt-6 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl"
        />
      </div>

      {/* pinned scroll region */}
      <div ref={pinHeight} style={{ height: `${n * 85}vh` }} className="relative mt-16">
        <div
          ref={stage}
          className="services-stage flex h-[100svh] items-center justify-center overflow-hidden px-6"
          style={{ perspective: "1600px" }}
        >
          <div className="relative h-[62vh] w-full max-w-md">
            {services.map((s) => (
              <article
                key={s.slug}
                className="services-card absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border p-8 [border-color:var(--hair)]"
                style={{ background: "#1c1a17" }}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-terracotta">
                    {s.index}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">
                    {s.startingPrice}
                  </span>
                </div>

                <div
                  className={`my-6 grid flex-1 place-items-center rounded-2xl tone-${
                    (services.indexOf(s) % 4) + 1
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ivory/60">
                    {s.imageAlt}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-3xl leading-none tracking-tight">
                    {s.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
                    {s.shortDescription}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
