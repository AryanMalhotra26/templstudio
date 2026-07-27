/**
 * Generates every placeholder asset the homepage needs into /public/media.
 *
 * Two families:
 *   1. chrome/*.svg — the liquid-metal objects (the reference uses rendered 3D
 *      chrome emoji): a bevelled fill, a specular sheen and a rim light.
 *   2. photography stand-ins — abstract editorial frames in the studio palette
 *      at the exact aspect ratios the layout expects, so swapping in real
 *      photos never shifts the design.
 *
 * Deterministic: same input, same bytes. Run: node scripts/studio-media.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mediaDir = join(root, "public", "media");
const chromeDir = join(mediaDir, "chrome");
mkdirSync(chromeDir, { recursive: true });

/* Palette: Antique Gold / Sage Green, matching --swatch-lime and
   --swatch-turquoise in globals.css. Names kept so the generator reads the
   same as the stylesheet it has to agree with. */
const LIME = "#ba9b5f";
const TURQUOISE = "#5e775e";
const ALABASTER = "#e9e0cf";

/* Small deterministic PRNG so every run produces identical files. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ---------------------------------------------------------------- chrome */

const CHROME_DEFS = `
  <linearGradient id="sheen" x1="0" y1="0" x2="0.15" y2="1">
    <stop offset="0" stop-color="#fdf9f0"/>
    <stop offset="0.16" stop-color="#e2d2a6"/>
    <stop offset="0.34" stop-color="#b39a63"/>
    <stop offset="0.46" stop-color="#6b5730"/>
    <stop offset="0.55" stop-color="#a98d54"/>
    <stop offset="0.64" stop-color="#f6efdd"/>
    <stop offset="0.78" stop-color="#fdf9f0"/>
    <stop offset="0.9" stop-color="#c0a86f"/>
    <stop offset="1" stop-color="#857046"/>
  </linearGradient>
  <radialGradient id="spec" cx="0.34" cy="0.24" r="0.5">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>
  <filter id="lift" x="-25%" y="-25%" width="150%" height="150%">
    <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#132b23" flood-opacity="0.35"/>
  </filter>
`;

/** Wraps one or more shapes in the chrome treatment. */
function chromeObject(name, body, { viewBox = "0 0 512 512" } = {}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="512" height="512">
  <defs>${CHROME_DEFS}</defs>
  <g filter="url(#lift)">
    <g fill="url(#sheen)" stroke="#ffffff" stroke-opacity="0.55" stroke-width="3">
${body}
    </g>
  </g>
</svg>
`;
  writeFileSync(join(chromeDir, `${name}.svg`), svg);
}

/** Concave many-pointed spark, built from quadratics. */
function sparkPath(points = 8, outer = 232, inner = 66, cx = 256, cy = 256) {
  const step = Math.PI / points;
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const a = i * step - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) d += `M${x.toFixed(1)} ${y.toFixed(1)}`;
    else {
      const ca = a - step / 2;
      const cr = i % 2 === 0 ? inner * 1.15 : inner * 1.15;
      const qx = cx + Math.cos(ca) * cr;
      const qy = cy + Math.sin(ca) * cr;
      d += `Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  return d + "Z";
}

chromeObject("spark", `      <path d="${sparkPath()}"/>`);

chromeObject(
  "heart",
  `      <path d="M256 452C256 452 60 334 60 202c0-60 45-102 98-102 39 0 74 23 98 58 24-35 59-58 98-58 53 0 98 42 98 102 0 132-196 250-196 250Z"/>`
);

chromeObject(
  "flame",
  `      <path d="M256 44c58 68 148 128 148 232 0 82-66 148-148 148s-148-66-148-148c0-58 29-100 58-138 12 39 33 57 49 57 25 0 33-29 23-70-8-33-4-63 18-81Z"/>
      <path d="M256 236c26 30 62 56 62 100 0 36-28 64-62 64s-62-28-62-64c0-26 14-44 26-60 6 18 15 26 23 26 12 0 16-14 11-32-4-15-2-27 2-34Z" fill="#ffffff" fill-opacity="0.35" stroke="none"/>`
);

