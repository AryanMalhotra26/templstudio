import type { Metadata } from "next";
import { site } from "@/content/site";
import StudioHero from "@/components/studio/StudioHero";
import ShowcaseSection from "@/components/studio/ShowcaseSection";
import ServicesPinned from "@/components/studio/ServicesPinned";
import TestimonialSlider from "@/components/studio/TestimonialSlider";
import ClosingStatement from "@/components/studio/ClosingStatement";
import CtaMomentum from "@/components/studio/CtaMomentum";

export const metadata: Metadata = {
  title: site.seo.home.title,
  description: site.seo.home.description,
};

/**
 * Homepage rebuilt to mirror the Hildén & Kaira section structure on the
 * TemplStudio brand:
 *   1. StudioHero        — chrome wordmark + rising media + masked tagline
 *   2. ShowcaseSection   — statement + client reel decks + live counters
 *   3. ServicesPinned    — pinned 3D service stack that peels on scroll
 *   4. TestimonialSlider — line-reveal quotes with counter
 *   5. ClosingStatement  — manifesto beat + CTAs
 *   6. CtaMomentum       — inertia-hover cards + callback popup
 * The chrome footer follows from the global layout.
 *
 * The previous homepage components (Hero, Intro, ServicesList, FeaturedWork,
 * Process, Testimonials, FaqSection) still live in src/components/home — this
 * swap is fully git-revertible.
 */
export default function HomePage() {
  return (
    <>
      <StudioHero />
      <ShowcaseSection />
      <ServicesPinned />
      <TestimonialSlider />
      <ClosingStatement />
      <CtaMomentum />
    </>
  );
}
