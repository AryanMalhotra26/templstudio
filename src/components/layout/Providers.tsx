"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import LenisProvider from "@/components/motion/LenisProvider";

/**
 * Global motion policy: `reducedMotion="user"` makes every Framer Motion
 * animation site-wide honor prefers-reduced-motion (transforms disabled,
 * opacity fades kept) — declared once, applied everywhere.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LenisProvider>{children}</LenisProvider>
    </MotionConfig>
  );
}
