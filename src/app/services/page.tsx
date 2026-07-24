import type { Metadata } from "next";
import { site } from "@/content/site";
import StudioPageHero from "@/components/studio/StudioPageHero";
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
      <StudioPageHero
        theme="chrome"
        label={servicesPage.label}
        headline={servicesPage.headline}
        subhead={servicesPage.subhead}
      />
      <ServiceBlocks />
      <Packages />
      <FaqSection />
    </>
  );
}
