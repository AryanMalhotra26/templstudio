"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Route-change curtain: an ink panel covers the viewport with the wordmark
 * briefly centered, then wipes up to reveal the page. Rendered from
 * template.tsx so it re-mounts on every navigation.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        aria-hidden
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-ink"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -8] }}
          transition={{ duration: 0.5, times: [0, 0.3, 0.7, 1] }}
          className="font-display text-2xl tracking-tight text-ivory md:text-3xl"
        >
          {site.brand.name}
          <span className="text-terracotta">.</span>
        </motion.span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </>
  );
}
