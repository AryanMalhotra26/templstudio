import type { Metadata } from "next";
import { site } from "@/content/site";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceRail from "@/components/services/ServiceRail";
import PackageTiers from "@/components/services/PackageTiers";
import ServicesFaq from "@/components/services/ServicesFaq";
import CtaSection from "@/components/home/CtaSection";

export const metadata: Metadata = {
  title: site.seo.services.title,
  description: site.seo.services.description,
};

/**
 * Services — the last page to move off the retired editorial system and onto
 * the studio system the rest of the site runs on:
 *
 *   1. ServicesHero — lime split: the claim, and the seven services as a
 *                     priced jump index
 *   2. ServiceRail  — sticky index rail beside the seven detail panels
 *   3. PackageTiers — three tiers per audience, featured tier raised
 *   4. ServicesFaq  — closing questions
 *   5. CtaSection   — the same closing CTA as the homepage, work and story
 *
 * Section anchors (`#web-design-development` and friends) are unchanged from
 * the previous version, so existing deep links still land.
 */
export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceRail />
      <PackageTiers />
      <ServicesFaq />
      <CtaSection />
    </>
  );
}
