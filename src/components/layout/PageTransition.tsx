"use client";

import { usePathname } from "next/navigation";
import { home } from "@/content/home";

/**
 * Route-change curtain: a lime plate with the wordmark briefly centred, which
 * wipes up to reveal the page. Rendered from template.tsx, so it re-mounts on
 * every navigation; `key` on the pathname guarantees the animation replays.
 *
 * Deliberately CSS-driven rather than JS-driven — a full-screen curtain that
 * needs a frame loop to get out of the way is the one element that can leave
 * the whole site blank if scripting stalls. It's the same lime as the hero's
 * own page-load plate, so on first load the two read as one reveal.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <div key={pathname} aria-hidden className="page-curtain">
        <span className="page-curtain__mark chrome-text">
          {home.hero.wordmarkLabel.toLowerCase()}
        </span>
      </div>
      {children}
    </>
  );
}
