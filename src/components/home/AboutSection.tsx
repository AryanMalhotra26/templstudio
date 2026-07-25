"use client";

import { useEffect, useRef } from "react";
import { home } from "@/content/home";
import BtnIcon from "@/components/ui/BtnIcon";
import { registerGsap, gsap } from "@/lib/gsap";
import { useImageParallax } from "@/components/home/StatementSection";

/**
 * Section 6 — the provocation.
 *
 * Same full-bleed media treatment as the statement, but the claim is set at
 * `heading-xxl` and two tilted photos drift in from off the left and right
 * edges at different parallax speeds — the reference drives those with
 * Locomotive's `data-scroll-speed` (0.1 and -0.05); here it's a scrubbed
 * ScrollTrigger doing the same thing.
 */
export default function AboutSection() {
  const { about } = home;
  const rootRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  useImageParallax(plateRef);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-scroll-speed]").forEach((el) => {
        const speed = parseFloat(el.dataset.scrollSpeed ?? "0");
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: -speed * 1200,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="section_about-us theme-media">
      <div className="bg-video">
        <div className="bg-overlay" />
        <div className="bg-blur" />
        <div className="image-parallax">
          <div className="image-parallax_image" ref={plateRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={about.background.src} alt={about.background.alt} />
          </div>
        </div>
      </div>

      <div className="padding-global">
        <div className="container-col-08">
          <div className="about-us_wrapper">
            <div className="about-us_img-wrapper is-left">
              <div className="about-us_img" data-scroll-speed="0.1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={about.images[0].src} alt={about.images[0].alt} />
              </div>
            </div>
            <div className="about-us_img-wrapper is-right">
              <div className="about-us_img" data-scroll-speed="-0.05">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={about.images[1].src} alt={about.images[1].alt} />
              </div>
            </div>

            <div className="max-width-880px">
              <h2 className="heading-xxl">{about.headline}</h2>
            </div>

            <div className="about-us_body">
              <p className="paragraph-m">{about.body}</p>
              <div className="button-group">
                <BtnIcon
                  label={about.primaryCta.label}
                  href={about.primaryCta.href}
                />
                <BtnIcon
                  label={about.secondaryCta.label}
                  href={about.secondaryCta.href}
                  variant="primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
