"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import Button from "@/components/ui/Button";

/** Full-viewport, type-only hero on ivory with a rotating type-ring badge. */
export default function Hero() {
  const { hero, brand } = site;

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-ivory">
      {/* warm wash, top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(196,80,44,0.14) 0%, rgba(196,80,44,0) 65%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-site flex-1 items-center px-6 pt-28 md:px-10">
        <div className="w-full">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="u-label text-terracotta"
          >
            {hero.label}
          </motion.p>

          <RevealText
            text={hero.headline}
            as="h1"
            delay={0.3}
            className="mt-6 max-w-[12ch] font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.98] tracking-[-0.02em] text-ink"
          />

          <div className="mt-10 flex flex-wrap items-end justify-between gap-10">
            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="text-lg text-stone md:text-xl"
              >
                {hero.subhead}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Button href={hero.primaryCta.href} variant="primary">
                  {hero.primaryCta.label}
                </Button>
                <Button href={hero.secondaryCta.href} variant="ghost">
                  {hero.secondaryCta.label}
                </Button>
              </motion.div>
            </div>

            {/* rotating type-ring badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="relative mr-4 hidden h-40 w-40 shrink-0 md:block lg:h-44 lg:w-44"
            >
              <svg
                viewBox="0 0 200 200"
                className="u-spin-slow h-full w-full text-ink"
                aria-hidden
              >
                <defs>
                  <path
                    id="badge-circle"
                    d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0"
                  />
                </defs>
                <text
                  fontSize="13.5"
                  letterSpacing="3.2"
                  fill="currentColor"
                  style={{ fontFamily: "var(--font-grotesk), monospace" }}
                >
                  <textPath href="#badge-circle">{hero.badge}</textPath>
                </text>
              </svg>
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center font-display text-4xl italic text-terracotta"
              >
                ✺
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.05 }}
        className="relative border-t u-hairline"
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
