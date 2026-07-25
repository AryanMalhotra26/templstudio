"use client";

import { useEffect, useRef } from "react";
import { home } from "@/content/home";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Section 2 — the statement.
 *
 * Full-bleed media behind a dark scrim and a bottom blur band, one centred
 * lime claim, and two five-star quotes anchored to the bottom corners.
 * The media plate is 125% tall and eases up as the section passes, which is
 * the reference's `image-parallax`.
 */
function Star() {
  return (
    <svg
      className="statement_testimonial-star"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 1.6l3.1 6.9 7.5.8-5.6 5 1.6 7.4L12 17.9l-6.6 3.8L7 14.3l-5.6-5 7.5-.8L12 1.6z" />
    </svg>
  );
}

export function useImageParallax(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      el,
      { yPercent: -20 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref]);
}

export default function StatementSection() {
  const { statement } = home;
  const plateRef = useRef<HTMLDivElement>(null);
  useImageParallax(plateRef);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <section className="section_statement theme-media">
      <div className="bg-video">
        <div className="bg-overlay" />
        <div className="bg-blur" />
        <div className="image-parallax">
          <div className="image-parallax_image" ref={plateRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={statement.background.src}
              alt={statement.background.alt}
            />
          </div>
        </div>
      </div>

      <div className="statement_wrapper">
        <div className="padding-global">
          <div className="container-col-10">
            <div className="content_wrapper">
              <div className="max-width-880px">
                <h2 className="heading-l">{statement.headline}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="statement_testimonials">
          {statement.quotes.map((q, i) => (
            <div
              key={q.author}
              className={`statement_testimonial${i === 1 ? " hide-mobile" : ""}`}
            >
              <div className="statement_testimonial-stars">
                {Array.from({ length: 5 }, (_, s) => (
                  <Star key={s} />
                ))}
              </div>
              <blockquote className="statement_testimonial-quote paragraph-s">
                {q.quote}
              </blockquote>
              <div className="statement_testimonial-caption">
                <div className="statement_testimonial-div">
                  <div>-</div>
                </div>
                <div className="paragraph-s">{q.author}</div>
                <div className="paragraph-xs">{q.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
