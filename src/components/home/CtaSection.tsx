"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { home } from "@/content/home";
import BtnIcon from "@/components/ui/BtnIcon";
import { registerGsap, gsap } from "@/lib/gsap";

/**
 * Section 7 — the closing CTA.
 *
 * Two tilted cards that get physically knocked about by the cursor. The
 * reference's `initMomentumBasedHover` tracks pointer velocity across the
 * section and, the moment the cursor crosses into a card, hands that velocity
 * to GSAP's InertiaPlugin — including an angular component derived from the
 * cross product of the entry vector and the pointer velocity, so a glancing
 * blow spins the card. It then coasts back to rest.
 *
 * Ported values: 30× linear velocity (clamped ±1080), 20× angular (clamped
 * ±60), resistance 200. Desktop pointers only.
 */

const LINEAR_MULT = 30;
const ANGULAR_MULT = 20;
const RESISTANCE = 200;

export default function CtaSection() {
  const { cta } = home;
  const rootRef = useRef<HTMLElement>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const clampLinear = gsap.utils.clamp(-1080, 1080);
    const clampAngular = gsap.utils.clamp(-60, 60);

    let lastX = 0;
    let lastY = 0;
    let vx = 0;
    let vy = 0;
    let frame: number | null = null;

    const onMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        vx = e.clientX - lastX;
        vy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        frame = null;
      });
    };
    root.addEventListener("mousemove", onMove);

    const cleanups: Array<() => void> = [
      () => root.removeEventListener("mousemove", onMove),
    ];

    root
      .querySelectorAll<HTMLElement>("[data-momentum-hover-element]")
      .forEach((el) => {
        const onEnter = (e: MouseEvent) => {
          const target = el.querySelector<HTMLElement>(
            "[data-momentum-hover-target]"
          );
          if (!target) return;

          const { left, top, width, height } = target.getBoundingClientRect();
          const dx = e.clientX - (left + width / 2);
          const dy = e.clientY - (top + height / 2);
          // Cross product of entry offset and pointer velocity — the "spin".
          const spin = (dx * vy - dy * vx) / (Math.hypot(dx, dy) || 1);
          // Settle back on the card's resting tilt rather than flat.
          const rest = parseFloat(target.dataset.restRotation ?? "0");

          gsap.to(target, {
            inertia: {
              x: { velocity: clampLinear(vx * LINEAR_MULT), end: 0 },
              y: { velocity: clampLinear(vy * LINEAR_MULT), end: 0 },
              rotation: {
                velocity: clampAngular(spin * ANGULAR_MULT),
                end: rest,
              },
              resistance: RESISTANCE,
            },
          });
        };
        el.addEventListener("mouseenter", onEnter);
        cleanups.push(() => el.removeEventListener("mouseenter", onEnter));
      });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Match the resting tilt the CSS gives each card, so inertia coasts home.
  const restRotation = (tilt: string) => (tilt === "is-1" ? -2 : 1);

  return (
    <section
      ref={rootRef}
      className="section_cta theme-dark"
      data-momentum-hover-init=""
    >
      <div className="section-padding-128px">
        <div className="padding-global">
          <div className="container-col-12">
            <div className="cta_wrapper">
              <div className="cta_title">
                <h2 className="heading-l">{cta.headline}</h2>
                <div className="max-width-960px">
                  <p className="paragraph-m">{cta.subhead}</p>
                </div>
              </div>

              <div className="cta-cards" data-gsap-ignore>
                {cta.cards.map((card) => {
                  const isPopup = card.cta.href === "#callback";
                  const inner = (
                    <>
                      <h3 className="heading-s">{card.title}</h3>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="cta-card_emoji"
                        src={card.object.src}
                        alt={card.object.alt}
                      />
                      <div className="cta-card_body">
                        <p className="paragraph-s">{card.body}</p>
                        <BtnIcon label={card.cta.label} />
                      </div>
                    </>
                  );

                  const shared = {
                    className: `cta-card ${card.tilt} ${card.theme}`,
                    "data-momentum-hover-target": "",
                    "data-rest-rotation": String(restRotation(card.tilt)),
                  };

                  return (
                    <div
                      className="cta-card_wrap"
                      data-momentum-hover-element=""
                      key={card.title}
                    >
                      {isPopup ? (
                        <button
                          type="button"
                          onClick={() => setPopupOpen(true)}
                          {...shared}
                        >
                          {inner}
                        </button>
                      ) : (
                        <Link href={card.cta.href} {...shared}>
                          {inner}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {popupOpen && (
        <div
          className="cta-pop-up"
          role="dialog"
          aria-modal="true"
          aria-label={cta.popup.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPopupOpen(false);
          }}
        >
          <div className="cta-pop-up_form theme-chrome" data-gsap-ignore>
            <button
              type="button"
              className="cta-pop-up_close"
              onClick={() => setPopupOpen(false)}
              aria-label={cta.popup.closeLabel}
            >
              <svg viewBox="0 0 16 16" width="100%" aria-hidden>
                <path
                  d="M1 1l14 14M15 1L1 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>

            <div className="contact-form">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="footer-main_card-img"
                src={cta.popup.object.src}
                alt={cta.popup.object.alt}
                style={{ width: "8em", alignSelf: "center", marginTop: 0 }}
              />
              <h3 className="heading-s">{cta.popup.title}</h3>
              <p className="paragraph-s">{cta.popup.body}</p>

              {sent ? (
                <div>
                  <h4 className="heading-xs">{cta.popup.successTitle}</h4>
                  <p className="paragraph-s">{cta.popup.successBody}</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <div className="contact-form">
                    <div className="form-row">
                      <label className="form-field-group">
                        <span className="paragraph-xs">
                          {cta.popup.nameLabel}
                        </span>
                        <input className="form-field" name="name" required />
                      </label>
                      <label className="form-field-group">
                        <span className="paragraph-xs">
                          {cta.popup.businessLabel}
                        </span>
                        <input className="form-field" name="business" />
                      </label>
                    </div>
                    <div className="form-row">
                      <label className="form-field-group">
                        <span className="paragraph-xs">
                          {cta.popup.emailLabel}
                        </span>
                        <input
                          className="form-field"
                          type="email"
                          name="email"
                          required
                        />
                      </label>
                      <label className="form-field-group">
                        <span className="paragraph-xs">
                          {cta.popup.phoneLabel}
                        </span>
                        <input className="form-field" name="phone" />
                      </label>
                    </div>
                    <label className="form-field-group">
                      <span className="paragraph-xs">
                        {cta.popup.messageLabel}
                      </span>
                      <textarea className="form-field" name="message" />
                    </label>
                    <button type="submit" className="btn-icon-link">
                      <span className="btn-icon-content is-secondary">
                        <span className="btn-icon-content__mask">
                          <span className="btn-icon-content__text">
                            {cta.popup.submitLabel}
                          </span>
                        </span>
                        <span className="btn-icon-content__bg is-secondary" />
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
