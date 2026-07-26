"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { story } from "@/content/story";
import { registerGsap, gsap, SplitText, ScrollTrigger } from "@/lib/gsap";

/**
 * Story section 1 — hero.
 *
 * Centred claim, an inline photo tucked up under it, the opening paragraphs,
 * and a scroll-down button. Behind all of it, two photo-and-chrome-object
 * clusters pushed off opposite corners on a two-column grid, so the copy sits
 * in the gap between them. Below 479 that background stops being a background
 * and becomes a row underneath the copy.
 */

const ARROW =
  "M0 6.75758L0 5.24242L9.09091 5.24242L4.92424 1.07576L6 0L12 6L6 12L4.92424 10.9242L9.09091 6.75758L0 6.75758Z";

export default function StoryHero() {
  const { hero } = story;
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const heading = root.querySelector<HTMLElement>(".heading-xxl");
    const plate = root.querySelector<HTMLElement>(".hero-story_img");
    const rest = root.querySelectorAll<HTMLElement>(
      ".hero-story_text-wrap, .btn-icon-link"
    );
    const clusters = Array.from(
      root.querySelectorAll<HTMLElement>(".hero-story_cluster")
    );
    const objects = Array.from(
      root.querySelectorAll<HTMLElement>(".hero-story_emoji")
    );

    let split: SplitText | undefined;

    /** Puts everything in its finished state, synchronously. */
    const settle = () => {
      gsap.set([...Array.from(rest), ...clusters], {
        autoAlpha: 1,
        y: 0,
        x: 0,
        scale: 1,
      });
      if (plate) gsap.set(plate, { clipPath: "none", scale: 1 });
      if (heading) {
        gsap.set(heading, { autoAlpha: 1 });
        if (split) gsap.set(split.words, { yPercent: 0, rotate: 0 });
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Headline arrives word by word, each from under its own mask with a
    // little rotation — reads far more deliberate than a single fade.
    if (heading) {
      split = SplitText.create(heading, {
        type: "words",
        mask: "words",
        wordsClass: "gsap-line",
      });
      gsap.set(heading, { autoAlpha: 1 });
      tl.from(split.words, {
        yPercent: 120,
        rotate: 4,
        duration: 1,
        stagger: 0.055,
      });
    }

    // Photo wipes open from the bottom while easing off a slight zoom.
    if (plate) {
      tl.fromTo(
        plate,
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.1,
          ease: "expo.out",
        },
        0.3
      );
    }

    tl.from(rest, { autoAlpha: 0, y: 22, duration: 0.7, stagger: 0.1 }, 0.55);
    tl.from(
      clusters,
      { autoAlpha: 0, scale: 0.9, duration: 0.9, stagger: 0.12 },
      0.2
    );

    // Ambient float, and a lazy drift toward the cursor.
    const floats = objects.map((el, i) =>
      gsap.to(el, {
        y: i % 2 === 0 ? "+=18" : "-=22",
        rotation: i % 2 === 0 ? 6 : -7,
        duration: 4 + i,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    );

    const setters = clusters.map((el) => ({
      x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
    }));
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      setters.forEach((s, i) => {
        const depth = i === 0 ? 34 : -26;
        s.x(nx * depth);
        s.y(ny * depth * 0.6);
      });
    };
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (pointer) window.addEventListener("mousemove", onMove);

    // Whole cluster layer lifts away as you scroll into the story.
    const drift = gsap.to(root.querySelector(".hero-story_bg"), {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // This timeline is what makes the copy and clusters visible, so it must not
    // be possible to end up stuck part-way. `tl.progress(1)` isn't enough: it
    // moves the playhead but still relies on a tick to paint, which is exactly
    // what's missing when a frame loop stalls. So kill the timeline and write
    // the end state directly — `gsap.set` is synchronous.
    const guard = window.setTimeout(() => {
      if (tl.progress() < 1) {
        tl.kill();
        settle();
      }
    }, 2200);

    return () => {
      window.clearTimeout(guard);
      if (pointer) window.removeEventListener("mousemove", onMove);
      floats.forEach((f) => f.kill());
      drift.scrollTrigger?.kill();
      drift.kill();
      tl.kill();
      split?.revert();
    };
  }, []);

  return (
    <header ref={rootRef} className="section_hero-story theme-dark" data-gsap-ignore>
      <div className="hero-story_wrapper">
        <div className="hero-story_body">
          <div className="padding-global">
            <div className="container-col-12">
              <div className="hero-story_content">
                <h1 className="heading-xxl">{hero.headline}</h1>

                <div className="hero-story_img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero.image.src} alt={hero.image.alt} />
                </div>

                <div className="hero-story_text-wrap">
                  {hero.body.map((p) => (
                    <p className="paragraph-m" key={p.slice(0, 24)}>
                      {p}
                    </p>
                  ))}
                </div>

                {/* Outline button with the arrow rotated to point down — it
                    scrolls to the chapters rather than navigating. */}
                <Link href={hero.cta.href} className="btn-icon-link">
                  <div className="btn-icon-content is-outline">
                    <div className="btn-icon-content__mask">
                      <span className="btn-icon-content__text">
                        {hero.cta.label}
                      </span>
                    </div>
                    <div className="btn-icon-icon">
                      <div className="btn-icon-icon__bg is-secondary" />
                      <div className="btn-icon-icon__wrap is-down is-secondary">
                        <div className="btn-icon-icon__list">
                          <svg
                            className="btn-icon-icon__arrow"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden
                          >
                            <path d={ARROW} fill="currentColor" />
                          </svg>
                          <svg
                            className="btn-icon-icon__arrow"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden
                          >
                            <path d={ARROW} fill="currentColor" />
                          </svg>
                          <svg
                            className="btn-icon-icon__arrow"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden
                          >
                            <path d={ARROW} fill="currentColor" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="btn-icon-content__bg is-white" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-story_bg">
          {[0, 1].map((i) => (
            <div
              className={`hero-story_bg-item ${i === 0 ? "is-left" : "is-right"}`}
              key={i}
            >
              <div className="hero-story_cluster">
                <div className="hero-home_media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.background[i].src}
                    alt={hero.background[i].alt}
                  />
                </div>
                <div
                  className={`hero-story_emoji ${i === 0 ? "is-01" : "is-02"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero.objects[i].src} alt={hero.objects[i].alt} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
