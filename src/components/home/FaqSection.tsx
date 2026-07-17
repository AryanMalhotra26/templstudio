import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import FadeUp from "@/components/motion/FadeUp";
import Accordion from "@/components/motion/Accordion";

/** Ivory FAQ section with the hairline accordion. */
export default function FaqSection({
  label = site.home.faq.label,
  headline = site.home.faq.headline,
}: {
  label?: string;
  headline?: string;
}) {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-40">
        <SectionLabel text={label} />
        <RevealText
          text={headline}
          as="h2"
          className="mt-6 max-w-4xl font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-ink"
        />
        <FadeUp className="mt-16 md:mt-24" delay={0.1}>
          <Accordion items={site.faq} />
        </FadeUp>
      </div>
    </section>
  );
}
