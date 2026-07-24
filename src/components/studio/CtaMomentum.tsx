"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { studioHome } from "@/content/site";
import SplitReveal from "./SplitReveal";

const { cta } = studioHome;

/**
 * CTA cards with momentum-based hover (ported from Hildén & Kaira's
 * `initMomentumBasedHover`): the studio tracks cursor velocity and flicks a
 * card with InertiaPlugin — x/y/rotation velocities that decay to rest.
 * The first card opens a callback popup (GSAP fade + slide, Lenis scroll
 * lock); the second links out. Desktop + fine-pointer only.
 */
export default function CtaMomentum() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const popup = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Momentum hover
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

      const targets = gsap.utils.toArray<HTMLElement>("[data-momentum-el]");
      const cleanups: Array<() => void> = [];
      targets.forEach((el) => {
        const inner = el.querySelector<HTMLElement>("[data-momentum-target]");
        if (!inner) return;
        const onEnter = (e: MouseEvent) => {
          const r = inner.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const gx = e.clientX - cx;
          const gy = e.clientY - cy;
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

  const openPopup = () => {
    setOpen(true);
    window.__studioLenis?.stop();
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => {
      gsap.fromTo(popup.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(panel.current, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out", delay: 0.05 });
    });
  };
  const closePopup = () => {
    gsap.to(popup.current, {
      autoAlpha: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setOpen(false);
        window.__studioLenis?.start();
        document.documentElement.style.overflow = "";
      },
    });
  };

  return (
    <section
      ref={root}
      data-studio-theme="chrome"
      data-nav-theme="chrome"
      className="px-6 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-site text-center">
        <p className="u-label text-[color:var(--muted)]">{cta.label}</p>
        <SplitReveal
          as="h2"
          text={cta.headline}
          className="mt-6 font-display text-5xl leading-[0.98] tracking-tight sm:text-7xl"
          accentClassName=""
        />
        <p className="mx-auto mt-5 max-w-md text-[color:var(--muted)]">{cta.subhead}</p>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
          {cta.cards.map((card, idx) => {
            const Inner = (
              <div
                data-momentum-target
                className="momentum-target flex h-full flex-col items-start rounded-3xl border p-8 text-left [border-color:var(--hair)]"
                style={{ background: "#1c1a17" }}
              >
                <span className="font-mono text-[11px] uppercase tracking-widest text-terracotta">
                  0{idx + 1}
                </span>
                <h3 className="mt-6 font-display text-3xl leading-tight tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[color:var(--muted)]">
                  {card.body}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
                  {card.cta.label}
                  <span aria-hidden>→</span>
                </span>
              </div>
            );

            return idx === 0 ? (
              <button
                key={card.title}
                data-momentum-el
                type="button"
                onClick={openPopup}
                className="block h-full"
              >
                {Inner}
              </button>
            ) : (
              <Link key={card.title} data-momentum-el href={card.cta.href} className="block h-full">
                {Inner}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Callback popup */}
      {open && (
        <div
          ref={popup}
          onClick={(e) => e.target === popup.current && closePopup()}
          onKeyDown={(e) => e.key === "Escape" && closePopup()}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 px-6 backdrop-blur-sm"
          style={{ opacity: 0 }}
        >
          <div
            ref={panel}
            className="relative w-full max-w-md rounded-3xl bg-ivory p-8 text-ink"
          >
            <button
              type="button"
              onClick={closePopup}
              aria-label="Close"
              className="absolute right-5 top-5 font-mono text-xs uppercase tracking-widest text-stone hover:text-ink"
            >
              Close ✕
            </button>
            {sent ? (
              <div className="py-8 text-center">
                <p className="font-display text-3xl italic text-terracotta">Got it.</p>
                <p className="mt-3 text-sm text-stone">
                  A senior strategist will call you within one business day.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-4"
              >
                <p className="font-display text-2xl tracking-tight">{cta.cards[0].title}</p>
                <p className="text-sm text-stone">Placeholder form — wire to your endpoint.</p>
                <input
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border u-hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-ink"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone number"
                  className="w-full rounded-xl border u-hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-ink"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-ivory transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Request my call
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
