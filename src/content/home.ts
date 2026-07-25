/**
 * TemplStudio homepage content.
 *
 * The shape maps 1:1 onto the eight sections of the Hildén & Kaira homepage
 * we're mirroring (hero → statement → client deck → services → testimonials
 * → about → CTA → footer). Every visible string on the homepage lives here;
 * imagery points at the generated placeholders in /public/media
 * (see scripts/studio-media.mjs) — swap those files for real photography and
 * nothing else changes.
 */

export interface Cta {
  label: string;
  href: string;
}

/** A single vertical reel inside a client card's flick deck. */
export interface HomeReel {
  /** Caption printed over the reel, as it would read in-feed. */
  caption: string;
  /** Badge on the player, e.g. "410k+ views". */
  views: string;
  /** Second badge, e.g. "12.4k". */
  likes: string;
  /** Meta line, e.g. "27 days ago". */
  age: string;
  poster: string;
  posterAlt: string;
}

export interface HomeShowcase {
  client: string;
  /** Big serif claim across the top of the card. */
  headline: string;
  avatar: string;
  /** Numbers the live counters tick up toward. */
  reach: { views: string; likes: string };
  reels: HomeReel[];
  cta: Cta;
}

export interface HomeServiceCard {
  number: string;
  title: string;
  /** One line under the title. */
  kicker: string;
  body: string;
  cta: Cta;
  /** Theme class driving the card's colourway. */
  theme: "theme-lime" | "theme-white" | "theme-turquoise";
  poster: string;
  posterAlt: string;
}

