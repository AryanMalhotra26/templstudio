import type { Metadata } from "next";
import { site } from "@/content/site";
import WorkIndex from "@/components/work/WorkIndex";
import CtaSection from "@/components/home/CtaSection";

export const metadata: Metadata = {
  title: site.seo.work.title,
  description: site.seo.work.description,
};

/**
 * Work — the case-study index as a full-viewport list of client names in
 * display type, promoted one at a time as you scroll, then the shared closing
 * CTA. No hero: the list is the hero.
 */
export default function WorkPage() {
  return (
    <>
      <WorkIndex />
      <CtaSection />
    </>
  );
}
