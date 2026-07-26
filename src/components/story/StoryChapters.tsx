"use client";

import { useEffect, useRef } from "react";
import { story } from "@/content/story";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import StoryChapter from "@/components/story/StoryChapter";

/**
 * Story section 3 — the chaptered timeline.
 *
 * Behind every chapter sits one sticky band of display type showing the year
 * range. As each chapter crosses the middle of the viewport the band swaps:
 * the outgoing year slides up out of a one-line mask and the incoming one
 * rises from below, both blurring as they go. The type is sized in JS —
 * binary-searched to the widest year that still fits the container — so the
 * band always spans the full width regardless of viewport or font.
 *
 * Chapters are dark; the closing "Mission" chapter is lime, and its year
 * (a deliberately far-off one) is at 10% so it stays quiet over that panel.
 */
export default function StoryChapters() {
  const groupRef = useRef<HTMLDivElement>(null);
  const years = [...story.chapters.map((c) => c.year), story.mission.year];

  useEffect(() => {
    registerGsap();
    const group = groupRef.current;
    if (!group) return;

    const chapters = Array.from(
      group.querySelectorAll<HTMLElement>(".chapter-item")
    );
    const items = Array.from(
      group.querySelectorAll<HTMLElement>(".chapter-year_item")
    );
    const masks = Array.from(
      group.querySelectorAll<HTMLElement>(".chapter-year_mask")
    );
    if (!chapters.length || !items.length || !masks.length) return;

    let activeIndex = 0;

    /** Largest font-size at which the widest year still fits its container. */
    const fitText = (el: HTMLElement) => {
      const parent = el.parentElement;
      if (!parent) return () => {};

      const update = () => {
        const parentWidth = parent.offsetWidth;
        let min = 1;
        let max = 1000;
        let best = min;
        while (min <= max) {
          const mid = (min + max) / 2;
          el.style.fontSize = `${mid}px`;
          if (el.scrollWidth <= parentWidth) {
            best = mid;
            min = mid + 0.5;
          } else {
            max = mid - 0.5;
          }
        }
        el.style.fontSize = `${best}px`;
      };

      update();
      const ro = new ResizeObserver(update);
      ro.observe(parent);
      document.fonts?.ready.then(update);
      return () => ro.disconnect();
    };

    const setYear = (nextIndex: number, direction: "forward" | "backward") => {
      if (nextIndex === activeIndex || !items[nextIndex]) return;
      const current = items[activeIndex];
      const next = items[nextIndex];

      items.forEach((el, i) => {
        el.classList.remove("is-active", "is-out-up", "is-out-down");
        if (i < nextIndex) el.classList.add("is-out-up");
        else if (i > nextIndex) el.classList.add("is-out-down");
      });

      if (direction === "forward") {
        current.classList.remove("is-active", "is-out-down");
        current.classList.add("is-out-up");
      } else {
        current.classList.remove("is-active", "is-out-up");
        current.classList.add("is-out-down");
      }

      next.classList.remove("is-out-up", "is-out-down");
      next.classList.add("is-active");
      activeIndex = nextIndex;
    };

    items.forEach((item, i) => {
      item.classList.remove("is-active", "is-out-up", "is-out-down");
      item.classList.add(i === 0 ? "is-active" : "is-out-down");
    });

    const disposers = masks.map(fitText);

    const triggers = chapters.map((chapter, index) =>
      ScrollTrigger.create({
        trigger: chapter,
        start: "top center",
        end: "bottom center",
        onEnter: () => setYear(index, "forward"),
        onEnterBack: () => setYear(index, "backward"),
      })
    );

    // Fitted sizes shift once the real face lands, which moves every trigger.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      triggers.forEach((t) => t.kill());
      disposers.forEach((d) => d());
    };
  }, []);

  return (
    <section className="section_chapters theme-dark" id="story">
      <div className="section-padding-128px">
        <div className="chapter-group" ref={groupRef}>
          <div className="chapter-year_wrapper" aria-hidden>
            <div className="chapter-year_sticky">
              <div className="padding-global">
                <div className="text-wrapper">
                  <div className="chapter-year_mask">
                    {years.map((year, i) => (
                      <div className="chapter-year_item" key={`${year}-${i}`}>
                        <div
                          className={`chapter-year_value${
                            i === years.length - 1 ? " is-future" : ""
                          }`}
                        >
                          {year}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {story.chapters.map((chapter, i) => (
            <div className="padding-global is-chapter" key={chapter.year}>
              <div className="container-col-12">
                <StoryChapter
                  chapter={chapter}
                  index={i + 1}
                  flipped={i % 2 === 1}
                />
              </div>
            </div>
          ))}

          <div className="padding-global is-chapter theme-lime">
            <div className="container-col-12">
              <StoryChapter
                chapter={story.mission}
                isLast
                titleClass="heading-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
