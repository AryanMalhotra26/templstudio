import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import FadeUp, { Stagger, StaggerItem } from "@/components/motion/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import Counter from "@/components/motion/Counter";

/** Ink editorial statement + counter stats. */
export default function Intro() {
  const { intro } = site;

  return (
    <section className="bg-ink text-ivory">
      <div className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-40">
        <SectionLabel text={intro.label} tone="stone" />
        <RevealText
          text={intro.statement}
          as="p"
          className="mt-8 max-w-5xl font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.08] tracking-[-0.02em]"
        />
        <FadeUp className="mt-10 max-w-xl" delay={0.2}>
          <p className="text-stone">{intro.supporting}</p>
        </FadeUp>

        <Stagger className="mt-20 grid grid-cols-1 gap-px border-t u-hairline-inverse pt-10 sm:grid-cols-3 md:mt-28">
          {intro.stats.map((stat) => (
            <StaggerItem
              key={stat.label}
              className="py-6 sm:border-l sm:first:border-l-0 sm:px-8 sm:first:pl-0 u-hairline-inverse"
            >
              <Counter
                stat={stat}
                valueClassName="text-[clamp(2.5rem,4.5vw,4rem)] text-ivory"
                labelClassName="text-stone"
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
