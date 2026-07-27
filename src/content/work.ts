import { site } from "@/content/site";

/**
 * Work index content.
 *
 * Built from the case studies in site.ts so there's one source of truth — this
 * only adds what the index itself needs: the two image crops per case and the
 * single headline result to show on hover.
 */

export interface WorkIndexItem {
  slug: string;
  client: string;
  category: string;
  year: string;
  /** The one number worth putting on the row. */
  result: string;
  tall: string;
  square: string;
  href: string;
}

const CROPS: Record<string, string> = {
  "golden-hour-medspa": "golden-hour",
  "northbound-supply": "northbound",
  "summit-air-hvac": "summit-air",
  "casa-verde": "casa-verde",
};

function headlineResult(slug: string): string {
  const item = site.work.find((w) => w.slug === slug);
  const first = item?.results[0];
  if (!first) return "";
  return `${first.prefix ?? ""}${first.value}${first.suffix ?? ""} ${first.label.toLowerCase()}`;
}

export const workIndex = {
  /* Doubles as the page h1. */
  label: "Selected work",
  lede: "Four recent engagements. Every number came out of a client's own dashboard.",
  cta: "View case",
  items: site.work.map((w): WorkIndexItem => {
    const crop = CROPS[w.slug] ?? w.slug;
    return {
      slug: w.slug,
      client: w.client,
      category: w.category,
      year: w.year,
      result: headlineResult(w.slug),
      tall: `/media/work-${crop}-tall.svg`,
      square: `/media/work-${crop}-sq.svg`,
      href: `/work/${w.slug}`,
    };
  }),
};
