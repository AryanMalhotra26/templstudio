"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { workIndex } from "@/content/work";
import BtnIcon from "@/components/ui/BtnIcon";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * The work index: client names as full-bleed display type, one promoted at a
 * time, with a detail strip and a photo plate that swing in behind the
 * promoted row.
 *
 * Adapted from the reference's `typo-scroll` rather than copied. Theirs
 * captures the wheel with `preventDefault` and lerps the list itself, which
 * means the page is trapped (you can't reach the footer), touch fights native
 * scroll, and nothing responds to the keyboard. This version pins the section
 * and scrubs the list from real scroll with snapping, so:
 *   • normal scrolling still works and still leaves the section
 *   • the promoted row follows scroll position, so it works on touch
 *   • hover and keyboard focus promote a row too, and agree with each other
 *   • reduced motion gets a plain, complete list instead of a pinned stage
 */
export default function WorkIndex() {
  const { items, label, lede, cta } = workIndex;
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  /**
   * Undecided until mounted. The promoted-row effect must not run before this
   * resolves: in static mode it would write inline transforms that then beat
   * the static CSS, leaving three rows shoved a full height down over the
   * name below them.
   */
  const [mode, setMode] = useState<"undecided" | "pinned" | "static">(
    "undecided",
  );
  const isStatic = mode === "static";
  /** Set while the pointer or focus owns the promotion, so scroll defers. */
  const overridden = useRef(false);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  /** False until the first promotion has been placed without animating. */
  const settled = useRef(false);

  /**
   * Slides the detail strip, button and photo plate for one row. `immediate`
   * places them outright instead of tweening — used on first paint so the row
   * that starts promoted doesn't depend on the frame loop having started.
   */
  const animateRow = useCallback(
    (row: HTMLElement, show: boolean, immediate = false) => {
      const strip = row.querySelector<HTMLElement>(".typo-scroll__hover");
      const details = row.querySelector<HTMLElement>(
        ".typo-scroll__hover-details",
      );
      const button = row.querySelector<HTMLElement>(
        ".typo-scroll__hover-button",
      );
      const plate = row.querySelector<HTMLElement>(".typo-scroll__hover-img");
      const square = row.querySelector<HTMLElement>(".typo-scroll__img");

      const targets = [strip, details, button, plate, square].filter(
        Boolean,
      ) as HTMLElement[];
      gsap.killTweensOf(targets);

      /**
       * `x`/`y` are zeroed explicitly on every state. GSAP reads the element's
       * computed matrix into pixel `x`/`y` and then *adds* `xPercent`/`yPercent`
       * on top — so the CSS `translateY(100%)` initial state would otherwise be
       * baked in permanently and every panel would sit one full height low.
       */
      const state = show
        ? {
            strip: { y: 0, yPercent: 0 },
            details: { y: 0, yPercent: 0 },
            button: { y: 0, yPercent: 0 },
            plate: { x: 0, y: 0, rotation: 6, xPercent: -150, yPercent: 50 },
            square: { scale: 1, rotation: -4, autoAlpha: 1 },
          }
        : {
            strip: { y: 0, yPercent: 100 },
            details: { y: 0, yPercent: 100 },
            button: { y: 0, yPercent: 100 },
            plate: { x: 0, y: 0, rotation: 16, xPercent: -150, yPercent: 100 },
            square: { scale: 0, rotation: -4, autoAlpha: 0 },
          };

      if (immediate) {
        if (strip) gsap.set(strip, state.strip);
        if (details) gsap.set(details, state.details);
        if (button) gsap.set(button, state.button);
        if (plate) gsap.set(plate, state.plate);
        if (square) gsap.set(square, state.square);
        return;
      }

      const ease = show ? "power3.out" : "power3.in";
      const dur = show ? 0.7 : 0.5;
      if (strip) gsap.to(strip, { ...state.strip, duration: dur, ease });
      if (details)
        gsap.to(details, {
          ...state.details,
          duration: dur,
          delay: show ? 0.12 : 0,
          ease,
        });
      if (button)
        gsap.to(button, {
          ...state.button,
          duration: dur,
          delay: show ? 0.17 : 0,
          ease,
        });
      if (plate)
        gsap.to(plate, {
          ...state.plate,
          duration: show ? 0.8 : 0.5,
          delay: show ? 0.1 : 0,
          ease,
        });
      if (square)
        gsap.to(square, {
          ...state.square,
          duration: show ? 0.45 : 0.4,
          delay: show ? 0.1 : 0,
          ease: show ? "back.out(1.7)" : "power3.in",
        });
    },
    [],
  );

  /* Decide the mode first — this effect is declared before the others so it
     runs first on mount. */
  useEffect(() => {
    const staticMode =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 991px)").matches;
    setMode(staticMode ? "static" : "pinned");
  }, []);

  /* Promote exactly one row whenever `active` changes. */
  useEffect(() => {
    if (mode !== "pinned") return;
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(
      list.querySelectorAll<HTMLElement>(".typo-scroll__item"),
    );
    const first = !settled.current;
    settled.current = true;
    rows.forEach((row, i) => {
      const on = i === active;
      row.setAttribute("data-active", String(on));
      animateRow(row, on, first);
    });
  }, [active, mode, animateRow]);

  /* Pin the section and scrub the list from scroll. Pinned mode only. */
  useEffect(() => {
    if (mode !== "pinned") return;
    registerGsap();
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const rows = Array.from(
      list.querySelectorAll<HTMLElement>(".typo-scroll__item"),
    );
    if (rows.length < 2) return;

    /** Offset that centres row `i` in the viewport. */
    const centreFor = (i: number) => {
      const row = rows[i];
      return window.innerHeight / 2 - (row.offsetTop + row.offsetHeight / 2);
    };

    const ctx = gsap.context(() => {
      gsap.set(list, { y: centreFor(0) });

      const tween = gsap.to(list, {
        y: () => centreFor(rows.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${(rows.length - 1) * window.innerHeight * 0.75}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (rows.length - 1),
            duration: { min: 0.2, max: 0.5 },
            delay: 0.06,
            // Without this, snap projects your momentum and can throw you
            // two rows past where you stopped.
            inertia: false,
            ease: "power3.out",
          },
          onUpdate: (self) => {
            if (overridden.current) return;
            const i = Math.round(self.progress * (rows.length - 1));
            setActive((prev) => (prev === i ? prev : i));
          },
        },
      });
      triggerRef.current = tween.scrollTrigger ?? null;
    }, section);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [mode]);

  /* Pointer and keyboard both take over promotion while engaged. */
  const claim = (i: number) => {
    overridden.current = true;
    setActive(i);
  };
  const release = () => {
    overridden.current = false;
    // Re-sync from where the scroll actually is. A full `ScrollTrigger.refresh`
    // here would recalculate every trigger on the page on each blur.
    const t = triggerRef.current;
    if (!t) return;
    const last = items.length - 1;
    setActive(Math.round(t.progress * last));
  };

  return (
    <section
      ref={sectionRef}
      className={`typo-scroll theme-default${isStatic ? " is-static" : ""}`}
      aria-labelledby="work-index-label"
      data-gsap-ignore
    >
      <div className="typo-scroll_fade" aria-hidden />
      <div className="typo-scroll_fade is-bottom" aria-hidden />

      <div className="typo-scroll__meta">
        <h1 className="paragraph-xs" id="work-index-label">
          {label}
        </h1>
        <span className="paragraph-xs is-muted">{lede}</span>
      </div>

      <div className="typo-scroll__collection">
        <div className="typo-scroll__list" ref={listRef}>
          {items.map((item, i) => (
            <div
              className="typo-scroll__item"
              key={item.slug}
              data-active={i === 0 ? "true" : "false"}
            >
              <Link
                href={item.href}
                className="typo-scroll__link"
                onMouseEnter={() => claim(i)}
                onMouseLeave={release}
                onFocus={() => claim(i)}
                onBlur={release}
              >
                <span className="typo-scroll__hover-wrap">
                  <span className="typo-scroll__hover">
                    <span className="typo-scroll__hover-details">
                      <span>{item.category}</span>
                      <span>{item.year}</span>
                      <span className="is-result">{item.result}</span>
                    </span>
                    <span className="typo-scroll__hover-button" aria-hidden>
                      <BtnIcon label={cta} />
                    </span>
                    <span className="typo-scroll__hover-img" aria-hidden>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.tall} alt="" />
                    </span>
                  </span>
                </span>

                <h2 className="typo-scroll__h">{item.client}</h2>

                <span className="typo-scroll__img" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.square} alt="" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="typo-scroll__counter" aria-hidden>
        <span className="is-current">
          {String(active + 1).padStart(2, "0")}
        </span>
        <span className="paragraph-xs is-muted">
          / {String(items.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
