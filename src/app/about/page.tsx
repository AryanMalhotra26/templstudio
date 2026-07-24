import type { Metadata } from "next";
import { site } from "@/content/site";
import StoryHero from "@/components/studio/StoryHero";
import FoundersIntro from "@/components/studio/FoundersIntro";
import StoryTimeline from "@/components/studio/StoryTimeline";
import CtaMomentum from "@/components/studio/CtaMomentum";

export const metadata: Metadata = {
  title: site.seo.about.title,
  description: site.seo.about.description,
};

/**
 * About = the studio's origin story as a scroll timeline (Hildén &
 * Kaira-style): floating-photo hero → founder intro → chapters with a
 * sticky year rail and stat call-outs → closing CTA.
 */
export default function AboutPage() {
  return (
    <>
      <StoryHero />
      <FoundersIntro />
      <StoryTimeline />
      <CtaMomentum />
    </>
  );
}
