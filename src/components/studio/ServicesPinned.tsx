"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { site, studioHome } from "@/content/site";
import SplitReveal from "./SplitReveal";

const services = site.services;

/**
 * Service cards. By default (mobile, no-JS, reduced-motion) they render as a
 * clean stacked list. On desktop with motion enabled, JS adds `is-pinned`:
 * the stage pins and the cards become a 3D stack that peels away on scroll
 * (ported from Hildén & Kaira's `section_services`).
 */
export default function ServicesPinned() {
  const pinHeight = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const n = services.length;

  useGSAP(
    () => {
      const pin = pinHeight.current;
      const stageEl = stage.current;
      if (!pin || !stageEl) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const canPin =
        window.matchMedia("(min-width: 768px) and (pointer: fine)").matches && !reduce;

      if (!canPin) {
        // Mobile / touch: stacked list — fade each card up as it enters view,
        // via IntersectionObserver (reliable on touch). Skip for reduced-motion.
        if (reduce) return;
        const cards = gsap.utils.toArray<HTMLElement>(".services-card");
        gsap.set(cards, { autoAlpha: 0, y: 40 });
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                gsap.to(e.target, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" });
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.15 },
        );
        cards.forEach((c) => io.observe(c));
        return () => io.disconnect();
      }

      pin.classList.add("is-pinned");
      pin.style.height = `${n * 85}vh`;

      const cards = gsap.utils.toArray<HTMLElement>(".services-card");
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
          trigger: pin,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          pin: stageEl,
          anticipatePin: 1,
        },
        defaults: { ease: "none", duration: 1 },
      });

      for (let k = 0; k < n - 1; k++) {
        tl.to(
          cards[k],
          { yPercent: -125, y: "-=40", rotation: (Math.random() - 0.5) * 26, scale: 1.12, opacity: 0, ease: "power3.in" },
          k,
        );
        for (let j = k + 1; j < n; j++) {
          tl.to(
            cards[j],
            { y: `-=16`, z: `+=60`, scale: `+=0.05`, opacity: j <= k + 4 ? 1 : 0 },
            k,
          );
        }
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set(cards, { clearProps: "all" });
        pin.classList.remove("is-pinned");
        pin.style.height = "";
      };
    },
    { scope: pinHeight },
  );

  return (
    <section data-studio-theme="ink" data-nav-theme="ink" className="relative">
      {/* intro */}
      <div className="mx-auto max-w-site px-6 pt-24 md:px-10 md:pt-40">
        <p className="u-label text-[color:var(--muted)]">{studioHome.services.label}</p>
        <SplitReveal
          as="h2"
          text={studioHome.services.headline}
          className="mt-6 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl"
        />
      </div>

      {/* cards: stacked list by default, pinned 3D stack on desktop */}
      <div ref={pinHeight} className="services-pin relative mt-10 px-6 pb-8 md:mt-16 md:pb-0">
        <div ref={stage} className="services-stage" style={{ perspective: "1600px" }}>
          <div className="services-track relative mx-auto w-full max-w-md">
            {services.map((s, i) => (
              <article
                key={s.slug}
                className="services-card flex flex-col justify-between overflow-hidden rounded-3xl border p-7 [border-color:var(--hair)] md:p-8"
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
                  className={`my-6 grid min-h-[180px] flex-1 place-items-center rounded-2xl tone-${(i % 4) + 1}`}
                >
                  <span className="px-4 text-center font-mono text-[10px] uppercase tracking-widest text-ivory/60">
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
