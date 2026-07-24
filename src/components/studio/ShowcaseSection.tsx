"use client";

import { studioHome } from "@/content/site";
import SplitReveal from "./SplitReveal";
import FlickDeck from "./FlickDeck";
import LiveCounter from "./LiveCounter";

const { statement, showcases, showcaseLabel, reach } = studioHome;

/**
 * Statement + client showcases. Mirrors Hildén & Kaira's statement /
 * client-deck sections: a big claim, then per-client reel decks with a
 * "social reach — past 30 days" panel whose numbers tick up live.
 */
export default function ShowcaseSection() {
  return (
    <section
      data-studio-theme="ink"
      data-nav-theme="ink"
      className="relative overflow-hidden px-6 py-20 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-site">
        {/* Statement */}
        <div className="mx-auto max-w-4xl text-center">
          <p className="u-label text-[color:var(--muted)]">{statement.label}</p>
          <SplitReveal
            as="h2"
            text={statement.headline}
            className="mt-6 font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl"
          />
          <figure className="mx-auto mt-10 max-w-xl">
            <blockquote className="text-[15px] leading-relaxed text-[color:var(--muted)]">
              “{statement.proof}”
            </blockquote>
            <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">
              {statement.proofAuthor}
            </figcaption>
          </figure>
        </div>

        {/* Client showcases */}
        <div className="mt-20 space-y-24 md:mt-40 md:space-y-32">
          {showcases.map((s, i) => (
            <div
              key={s.client}
              className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Copy + reach */}
              <div>
                <p className="u-label text-terracotta">{showcaseLabel}</p>
                <SplitReveal
                  as="h3"
                  text={s.line}
                  className="mt-4 font-display text-2xl leading-[1.08] tracking-tight sm:text-4xl"
                />
                <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">
                  {reach.label}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-6 border-t pt-6 [border-color:var(--hair)]">
                  <div>
                    <div className="font-display text-3xl tabular-nums sm:text-4xl">
                      <LiveCounter value={s.reach.views} kind="views" />
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted)]">
                      {reach.viewsLabel}
                    </p>
                  </div>
                  <div>
                    <div className="font-display text-3xl tabular-nums sm:text-4xl">
                      <LiveCounter value={s.reach.likes} kind="likes" />
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted)]">
                      {reach.likesLabel}
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-[11px] font-mono uppercase tracking-widest text-[color:var(--muted)]/70">
                  {s.client}
                </p>
              </div>

              {/* Reel deck */}
              <div className="text-[color:var(--fg)]">
                <FlickDeck reels={s.reels} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
