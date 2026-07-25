"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HomeReel } from "@/content/home";
import { registerGsap, gsap } from "@/lib/gsap";

/**
 * The flick-card deck — the fanned stack of vertical reels on each client
 * card, ported from the reference's `initFlickCards`.
 *
 * Every card's slot is derived from its signed distance to the active index
 * (wrapping around the deck), which gives the five visible positions: centre,
 * ±1 tucked just behind, ±2 further out and rotated, everything else parked
 * off-stage at zero opacity. Cards animate between slots on an elastic ease;
 * clicking a ±1 card flicks the deck that way. The meta chips on the active
 * card slide up out of their masks on a short stagger.
 */

interface Slot {
  x: number;
  y: number;
  rot: number;
  s: number;
  o: number;
  z: number;
  status: string;
}

function slotFor(index: number, active: number, total: number): Slot {
  let d = index - active;
  if (d > total / 2) d -= total;
  else if (d < -total / 2) d += total;

  switch (d) {
    case 0:
      return { x: 0, y: 0, rot: 0, s: 1, o: 1, z: 5, status: "active" };
    case 1:
      return { x: 25, y: 1, rot: 10, s: 0.9, o: 1, z: 4, status: "2-after" };
    case -1:
      return { x: -25, y: 1, rot: -10, s: 0.9, o: 1, z: 4, status: "2-before" };
    case 2:
      return { x: 45, y: 5, rot: 15, s: 0.8, o: 1, z: 3, status: "3-after" };
    case -2:
      return { x: -45, y: 5, rot: -15, s: 0.8, o: 1, z: 3, status: "3-before" };
    default: {
      const dir = d > 0 ? 1 : -1;
      return {
        x: 55 * dir,
        y: 5,
        rot: 20 * dir,
        s: 0.6,
        o: 0,
        z: 2,
        status: "hidden",
      };
    }
  }
}

function ChevronIcon({ back = false }: { back?: boolean }) {
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

function EyeIcon() {
  return (
    <svg
      className="flick-card_data-icon-svg"
      viewBox="0 0 24 16"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0C6.5 0 2 4 0 8c2 4 6.5 8 12 8s10-4 12-8c-2-4-6.5-8-12-8zm0 13a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      className="flick-card_data-icon-svg"
      viewBox="0 0 24 22"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 21.4S0 14.2 0 7.6C0 4 2.7 1.2 6.1 1.2c2.4 0 4.6 1.4 5.9 3.5 1.3-2.1 3.5-3.5 5.9-3.5C21.3 1.2 24 4 24 7.6c0 6.6-12 13.8-12 13.8z" />
    </svg>
  );
}

export default function FlickDeck({
  reels,
  label,
}: {
  reels: HomeReel[];
  label: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const busy = useRef(false);
  const total = reels.length;

  /** Lay the deck out; `animate: false` on first paint so nothing flies in. */
  const layout = useCallback(
    (next: number, animate: boolean) => {
      const list = listRef.current;
      if (!list) return;
      const items = Array.from(
        list.querySelectorAll<HTMLElement>("[data-flick-cards-item]")
      );

      items.forEach((item, i) => {
        const slot = slotFor(i, next, total);
        item.setAttribute("data-flick-cards-item-status", slot.status);
        item.style.zIndex = String(slot.z);
        const to = {
          xPercent: slot.x,
          yPercent: slot.y,
          rotation: slot.rot,
          scale: slot.s,
          opacity: slot.o,
        };
        if (animate)
          gsap.to(item, { ...to, duration: 0.6, ease: "elastic.out(1.2, 1)" });
        else gsap.set(item, to);

        // Meta chips: only the active card's are up.
        const chips = item.querySelectorAll<HTMLElement>(".flick-card_data");
        gsap.killTweensOf(chips);
        if (i === next) {
          chips.forEach((chip, c) => {
            gsap.set(chip, { yPercent: 110 });
            gsap.to(chip, {
              yPercent: 0,
              duration: 0.5,
              delay: (animate ? 0.2 : 0.1) + 0.1 * c,
              ease: "power2.out",
            });
          });
        } else {
          gsap.set(chips, { yPercent: 110 });
        }
      });
    },
    [total]
  );

  useEffect(() => {
    registerGsap();
    layout(0, false);
  }, [layout]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (busy.current || total < 2) return;
      busy.current = true;
      setActive((prev) => {
        const next = (prev + dir + total) % total;
        layout(next, true);
        return next;
      });
      window.setTimeout(() => {
        busy.current = false;
      }, 700);
    },
    [layout, total]
  );

  return (
    <div className="flick-group" data-gsap-ignore>
      <div className="flick-group__relative-object">
        <div className="flick-group__relative-object-before" />
      </div>

      <div className="flick-group__collection">
        <div className="flick-group__list" ref={listRef}>
          {reels.map((reel, i) => (
            <div
              key={i}
              className="flick-group__item"
              data-flick-cards-item=""
              onClick={(e) => {
                const status = (
                  e.currentTarget as HTMLElement
                ).getAttribute("data-flick-cards-item-status");
                if (status === "2-after") go(1);
                else if (status === "2-before") go(-1);
              }}
            >
              <div className="flick-card">
                <div className="flick-card__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={reel.poster} alt={reel.posterAlt} />
                </div>
                {/* On the reference these captions are burned into the reel
                    footage; here they sit on the poster so the placeholder
                    still reads as a piece of content. */}
                <p className="flick-card__caption">{reel.caption}</p>
              </div>
              <div className="flick-card_data-wrap">
                <div className="flick-card_data-mask">
                  <div className="flick-card_data paragraph-xxs">
                    <EyeIcon />
                    {reel.views}
                  </div>
                </div>
                <div className="flick-card_data-mask">
                  <div className="flick-card_data paragraph-xxs">
                    <HeartIcon />
                    {reel.likes}
                  </div>
                </div>
                <div className="flick-card_data-mask">
                  <div className="flick-card_data paragraph-xxs">{reel.age}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flick-group__pagination is-client-deck">
        <button
          type="button"
          className="flick-group__button"
          onClick={() => go(-1)}
          aria-label={`Previous reel — ${label}`}
        >
          <ChevronIcon back />
        </button>
        <button
          type="button"
          className="flick-group__button"
          onClick={() => go(1)}
          aria-label={`Next reel — ${label}`}
        >
          <ChevronIcon />
        </button>
      </div>
    </div>
  );
}