export interface HomeQuote {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export interface HomeStarQuote {
  quote: string;
  author: string;
  role: string;
}

export interface ChromeObject {
  src: string;
  alt: string;
}

export const home = {
  /* ---- 1. Hero -------------------------------------------------- */
  hero: {
    /** Wordmark, one chrome glyph per character. */
    wordmark: ["t", "e", "m", "p", "l", "✳", "s", "t", "u", "d", "i", "o"],
    glyphIndex: 5,
    wordmarkLabel: "TemplStudio",
    headline:
      "If a stranger can't place your brand in three seconds, your marketing is invisible.",
    subhead: "We turn attention into revenue, or we keep working until it does.",
    primaryCta: { label: "Our approach", href: "/services" },
    secondaryCta: { label: "Work with us", href: "/contact" },
    /** Rising ambient media behind the wordmark. */
    media: [1, 2, 3, 4, 5, 6, 7].map((n) => ({
      src: `/media/hero-float-${n}.svg`,
      alt: "",
    })),
  },

  /* ---- 2. Statement --------------------------------------------- */
  statement: {
    headline: "Marketing only your business can run, because it's built on your numbers.",
    background: {
      src: "/media/bg-statement.svg",
      alt: "A TemplStudio strategist reviewing a client's campaign dashboard",
    },
    quotes: [
      {
        quote: "TemplStudio understood our patients and our pricing faster than we could explain either",
        author: "Priya Sharma",
        role: "Owner, Golden Hour Med Spa",
      },
      {
        quote: "A third of our revenue now comes from a channel we'd written off",
        author: "Marcus Chen",
        role: "Founder, Northbound Supply Co.",
      },
    ] as HomeStarQuote[],
  },

  /* ---- 3. Client deck ------------------------------------------- */
  deck: {
    reachLabel: "Growth from the past 30 days",
    viewsLabel: "Qualified visits",
    likesLabel: "Leads",
    showcases: [
      {
        client: "Golden Hour Med Spa",
        headline:
          "Golden Hour put their injectors on camera and booked out a two-week waitlist.",
        avatar: "/media/avatar-golden-hour.svg",
        reach: { views: "141 394", likes: "1 994" },
        cta: { label: "Show case", href: "/work/golden-hour-medspa" },
        reels: [
          {
            caption: "The consult question every new client asks, answered on camera.",
            views: "37k+ visits",
            likes: "1.2k",
            age: "25 days ago",
            poster: "/media/reel-golden-hour-1.svg",
            posterAlt: "Treatment-room reel for Golden Hour Med Spa",
          },
          {
            caption: "Before and after, honestly: what week two actually looks like.",
            views: "16k+ visits",
            likes: "860",
            age: "20 days ago",
            poster: "/media/reel-golden-hour-2.svg",
            posterAlt: "Results reel for Golden Hour Med Spa",
          },
          {
            caption: "A day in the treatment room, narrated by the owner.",
            views: "8k+ visits",
            likes: "510",
            age: "12 days ago",
            poster: "/media/reel-golden-hour-3.svg",
            posterAlt: "Owner-narrated reel for Golden Hour Med Spa",
          },
        ],
      },
      {
        client: "Northbound Supply Co.",
        headline:
          "Northbound turned a dusty email list into a third of the company's revenue.",
        avatar: "/media/avatar-northbound.svg",
        reach: { views: "145 858", likes: "2 441" },
        cta: { label: "Show case", href: "/work/northbound-supply" },
        reels: [
          {
            caption: "Why our most-returned product is also our most-loved.",
            views: "36k+ visits",
            likes: "6.1k",
            age: "19 days ago",
            poster: "/media/reel-northbound-1.svg",
            posterAlt: "Product story reel for Northbound Supply Co.",
          },
          {
            caption: "The warehouse at 6am, or what packing 400 orders really looks like.",
            views: "17k+ visits",
            likes: "5.8k",
            age: "29 days ago",
            poster: "/media/reel-northbound-2.svg",
            posterAlt: "Warehouse reel for Northbound Supply Co.",
          },
          {
            caption: "A customer question we get every week, answered by the founder.",
            views: "24k+ visits",
            likes: "6.4k",
            age: "28 days ago",
            poster: "/media/reel-northbound-3.svg",
            posterAlt: "Founder Q&A reel for Northbound Supply Co.",
          },
        ],
      },
      {
        client: "Summit Air Heating & Cooling",
        headline:
          "Summit Air stopped losing 2am emergency calls to whoever answered first.",
        avatar: "/media/avatar-summit-air.svg",
        reach: { views: "132 978", likes: "2 354" },
        cta: { label: "Show case", href: "/work/summit-air-hvac" },
        reels: [
          {
            caption: "The 2am call our automation booked while everybody slept.",
            views: "36k+ visits",
            likes: "6.0k",
            age: "8 days ago",
            poster: "/media/reel-summit-air-1.svg",
            posterAlt: "After-hours automation reel for Summit Air",
          },
          {
            caption: "What a failing furnace looks like from the tech's own camera.",
            views: "12k+ visits",
            likes: "1.5k",
            age: "21 days ago",
            poster: "/media/reel-summit-air-2.svg",
            posterAlt: "Technician point-of-view reel for Summit Air",
          },
          {
            caption: "Sixty-seven five-star reviews in ninety days. Here's the system.",
            views: "21k+ visits",
            likes: "4.3k",
            age: "22 days ago",
            poster: "/media/reel-summit-air-3.svg",
            posterAlt: "Review engine reel for Summit Air",
          },
        ],
      },
      {
        client: "Casa Verde",
        headline:
          "Casa Verde gave its deadest night of the week a reason to sell out.",
        avatar: "/media/avatar-casa-verde.svg",
        reach: { views: "118 674", likes: "2 091" },
        cta: { label: "Show case", href: "/work/casa-verde" },
        reels: [
          {
            caption: "Chef's table Tuesdays: the campaign that filled the slow night.",
            views: "7k+ visits",
            likes: "1.5k",
            age: "23 days ago",
            poster: "/media/reel-casa-verde-1.svg",
            posterAlt: "Chef's table campaign reel for Casa Verde",
          },
          {
            caption: "The family story behind the menu, told in ninety seconds.",
            views: "5k+ visits",
            likes: "1.3k",
            age: "16 days ago",
            poster: "/media/reel-casa-verde-2.svg",
            posterAlt: "Brand story reel for Casa Verde",
          },
          {
            caption: "One dish, five honest reactions from the room next door.",
            views: "6k+ visits",
            likes: "1.4k",
            age: "9 days ago",
            poster: "/media/reel-casa-verde-3.svg",
            posterAlt: "Customer reaction reel for Casa Verde",
          },
        ],
      },
    ] as HomeShowcase[],
  },

  /* ---- 4. Services ---------------------------------------------- */
  services: {
    heading: "Our services",
    /** Listed front-to-back: 01 sits on top of the stack and peels first. */
    cards: [
      {
        number: "01",
        title: "Websites & CRO",
        kicker: "Let's turn the traffic you already have into customers.",
        body: "Your website is either your hardest-working employee or your most expensive liability. We design, build and keep testing fast, conversion-focused sites — then report the numbers your accountant cares about.",
        cta: { label: "Discover our approach", href: "/services" },
        theme: "theme-lime",
        poster: "/media/service-websites.svg",
        posterAlt: "Preview of a TemplStudio conversion-focused website build",
      },
      {
        number: "02",
        title: "Paid advertising",
        kicker: "(and why your creative needs clarity far more than novelty)",
        body: "Organic earns you attention; ads buy more of what already works. We take your best-performing hooks, faces and offers and put them in front of people ready to buy — every dollar traced to a booked job or an order.",
        cta: { label: "Discover our approach", href: "/services" },
        theme: "theme-white",
        poster: "/media/service-ads.svg",
        posterAlt: "Preview of a TemplStudio paid advertising campaign",
      },
      {
        number: "03",
        title: "AI automation",
        kicker: "We'll make your business the fastest one to answer.",
        body: "The quickest business wins the lead. We build the systems that reply in seconds, answer the phone at 2am, chase reviews on their own and hand your team a single pipeline they actually trust.",
        cta: { label: "Get in touch", href: "/contact" },
        theme: "theme-turquoise",
        poster: "/media/service-automation.svg",
        posterAlt: "Preview of a TemplStudio automation workflow",
      },
    ] as HomeServiceCard[],
    /** Chrome objects drifting up behind the section heading. */
    objects: [
      { src: "/media/chrome/spark.svg", alt: "" },
      { src: "/media/chrome/smile.svg", alt: "" },
      { src: "/media/chrome/flame.svg", alt: "" },
      { src: "/media/chrome/bolt.svg", alt: "" },
      { src: "/media/chrome/mic.svg", alt: "" },
      { src: "/media/chrome/heart.svg", alt: "" },
      { src: "/media/chrome/phone.svg", alt: "" },
    ] as ChromeObject[],
  },

  /* ---- 5. Testimonials ------------------------------------------ */
  testimonials: {
    label: "What our clients say:",
    quotes: [
      {
        quote:
          "TemplStudio has been with us through every critical moment of the last two years, from the rebuild to the campaign that finally filled our calendar. Together we found a voice that sounds like a clinic and not a catalogue: we tested, we cut what didn't work, and we doubled down on what did. Our booking calendar went from gaps everywhere to a two-week waitlist, and they treated our budget like it was their own money.",
        author: "Priya Sharma",
        role: "Owner, Golden Hour Med Spa",
        avatar: "/media/avatar-golden-hour.svg",
      },
      {
        quote:
          "Email went from an afterthought to a third of our revenue in a single quarter. What I value most is that nobody ever tried to impress me with a dashboard: they told us what they were shipping, when it would land, and what it returned. Nine flows and one honest calendar later, it is the best money we have spent on this business.",
        author: "Marcus Chen",
        role: "Founder, Northbound Supply Co.",
        avatar: "/media/avatar-northbound.svg",
      },
      {
        quote:
          "They believed from day one that we could win the after-hours jobs we had been handing to competitors, and that is exactly what happened. The AI receptionist paid for itself the first weekend — we booked three emergency jobs while I was asleep. They work at the pace this trade actually moves at, delivering in hours what other agencies quote in weeks.",
        author: "Dave Kowalski",
        role: "Owner, Summit Air Heating & Cooling",
        avatar: "/media/avatar-summit-air.svg",
      },
      {
        quote:
          "They have a knack for finding the people, dishes and angles that show what we actually are. I could almost say TemplStudio helped us find our identity. Tuesdays used to be our dead night; now the chef's table books two weeks out, and they understood our family's story better than we could tell it ourselves.",
        author: "Elena Reyes",
        role: "Co-owner, Casa Verde",
        avatar: "/media/avatar-casa-verde.svg",
      },
    ] as HomeQuote[],
    mark: { src: "/media/chrome/quote.svg", alt: "" },
  },

  /* ---- 6. About -------------------------------------------------- */
  about: {
    headline: "Does your brand undersell itself?",
    body: "Businesses think their work, their people and their story aren't interesting enough. That they need an expensive brand campaign to look serious. We think that's lazy, and a waste of your money.",
    primaryCta: { label: "Read our story", href: "/about" },
    secondaryCta: { label: "Get in touch", href: "/contact" },
    background: {
      src: "/media/bg-about.svg",
      alt: "The TemplStudio team on a client shoot",
    },
    images: [
      { src: "/media/about-1.svg", alt: "A TemplStudio strategy session in progress" },
      { src: "/media/about-2.svg", alt: "A TemplStudio founder on a client call" },
    ],
  },

  /* ---- 7. CTA ---------------------------------------------------- */
  cta: {
    headline: "Ready to work with us?",
    subhead: "Choose how you would like to get in touch.",
    cards: [
      {
        title: "We'll call you",
        body: "We audit your current marketing and call you back with the three things we would fix first.",
        cta: { label: "Share your contact info", href: "#callback" },
        theme: "theme-lime",
        tilt: "is-1",
        object: { src: "/media/chrome/phone.svg", alt: "" },
      },
      {
        title: "Contact us",
        body: "Email or call the studio to start the discussion right away.",
        cta: { label: "Contact information", href: "/contact" },
        theme: "theme-dark-grey",
        tilt: "is-2",
        object: { src: "/media/chrome/envelope.svg", alt: "" },
      },
    ],
    popup: {
      title: "We'll call you",
      body: "Leave your number and a senior strategist — not a junior gatekeeper — calls you within one business day.",
      object: { src: "/media/chrome/phone.svg", alt: "" },
      nameLabel: "Your name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      businessLabel: "Business name",
      messageLabel: "What are you trying to grow?",
      submitLabel: "Send it over",
      successTitle: "Got it — thank you.",
      successBody: "We aim to reply to you as soon as possible.",
      closeLabel: "Close",
    },
  },

  /* ---- 8. Footer ------------------------------------------------- */
  footer: {
    sitemapTitle: "Sitemap",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    cards: [
      {
        title: "Podcast",
        object: { src: "/media/chrome/mic.svg", alt: "" },
        links: [
          { label: "Spotify", href: "#", glyph: "S" },
          { label: "YouTube", href: "#", glyph: "Y" },
          { label: "Apple Podcasts", href: "#", glyph: "A" },
        ],
      },
      {
        title: "Social",
        object: { src: "/media/chrome/heart.svg", alt: "" },
        links: [
          { label: "Instagram", href: "#", glyph: "I" },
          { label: "TikTok", href: "#", glyph: "T" },
          { label: "LinkedIn", href: "#", glyph: "L" },
        ],
      },
    ],
    legal: "All rights reserved",
    bottomLinks: [
      { label: "Privacy Policy", href: "#" },
      { label: "Cookies", href: "#" },
    ],
    credit: "Design & build by TemplStudio",
  },
};
