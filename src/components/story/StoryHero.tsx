"use client";

import Link from "next/link";
import { story } from "@/content/story";

/**
 * Story section 1 — hero.
 *
 * Centred claim, an inline photo tucked up under it, the opening paragraphs,
 * and a scroll-down button. Behind all of it, two photo-and-chrome-object
 * clusters pushed off opposite corners on a two-column grid, so the copy sits
 * in the gap between them. Below 479 that background stops being a background
 * and becomes a row underneath the copy.
 */

const ARROW =
  "M0 6.75758L0 5.24242L9.09091 5.24242L4.92424 1.07576L6 0L12 6L6 12L4.92424 10.9242L9.09091 6.75758L0 6.75758Z";

export default function StoryHero() {
  const { hero } = story;

  return (
    <header className="section_hero-story theme-dark">
      <div className="hero-story_wrapper">
        <div className="hero-story_body">
          <div className="padding-global">
            <div className="container-col-12">
              <div className="hero-story_content">
                <h1 className="heading-xxl">{hero.headline}</h1>

                <div className="hero-story_img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero.image.src} alt={hero.image.alt} />
                </div>

                <div className="hero-story_text-wrap">
                  {hero.body.map((p) => (
                    <p className="paragraph-m" key={p.slice(0, 24)}>
                      {p}
                    </p>
                  ))}
                </div>

                {/* Outline button with the arrow rotated to point down — it
                    scrolls to the chapters rather than navigating. */}
                <Link href={hero.cta.href} className="btn-icon-link">
                  <div className="btn-icon-content is-outline">
                    <div className="btn-icon-content__mask">
                      <span className="btn-icon-content__text">
                        {hero.cta.label}
                      </span>
                    </div>
                    <div className="btn-icon-icon">
                      <div className="btn-icon-icon__bg is-secondary" />
                      <div className="btn-icon-icon__wrap is-down is-secondary">
                        <div className="btn-icon-icon__list">
                          <svg
                            className="btn-icon-icon__arrow"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden
                          >
                            <path d={ARROW} fill="currentColor" />
                          </svg>
                          <svg
                            className="btn-icon-icon__arrow"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden
                          >
                            <path d={ARROW} fill="currentColor" />
                          </svg>
                          <svg
                            className="btn-icon-icon__arrow"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden
                          >
                            <path d={ARROW} fill="currentColor" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="btn-icon-content__bg is-white" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-story_bg">
          {[0, 1].map((i) => (
            <div
              className={`hero-story_bg-item ${i === 0 ? "is-left" : "is-right"}`}
              key={i}
            >
              <div className="hero-story_cluster">
                <div className="hero-home_media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.background[i].src}
                    alt={hero.background[i].alt}
                  />
                </div>
                <div
                  className={`hero-story_emoji ${i === 0 ? "is-01" : "is-02"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero.objects[i].src} alt={hero.objects[i].alt} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
