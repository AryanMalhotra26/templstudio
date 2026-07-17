import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-grotesk)", "monospace"],
      },
      maxWidth: {
        site: "1400px",
      },
      transitionTimingFunction: {
        studio: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
