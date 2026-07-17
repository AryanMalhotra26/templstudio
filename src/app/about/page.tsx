import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import FadeUp, { Stagger, StaggerItem } from "@/components/motion/FadeUp";
import Counter from "@/components/motion/Counter";

export const metadata: Metadata = {
  title: site.seo.about.title,
  description: site.seo.about.description,
};

export default function AboutPage() {
  const { about, intro } = site;

  return (
    <>
      {/* Statement */}
      <section className="bg-ivory pt-36 md:pt-48">
        <div className="mx-auto max-w-site px-6 pb-20 md:px-10 md:pb-32">
          <SectionLabel text={about.label} />
          <RevealText
            text={about.headline}
            as="h1"
            className="mt-6 max-w-5xl font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.02] tracking-[-0.02em] text-ink"
          />
        </div>
      </section>

      {/* Manifesto */}
      <section className="border-t u-hairline bg-ivory">
        <div className="mx-auto grid max-w-site gap-10 px-6 py-20 md:grid-cols-2 md:gap-16 md:px-10 md:py-32">
          <FadeUp>
            <p className="font-display text-2xl leading-snug tracking-[-0.02em] text-ink md:text-3xl">
              {about.story[0]}
            </p>
          </FadeUp>
          <FadeUp delay={0.1} className="space-y-6 text-stone md:text-lg">
            {about.story.slice(1).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink text-ivory">
        <div className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-40">
          <SectionLabel text={about.manifestoLabel} tone="stone" />
          <Stagger className="mt-12 border-t u-hairline-inverse">
            {about.values.map((value, i) => (
              <StaggerItem
                key={value.title}
                className="grid gap-4 border-b u-hairline-inverse py-8 md:grid-cols-[80px_1fr_1fr] md:items-baseline md:gap-10 md:py-10"
              >
                <p className="u-label text-terracotta">
                  {String(i + 1).padStart(2, "0")}.
                </p>
                <h2 className="font-display text-2xl tracking-[-0.02em] md:text-4xl">
                  {value.title}
                </h2>
                <p className="max-w-md text-stone">{value.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Team — rendered only when there is a team to show */}
      {about.team.length > 0 && (
        <section className="bg-ivory">
          <div className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-40">
            <Stagger className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {about.team.map((member) => (
                <StaggerItem key={member.name}>
                  <div className="u-grain relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.imageAlt}
                      fill
                      sizes="(min-width: 768px) 30vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <h2 className="mt-5 font-display text-2xl tracking-[-0.02em] text-ink">
                    {member.name}
                  </h2>
                  <p className="u-label mt-1 text-stone">{member.role}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Stats row reused */}
      <section className="border-t u-hairline bg-ivory">
        <div className="mx-auto max-w-site px-6 py-20 md:px-10 md:py-32">
          <SectionLabel text={about.statsLabel} />
          <Stagger className="mt-10 grid grid-cols-1 gap-px border-t u-hairline pt-8 sm:grid-cols-3">
            {intro.stats.map((stat) => (
              <StaggerItem
                key={stat.label}
                className="py-6 sm:border-l sm:first:border-l-0 sm:px-8 sm:first:pl-0 u-hairline"
              >
                <Counter
                  stat={stat}
                  valueClassName="text-[clamp(2.5rem,4.5vw,4rem)] text-ink"
                  labelClassName="text-stone"
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
