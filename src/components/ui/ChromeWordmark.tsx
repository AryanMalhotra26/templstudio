import { home } from "@/content/home";

/**
 * The TemplStudio wordmark, one element per glyph so each letter can be
 * animated independently — the reference does the same thing with twelve
 * separately-rendered 3D chrome letters. Here the metal is faked in CSS
 * (`.chrome-text`) and the studio's spark is drawn as an SVG with the same
 * gradient, which keeps the mark crisp at any size. Drop in rendered
 * PNG/AVIF glyphs later and the animation code doesn't change.
 */

const SPARK_PATH =
  "M16 1.5c.63 0 1.14.5 1.16 1.13l.2 7.3 5.2-5.13a1.16 1.16 0 0 1 1.68 1.6l-4.9 5.4 7.13-.75a1.16 1.16 0 0 1 .3 2.3l-6.95 1.5 6.72 2.42a1.16 1.16 0 0 1-.7 2.2l-6.97-1.9 4.5 5.73a1.16 1.16 0 0 1-1.8 1.44l-4.4-5.86-.87 7.2a1.16 1.16 0 0 1-2.3 0l-.88-7.2-4.4 5.86a1.16 1.16 0 0 1-1.8-1.44l4.5-5.73-6.96 1.9a1.16 1.16 0 0 1-.7-2.2l6.72-2.42-6.95-1.5a1.16 1.16 0 0 1 .3-2.3l7.12.75-4.9-5.4a1.16 1.16 0 0 1 1.7-1.6l5.2 5.13.19-7.3c.02-.63.53-1.13 1.16-1.13Z";

export default function ChromeWordmark({
  className,
  itemClassName,
  /** Must be unique per instance: the SVG gradient is referenced by id. */
  idPrefix,
}: {
  className: string;
  itemClassName: string;
  idPrefix: string;
}) {
  const gradientId = `${idPrefix}-chrome`;

  return (
    <div className={className} role="img" aria-label={home.hero.wordmarkLabel}>
      {home.hero.wordmark.map((glyph, i) =>
        i === home.hero.glyphIndex ? (
          <span key={`glyph-${i}`} aria-hidden className={`${itemClassName} is-glyph`}>
            <svg viewBox="0 0 32 32" height="100%" aria-hidden>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0.1" y2="1">
                  <stop offset="0" stopColor="#6f747c" />
                  <stop offset="0.08" stopColor="#c9cdd2" />
                  <stop offset="0.2" stopColor="#ffffff" />
                  <stop offset="0.34" stopColor="#8f949c" />
                  <stop offset="0.44" stopColor="#55595f" />
                  <stop offset="0.56" stopColor="#e8ebee" />
                  <stop offset="0.66" stopColor="#ffffff" />
                  <stop offset="0.78" stopColor="#9aa0a8" />
                  <stop offset="0.9" stopColor="#d7dbe0" />
                  <stop offset="1" stopColor="#7d828a" />
                </linearGradient>
              </defs>
              <path d={SPARK_PATH} fill={`url(#${gradientId})`} />
            </svg>
          </span>
        ) : (
          <span
            key={`${glyph}-${i}`}
            aria-hidden
            className={`${itemClassName} chrome-text`}
          >
            {glyph}
          </span>
        )
      )}
    </div>
  );
}
