"use client";

import { useEffect, useRef } from "react";
import { home } from "@/content/home";
import BtnIcon from "@/components/ui/BtnIcon";
import ChromeWordmark from "@/components/ui/ChromeWordmark";
import { registerGsap, gsap, SplitText } from "@/lib/gsap";
import { useRisingMedia, HERO_RISING } from "@/components/motion/useRisingMedia";

/**
 * Section 1 — hero.
 *
 * Three layers, exactly as the reference stacks them:
 *   • the chrome wordmark, pinned across the top of the viewport
 *   • ambient photo cards drifting up from below the fold, painting *over*
 *     the wordmark and *under* the copy
 *   • the claim, subhead and button pair, bottom-centred
 *
 * The whole section opts out of the global text reveal (`data-gsap-ignore`)
 * because it runs its own page-load timeline instead: the lime plate lifts,
 * the wordmark letters spring in from the middle outward, then the claim's
 * lines mask up and the buttons arrive.
 */
export default function HeroSection() {
  const { hero } = home;
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useRisingMedia(bgRef, ".hero-home_item", HERO_RISING);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const letters = Array.from(
      root.querySelectorAll<HTMLElement>(".hero-home_logo-item")
    );
    const heading = root.querySelector<HTMLElement>(".heading-xl");
    const rest = root.querySelectorAll<HTMLElement>(
      ".hero-home_text-wrap, .btn-group"
    );

    if (reduce) return;

    // Letters resolve from the centre of the wordmark outward, so the mark
    // assembles rather than sweeping in one direction.
    const mid = (letters.length - 1) / 2;
    const byDistance = letters
      .map((el, i) => ({ el, d: Math.abs(i - mid) }))
      .sort((a, b) => a.d - b.d)
      .map((x) => x.el);

    let split: SplitText | undefined;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.set(letters, { yPercent: 45, autoAlpha: 0, scale: 0.86 })
      .set(rest, { autoAlpha: 0, y: 24 })
      .to(
        byDistance,
        {
          yPercent: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 1.1,
          stagger: 0.055,
          ease: "elastic.out(1, 0.75)",
        },
        0.15
      );

    if (heading) {
      split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        linesClass: "gsap-line",
      });
      gsap.set(heading, { autoAlpha: 1 });
      tl.from(
        split.lines,
        { yPercent: 110, duration: 0.8, stagger: 0.08 },
        0.55
      );
    }

    tl.to(rest, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.8);

    // Safety net for low-end devices: this timeline is what makes the wordmark
    // and copy visible, so if the frame loop never gets going, snap it to the
    // end rather than leaving the hero empty. Timers still fire when rAF is
    // starved, so this runs even when GSAP can't.
    const startFrame = gsap.ticker.frame;
    const guard = window.setTimeout(() => {
      if (gsap.ticker.frame - startFrame < 2) tl.progress(1);
    }, 1500);

    return () => {
      window.clearTimeout(guard);
      tl.kill();
      split?.revert();
    };
  }, []);

  return (
    // Lime background, but deliberately *not* `theme-lime`: like the
    // reference, the hero keeps the default token set, which is what makes
    // "Our approach" a black block and "Work with us" read as lime-on-lime
    // with only its arrow square showing.
    <header ref={rootRef} className="section_hero" data-gsap-ignore>
      <div className="hero-home_wrapper">
        <div className="hero-home_body">
          <div className="padding-global">
            <div className="container-col-12">
              <div className="hero-home_content">
                <h1 className="heading-xl">{hero.headline}</h1>
                <div className="hero-home_text-wrap">
                  <p className="paragraph-m">{hero.subhead}</p>
                </div>
                <div className="btn-group">
                  <BtnIcon
                    label={hero.primaryCta.label}
                    href={hero.primaryCta.href}
                  />
                  <BtnIcon
                    label={hero.secondaryCta.label}
                    href={hero.secondaryCta.href}
                    variant="primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ChromeWordmark
          className="hero-home_logo"
          itemClassName="hero-home_logo-item"
          idPrefix="hero"
        />

        <div className="hero-home_bg" ref={bgRef}>
          <div className="hero-home_list">
            {hero.media.map((m, i) => (
              <div className="hero-home_item" key={i}>
                <div className="hero-home_media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.src} alt={m.alt} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-home_pageload-bg" />
    </header>
  );
}
