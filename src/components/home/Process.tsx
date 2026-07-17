import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import { Stagger, StaggerItem } from "@/components/motion/FadeUp";

/** Four numbered steps with giant outlined numerals in a hairline-ruled row. */
export default function Process() {
  const { process, home } = site;

  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-36">
        <SectionLabel text={home.process.label} />
        <RevealText
          text={home.process.headline}
          as="h2"
          className="mt-6 max-w-4xl font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-ink"
        />

        <Stagger className="mt-14 grid gap-10 border-t u-hairline pt-10 md:mt-20 md:grid-cols-4 md:gap-0">
          {process.map((step, i) => (
            <StaggerItem
              key={step.number}
              className="md:border-l md:px-8 md:first:border-l-0 md:first:pl-0 u-hairline"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p
                  aria-hidden
                  className="u-outline-text font-display text-6xl text-ink md:text-7xl"
                >
                  {step.number}
                </p>
                {i < process.length - 1 && (
                  <span aria-hidden className="u-label hidden text-terracotta md:block">
                    →
                  </span>
                )}
              </div>
              <h3 className="mt-6 font-display text-2xl tracking-[-0.02em] text-ink md:text-3xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-xs text-sm text-stone md:text-base">
                {step.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
