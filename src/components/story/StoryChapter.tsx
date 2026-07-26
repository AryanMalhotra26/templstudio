"use client";

import { useEffect, useRef } from "react";
import type { StoryChapter as Chapter } from "@/content/story";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { useImageTrail } from "@/components/motion/useImageTrail";

/**
 * One chapter of the story, ported from the reference.
 *
 * Three things happen here:
 *   • the dashed rail down the middle fills as the chapter crosses the middle
 *     of the viewport — progress is measured off the rail's own box, not the
 *     scroll position, so it reads as a line being drawn
 *   • the chrome object at the end of the rail pops in once, on `back.out`
 *   • the frames above the title run as a flipbook, 500ms apiece
 *
 * The whole chapter is also an image-trail surface (desktop pointers only).
 */
export default function StoryChapter({
  chapter,
  isLast = false,
  titleClass = "heading-s",
  index,
  flipped = false,
}: {
  chapter: Chapter | (Omit<Chapter, "frames" | "trail"> & Partial<Chapter>);
  isLast?: boolean;
  titleClass?: string;
  /** 1-based; shown as the outline numeral. Omit for the closing chapter. */
  index?: number;
  /** Puts the copy on the right and the frames on the left. */
  flipped?: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const frames = chapter.frames ?? [];
  const trail = chapter.trail ?? [];

  useImageTrail(itemRef, {
    minWidth: 992,
    moveDistance: 15,
    stopDuration: 350,
    trailLength: 8,
  });

  /* Rail fill + object pop. */
  useEffect(() => {
    registerGsap();
    const item = itemRef.current;
    if (!item) return;

    const path = item.querySelector<HTMLElement>(".chapter-path");
    const fillMask = item.querySelector<HTMLElement>(".chapter-path_fill-mask");
    const triggerPoint = item.querySelector<HTMLElement>(".chapter-path_trigger");
    const emoji = item.querySelector<HTMLElement>(".chapter-path_emoji");
    const head = item.querySelector<HTMLElement>(".chapter-path_head");
    const gallery = item.querySelector<HTMLElement>(".chapter-gallery_list");
    if (!path || !fillMask || !triggerPoint || !emoji) return;

    const reveal = () =>
      gsap.set(emoji, { xPercent: -50, scale: 1, rotation: 0, autoAlpha: 1 });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(fillMask, { height: "100%" });
      reveal();
      return;
    }

    gsap.set(fillMask, { height: "0%" });
    gsap.set(emoji, { xPercent: -50, scale: 0.6, rotation: -10, autoAlpha: 0 });

    let played = false;
    const fill = ScrollTrigger.create({
      trigger: item,
      start: "top bottom",
      end: "bottom top",
      onUpdate: () => {
        const rect = path.getBoundingClientRect();
        const progress = gsap.utils.clamp(
          0,
          1,
          (window.innerHeight * 0.5 - rect.top) / rect.height
        );
        gsap.set(fillMask, { height: `${progress * 100}%` });
        // The lit head rides the end of the drawn line.
        if (head) {
          gsap.set(head, {
            top: `${progress * 100}%`,
            autoAlpha: progress > 0.01 && progress < 0.995 ? 1 : 0,
          });
        }
      },
    });

    // Frames drift against the scroll — a small amount goes a long way, and
    // it's what stops the media column feeling pasted on.
    const parallax = gallery
      ? gsap.fromTo(
          gallery,
          { yPercent: 9 },
          {
            yPercent: -9,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        )
      : null;

    const pop = ScrollTrigger.create({
      trigger: triggerPoint,
      start: "top center",
      onEnter: () => {
        if (played) return;
        played = true;
        gsap.to(emoji, {
          scale: 1,
          rotation: 0,
          autoAlpha: 1,
          duration: 0.45,
          ease: "back.out(2.5)",
        });
      },
    });

    // Same safety net as the homepage: if the frame loop never gets going, the
    // object would sit invisible forever, so place it outright.
    const startFrame = gsap.ticker.frame;
    const guard = window.setTimeout(() => {
      if (gsap.ticker.frame - startFrame < 2) reveal();
    }, 2000);

    return () => {
      window.clearTimeout(guard);
      fill.kill();
      pop.kill();
      parallax?.scrollTrigger?.kill();
      parallax?.kill();
    };
  }, []);

  /* Flipbook. Only ticks while the chapter is on screen. */
  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || frames.length < 2) return;

    const items = Array.from(
      gallery.querySelectorAll<HTMLElement>(".chapter-gallery_item")
    );
    items.forEach((el, i) => {
      el.style.zIndex = String(i + 1);
      el.style.display = i === 0 ? "block" : "none";
    });

    let current = 0;
    let timer: number | null = null;

    const tick = () => {
      items[current].style.display = "none";
      current = (current + 1) % items.length;
      items[current].style.display = "block";
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && timer === null) {
        timer = window.setInterval(tick, 500);
      } else if (!entry.isIntersecting && timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    });
    observer.observe(gallery);

    return () => {
      observer.disconnect();
      if (timer !== null) window.clearInterval(timer);
    };
  }, [frames.length]);

  const copy = (
    <div className="chapter-content">
      {index !== undefined && (
        <span className="chapter-eyebrow">
          <span className="chapter-index">
            {String(index).padStart(2, "0")}
          </span>
          <span className="chapter-years">
            {chapter.year.replace(/\s+/g, " — ")}
          </span>
        </span>
      )}

      <h2 className={`${titleClass} chapter-title`}>{chapter.title}</h2>

      <div className="chapter-text">
        {chapter.body.map((p) => (
          <p className="paragraph-regular" key={p.slice(0, 24)}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );

  const media = frames.length > 0 && (
    <div className="chapter-media">
      <div className="chapter-gallery_list" ref={galleryRef} aria-hidden>
        {frames.map((src, i) => (
          <div className="chapter-gallery_item" key={`${src}-${i}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={`chapter-item${flipped ? " is-flipped" : ""}${
        media ? "" : " is-solo"
      }`}
      ref={itemRef}
      data-trail="wrapper"
    >
      <div className="chapter-path_wrap">
        <div className="chapter-path">
          <div className="chapter-path_start" />
          <div className={`chapter-path_track${isLast ? " is-last" : ""}`} />
          <div className="chapter-path_fill-mask">
            <div className={`chapter-path_fill${isLast ? " is-last" : ""}`} />
          </div>
          <div className={`chapter-path_head${isLast ? " is-last" : ""}`} />
          <div className="chapter-path_trigger" />
        </div>
        <div className="chapter-path_emoji">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={chapter.object.src} alt={chapter.object.alt} />
        </div>
      </div>

      {media ? (
        <div className="chapter-body">
          {copy}
          {media}
        </div>
      ) : (
        copy
      )}

      {trail.length > 0 && (
        <div className="trail-wrap" aria-hidden>
          <div className="trail-list">
            {trail.map((src, i) => (
              <div className="trail-item" data-trail="item" key={`${src}-${i}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="trail-item__img" src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
