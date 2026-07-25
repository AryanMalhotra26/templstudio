"use client";

import { useEffect, useRef } from "react";
import { home } from "@/content/home";
import BtnIcon from "@/components/ui/BtnIcon";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import {
  useRisingMedia,
  OBJECTS_RISING,
} from "@/components/motion/useRisingMedia";

/**
 * Section 4 — services.
 *
 * A 400vh scroll well with the card stack pinned in the middle of it. The
 * cards start offset 80px down and 80px back in Z, so they read as a deck seen
 * in perspective. As you scroll, every card walks forward one slot at a time
 * (`y -= 80`, `z += 80`); once the front card reaches the viewer it flings up
 * off the top with a random tilt, revealing the one behind. The rearmost card
 * never peels — it's the one you're left looking at.
 *
 * Values are a straight port of the reference: gap 80, `triggerFactor` 0.85,
 * `scrub: 0.2`, `power2.inOut` walking and `power4.in` for the fling.
 */

const GAP = 80;
const TRIGGER_FACTOR = 0.85;

export default function ServicesSection() {
  const { services } = home;
  const rootRef = useRef<HTMLElement>(null);
  const objectsRef = useRef<HTMLDivElement>(null);

  useRisingMedia(objectsRef, ".services_emoji-item", OBJECTS_RISING, {
    desktopOnly: true,
  });

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const pinHeight = root.querySelector<HTMLElement>(".services-pin-height");
    const container = root.querySelector<HTMLElement>(".services-container");
    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(".services-item")
    );
    if (!pinHeight || !container || !cards.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinHeight,
        start: "top top",
        end: "bottom bottom",
        pin: container,
      });

      const distPerCard =
        (pinHeight.clientHeight - window.innerHeight) / cards.length;

      gsap.set(cards, {
        y: GAP * (cards.length - 1),
        z: -GAP * (cards.length - 1),
      });

      cards.forEach((card, index) => {
        const rearmost = index === 0;
        const shift = distPerCard * index * TRIGGER_FACTOR;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinHeight,
            start: `top top+=${shift}`,
            end: `bottom bottom+=${shift}`,
            scrub: 0.2,
          },
        });

        for (let i = 0; i < cards.length - 1; i++) {
          tl.to(card, { y: `-=${GAP}`, z: `+=${GAP}`, ease: "power2.inOut" });
        }

        if (!rearmost) {
          tl.to(card, {
            yPercent: -100,
            y: "-100vh",
            scale: 1.2,
            rotation: (Math.random() - 0.5) * 50,
            ease: "power4.in",
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // 01 sits on top of the stack, so it has to be last in the DOM.
  const stackOrder = [...services.cards].reverse();

  return (
    <section
      ref={rootRef}
      className="section_services theme-dark"
      data-gsap-ignore
    >
      <div className="services_container">
        <div className="services-heading">
          <h2 className="heading-m">{services.heading}</h2>

          <div className="services_emojis" ref={objectsRef}>
            <div className="services_emojis-list">
              {services.objects.map((obj, i) => (
                <div className="services_emoji-item" key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={obj.src} alt={obj.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="services-pin-height">
          <div className="services-container">
            <div className="services-list">
              {stackOrder.map((card) => (
                <div
                  key={card.number}
                  className={`services-item ${card.theme}`}
                >
                  <div className="service-card">
                    <div className="service-card_top">
                      <div className="service-card_title">
                        <h3 className="heading-l">{card.title}</h3>
                        <p className="paragraph-m">{card.kicker}</p>
                      </div>
                      <div className="service-card_number">
                        {card.number.split("").map((d, i) => (
                          <div className="heading-s" key={i}>
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="service-card_bottom">
                      <div className="service-card_body">
                        <p className="paragraph-regular">{card.body}</p>
                        <div className="button-wrap">
                          <BtnIcon
                            label={card.cta.label}
                            href={card.cta.href}
                          />
                        </div>
                      </div>
                      <div className="service-card_video">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={card.poster} alt={card.posterAlt} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
