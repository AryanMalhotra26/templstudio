import RevealText from "@/components/motion/RevealText";
import FadeUp from "@/components/motion/FadeUp";

interface SectionHeaderProps {
  label: string;
  headline?: string;
  lede?: string;
  meta?: string;
  tone?: "light" | "dark";
}

/**
 * The shared editorial section header: a full-width hairline rule with the
 * mono index label (and optional right-aligned meta), then the headline on
 * a 12-column grid with the supporting lede bottom-aligned in the right
 * column. Keeps every section opening on the same structural rhythm.
 */
export default function SectionHeader({
  label,
  headline,
  lede,
  meta,
  tone = "light",
}: SectionHeaderProps) {
  const dark = tone === "dark";

  return (
    <header>
      <FadeUp>
        <div
          className={`flex items-baseline justify-between gap-6 border-t pt-5 ${
            dark ? "u-hairline-inverse" : "u-hairline"
          }`}
        >
          <p className="u-label text-terracotta">{label}</p>
          {meta && (
            <p className={`u-label ${dark ? "text-stone-light" : "text-stone"}`}>
              {meta}
            </p>
          )}
        </div>
      </FadeUp>

      {headline && (
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end md:gap-10">
          <RevealText
            text={headline}
            as="h2"
            className={`font-display text-[clamp(2rem,4.5vw,4.25rem)] leading-[1.05] tracking-[-0.02em] md:col-span-8 ${
              dark ? "text-ivory" : "text-ink"
            }`}
          />
          {lede && (
            <FadeUp delay={0.15} className="md:col-span-4 md:justify-self-end">
              <p
                className={`max-w-sm text-base ${
                  dark ? "text-stone-light" : "text-stone"
                }`}
              >
                {lede}
              </p>
            </FadeUp>
          )}
        </div>
      )}
    </header>
  );
}
