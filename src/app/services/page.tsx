import type { Metadata } from "next";
import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import FadeUp from "@/components/motion/FadeUp";
import ServiceBlocks from "@/components/services/ServiceBlocks";
import Packages from "@/components/services/Packages";
import FaqSection from "@/components/home/FaqSection";

export const metadata: Metadata = {
  title: site.seo.services.title,
  description: site.seo.services.description,
};

export default function ServicesPage() {
  const { servicesPage } = site;

  return (
    <>
      <section className="bg-ivory pt-36 md:pt-48">
        <div className="mx-auto max-w-site px-6 pb-16 md:px-10 md:pb-28">
          <SectionLabel text={servicesPage.label} />
          <RevealText
            text={servicesPage.headline}
            as="h1"
            className="mt-6 max-w-5xl font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.02] tracking-[-0.02em] text-ink"
          />
          <FadeUp delay={0.2}>
            <p className="mt-8 max-w-xl text-lg text-stone">
              {servicesPage.subhead}
            </p>
          </FadeUp>
        </div>
      </section>

      <ServiceBlocks />
      <Packages />
      <FaqSection />
    </>
  );
}
