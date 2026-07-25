import type { Metadata } from "next";
import { site } from "@/content/site";
import StoryHero from "@/components/story/StoryHero";
import StoryIntro from "@/components/story/StoryIntro";
import StoryChapters from "@/components/story/StoryChapters";
import CtaSection from "@/components/home/CtaSection";

export const metadata: Metadata = {
  title: site.seo.about.title,
  description: site.seo.about.description,
};

/**
 * Our story — a section-for-section rebuild of the Hildén & Kaira story page
 * on TemplStudio's own copy:
 *
 *   1. StoryHero     — claim over two corner photo/chrome clusters
 *   2. StoryIntro    — the two founders
 *   3. StoryChapters — chaptered timeline: sticky fit-to-width year, a dashed
 *                      rail that draws itself, flipbook frames, cursor image
 *                      trails, and a lime "Mission" close
 *   4. CtaSection    — the same closing CTA as the homepage
 */
export default function AboutPage() {
  return (
    <>
      <StoryHero />
      <StoryIntro />
      <StoryChapters />
      <CtaSection />
    </>
  );
}
