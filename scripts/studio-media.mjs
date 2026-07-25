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

const LIME = "#ecfdad";
const TURQUOISE = "#3fae86";

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
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset="0.16" stop-color="#dfe3e8"/>
    <stop offset="0.34" stop-color="#9aa0a8"/>
    <stop offset="0.46" stop-color="#4e5359"/>
    <stop offset="0.55" stop-color="#8d939b"/>
    <stop offset="0.64" stop-color="#f4f6f8"/>
    <stop offset="0.78" stop-color="#ffffff"/>
    <stop offset="0.9" stop-color="#a6acb4"/>
    <stop offset="1" stop-color="#6d727a"/>
  </linearGradient>
  <radialGradient id="spec" cx="0.34" cy="0.24" r="0.5">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>
  <filter id="lift" x="-25%" y="-25%" width="150%" height="150%">
    <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#181818" flood-opacity="0.35"/>
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
      <rect x="196" y="74" width="120" height="104" rx="10" fill="#2b2b2b" fill-opacity="0.65" stroke="none"/>
      <g fill="#2b2b2b" fill-opacity="0.45" stroke="none">
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
      <g fill="#2b2b2b" fill-opacity="0.6" stroke="none">
        <ellipse cx="188" cy="212" rx="22" ry="30"/>
        <ellipse cx="324" cy="212" rx="22" ry="30"/>
      </g>
      <path d="M158 306c26 52 56 78 98 78s72-26 98-78" fill="none" stroke="#2b2b2b" stroke-opacity="0.6" stroke-width="26" stroke-linecap="round"/>`
);

chromeObject(
  "quote",
  `      <path d="M126 300c-38 0-66-28-66-68 0-58 44-110 108-136l20 40c-34 16-56 40-58 62 32 2 58 28 58 62 0 22-26 40-62 40Z"/>
      <path d="M330 300c-38 0-66-28-66-68 0-58 44-110 108-136l20 40c-34 16-56 40-58 62 32 2 58 28 58 62 0 22-26 40-62 40Z"/>`
);

/* --------------------------------------------------------- photo stand-ins */

/**
 * An abstract "shoot in progress" frame: a lit backdrop, a soft window of key
 * light, a floor, a seated/standing subject mass and a lens bloom, in the
 * studio palette. Deliberately non-representational — it reads as
 * "photograph goes here" without pretending to be a photo of a real person,
 * but carries enough tonal range to sit under white and lime type.
 */
function photo(file, w, h, seed, { accent = LIME, tone = "dark" } = {}) {
  const r = rng(seed);
  const ramp = {
    dark: ["#8d918a", "#4c5049", "#1e201c"],
    warm: ["#a98f6f", "#6b573e", "#241c13"],
    cool: ["#6f8f86", "#3b544d", "#141d1a"],
  }[tone];

  const min = Math.min(w, h);

  // Key light: a bright soft-box, offset from centre.
  const keyX = (0.18 + r() * 0.5) * w;
  const keyY = (0.1 + r() * 0.3) * h;
  const keyR = (0.35 + r() * 0.3) * min;

  // Horizon / floor line.
  const floorY = h * (0.6 + r() * 0.16);

  // Subject mass. Low contrast on purpose, so it reads as a body in shadow
  // rather than an avatar icon. Portrait crops fill the frame the way a
  // photographed subject would; landscape frames get a smaller, off-centre
  // figure so the plate stays usable as a full-bleed background.
  const portrait = h >= w;
  const subW = portrait ? w * (1.15 + r() * 0.4) : w * (0.3 + r() * 0.12);
  const subX = w * (portrait ? 0.5 + (r() - 0.5) * 0.3 : 0.22 + r() * 0.56);
  const headR = portrait ? min * (0.15 + r() * 0.05) : min * (0.07 + r() * 0.03);
  const headY = portrait ? h * (0.3 + r() * 0.14) : h * (0.42 + r() * 0.12);

  // A second, smaller light for depth, plus one accent kiss.
  const rimX = (0.6 + r() * 0.35) * w;
  const rimY = (0.25 + r() * 0.4) * h;
  const grainAngle = (-14 + r() * 28).toFixed(1);
  const step = Math.round(min / 11);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0" stop-color="${ramp[0]}"/>
      <stop offset="0.55" stop-color="${ramp[1]}"/>
      <stop offset="1" stop-color="${ramp[2]}"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.5"/>
    </linearGradient>
    <radialGradient id="key">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.62"/>
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="rim">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="kiss">
      <stop offset="0" stop-color="${TURQUOISE}" stop-opacity="0.3"/>
      <stop offset="1" stop-color="${TURQUOISE}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="subject" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.24"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.5"/>
    </linearGradient>
    <linearGradient id="vig" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.2"/>
      <stop offset="0.42" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.34"/>
    </linearGradient>
    <pattern id="grain" width="${step}" height="${step}" patternUnits="userSpaceOnUse" patternTransform="rotate(${grainAngle})">
      <path d="M0 0H${step}M0 0V${step}" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#wall)"/>
  <circle cx="${keyX.toFixed(0)}" cy="${keyY.toFixed(0)}" r="${keyR.toFixed(0)}" fill="url(#key)"/>
  <circle cx="${rimX.toFixed(0)}" cy="${rimY.toFixed(0)}" r="${(keyR * 0.7).toFixed(0)}" fill="url(#rim)"/>
  <circle cx="${(w - keyX).toFixed(0)}" cy="${(h * 0.78).toFixed(0)}" r="${(keyR * 0.55).toFixed(0)}" fill="url(#kiss)"/>
  <rect y="${floorY.toFixed(0)}" width="${w}" height="${(h - floorY).toFixed(0)}" fill="url(#floor)"/>
  <path d="M0 ${floorY.toFixed(0)}H${w}" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5"/>

  <g fill="url(#subject)"${portrait ? "" : ' opacity="0.35"'}>
    <ellipse cx="${subX.toFixed(0)}" cy="${headY.toFixed(0)}" rx="${headR.toFixed(0)}" ry="${(headR * 1.22).toFixed(0)}"/>
    <path d="M${(subX - subW / 2).toFixed(0)} ${h}
             C${(subX - subW / 2).toFixed(0)} ${(headY + headR * 1.5).toFixed(0)}
              ${(subX - headR * 1.35).toFixed(0)} ${(headY + headR * 1.5).toFixed(0)}
              ${subX.toFixed(0)} ${(headY + headR * 1.42).toFixed(0)}
             C${(subX + headR * 1.35).toFixed(0)} ${(headY + headR * 1.5).toFixed(0)}
              ${(subX + subW / 2).toFixed(0)} ${(headY + headR * 1.5).toFixed(0)}
              ${(subX + subW / 2).toFixed(0)} ${h}Z"/>
  </g>

  <rect width="${w}" height="${h}" fill="url(#grain)"/>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
</svg>
`;
  writeFileSync(join(mediaDir, file), svg);
}

/** Round portrait stand-in for a named person. */
function avatar(file, seed, initials) {
  const r = rng(seed);
  const hue = Math.round(r() * 60) + 20;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <defs>
    <linearGradient id="a" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 12% 30%)"/>
      <stop offset="1" stop-color="hsl(${hue} 14% 16%)"/>
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

/* Avatars */
avatar("avatar-golden-hour.svg", 311, "PS");
avatar("avatar-northbound.svg", 407, "MC");
avatar("avatar-summit-air.svg", 503, "DK");
avatar("avatar-casa-verde.svg", 601, "ER");

console.log("Wrote placeholder media to public/media");
