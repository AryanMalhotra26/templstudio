import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import FadeUp, { Stagger, StaggerItem } from "@/components/motion/FadeUp";
import SectionHeader from "@/components/ui/SectionHeader";
import Counter from "@/components/motion/Counter";

/** Ink editorial statement, then supporting copy + stats on one ruled grid. */
export default function Intro() {
  const { intro, brand } = site;

  return (
    <section className="bg-ink text-ivory">
      <div className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-32">
        <SectionHeader
          label={intro.label}
          meta={`${brand.location.toUpperCase()} ©`}
          tone="dark"
        />

        <RevealText
          text={intro.statement}
          as="p"
          className="mt-10 max-w-5xl font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.08] tracking-[-0.02em]"
        />

        <div className="mt-16 grid gap-10 border-t u-hairline-inverse pt-10 md:mt-24 md:grid-cols-12">
          <FadeUp className="md:col-span-4">
            <p className="max-w-sm text-stone-light">{intro.supporting}</p>
          </FadeUp>
          <Stagger className="grid grid-cols-1 gap-8 sm:grid-cols-3 md:col-span-8">
            {intro.stats.map((stat) => (
              <StaggerItem
                key={stat.label}
                className="border-t u-hairline-inverse pt-5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0 sm:first:border-l-0 sm:first:pl-0"
              >
                <Counter
                  stat={stat}
                  valueClassName="text-[clamp(2.5rem,4vw,3.75rem)] text-ivory"
                  labelClassName="text-stone-light"
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
