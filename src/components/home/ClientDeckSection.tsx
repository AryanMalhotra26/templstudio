"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { home } from "@/content/home";
import BtnIcon from "@/components/ui/BtnIcon";
import FlickDeck from "@/components/home/FlickDeck";
import LiveCounter from "@/components/home/LiveCounter";

/**
 * Section 3 — the client deck.
 *
 * A centred carousel of case cards. The reference drives it with Swiper
 * (`slidesPerView: "auto"`, centred, 20px between slides, 600ms, inactive
 * slides at `scale(0.94)`); this is the same behaviour on a transform-driven
 * track, so there's no runtime dependency to ship.
 *
 * Each card carries: the claim + client avatar, the live reach tiles, a
 * "Show case" button, and the flick deck of reels on the right.
 */

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

export default function ClientDeckSection() {
  const { deck } = home;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = deck.showcases.length;

  /** Distance the track must sit at for slide `i` to be centred. */
  const offsetFor = useCallback((i: number) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return 0;
    const slide = track.children[i] as HTMLElement | undefined;
    if (!slide) return 0;
    return slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2;
  }, []);

  const position = useCallback(
    (extra = 0) => {
      const track = trackRef.current;
      if (!track) return;
      track.style.transform = `translate3d(${-offsetFor(index) + extra}px, 0, 0)`;
    },
    [index, offsetFor]
  );

  useEffect(() => {
    position();
    const onResize = () => position();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [position]);

  const go = (dir: 1 | -1) =>
    setIndex((i) => Math.min(total - 1, Math.max(0, i + dir)));

  /**
   * Touch/pointer dragging — the primary way to move through the deck on a
   * phone, where the arrows are a fallback. Only takes over once the gesture
   * is clearly horizontal, so vertical page scrolling still works.
   */
  const drag = useRef({ active: false, decided: false, x: 0, y: 0, dx: 0 });

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { active: true, decided: false, x: e.clientX, y: e.clientY, dx: 0 };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;

    if (!d.decided) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        d.active = false; // vertical scroll — let the page have it
        return;
      }
      d.decided = true;
      trackRef.current?.classList.add("is-dragging");
      trackRef.current?.setPointerCapture?.(e.pointerId);
    }

    d.dx = dx;
    position(dx);
  };

  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    trackRef.current?.classList.remove("is-dragging");
    if (!d.decided) return;

    const width = (trackRef.current?.children[index] as HTMLElement)?.offsetWidth ?? 1;
    const threshold = width * 0.15;
    if (d.dx <= -threshold) go(1);
    else if (d.dx >= threshold) go(-1);
    else position();
  };

  return (
    <section className="section_client-deck" data-gsap-ignore>
      <div className="section-padding-128px">
        <div className="padding-global">
          <div className="container-col-12">
            <div className="swiper-group">
              <div
                className="deck-viewport"
                ref={viewportRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                <div className="deck-track" ref={trackRef}>
                  {deck.showcases.map((showcase, i) => (
                    <div
                      key={showcase.client}
                      className={`deck-slide${i === index ? " is-active" : ""}`}
                      aria-hidden={i !== index}
                    >
                      <article className="client-deck_card">
                        <div className="client-deck_card-title">
                          <div className="client-deck_card-pf">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={showcase.avatar}
                              alt={`${showcase.client} logo`}
                            />
                          </div>
                          <h2 className="client-deck_title">
                            {showcase.headline}
                          </h2>
                        </div>

                        <div className="client-deck_card-slider">
                          <FlickDeck
                            reels={showcase.reels}
                            label={showcase.client}
                          />
                        </div>

                        <div className="client-deck_card-data">
                          <div className="client-deck_data-title">
                            <div className="dot-l" />
                            <p className="paragraph-m">{deck.reachLabel}</p>
                          </div>

                          <div className="client-deck_card-data-wrap">
                            <div className="client-deck_card-views theme-lime">
                              <div className="paragraph-regular">
                                {deck.viewsLabel}
                              </div>
                              <LiveCounter
                                className="client-deck_views-title"
                                value={showcase.reach.views}
                                type="views"
                              />
                            </div>
                            <div className="client-deck_card-likes theme-chrome">
                              <div className="paragraph-regular">
                                {deck.likesLabel}
                              </div>
                              <LiveCounter
                                className="client-deck_likes-title"
                                value={showcase.reach.likes}
                                type="likes"
                              />
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                className="client-deck_likes-heart"
                                src="/media/chrome/heart.svg"
                                alt=""
                              />
                            </div>
                          </div>

                          <div className="client-deck_button">
                            <BtnIcon
                              label={showcase.cta.label}
                              href={showcase.cta.href}
                            />
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>

              <div className="swiper-navigation">
                <button
                  type="button"
                  className="slider-button"
                  onClick={() => go(-1)}
                  disabled={index === 0}
                  aria-label="Previous case"
                >
                  <Chevron back />
                </button>
                <button
                  type="button"
                  className="slider-button"
                  onClick={() => go(1)}
                  disabled={index === total - 1}
                  aria-label="Next case"
                >
                  <Chevron />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