chromeObject(
  "bolt",
  `      <path d="M304 28 128 292h104l-40 194 196-286H278l26-172Z"/>`
);

chromeObject(
  "mic",
  `      <path d="M256 56c-39 0-70 31-70 70v98c0 39 31 70 70 70s70-31 70-70v-98c0-39-31-70-70-70Z"/>
      <path d="M148 206v20c0 60 48 108 108 108s108-48 108-108v-20" fill="none" stroke="url(#sheen)" stroke-width="26" stroke-linecap="round"/>
      <path d="M256 334v80" fill="none" stroke="url(#sheen)" stroke-width="26" stroke-linecap="round"/>
      <path d="M188 452h136" fill="none" stroke="url(#sheen)" stroke-width="26" stroke-linecap="round"/>`
);

chromeObject(
  "phone",
  `      <rect x="168" y="34" width="176" height="444" rx="28"/>
      <rect x="196" y="74" width="120" height="104" rx="10" fill="#132b23" fill-opacity="0.65" stroke="none"/>
      <g fill="#132b23" fill-opacity="0.45" stroke="none">
        <rect x="200" y="204" width="112" height="18" rx="9"/>
        <rect x="200" y="242" width="34" height="18" rx="9"/>
        <rect x="239" y="242" width="34" height="18" rx="9"/>
        <rect x="278" y="242" width="34" height="18" rx="9"/>
        <rect x="200" y="280" width="34" height="18" rx="9"/>
        <rect x="239" y="280" width="34" height="18" rx="9"/>
        <rect x="278" y="280" width="34" height="18" rx="9"/>
        <rect x="200" y="318" width="34" height="18" rx="9"/>
        <rect x="239" y="318" width="34" height="18" rx="9"/>
        <rect x="278" y="318" width="34" height="18" rx="9"/>
        <rect x="200" y="356" width="34" height="18" rx="9"/>
        <rect x="239" y="356" width="34" height="18" rx="9"/>
        <rect x="278" y="356" width="34" height="18" rx="9"/>
      </g>`
);

chromeObject(
  "envelope",
  `      <rect x="62" y="132" width="388" height="248" rx="20"/>
      <path d="M62 152 256 300 450 152" fill="none" stroke="url(#sheen)" stroke-width="26" stroke-linejoin="round"/>
      <path d="M256 246c-22-22-14-56 14-56 14 0 24 9 28 20 4-11 14-20 28-20 28 0 36 34 14 56l-42 40Z" fill="#ffffff" fill-opacity="0.4" stroke="none"/>`
);

chromeObject(
  "smile",
  `      <circle cx="256" cy="256" r="204"/>
      <g fill="#132b23" fill-opacity="0.6" stroke="none">
        <ellipse cx="188" cy="212" rx="22" ry="30"/>
        <ellipse cx="324" cy="212" rx="22" ry="30"/>
      </g>
      <path d="M158 306c26 52 56 78 98 78s72-26 98-78" fill="none" stroke="#132b23" stroke-opacity="0.6" stroke-width="26" stroke-linecap="round"/>`
);

chromeObject(
  "quote",
  `      <path d="M126 300c-38 0-66-28-66-68 0-58 44-110 108-136l20 40c-34 16-56 40-58 62 32 2 58 28 58 62 0 22-26 40-62 40Z"/>
      <path d="M330 300c-38 0-66-28-66-68 0-58 44-110 108-136l20 40c-34 16-56 40-58 62 32 2 58 28 58 62 0 22-26 40-62 40Z"/>`
);

/* --------------------------------------------------------- photo stand-ins */

/**
 * Editorial art placeholders.
 *
 * The earlier version was a soft gradient with a faint blob in it, which read
 * as "image failed to load". These are deliberately *designed* frames instead:
 * a backlit silhouette against a duotone wash, a halftone dot field for
 * photographic texture, an off-frame geometric arc, film grain and a vignette.
 * `kind: "frame"` adds contact-sheet furniture (crop marks + an index), which
 * makes a wall of them read as a shoot contact sheet rather than as missing
 * assets.
 *
 * Swapping in real photography is still a one-line change per entry in
 * src/content — nothing downstream cares.
 */

