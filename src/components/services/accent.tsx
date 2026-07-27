import { Fragment, type ReactNode } from "react";

/**
 * Renders the content system's `*asterisk*` accents as emphasis in the *same*
 * family — Instrument Serif has a real italic, so the accent word reads as a
 * deliberate stress rather than a second typeface dropped into the line.
 *
 * Deliberately plain markup: no SplitText, no `dangerouslySetInnerHTML`. The
 * site-wide `MaskTextReveal` already splits and masks every heading and
 * paragraph, and a second SplitText over the same node is what left the old
 * services hero parked outside its own mask, permanently invisible.
 */
export function accent(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
      <em className="is-accent" key={i}>
        {part.slice(1, -1)}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
