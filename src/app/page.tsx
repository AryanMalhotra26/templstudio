import type { Metadata } from "next";
import { site } from "@/content/site";
import HeroSection from "@/components/home/HeroSection";
import StatementSection from "@/components/home/StatementSection";
import ClientDeckSection from "@/components/home/ClientDeckSection";
import ServicesSection from "@/components/home/ServicesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import AboutSection from "@/components/home/AboutSection";
import CtaSection from "@/components/home/CtaSection";

export const metadata: Metadata = {
  title: site.seo.home.title,
  description: site.seo.home.description,
};

/**
 * Homepage — a section-for-section, animation-for-animation rebuild of the
 * Hildén & Kaira homepage on TemplStudio's copy, logo and palette:
 *
 *   1. HeroSection        — chrome wordmark, rising media, page-load timeline
 *   2. StatementSection   — full-bleed media, centred claim, star quotes
 *   3. ClientDeckSection  — carousel of case cards with flick-card reel decks
 *   4. ServicesSection    — 400vh pinned 3D card stack that peels card by card
 *   5. TestimonialsSection— line-reveal quote slider with iris portraits
 *   6. AboutSection       — giant claim over media with tilted parallax photos
 *   7. CtaSection         — momentum-hover cards + callback popup
 *
 * The chrome footer follows from the root layout.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatementSection />
      <ClientDeckSection />
      <ServicesSection />
      <TestimonialsSection />
      <AboutSection />
      <CtaSection />
    </>
  );
}
