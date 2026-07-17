"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import Button from "@/components/ui/Button";

/** Full-viewport, type-only hero: label → headline → ruled grid row. */
export default function Hero() {
  const { hero, brand } = site;

  return (
    <section className="flex min-h-[100svh] flex-col justify-between bg-ivory">
      <div className="mx-auto flex w-full max-w-site flex-1 flex-col justify-center px-6 pt-28 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="u-label text-terracotta"
        >
          {hero.label}
        </motion.p>

        <RevealText
          text={hero.headline}
          as="h1"
          delay={0.2}
          className="mt-6 max-w-[13ch] font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.98] tracking-[-0.02em] text-ink"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-12 grid gap-8 border-t u-hairline pt-8 md:mt-16 md:grid-cols-12 md:items-center md:gap-10"
        >
          <p className="max-w-xl text-lg text-stone md:col-span-7 md:text-xl">
            {hero.subhead}
          </p>
          <div className="flex flex-wrap items-center gap-4 md:col-span-5 md:justify-end">
            <Button href={hero.primaryCta.href} variant="primary">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Bottom strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.75 }}
        className="border-t u-hairline"
      >
        <div className="mx-auto flex max-w-site items-center justify-between px-6 py-4 md:px-10">
          <p className="u-label text-stone">
            {brand.location} — EST. {brand.est}
          </p>
          <p className="u-label text-stone">{hero.scrollHint}</p>
        </div>
      </motion.div>
    </section>
  );
}
