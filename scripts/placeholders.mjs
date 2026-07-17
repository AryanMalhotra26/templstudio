/**
 * Generates the editorial placeholder artwork in /public/images.
 * Deterministic, palette-locked compositions — swap for real photography
 * by replacing the files or pointing site.ts at new paths.
 *
 * Run: node scripts/placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "images");
mkdirSync(outDir, { recursive: true });

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Arial, sans-serif";

const palettes = {
  ink: {
    bg: "#171511",
    circle: "rgba(139,133,124,0.45)",
    line: "rgba(242,239,233,0.14)",
    disc: "#C4502C",
    stroke: "rgba(242,239,233,0.85)",
    label: "rgba(168,162,154,0.9)",
    wash: "rgba(196,80,44,0.16)",
  },
  ivory: {
    bg: "#EDE8DF",
    circle: "rgba(17,17,16,0.18)",
    line: "rgba(17,17,16,0.12)",
    disc: "#C4502C",
    stroke: "rgba(17,17,16,0.85)",
    label: "rgba(112,106,97,0.95)",
    wash: "rgba(196,80,44,0.10)",
  },
  terra: {
    bg: "#C4502C",
    circle: "rgba(242,239,233,0.35)",
    line: "rgba(242,239,233,0.22)",
    disc: "#171511",
    stroke: "rgba(242,239,233,0.92)",
    label: "rgba(242,239,233,0.85)",
    wash: "rgba(23,21,17,0.18)",
  },
};

const grain = (id) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
    <feComposite operator="over" in2="SourceGraphic"/>
  </filter>`;

function svgShell(w, h, p, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    ${grain("g")}
    <radialGradient id="wash" cx="0.8" cy="0.15" r="1">
      <stop offset="0" stop-color="${p.wash}"/>
      <stop offset="1" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <rect width="${w}" height="${h}" fill="url(#wash)"/>
  ${body}
  <rect width="${w}" height="${h}" filter="url(#g)" opacity="0.05"/>
</svg>`;
}

const label = (x, y, text, p, size = 17) =>
  `<text x="${x}" y="${y}" font-family="${SANS}" font-size="${size}" letter-spacing="3.5" fill="${p.label}">${text}</text>`;

const orbit = (cx, cy, r, p, dash = false) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p.circle}" stroke-width="1.25"${dash ? ` stroke-dasharray="2 7"` : ""}/>`;

const glyph = (cx, cy, r, color) => {
  let petals = "";
  for (let a = 0; a < 360; a += 45) {
    petals += `<line x1="${cx}" y1="${cy}" x2="${cx + r * Math.cos((a * Math.PI) / 180)}" y2="${cy + r * Math.sin((a * Math.PI) / 180)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
  }
  return `<g>${petals}<circle cx="${cx}" cy="${cy}" r="${r * 0.22}" fill="${color}"/></g>`;
};

/* ——— services: 640×800, big outlined numeral ——— */
const serviceOrder = ["ink", "ivory", "terra", "ink", "ivory", "terra", "ink"];
serviceOrder.forEach((key, i) => {
  const p = palettes[key];
  const n = String(i + 1).padStart(2, "0");
  const body = `
  ${orbit(560, 130, 260, p)}
  ${orbit(560, 130, 175, p, true)}
  <line x1="0" y1="668" x2="640" y2="668" stroke="${p.line}" stroke-width="1.25"/>
  <line x1="46" y1="0" x2="46" y2="800" stroke="${p.line}" stroke-width="1.25"/>
  <circle cx="560" cy="130" r="34" fill="${p.disc}"/>
  ${glyph(90, 585, 26, p.disc)}
  ${label(66, 78, `( ${n} ) — TEMPLSTUDIO ©`, p)}
  <text x="60" y="640" font-family="${SERIF}" font-style="italic" font-size="300"
    fill="none" stroke="${p.stroke}" stroke-width="2">${n}</text>`;
  writeFileSync(join(outDir, `service-${n}.svg`), svgShell(640, 800, p, body));
});

