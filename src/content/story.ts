/**
 * TemplStudio's story page content.
 *
 * Shape maps 1:1 onto the four sections of the Hildén & Kaira "Our story"
 * page: hero → founders intro → chaptered timeline with a sticky year → the
 * shared closing CTA. Each chapter owns a year range (rendered as fit-to-width
 * display type in the sticky rail), a chrome object that pops in at the end of
 * its dashed path, a flipbook of frames and a set of trail images.
 *
 * Imagery points at the generated placeholders in /public/media — see
 * scripts/studio-media.mjs.
 */

export interface StoryChapter {
  /** Shown in the sticky rail, fit to the container width. */
  year: string;
  title: string;
  /** One or more paragraphs. */
  body: string[];
  /** Chrome object that pops in when the path completes. */
  object: { src: string; alt: string };
  /** Frames cycled as a flipbook (500ms each). */
  frames: string[];
  /** Images left behind by the cursor across this chapter. */
  trail: string[];
}

const frames = (start: number, count = 5) =>
  Array.from({ length: count }, (_, i) => `/media/story-frame-${((start + i) % 10) + 1}.svg`);

export const story = {
  /* ---- 1. Hero --------------------------------------------------- */
  hero: {
    headline: "You'll be hearing from us.",
    image: {
      src: "/media/story-hero.svg",
      alt: "The TemplStudio founders on an early client shoot",
    },
    body: [
      "Marketing is the cheapest lever most businesses never pull properly. Reaching the right thousand people costs almost nothing now — what it costs is judgement, and nobody wants to sell you that.",
      "We started TemplStudio because the industry had settled into selling activity. Retainers full of deliverables, dashboards full of numbers nobody acts on, and owners left guessing whether any of it worked.",
    ],
    cta: { label: "Read our story", href: "#story" },
    background: [
      { src: "/media/story-bg-1.svg", alt: "" },
      { src: "/media/story-bg-2.svg", alt: "" },
    ],
    objects: [
      { src: "/media/chrome/smile.svg", alt: "" },
      { src: "/media/chrome/mic.svg", alt: "" },
    ],
  },

  /* ---- 2. Founders ----------------------------------------------- */
  intro: {
    headline:
      "Alex Templeton and Sam Rivera, friends first and founding partners second. This is where our story begins.",
    founders: [
      { name: "Alex Templeton", image: "/media/founder-1.svg" },
      { name: "Sam Rivera", image: "/media/founder-2.svg" },
    ],
  },

  /* ---- 3. Chapters ----------------------------------------------- */
  chapters: [
    {
      year: "2019  2020",
      title: "A shared doc and too many opinions",
      body: [
        "We met freelancing for the same client and kept quietly fixing each other's work at midnight. Neither of us had a plan — just a shared doc, strong opinions, and a habit of saying yes to things we didn't yet know how to do.",
        "The work paid rent. It also taught us how much of this industry is theatre: decks that impress the person who commissioned them and change nothing for the business paying for them.",
      ],
      object: { src: "/media/chrome/spark.svg", alt: "" },
      frames: frames(0),
      trail: frames(3),
    },
    {
      year: "2020  2021",
      title: "Everything moved online at once",
      body: [
        "Overnight, every business needed a digital presence, and most of what agencies shipped them was expensive and forgettable. Templates with a logo dropped in. Ad accounts nobody was watching.",
        "So we started taking the projects nobody else wanted to do properly — the plumber, the med spa, the corner restaurant — and doing them properly.",
      ],
      object: { src: "/media/chrome/bolt.svg", alt: "" },
      frames: frames(2),
      trail: frames(6),
    },
    {
      year: "2021  2022",
      title: "We stopped selling hours",
      body: [
        "Hours are a terrible thing to sell. They reward slowness, they punish getting good, and they let everyone avoid the only question that matters: did it work?",
        "So we tore up the retainer and rebuilt around one rule. Every engagement has to produce something the client can see in their own dashboard — booked jobs, orders, revenue. Not impressions. Not brand lift.",
      ],
      object: { src: "/media/chrome/quote.svg", alt: "" },
      frames: frames(4),
      trail: frames(1),
    },
    {
      year: "2022  2023",
      title: "The first system that paid for itself",
      body: [
        "An HVAC client was losing after-hours emergency calls to whoever picked up first. We built something that answered the phone at 2am, qualified the caller and booked the job.",
        "It paid for the entire engagement in a single weekend. That was the week we stopped describing ourselves as people who make things and started describing ourselves as people who fix the leak.",
      ],
      object: { src: "/media/chrome/phone.svg", alt: "" },
      frames: frames(6),
      trail: frames(0),
    },
    {
      year: "2023  2024",
      title: "From vendors to the room",
      body: [
        "Clients stopped briefing us and started bringing us in early. We were no longer the vendor waiting on approvals; we were in the conversation where the decisions got made.",
        "That changed what we could do. You cannot fix a funnel from outside the business, and you cannot argue with a bad offer from the bottom of an email chain.",
      ],
      object: { src: "/media/chrome/heart.svg", alt: "" },
      frames: frames(8),
      trail: frames(4),
    },
    {
      year: "2024  2025",
      title: "The year the numbers got loud",
      body: [
        "Our best clients weren't the ones with the biggest budgets. They were the ones who let us be honest — who could hear \"stop spending on that\" without treating it as an insult.",
        "Revenue followed. Theirs first, then ours.",
        "+240% average client revenue lift. 95% retention.",
      ],
      object: { src: "/media/chrome/flame.svg", alt: "" },
      frames: frames(1),
      trail: frames(7),
    },
    {
      year: "2026",
      title: "A studio, not an agency",
      body: [
        "We drew a line. Senior people only. Public pricing. You own every account, asset and line of code we make, from day one.",
        "Small on purpose, and fast because of it. There is no account manager between you and the person doing the work, because there is no version of this where that helps you.",
      ],
      object: { src: "/media/chrome/envelope.svg", alt: "" },
      frames: frames(5),
      trail: frames(2),
    },
  ] as StoryChapter[],

  /* The closing chapter: no gallery, no trail, lime instead of dark. */
  mission: {
    year: "2030",
    title: "Mission",
    body: [
      "Most businesses are more interesting than their marketing suggests. The work is good, the people are good, the story is there — and it never reaches anybody.",
      "We think that gap is the whole opportunity. Not bigger budgets or braver campaigns: just showing the thing that's already true, to the people who would care, in a way they can act on.",
      "Every business should be findable, legible and impossible to confuse with its competitors. That's the entire job.",
    ],
    object: { src: "/media/chrome/smile.svg", alt: "" },
  },
};
