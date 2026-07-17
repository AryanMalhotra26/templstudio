/**
 * TemplStudio — single source of truth for every piece of visible content.
 *
 * Every string a visitor reads lives here. Rename a service, change a price,
 * add a testimonial or a case study — components adapt automatically.
 * Headline strings support *asterisk* accents: wrapped words render as
 * italic serif accent words (the studio signature).
 */

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Cta {
  label: string;
  href: string;
}

export interface Brand {
  name: string;
  tagline: string;
  email: string;
  location: string;
  est: string;
}

export interface Hero {
  label: string;
  headline: string;
  subhead: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  scrollHint: string;
}

export interface Intro {
  label: string;
  statement: string;
  supporting: string;
  stats: Stat[];
}

export interface Service {
  slug: string;
  index: string;
  name: string;
  shortDescription: string;
  description: string;
  deliverables: string[];
  startingPrice: string;
  image: string;
  imageAlt: string;
}

export type PackageSegment = "local" | "ecom";

export interface Package {
  segment: PackageSegment;
  name: string;
  price: string;
  priceNote: string;
  blurb: string;
  includes: string[];
  featured: boolean;
  cta: Cta;
}

export interface WorkImage {
  src: string;
  alt: string;
}

export interface WorkItem {
  slug: string;
  client: string;
  category: string;
  year: string;
  featured: boolean;
  cover: WorkImage;
  summary: string;
  challenge: string;
  approach: string;
  results: Stat[];
  gallery: WorkImage[];
  testimonialRef?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  business: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface AboutValue {
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
}

export interface About {
  label: string;
  headline: string;
  story: string[];
  manifestoLabel: string;
  values: AboutValue[];
  team: TeamMember[];
  statsLabel: string;
}

export interface Contact {
  label: string;
  headline: string;
  subhead: string;
  budgetOptions: string[];
  formspreeEndpoint: string;
  responseNote: string;
  form: {
    nameLabel: string;
    namePlaceholder: string;
    businessLabel: string;
    businessPlaceholder: string;
    websiteLabel: string;
    websitePlaceholder: string;
    budgetLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    successTitle: string;
    successMessage: string;
    errorMessage: string;
    requiredError: string;
    emailNote: string;
  };
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Footer {
  ctaLabel: string;
  ctaHeadline: string;
  ctaHref: string;
  nav: NavLink[];
  socials: SocialLink[];
  legal: string;
}

export interface SeoEntry {
  title: string;
  description: string;
}

export interface Seo {
  siteUrl: string;
  titleTemplate: string;
  defaultTitle: string;
  home: SeoEntry;
  services: SeoEntry;
  work: SeoEntry;
  about: SeoEntry;
  contact: SeoEntry;
}

export interface SectionHeading {
  label: string;
  headline: string;
  /** Short supporting line, set right of the headline. */
  lede?: string;
}

export interface HomeSections {
  services: SectionHeading & { cta: Cta };
  work: SectionHeading & { cta: Cta };
  process: SectionHeading;
  testimonials: SectionHeading;
  faq: SectionHeading;
}

export interface ServicesPage {
  label: string;
  headline: string;
  subhead: string;
  deliverablesLabel: string;
  fromLabel: string;
  packages: {
    label: string;
    headline: string;
    subhead: string;
    segments: { id: PackageSegment; label: string }[];
    featuredTag: string;
  };
}

export interface WorkPage {
  label: string;
  headline: string;
  subhead: string;
  allFilter: string;
  caseStudy: {
    challengeLabel: string;
    approachLabel: string;
    resultsLabel: string;
    galleryLabel: string;
    prevLabel: string;
    nextLabel: string;
    backLabel: string;
  };
}

export interface NotFoundContent {
  headline: string;
  message: string;
  cta: Cta;
}

export interface SiteContent {
  brand: Brand;
  nav: NavLink[];
  hero: Hero;
  marqueeItems: string[];
  intro: Intro;
  home: HomeSections;
  services: Service[];
  servicesPage: ServicesPage;
  packages: Package[];
  process: ProcessStep[];
  work: WorkItem[];
  workPage: WorkPage;
  testimonials: Testimonial[];
  faq: FaqItem[];
  about: About;
  contact: Contact;
  footer: Footer;
  notFound: NotFoundContent;
  seo: Seo;
}

/* ————————————————————————————————————————————————————————————————
   SEED CONTENT
   ———————————————————————————————————————————————————————————————— */

export const site: SiteContent = {
  brand: {
    name: "TemplStudio",
    tagline: "The marketing studio for businesses that want to be unignorable.",
    email: "hello@templstudio.com",
    location: "Toronto / Remote",
    est: "2026",
  },

  nav: [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  hero: {
    label: "MARKETING STUDIO — FOR LOCAL & ECOM BRANDS",
    headline: "We build brands people *actually* remember.",
    subhead:
      "Websites, ads, and automation systems that turn attention into revenue — for local businesses and ecommerce brands.",
    primaryCta: { label: "Book a call", href: "/contact" },
    secondaryCta: { label: "See what we do", href: "/services" },
    scrollHint: "(SCROLL) ↓",
  },

  marqueeItems: [
    "WEBSITES",
    "PAID ADS",
    "SEO & CONTENT",
    "EMAIL & SMS",
    "AI AUTOMATION",
    "SOCIAL",
    "CRO",
  ],

  intro: {
    label: "(00) — THE STUDIO ©",
    statement:
      "Most agencies sell activity. *We sell outcomes* — more booked jobs, more orders, more revenue you can point to.",
    supporting:
      "TemplStudio is a small senior team that moves at startup speed. No account-manager telephone, no six-week discovery decks — the people you meet on the first call are the people doing the work, shipping in days and reporting in plain English.",
    stats: [
      { value: 50, suffix: "+", label: "Projects shipped" },
      { value: 2, prefix: "$", suffix: "M+", label: "Ad spend managed" },
      { value: 98, suffix: "%", label: "Clients who'd refer us" },
    ],
  },

  home: {
    services: {
      label: "(01) — WHAT WE DO ©",
      headline: "Everything your growth *actually* needs.",
      lede: "Start with the one channel you need most, or run the full system under one roof.",
      cta: { label: "All services & pricing", href: "/services" },
    },
    work: {
      label: "(02) — SELECTED WORK ©",
      headline: "Results you can *point* to.",
      lede: "Recent engagements — every number comes straight from a client dashboard.",
      cta: { label: "View all work", href: "/work" },
    },
    process: {
      label: "(03) — HOW IT WORKS ©",
      headline: "From first call to first result, *fast.*",
      lede: "No black box. You'll know what's shipping, when, and what it returned.",
    },
    testimonials: {
      label: "(04) — KIND WORDS ©",
      headline: "",
    },
    faq: {
      label: "(05) — QUESTIONS ©",
      headline: "Asked *often,* answered honestly.",
      lede: "Straight answers to the questions every owner asks before signing.",
    },
  },

  services: [
    {
      slug: "web-design-development",
      index: "01",
      name: "Web Design & Development",
      shortDescription: "Fast, beautiful sites that sell.",
      description:
        "Your website is your hardest-working employee — or your most expensive liability. We design and build fast, conversion-focused sites that make your business look like the obvious choice, then prove it with the numbers.",
      deliverables: [
        "Conversion-focused design & copywriting",
        "Custom build — no bloated page builders",
        "Sub-2s load times, 90+ Lighthouse scores",
        "Local SEO & schema foundations",
        "Analytics, call & form tracking installed",
        "Training video so your team can edit content",
      ],
      startingPrice: "from $2,500",
      image: "/images/service-01.svg",
      imageAlt: "Editorial preview of a website design project",
    },
    {
      slug: "paid-advertising",
      index: "02",
      name: "Paid Advertising",
      shortDescription: "Google & Meta ads accountable to revenue, not impressions.",
      description:
        "We run Google and Meta campaigns the way an owner would: every dollar tracked to a booked job or an order. Weekly optimization, honest reporting, and creative that stops the scroll — with zero tolerance for vanity metrics.",
      deliverables: [
        "Full-funnel campaign strategy & build",
        "Ad creative — static, video & copy",
        "Conversion tracking & call attribution",
        "Weekly optimization & A/B testing",
        "Landing page recommendations",
        "Plain-English monthly reporting",
      ],
      startingPrice: "from $1,200/mo",
      image: "/images/service-02.svg",
      imageAlt: "Paid advertising campaign dashboard preview",
    },
    {
      slug: "seo-content",
      index: "03",
      name: "SEO & Content",
      shortDescription: "Own the searches your customers actually make.",
      description:
        "Ranking for trophy keywords is nice. Ranking for the searches that end in a purchase is better. We build topical authority around buyer intent — technical fixes, local dominance, and content people actually want to read.",
      deliverables: [
        "Technical SEO audit & fixes",
        "Local SEO & Google Business Profile",
        "Keyword strategy mapped to revenue",
        "Monthly content production",
        "Authority link building",
        "Rank & traffic reporting that makes sense",
      ],
      startingPrice: "from $1,000/mo",
      image: "/images/service-03.svg",
      imageAlt: "Search rankings growth chart preview",
    },
    {
      slug: "email-sms",
      index: "04",
      name: "Email & SMS",
      shortDescription: "The highest-ROI channel in your business, finally working.",
      description:
        "For most brands, email is a dusty list and a monthly newsletter nobody opens. We turn it into a revenue engine: automated flows that sell while you sleep and campaigns your customers actually look forward to.",
      deliverables: [
        "Klaviyo / platform setup & migration",
        "Core automated flows — welcome, abandon, post-purchase",
        "Campaign calendar & production",
        "List growth & segmentation strategy",
        "Deliverability monitoring",
        "Revenue-per-recipient reporting",
      ],
      startingPrice: "from $800/mo",
      image: "/images/service-04.svg",
      imageAlt: "Email marketing flow diagram preview",
    },
    {
      slug: "ai-automation",
      index: "05",
      name: "AI Automation",
      shortDescription:
        "Speed-to-lead, review engines, AI receptionists — systems that work while you sleep.",
      description:
        "The fastest business wins the lead. We build automation systems that respond to enquiries in seconds, chase reviews automatically, and answer your phone at 2am — so no opportunity ever slips because a human was busy.",
      deliverables: [
        "Speed-to-lead instant response system",
        "AI receptionist & missed-call textback",
        "Automated review generation engine",
        "CRM & pipeline automation",
        "Appointment booking workflows",
        "Monthly monitoring & tuning",
      ],
      startingPrice: "from $1,500 setup",
      image: "/images/service-05.svg",
      imageAlt: "Automation system workflow preview",
    },
    {
      slug: "social-content",
      index: "06",
      name: "Social Content",
      shortDescription: "A month of scroll-stopping content, produced in days.",
      description:
        "Consistency beats virality — but nobody has time for daily content. We batch-produce a full month of on-brand posts, reels and stories in a single production cycle, so your feed looks alive while you run the business.",
      deliverables: [
        "Monthly content strategy & calendar",
        "Batch production — design, video, copy",
        "Platform-native formats & hooks",
        "Scheduling & publishing",
        "Community response guidelines",
        "Monthly performance recap",
      ],
      startingPrice: "from $600/mo",
      image: "/images/service-06.svg",
      imageAlt: "Social media content grid preview",
    },
    {
      slug: "landing-pages-cro",
      index: "07",
      name: "Landing Pages & CRO",
      shortDescription: "Turn the traffic you already have into customers.",
      description:
        "Doubling your conversion rate is the same as doubling your ad budget — except you only pay for it once. We build high-converting landing pages and run structured experiments on the pages you already have.",
      deliverables: [
        "Conversion audit & heatmap analysis",
        "High-converting landing page design & build",
        "Copywriting driven by customer research",
        "A/B testing setup & management",
        "Form & funnel optimization",
        "Before/after conversion reporting",
      ],
      startingPrice: "from $750",
      image: "/images/service-07.svg",
      imageAlt: "Landing page conversion funnel preview",
    },
  ],

  servicesPage: {
    label: "(SERVICES) ©",
    headline: "Seven ways we make you *unignorable.*",
    subhead:
      "Pick one, or let us build the full system. Everything is priced to pay for itself — and you own every asset, account, and line of code we create.",
    deliverablesLabel: "WHAT'S INCLUDED",
    fromLabel: "STARTING AT",
    packages: {
      label: "(PACKAGES) ©",
      headline: "Simple packages, *serious* outcomes.",
      subhead:
        "Built for the two kinds of businesses we know best. Every package is month-to-month after the initial 90 days — we keep clients with results, not contracts.",
      segments: [
        { id: "local", label: "Local businesses" },
        { id: "ecom", label: "Ecommerce brands" },
      ],
      featuredTag: "MOST POPULAR",
    },
  },

  packages: [
    {
      segment: "local",
      name: "Foundation",
      price: "$2,500",
      priceNote: "one-time",
      blurb: "The digital storefront done right — for businesses that need to look like the obvious choice.",
      includes: [
        "Conversion-focused website (up to 6 pages)",
        "Local SEO & Google Business Profile setup",
        "Review generation system",
        "Call & form tracking",
        "Analytics dashboard",
        "30 days of post-launch support",
      ],
      featured: false,
      cta: { label: "Start with Foundation", href: "/contact" },
    },
    {
      segment: "local",
      name: "Growth",
      price: "$1,500",
      priceNote: "/mo",
      blurb: "The full lead engine — ads, automation and follow-up working as one system.",
      includes: [
        "Google & Meta ads management",
        "Speed-to-lead automation",
        "Missed-call textback & AI receptionist",
        "Landing page optimization",
        "Monthly content for social proof",
        "Weekly optimization, monthly reporting",
        "Dedicated senior strategist",
      ],
      featured: true,
      cta: { label: "Book a Growth call", href: "/contact" },
    },
    {
      segment: "local",
      name: "Dominate",
      price: "$3,000",
      priceNote: "/mo",
      blurb: "Own your market. Every channel, every search, every follow-up — handled.",
      includes: [
        "Everything in Growth",
        "SEO & monthly content production",
        "Email & SMS marketing",
        "Full social content production",
        "Quarterly strategy intensives",
        "Priority same-day support",
      ],
      featured: false,
      cta: { label: "Talk about Dominate", href: "/contact" },
    },
    {
      segment: "ecom",
      name: "Revenue Rescue",
      price: "$1,000",
      priceNote: "/mo",
      blurb: "For stores leaving money on the table — we fix the retention layer first.",
      includes: [
        "Klaviyo audit & rebuild",
        "Core automated flows (welcome, abandon, post-purchase)",
        "2 campaigns per month",
        "List growth & pop-up optimization",
        "Deliverability monitoring",
        "Revenue-per-recipient reporting",
      ],
      featured: false,
      cta: { label: "Rescue my revenue", href: "/contact" },
    },
    {
      segment: "ecom",
      name: "Traffic + Convert",
      price: "$2,800",
      priceNote: "/mo",
      blurb: "Profitable acquisition and a site that converts it — the growth core for scaling stores.",
      includes: [
        "Meta & Google ads management",
        "Monthly ad creative production",
        "Landing page & CRO program",
        "Email & SMS management",
        "Weekly optimization sprints",
        "Plain-English P&L-level reporting",
        "Dedicated senior strategist",
      ],
      featured: true,
      cta: { label: "Book a strategy call", href: "/contact" },
    },
    {
      segment: "ecom",
      name: "Full Stack",
      price: "$5,000",
      priceNote: "/mo",
      blurb: "An entire growth department for less than one senior hire.",
      includes: [
        "Everything in Traffic + Convert",
        "SEO & content production",
        "Full social content production",
        "AI automation & support workflows",
        "Quarterly growth roadmapping",
        "Priority same-day support",
      ],
      featured: false,
      cta: { label: "Talk about Full Stack", href: "/contact" },
    },
  ],

  process: [
    {
      number: "01",
      title: "Discover",
      description: "A 30-minute call. Your numbers, your goals, no pitch.",
    },
    {
      number: "02",
      title: "Design",
      description: "Strategy and creative, shown to you before anything ships.",
    },
    {
      number: "03",
      title: "Deliver",
      description: "Launched in days, not months.",
    },
    {
      number: "04",
      title: "Grow",
      description: "Weekly optimization, monthly plain-English reporting.",
    },
  ],

  work: [
    {
      slug: "golden-hour-medspa",
      client: "Golden Hour Med Spa",
      category: "Website & Paid Ads",
      year: "2026",
      featured: true,
      cover: {
        src: "/images/cover-golden-hour.svg",
        alt: "Golden Hour Med Spa website shown on a warm editorial layout",
      },
      summary:
        "A med spa with five-star treatments and a two-star website. We rebuilt the brand's digital presence and filled the booking calendar with paid search.",
      challenge:
        "Golden Hour had the best injectors in their suburb and a website that looked like a 2014 template — no online booking, no reviews surfaced, and ad traffic bouncing at 80%. Competitors with worse outcomes were winning purely on presentation.",
      approach:
        "We rebuilt the site around treatment-specific landing pages with transparent pricing and real client results, wired online booking into every page, then launched Google Search campaigns targeting high-intent local searches — retargeting warm visitors on Meta with before-and-after creative.",
      results: [
        { value: 214, suffix: "%", label: "More booked consultations" },
        { value: 4.2, prefix: "", suffix: "x", label: "Return on ad spend" },
        { value: 38, suffix: "%", label: "Lower cost per lead" },
      ],
      gallery: [
        {
          src: "/images/gallery-golden-hour-1.svg",
          alt: "Golden Hour Med Spa booking flow design",
        },
        {
          src: "/images/gallery-golden-hour-2.svg",
          alt: "Golden Hour Med Spa paid ad creative set",
        },
        {
          src: "/images/gallery-golden-hour-3.svg",
          alt: "Golden Hour Med Spa treatment landing pages",
        },
      ],
      testimonialRef: "golden-hour",
    },
    {
      slug: "northbound-supply",
      client: "Northbound Supply Co.",
      category: "Email & SMS",
      year: "2026",
      featured: true,
      cover: {
        src: "/images/cover-northbound.svg",
        alt: "Northbound Supply email designs in an editorial grid",
      },
      summary:
        "An outdoor-gear brand doing seven figures with email contributing almost nothing. We rebuilt the entire retention layer in three weeks.",
      challenge:
        "Northbound's email program was one batch-and-blast per month to an unsegmented list — 4% of revenue when healthy DTC brands see 25–35%. Abandoned carts got no follow-up at all, and their SMS list was collecting dust.",
      approach:
        "We migrated them to a clean Klaviyo build: a nine-flow automation core, segmentation by purchase behaviour, and a campaign calendar tied to product drops. Every email redesigned to feel like the brand's field journal, not a coupon machine.",
      results: [
        { value: 31, suffix: "%", label: "Of revenue now from email" },
        { value: 47, suffix: "x", label: "ROI on the rebuild in 90 days" },
        { value: 3.1, suffix: "x", label: "More repeat purchases" },
      ],
      gallery: [
        {
          src: "/images/gallery-northbound-1.svg",
          alt: "Northbound Supply email flow architecture",
        },
        {
          src: "/images/gallery-northbound-2.svg",
          alt: "Northbound Supply campaign email designs",
        },
      ],
      testimonialRef: "northbound",
    },
    {
      slug: "summit-air-hvac",
      client: "Summit Air Heating & Cooling",
      category: "AI Automation",
      year: "2026",
      featured: true,
      cover: {
        src: "/images/cover-summit-air.svg",
        alt: "Summit Air automation dashboard in an editorial layout",
      },
      summary:
        "An HVAC company losing after-hours emergency calls to whoever answered first. We made sure that was always them.",
      challenge:
        "Summit Air's phones went to voicemail after 6pm — in a trade where the first company to respond wins the job. They were losing an estimated 15 emergency calls a month to competitors, and their techs were too busy to chase reviews.",
      approach:
        "We deployed an AI receptionist that answers, qualifies and books emergency calls 24/7, missed-call textback for daytime overflow, and an automated review engine that texts customers after every completed job. The office got a single pipeline view of every lead.",
      results: [
        { value: 92, suffix: "%", label: "Of after-hours calls now captured" },
        { value: 67, suffix: "", label: "New five-star reviews in 90 days" },
        { value: 41, prefix: "$", suffix: "k", label: "Added monthly revenue" },
      ],
      gallery: [
        {
          src: "/images/gallery-summit-air-1.svg",
          alt: "Summit Air AI receptionist call flow",
        },
        {
          src: "/images/gallery-summit-air-2.svg",
          alt: "Summit Air automated review engine",
        },
      ],
      testimonialRef: "summit-air",
    },
    {
      slug: "casa-verde",
      client: "Casa Verde",
      category: "Brand & Social",
      year: "2026",
      featured: true,
      cover: {
        src: "/images/cover-casa-verde.svg",
        alt: "Casa Verde restaurant brand and social content grid",
      },
      summary:
        "A neighbourhood restaurant with lines out the door on weekends and empty tables on Tuesdays. We gave the brand a voice worth following.",
      challenge:
        "Casa Verde's food photographed beautifully — but their feed was sporadic phone snaps and their brand lived entirely on word of mouth. Weekday covers were 40% below capacity while competitors with worse kitchens packed rooms through Instagram.",
      approach:
        "We sharpened the brand identity around the family's story, then built a monthly content engine: one batch shoot covering dishes, people and process, cut into reels, posts and stories. Weekday-specific campaigns — chef's table Tuesdays, industry night Wednesdays — gave slow nights their own identity.",
      results: [
        { value: 28, suffix: "k", label: "New followers in six months" },
        { value: 64, suffix: "%", label: "Increase in weekday covers" },
        { value: 3, suffix: "x", label: "More reservation-link clicks" },
      ],
      gallery: [
        {
          src: "/images/gallery-casa-verde-1.svg",
          alt: "Casa Verde brand identity system",
        },
        {
          src: "/images/gallery-casa-verde-2.svg",
          alt: "Casa Verde social content grid",
        },
        {
          src: "/images/gallery-casa-verde-3.svg",
          alt: "Casa Verde weekday campaign creative",
        },
      ],
      testimonialRef: "casa-verde",
    },
  ],

  workPage: {
    label: "(WORK) ©",
    headline: "Proof, not *promises.*",
    subhead:
      "A selection of recent projects. Every number below is one our clients can see in their own dashboards.",
    allFilter: "All",
    caseStudy: {
      challengeLabel: "(A) — THE CHALLENGE",
      approachLabel: "(B) — THE APPROACH",
      resultsLabel: "(C) — THE RESULTS",
      galleryLabel: "(D) — SELECTED VISUALS",
      prevLabel: "Previous project",
      nextLabel: "Next project",
      backLabel: "All work",
    },
  },

  testimonials: [
    {
      id: "golden-hour",
      quote:
        "Our booking calendar went from gaps everywhere to a two-week waitlist. They treated our budget like it was their own money.",
      author: "Priya Sharma",
      role: "Owner",
      business: "Golden Hour Med Spa",
    },
    {
      id: "northbound",
      quote:
        "Email went from an afterthought to a third of our revenue in one quarter. It's the best money we've spent on this business.",
      author: "Marcus Chen",
      role: "Founder",
      business: "Northbound Supply Co.",
    },
    {
      id: "summit-air",
      quote:
        "The AI receptionist paid for itself the first weekend. We booked three emergency jobs while I was asleep.",
      author: "Dave Kowalski",
      role: "Owner",
      business: "Summit Air Heating & Cooling",
    },
    {
      id: "casa-verde",
      quote:
        "Tuesdays used to be our dead night. Now people book the chef's table two weeks out. They understood our family's story better than we could tell it.",
      author: "Elena Reyes",
      role: "Co-owner",
      business: "Casa Verde",
    },
  ],

  faq: [
    {
      question: "What's the minimum engagement?",
      answer:
        "90 days for ongoing services. Real results — rankings, optimized campaigns, compounding email revenue — take a full quarter to prove. After that, everything is month-to-month: we keep clients with results, not contracts. One-time projects like websites have no ongoing commitment at all.",
    },
    {
      question: "How fast will we see results?",
      answer:
        "Depends on the channel. Paid ads and automation systems generate leads in the first weeks. Email flows start producing revenue as soon as they're live. SEO and content compound over months. On our first call we'll tell you honestly what to expect and when — and we report against those expectations every month.",
    },
    {
      question: "Do you replace our team or work with them?",
      answer:
        "Whichever helps you more. For most local businesses we are the marketing department. For brands with in-house marketers, we slot in as the senior specialists — running the channels they don't have time to master, and handing over playbooks as we go.",
    },
    {
      question: "Who owns the accounts and the assets?",
      answer:
        "You do, always. Ad accounts, analytics, email lists, the website, every design file — all created under your ownership from day one. If we ever part ways, everything keeps working and you keep everything. No hostage-taking, ever.",
    },
    {
      question: "How does pricing work?",
      answer:
        "Websites and one-time projects are fixed-price — you know the number before we start. Ongoing services are flat monthly retainers based on scope, not a percentage of your ad spend, so our incentive is your results rather than your budget. Every price on this site is real.",
    },
    {
      question: "Do you use AI?",
      answer:
        "We use modern tools to move faster — strategy, quality control, and accountability are always human. AI helps us produce and test more, but nothing ships to your customers without a senior human deciding it's good enough to carry your name.",
    },
  ],

  about: {
    label: "(ABOUT) ©",
    headline: "A studio built like the businesses *we serve.*",
    story: [
      "TemplStudio started with a simple observation: the marketing industry is optimized for agencies, not clients. Long contracts, junior staff behind senior sales calls, reports designed to hide more than they reveal — and business owners left paying for activity instead of outcomes.",
      "So we built the opposite. A small senior team, no layers between you and the people doing the work, pricing that's public, and a rule that every engagement must produce numbers the client can see in their own dashboards — booked jobs, orders, revenue. Not impressions. Not 'brand lift'. Money.",
      "We work with local businesses and ecommerce brands because that's where marketing is most honest: either the phone rings and the orders come in, or they don't. That accountability is why our clients stay — and why almost all of them would refer us.",
    ],
    manifestoLabel: "(WHAT WE BELIEVE) ©",
    values: [
      {
        title: "Outcomes over activity",
        description:
          "Busy isn't a result. Every engagement is measured in booked jobs, orders and revenue — numbers you can point to.",
      },
      {
        title: "Speed is a feature",
        description:
          "Momentum compounds. We ship in days, learn in weeks, and never let 'process' become the product.",
      },
      {
        title: "No jargon, ever",
        description:
          "If your report needs a glossary, we've failed. Plain English, real numbers, honest calls when something isn't working.",
      },
      {
        title: "You own everything",
        description:
          "Your accounts, your data, your website, your creative. We're hired for results, not leverage.",
      },
    ],
    team: [],
    statsLabel: "(THE NUMBERS) ©",
  },

  contact: {
    label: "(CONTACT) ©",
    headline: "Let's make you *unignorable.*",
    subhead:
      "Tell us where your business is and where you want it to be. We'll come back with an honest read on whether we can get you there — and exactly what it would cost.",
    budgetOptions: [
      "Under $1k/mo",
      "$1–3k/mo",
      "$3–5k/mo",
      "$5k+/mo",
      "One-time project",
    ],
    // Swap in your real Formspree form ID (formspree.io → New form) — one-line change.
    formspreeEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
    responseNote: "We reply within 24 hours.",
    form: {
      nameLabel: "Your name",
      namePlaceholder: "Jane Appleseed",
      businessLabel: "Business name",
      businessPlaceholder: "Appleseed & Co.",
      websiteLabel: "Website (if you have one)",
      websitePlaceholder: "yourbusiness.com",
      budgetLabel: "Monthly budget",
      messageLabel: "What are you trying to grow?",
      messagePlaceholder:
        "Tell us about your business, your goals, and what's not working right now…",
      submitLabel: "Send it over",
      successTitle: "Got it — thank you.",
      successMessage: "We'll reply within 24 hours — usually faster.",
      errorMessage:
        "Something went wrong sending the form. Email us directly instead — we answer everything.",
      requiredError: "This one's required.",
      emailNote: "Prefer email?",
    },
  },

  footer: {
    ctaLabel: "(NEXT STEP) ©",
    ctaHeadline: "Let's work *together.*",
    ctaHref: "/contact",
    nav: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    socials: [
      { label: "Instagram", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "X", href: "#" },
    ],
    legal: "© 2026 TemplStudio. All rights reserved.",
  },

  notFound: {
    headline: "Lost?",
    message: "This page doesn't exist — but your customers are still out there.",
    cta: { label: "Back to the studio", href: "/" },
  },

  seo: {
    siteUrl: "https://templstudio.com",
    titleTemplate: "%s — TemplStudio",
    defaultTitle: "TemplStudio — The marketing studio for businesses that want to be unignorable.",
    home: {
      title: "Marketing that turns attention into revenue",
      description:
        "TemplStudio builds websites, ads, and automation systems that turn attention into revenue — for local businesses and ecommerce brands.",
    },
    services: {
      title: "Services & pricing",
      description:
        "Web design, paid advertising, SEO, email & SMS, AI automation, social content and CRO — transparent pricing, senior execution, and you own everything.",
    },
    work: {
      title: "Selected work",
      description:
        "Case studies with numbers our clients can see in their own dashboards — websites, ads, email and automation for local and ecommerce brands.",
    },
    about: {
      title: "About the studio",
      description:
        "A small senior team built on outcomes over activity, speed, plain English, and client ownership of everything we make.",
    },
    contact: {
      title: "Book a call",
      description:
        "Tell us where your business is and where you want it to be. We reply within 24 hours — usually faster.",
    },
  },
};

/* Convenience accessors */
export const featuredWork = site.work.filter((w) => w.featured);

export function getWorkBySlug(slug: string): WorkItem | undefined {
  return site.work.find((w) => w.slug === slug);
}

export function getTestimonialById(id: string): Testimonial | undefined {
  return site.testimonials.find((t) => t.id === id);
}

export function workCategories(): string[] {
  return Array.from(new Set(site.work.map((w) => w.category)));
}