const DUOTONES = [
  { a: LIME, b: TURQUOISE, bg: ["#0f2019", "#1b3a2f"] },
  { a: TURQUOISE, b: LIME, bg: ["#0d1c17", "#18332a"] },
  { a: ALABASTER, b: LIME, bg: ["#132b23", "#1f4034"] },
  { a: LIME, b: ALABASTER, bg: ["#112620", "#0c1a15"] },
  { a: TURQUOISE, b: ALABASTER, bg: ["#0f231c", "#1b3a2f"] },
];

function art(file, w, h, seed, { kind = "frame", pair = 0, index = null } = {}) {
  const r = rng(seed);
  const P = DUOTONES[pair % DUOTONES.length];
  const min = Math.min(w, h);
  const id = `a${seed}`;

  /* Key light behind the subject — this is what makes it read as backlit. */
  const keyX = (0.3 + r() * 0.4) * w;
  const keyY = (0.22 + r() * 0.26) * h;
  const keyR = (0.42 + r() * 0.26) * min;

  /* Second, cooler wash pushed to a corner. */
  const washX = (r() < 0.5 ? 0.12 : 0.88) * w;
  const washY = (0.55 + r() * 0.4) * h;
  const washR = (0.4 + r() * 0.3) * min;

  /* Subject: head + shoulders, cropped by the frame bottom. */
  const headR = min * (kind === "wide" ? 0.1 : 0.15) * (0.9 + r() * 0.25);
  const cx = w * (0.5 + (r() - 0.5) * (kind === "wide" ? 0.5 : 0.3));
  const cy = h * (kind === "wide" ? 0.52 : 0.44) + headR * (r() - 0.5) * 0.4;
  const shoulder = headR * (2.5 + r() * 0.7);
  const rim = r() < 0.5 ? -1 : 1;

  /* Off-frame arc. */
  const arcR = min * (0.55 + r() * 0.4);
  const arcX = (r() < 0.5 ? -0.1 : 1.1) * w;
  const arcY = (0.2 + r() * 0.6) * h;

  const dot = Math.max(6, Math.round(min / 90));
  const grainSeed = (seed % 97) + 1;

  const marks =
    kind !== "frame"
      ? ""
      : `
  <g stroke="#e9e0cf" stroke-opacity="0.4" stroke-width="${Math.max(1, min / 340)}" fill="none">
    <path d="M${dot * 2} ${dot * 4}V${dot * 2}H${dot * 4}"/>
    <path d="M${w - dot * 4} ${dot * 2}H${w - dot * 2}V${dot * 4}"/>
    <path d="M${dot * 2} ${h - dot * 4}V${h - dot * 2}H${dot * 4}"/>
    <path d="M${w - dot * 4} ${h - dot * 2}H${w - dot * 2}V${h - dot * 4}"/>
  </g>${
    index === null
      ? ""
      : `
  <text x="${dot * 2}" y="${h - dot * 2.2}" font-family="'Helvetica Neue', Arial, sans-serif" font-size="${Math.round(min / 26)}" letter-spacing="${(min / 400).toFixed(1)}" fill="#e9e0cf" fill-opacity="0.55">${String(index).padStart(2, "0")}</text>`
  }`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="${id}bg" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${P.bg[1]}"/>
      <stop offset="1" stop-color="${P.bg[0]}"/>
    </linearGradient>
    <radialGradient id="${id}key">
      <stop offset="0" stop-color="${P.a}" stop-opacity="0.85"/>
      <stop offset="0.45" stop-color="${P.a}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${P.a}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}wash">
      <stop offset="0" stop-color="${P.b}" stop-opacity="0.4"/>
      <stop offset="1" stop-color="${P.b}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}dotmask">
      <stop offset="0" stop-color="#fff" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="${id}dm">
      <rect width="${w}" height="${h}" fill="url(#${id}dotmask)"/>
    </mask>
    <pattern id="${id}dots" width="${dot}" height="${dot}" patternUnits="userSpaceOnUse">
      <circle cx="${dot / 2}" cy="${dot / 2}" r="${(dot * 0.17).toFixed(2)}" fill="${P.a}" fill-opacity="0.5"/>
    </pattern>
    <linearGradient id="${id}vig" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.4"/>
      <stop offset="0.45" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.55"/>
    </linearGradient>
    <filter id="${id}grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${grainSeed}" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#${id}bg)"/>
  <circle cx="${keyX.toFixed(0)}" cy="${keyY.toFixed(0)}" r="${keyR.toFixed(0)}" fill="url(#${id}key)"/>
  <circle cx="${washX.toFixed(0)}" cy="${washY.toFixed(0)}" r="${washR.toFixed(0)}" fill="url(#${id}wash)"/>
  <g mask="url(#${id}dm)">
    <rect width="${w}" height="${h}" fill="url(#${id}dots)"/>
  </g>
  <circle cx="${arcX.toFixed(0)}" cy="${arcY.toFixed(0)}" r="${arcR.toFixed(0)}" fill="none"
          stroke="${P.b}" stroke-opacity="0.35" stroke-width="${Math.max(1.5, min / 300).toFixed(1)}"/>

  <g>
    <path d="M${(cx - shoulder).toFixed(0)} ${h}
             C${(cx - shoulder).toFixed(0)} ${(cy + headR * 2.1).toFixed(0)}
              ${(cx - headR * 1.45).toFixed(0)} ${(cy + headR * 1.5).toFixed(0)}
              ${cx.toFixed(0)} ${(cy + headR * 1.42).toFixed(0)}
             C${(cx + headR * 1.45).toFixed(0)} ${(cy + headR * 1.5).toFixed(0)}
              ${(cx + shoulder).toFixed(0)} ${(cy + headR * 2.1).toFixed(0)}
              ${(cx + shoulder).toFixed(0)} ${h}Z" fill="#08130f" fill-opacity="0.9"/>
    <ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${headR.toFixed(0)}" ry="${(headR * 1.16).toFixed(0)}" fill="#08130f" fill-opacity="0.9"/>
    <path d="M${(cx + rim * headR * 0.92).toFixed(0)} ${(cy - headR * 0.72).toFixed(0)}
             A${headR.toFixed(0)} ${(headR * 1.16).toFixed(0)} 0 0 ${rim > 0 ? 1 : 0} ${(cx + rim * headR * 0.62).toFixed(0)} ${(cy + headR * 0.98).toFixed(0)}"
          fill="none" stroke="${P.a}" stroke-opacity="0.8" stroke-width="${Math.max(1.5, headR * 0.055).toFixed(1)}" stroke-linecap="round"/>
  </g>

  <rect width="${w}" height="${h}" fill="url(#${id}vig)"/>
  <g opacity="0.14" filter="url(#${id}grain)">
    <rect width="${w}" height="${h}"/>
  </g>${marks}
</svg>
`;
  writeFileSync(join(mediaDir, file), svg);
}

/* Kept as the entry point the rest of the script already calls. */
function photo(file, w, h, seed, opts = {}) {
  const { tone = "dark", kind, index } = opts;
  const pair = { dark: 0, warm: 2, cool: 1 }[tone] ?? 0;
  art(file, w, h, seed, {
    kind: kind ?? (h > w * 1.15 ? "portrait" : "wide"),
    pair: (pair + (seed % 3)) % DUOTONES.length,
    index: index ?? null,
  });
}


/** Round portrait stand-in for a named person. */
function avatar(file, seed, initials) {
  const r = rng(seed);
  const hue = Math.round(r() * 30) + 140; /* forest range */
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <defs>
    <linearGradient id="a" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 14% 26%)"/>
      <stop offset="1" stop-color="hsl(${hue} 16% 13%)"/>
    </linearGradient>
  </defs>
  <rect width="240" height="240" fill="url(#a)"/>
  <circle cx="120" cy="96" r="42" fill="#ffffff" fill-opacity="0.18"/>
  <path d="M28 240c0-52 41-84 92-84s92 32 92 84Z" fill="#ffffff" fill-opacity="0.14"/>
  <text x="120" y="214" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="#ffffff" fill-opacity="0.5">${initials}</text>
</svg>
`;
  writeFileSync(join(mediaDir, file), svg);
}