/* ——— work covers ——— */
const covers = [
  { file: "cover-golden-hour", w: 1200, h: 1500, p: "ivory", initial: "G", name: "GOLDEN HOUR MED SPA" },
  { file: "cover-northbound", w: 1200, h: 900, p: "terra", initial: "N", name: "NORTHBOUND SUPPLY CO." },
  { file: "cover-summit-air", w: 1200, h: 1500, p: "ink", initial: "S", name: "SUMMIT AIR HEATING & COOLING" },
  { file: "cover-casa-verde", w: 1200, h: 900, p: "ivory", initial: "C", name: "CASA VERDE" },
];
covers.forEach(({ file, w, h, p: key, initial, name }) => {
  const p = palettes[key];
  const cy = h * 0.42;
  const body = `
  ${orbit(w * 0.5, cy, Math.min(w, h) * 0.34, p)}
  ${orbit(w * 0.5, cy, Math.min(w, h) * 0.44, p, true)}
  <line x1="0" y1="${h - 130}" x2="${w}" y2="${h - 130}" stroke="${p.line}" stroke-width="1.5"/>
  <circle cx="${w * 0.5 + Math.min(w, h) * 0.34}" cy="${cy}" r="26" fill="${p.disc}"/>
  ${glyph(w - 110, 108, 30, p.disc)}
  ${label(72, 96, `( WORK ) — TEMPLSTUDIO ©`, p, 20)}
  ${label(72, h - 78, name + " ©", p, 20)}
  <text x="${w * 0.5}" y="${cy + Math.min(w, h) * 0.13}" text-anchor="middle" font-family="${SERIF}" font-style="italic"
    font-size="${Math.min(w, h) * 0.42}" fill="none" stroke="${p.stroke}" stroke-width="2.5">${initial}.</text>`;
  writeFileSync(join(outDir, `${file}.svg`), svgShell(w, h, p, body));
});

/* ——— gallery frames: 1600×1000, three compositions per palette ——— */
const galleries = [
  { slug: "golden-hour", p: "ivory", count: 3, labels: ["BOOKING FLOW", "AD CREATIVE", "TREATMENT PAGES"] },
  { slug: "northbound", p: "terra", count: 2, labels: ["FLOW ARCHITECTURE", "CAMPAIGN DESIGN"] },
  { slug: "summit-air", p: "ink", count: 2, labels: ["AI RECEPTIONIST", "REVIEW ENGINE"] },
  { slug: "casa-verde", p: "ivory", count: 3, labels: ["BRAND IDENTITY", "CONTENT GRID", "CAMPAIGN"] },
];
galleries.forEach(({ slug, p: key, count, labels }) => {
  const p = palettes[key];
  for (let i = 0; i < count; i++) {
    const variant = i % 3;
    let comp = "";
    if (variant === 0) {
      comp = `${orbit(1280, 500, 330, p)}${orbit(1280, 500, 240, p, true)}
        <circle cx="1280" cy="170" r="28" fill="${p.disc}"/>
        <line x1="90" y1="330" x2="900" y2="330" stroke="${p.line}" stroke-width="1.5"/>
        <line x1="90" y1="500" x2="820" y2="500" stroke="${p.line}" stroke-width="1.5"/>
        <line x1="90" y1="670" x2="880" y2="670" stroke="${p.line}" stroke-width="1.5"/>
        ${glyph(150, 830, 30, p.disc)}`;
    } else if (variant === 1) {
      comp = `${orbit(360, 500, 300, p)}${orbit(1240, 500, 300, p, true)}
        <line x1="800" y1="90" x2="800" y2="910" stroke="${p.line}" stroke-width="1.5"/>
        <circle cx="660" cy="500" r="26" fill="${p.disc}"/>
        <circle cx="940" cy="500" r="26" fill="none" stroke="${p.stroke}" stroke-width="2"/>`;
    } else {
      comp = `<line x1="90" y1="260" x2="1510" y2="260" stroke="${p.line}" stroke-width="1.5"/>
        <line x1="90" y1="740" x2="1510" y2="740" stroke="${p.line}" stroke-width="1.5"/>
        ${orbit(800, 500, 210, p)}
        <circle cx="800" cy="500" r="30" fill="${p.disc}"/>
        ${glyph(1450, 170, 30, p.disc)}
        ${glyph(150, 830, 30, p.disc)}`;
    }
    const body = `${comp}
      ${label(90, 120, `( ${String(i + 1).padStart(2, "0")} ) — ${labels[i]} ©`, p, 22)}`;
    writeFileSync(join(outDir, `gallery-${slug}-${i + 1}.svg`), svgShell(1600, 1000, p, body));
  }
});

console.log("placeholder artwork generated in public/images");
