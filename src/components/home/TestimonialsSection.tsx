"use client";

import { useEffect, useRef } from "react";
import { home } from "@/content/home";
import { registerGsap, gsap, SplitText } from "@/lib/gsap";

/**
 * Section 5 — testimonials.
 *
 * A single quote at a time, stacked in one grid cell. Changing quote runs the
 * reference's `initLineRevealTestimonials` choreography: the outgoing lines
 * slide up out of their masks while its portrait irises shut, then the
 * incoming lines rise in from below, slightly overlapped, while the new
 * portrait irises open.
 *
 * Autoplays every 10s, pauses while off-screen, and resets its timer whenever
 * you drive it by hand.
 */

const AUTOPLAY_MS = 10000;

function Chevron({ back = false }: { back?: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      width="100%"
      aria-hidden
      style={back ? { transform: "rotate(180deg)" } : undefined}
    >
      <path
        d="M0 6.75758L0 5.24242L9.09091 5.24242L4.92424 1.07576L6 0L12 6L6 12L4.92424 10.9242L9.09091 6.75758L0 6.75758Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function TestimonialsSection() {
  const { testimonials } = home;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-testimonial-item]")
    );
    if (!items.length) return;

    const currentEl = root.querySelector<HTMLElement>("[data-current]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let active = 0;
    let animating = false;
    let inView = true;
    let autoplay: gsap.core.Tween | undefined;

    const slides = items.map((item) => ({
      item,
      image: item.querySelector<HTMLElement>("[data-testimonial-img]"),
      targets: Array.from(
        item.querySelectorAll<HTMLElement>("[data-testimonial-split]")
      ),
      splits: [] as SplitText[],
      lines(): HTMLElement[] {
        return this.splits.flatMap((s) => s.lines as HTMLElement[]);
      },
    }));

    const setState = (i: number, isActive: boolean) => {
      slides[i].item.classList.toggle("is--active", isActive);
      slides[i].item.setAttribute("aria-hidden", String(!isActive));
      gsap.set(slides[i].item, {
        autoAlpha: isActive ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
      });
    };

    slides.forEach((_, i) => setState(i, i === active));
    if (currentEl) currentEl.textContent = String(active + 1);

    if (!reduce) {
      slides.forEach((slide, slideIndex) => {
        slide.splits = slide.targets.map((el) =>
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "text-line",
            autoSplit: true,
            reduceWhiteSpace: false,
            onSplit(self) {
              const isActive = slideIndex === active;
              gsap.set(self.lines, {
                yPercent: isActive ? 0 : 110,
                whiteSpace: "nowrap",
              });
              if (slide.image) {
                gsap.set(slide.image, {
                  clipPath: isActive
                    ? "circle(50% at 50% 50%)"
                    : "circle(0% at 50% 50%)",
                });
              }
            },
          })
        );
      });
    }

    const goTo = (next: number) => {
      if (animating || next === active) return;
      animating = true;

      const out = slides[active];
      const incoming = slides[next];
      const finish = () => {
        setState(active, false);
        setState(next, true);
        active = next;
        if (currentEl) currentEl.textContent = String(active + 1);
        animating = false;
      };

      if (reduce) {
        const tl = gsap.timeline({ onComplete: finish });
        tl.to(out.item, { autoAlpha: 0, duration: 0.4 }, 0).fromTo(
          incoming.item,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4 },
          0
        );
        return;
      }

      const tl = gsap.timeline({ onComplete: finish });

      gsap.set(incoming.item, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(incoming.lines(), { yPercent: 110, whiteSpace: "nowrap" });
      if (incoming.image)
        gsap.set(incoming.image, { clipPath: "circle(0% at 50% 50%)" });
      if (out.image)
        gsap.set(out.image, { clipPath: "circle(50% at 50% 50%)" });

      tl.to(
        out.lines(),
        {
          yPercent: -110,
          duration: 0.6,
          ease: "power4.inOut",
          stagger: { amount: 0.25 },
        },
        0
      );
      if (out.image) {
        tl.to(
          out.image,
          {
            clipPath: "circle(0% at 50% 50%)",
            duration: 0.6,
            ease: "power4.inOut",
          },
          0
        );
      }
      tl.to(
        incoming.lines(),
        {
          yPercent: 0,
          duration: 0.7,
          ease: "power4.inOut",
          stagger: { amount: 0.4 },
        },
        ">-=0.3"
      );
      if (incoming.image) {
        tl.to(
          incoming.image,
          {
            clipPath: "circle(50% at 50% 50%)",
            duration: 0.75,
            ease: "power4.inOut",
          },
          "<"
        );
      }
      tl.set(out.item, { autoAlpha: 0 }, ">");
    };

    const startAutoplay = () => {
      autoplay?.kill();
      autoplay = gsap.delayedCall(AUTOPLAY_MS / 1000, () => {
        if (!inView || animating) {
          startAutoplay();
          return;
        }
        goTo((active + 1) % slides.length);
        startAutoplay();
      });
    };
    startAutoplay();

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.15 }
    );
    observer.observe(root);

    const step = (dir: 1 | -1) => {
      startAutoplay();
      goTo((active + dir + slides.length) % slides.length);
    };
    const prev = root.querySelector<HTMLButtonElement>("[data-prev]");
    const next = root.querySelector<HTMLButtonElement>("[data-next]");
    const onPrev = () => step(-1);
    const onNext = () => step(1);
    prev?.addEventListener("click", onPrev);
    next?.addEventListener("click", onNext);

    const onKey = (e: KeyboardEvent) => {
      if (!inView) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      autoplay?.kill();
      observer.disconnect();
      prev?.removeEventListener("click", onPrev);
      next?.removeEventListener("click", onNext);
      window.removeEventListener("keydown", onKey);
      slides.forEach((s) => s.splits.forEach((sp) => sp.revert()));
    };
  }, []);

  return (
    <section className="section_testimonials theme-default" data-gsap-ignore>
      <div className="section-padding-128px">
        <div className="padding-global">
          <div className="testimonial-lines" ref={rootRef}>
            <div className="testimonial-lines__main">
              <div className="testimonial-lines__main-details">
                <p className="testimonial-lines__p is--faded">
                  <span className="testimonial-lines__count" data-current="">
                    1
                  </span>
                  {" / "}
                  <span data-total="">{testimonials.quotes.length}</span>
                </p>
                <p className="testimonial-lines__p">{testimonials.label}</p>
              </div>

              <div className="testimonial-lines__collection">
                <div className="testimonial-lines__list">
                  {testimonials.quotes.map((q, i) => (
                    <div
                      key={q.author}
                      className={`testimonial-lines__item${
                        i === 0 ? " is--active" : ""
                      }`}
                      data-testimonial-item=""
                    >
                      <h3
                        className="testimonial-lines__h"
                        data-testimonial-split=""
                      >
                        {q.quote}
                      </h3>
                      <div className="testimonial-lines__item-details">
                        <div
                          className="testimonial-lines__item-visual"
                          data-testimonial-img=""
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="testimonial-lines__item-img"
                            src={q.avatar}
                            alt={q.author}
                          />
                        </div>
                        <div className="testimonial-lines__item-text">
                          <p className="paragraph-s" data-testimonial-split="">
                            {q.author}
                          </p>
                          <p className="paragraph-xs" data-testimonial-split="">
                            {q.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="testimonials-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={testimonials.mark.src} alt={testimonials.mark.alt} />
              </div>
            </div>

            <div className="slider-buttons">
              <button
                type="button"
                className="slider-button"
                data-prev=""
                aria-label="Previous testimonial"
              >
                <Chevron back />
              </button>
              <button
                type="button"
                className="slider-button"
                data-next=""
                aria-label="Next testimonial"
              >
                <Chevron />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
