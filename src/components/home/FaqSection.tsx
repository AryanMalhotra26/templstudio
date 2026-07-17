import { site } from "@/content/site";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeUp from "@/components/motion/FadeUp";
import Accordion from "@/components/motion/Accordion";

/** Ivory FAQ section with the hairline accordion. */
export default function FaqSection({
  label = site.home.faq.label,
  headline = site.home.faq.headline,
  lede = site.home.faq.lede,
}: {
  label?: string;
  headline?: string;
  lede?: string;
}) {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-32">
        <SectionHeader
          label={label}
          headline={headline}
          lede={lede}
          meta={`(${String(site.faq.length).padStart(2, "0")}) ©`}
        />
        <FadeUp className="mt-14 md:mt-20" delay={0.1}>
          <Accordion items={site.faq} />
        </FadeUp>
      </div>
    </section>
  );
}
