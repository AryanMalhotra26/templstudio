import type { Config } from "tailwindcss";

/**
 * The studio system is driven by the CSS custom properties in globals.css
 * (fluid `--size-font` + the `theme-*` token sets), so Tailwind here only
 * exposes the swatches and the two type families for one-off utilities.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lime: "var(--swatch-lime)",
        turquoise: "var(--swatch-turquoise)",
        black: "var(--swatch-black)",
        "off-white": "var(--swatch-off-white)",
        "dark-grey": "var(--swatch-dark-grey)",
        red: "var(--swatch-red)",
        // Legacy palette — still used by /services, /work, /about, /contact
        // until those pages are moved onto the studio system too.
        ivory: "var(--ivory)",
        "ivory-deep": "var(--ivory-deep)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        terracotta: "var(--terracotta)",
        "terracotta-deep": "var(--terracotta-deep)",
        stone: "var(--stone)",
        "stone-light": "var(--stone-light)",
      },
      borderColor: {
        line: "var(--line)",
        "line-inverse": "var(--line-inverse)",
      },
      fontFamily: {
        editorial: ["var(--font-editorial)", "Times New Roman", "serif"],
        neue: ["var(--font-neue)", "Arial", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-grotesk)", "monospace"],
      },
      maxWidth: {
        site: "1400px",
      },
      transitionTimingFunction: {
        studio: "cubic-bezier(0.19, 1, 0.22, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
