import type { Metadata } from "next";
import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import FadeUp from "@/components/motion/FadeUp";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: site.seo.work.title,
  description: site.seo.work.description,
};

export default function WorkPage() {
  const { workPage } = site;

  return (
    <section className="bg-ivory pt-36 md:pt-48">
      <div className="mx-auto max-w-site px-6 pb-24 md:px-10 md:pb-40">
        <SectionLabel text={workPage.label} />
        <RevealText
          text={workPage.headline}
          as="h1"
          className="mt-6 max-w-5xl font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.02] tracking-[-0.02em] text-ink"
        />
        <FadeUp delay={0.2}>
          <p className="mt-8 max-w-xl text-lg text-stone">{workPage.subhead}</p>
        </FadeUp>

        <div className="mt-16 md:mt-24">
          <WorkGrid />
        </div>
      </div>
    </section>
  );
}