/* Hero rising cards — 4:5 */
for (let i = 1; i <= 7; i++) {
  photo(`hero-float-${i}.svg`, 640, 800, 1000 + i * 37, {
    tone: i % 3 === 0 ? "warm" : i % 3 === 1 ? "dark" : "cool",
  });
}

/* Section backgrounds — 16:9 */
photo("bg-statement.svg", 1920, 1080, 4201, { tone: "dark" });
photo("bg-about.svg", 1920, 1080, 4507, { tone: "warm" });

/* Client reels — 9:16 */
const reelSlugs = ["golden-hour", "northbound", "summit-air", "casa-verde"];
reelSlugs.forEach((slug, s) => {
  for (let i = 1; i <= 3; i++) {
    photo(`reel-${slug}-${i}.svg`, 720, 1280, 7000 + s * 91 + i * 13, {
      tone: ["dark", "warm", "cool"][(s + i) % 3],
    });
  }
});

/* Service card videos — 9:16 */
["websites", "ads", "automation"].forEach((slug, i) => {
  photo(`service-${slug}.svg`, 720, 1280, 8100 + i * 57, {
    tone: ["dark", "cool", "warm"][i],
  });
});

/* About tilted photos — 4:5.5 */
photo("about-1.svg", 640, 880, 9301, { tone: "cool" });
photo("about-2.svg", 640, 880, 9407, { tone: "warm" });

