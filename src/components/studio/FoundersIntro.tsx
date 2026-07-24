"use client";

import { studioStory } from "@/content/site";
import SplitReveal from "./SplitReveal";
import FadeUp from "@/components/motion/FadeUp";

const { founders } = studioStory;

/** Founder intro: a lead line + portrait cards (placeholder gradients). */
export default function FoundersIntro() {
  return (
    <section
      data-studio-theme="ink"
      data-nav-theme="ink"
      className="border-t px-6 py-24 [border-color:var(--hair)] md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-site">
        <SplitReveal
          text={founders.intro}
          className="mx-auto max-w-3xl text-center font-display text-2xl leading-snug tracking-[-0.02em] sm:text-3xl"
        />
        <div className="mx-auto mt-16 grid max-w-2xl gap-6 sm:grid-cols-2">
          {founders.people.map((p) => (
            <FadeUp key={p.name}>
              <figure>
                <div className={`aspect-[4/5] w-full overflow-hidden rounded-2xl tone-${p.tone}`}>
                  <div className="flex h-full items-end p-5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ivory/60">
                      Portrait · placeholder
                    </span>
                  </div>
                </div>
                <figcaption className="mt-4">
                  <p className="font-display text-2xl tracking-tight">{p.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">
                    {p.role}
                  </p>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
