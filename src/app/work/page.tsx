import type { Metadata } from "next";
import { site } from "@/content/site";
import StudioPageHero from "@/components/studio/StudioPageHero";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: site.seo.work.title,
  description: site.seo.work.description,
};

export default function WorkPage() {
  const { workPage } = site;

  return (
    <>
      <StudioPageHero
        theme="ink"
        label={workPage.label}
        headline={workPage.headline}
        subhead={workPage.subhead}
      />
      <section className="bg-ivory">
        <div className="mx-auto max-w-site px-6 py-20 md:px-10 md:py-28">
          <WorkGrid />
        </div>
      </section>
    </>
  );
}