/* ---- Story page ---- */
/* Hero inline image — 3:2 */
photo("story-hero.svg", 960, 640, 12007, { tone: "warm" });
/* Hero background cards — 4:5, same box as the homepage's rising media */
photo("story-bg-1.svg", 640, 800, 12103, { tone: "cool" });
photo("story-bg-2.svg", 640, 800, 12211, { tone: "dark" });
/* Founder portraits — 2:3 */
photo("founder-1.svg", 640, 960, 12301, { tone: "dark" });
photo("founder-2.svg", 640, 960, 12409, { tone: "warm" });
/* Chapter frames — 3:4. One pool, cycled by the flipbooks and mouse trails.
   Contact-sheet furniture (crop marks + index) so a wall of them reads as a
   shoot rather than as ten identical placeholders. */
for (let i = 1; i <= 10; i++) {
  photo(`story-frame-${i}.svg`, 720, 960, 12500 + i * 71, {
    tone: ["dark", "warm", "cool"][i % 3],
    kind: "frame",
    index: i,
  });
}

/* ---- Work index ----
   Two crops per case: the tall plate that flies in on hover, and the small
   square that pops next to the client name. */
["golden-hour", "northbound", "summit-air", "casa-verde"].forEach((slug, i) => {
  photo(`work-${slug}-tall.svg`, 640, 960, 14100 + i * 83, {
    tone: ["dark", "warm", "cool"][i % 3],
    kind: "frame",
    index: i + 1,
  });
  photo(`work-${slug}-sq.svg`, 600, 600, 14500 + i * 97, {
    tone: ["cool", "dark", "warm"][i % 3],
    kind: "portrait",
  });
});

/* ---- Services page ----
   One 4:5 plate per service. Contact-sheet furniture again, for the same
   reason as the story frames: seven stacked panels each carrying an abstract
   plate would otherwise read as seven identical missing images. */
for (let i = 1; i <= 7; i++) {
  photo(`service-plate-${i}.svg`, 640, 800, 16100 + i * 67, {
    tone: ["dark", "cool", "warm"][i % 3],
    kind: "frame",
    index: i,
  });
}

/* Avatars */
avatar("avatar-golden-hour.svg", 311, "PS");
avatar("avatar-northbound.svg", 407, "MC");
avatar("avatar-summit-air.svg", 503, "DK");
avatar("avatar-casa-verde.svg", 601, "ER");

console.log("Wrote placeholder media to public/media");
