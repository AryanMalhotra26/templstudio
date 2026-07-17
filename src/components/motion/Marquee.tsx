"use client";

interface MarqueeProps {
  items: string[];
  inverted?: boolean;
  glyph?: string;
  durationSeconds?: number;
  /** Tilt the strip a touch for editorial energy. */
  tilt?: boolean;
}

/**
 * Infinite horizontal loop strip — pure CSS transform animation with the
 * content duplicated once (track translates -50%).
 */
export default function Marquee({
  items,
  inverted = false,
  glyph = "©",
  durationSeconds = 28,
  tilt = false,
}: MarqueeProps) {
  const strip = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span className="u-label !text-[13px] md:!text-[15px] whitespace-nowrap px-6 md:px-10">
            {item}
          </span>
          <span
            aria-hidden
            className={inverted ? "text-terracotta" : "text-terracotta"}
          >
            {glyph}
          </span>
        </span>
      ))}
    </div>
  );

  const band = (
    <div
      className={`overflow-hidden border-y py-5 md:py-6 ${
        inverted
          ? "bg-ink text-ivory border-line-inverse"
          : "bg-ivory text-ink border-line"
      } ${tilt ? "-mx-6 -rotate-1 scale-[1.02]" : ""}`}
    >
      <div
        className="marquee-track flex w-max"
        style={{ "--marquee-duration": `${durationSeconds}s` } as React.CSSProperties}
      >
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );

  return tilt ? <div className="overflow-hidden py-4">{band}</div> : band;
}
