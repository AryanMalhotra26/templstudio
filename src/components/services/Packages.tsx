"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { site, type PackageSegment } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import FadeUp from "@/components/motion/FadeUp";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Three-tier pricing with an animated local/ecom segment toggle.
 * The featured tier gets an ink background and a "MOST POPULAR" tag.
 */
export default function Packages() {
  const { packages, servicesPage } = site;
  const { segments } = servicesPage.packages;
  const [segment, setSegment] = useState<PackageSegment>(segments[0].id);
  const visible = packages.filter((p) => p.segment === segment);

  return (
    <section className="border-t u-hairline bg-ivory">
      <div className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-40">
        <SectionLabel text={servicesPage.packages.label} />
        <RevealText
          text={servicesPage.packages.headline}
          as="h2"
          className="mt-6 max-w-4xl font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-ink"
        />
        <FadeUp delay={0.1}>
          <p className="mt-6 max-w-xl text-stone">
            {servicesPage.packages.subhead}
          </p>
        </FadeUp>

        {/* Segment toggle */}
        <FadeUp delay={0.15} className="mt-12">
          <div
            role="tablist"
            aria-label="Package segments"
            className="inline-flex rounded-full border u-hairline p-1"
          >
            {segments.map((seg) => {
              const selected = segment === seg.id;
              return (
                <button
                  key={seg.id}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setSegment(seg.id)}
                  className={`relative rounded-full px-6 py-2.5 u-label transition-colors duration-300 ${
                    selected ? "text-ivory" : "text-ink hover:text-terracotta"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="segment-pill"
                      transition={{ duration: 0.45, ease: EASE }}
                      className="absolute inset-0 rounded-full bg-ink"
                    />
                  )}
                  <span className="relative z-10">{seg.label}</span>
                </button>
              );
            })}
          </div>
        </FadeUp>

        {/* Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((pkg, i) => (
              <motion.div
                key={`${pkg.segment}-${pkg.name}`}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
                className={`flex flex-col border p-8 transition-transform duration-500 ease-studio hover:-translate-y-1.5 motion-reduce:transition-none md:p-10 ${
                  pkg.featured
                    ? "border-ink bg-ink text-ivory"
                    : "u-hairline bg-ivory-deep/40 text-ink"
                }`}
              >
                {pkg.featured ? (
                  <p className="u-label mb-6 w-fit border border-terracotta px-3 py-1.5 text-terracotta">
                    {servicesPage.packages.featuredTag}
                  </p>
                ) : (
                  <p className="mb-6 h-[30px]" aria-hidden />
                )}
                <h3 className="font-display text-3xl tracking-[-0.02em]">
                  {pkg.name}
                </h3>
                <p
                  className={`mt-2 text-sm ${
                    pkg.featured ? "text-ivory/70" : "text-stone"
                  }`}
                >
                  {pkg.blurb}
                </p>
                <p className="mt-8 font-display text-5xl tracking-[-0.02em]">
                  {pkg.price}
                  <span
                    className={`ml-1 font-body text-base ${
                      pkg.featured ? "text-ivory/70" : "text-stone"
                    }`}
                  >
                    {pkg.priceNote}
                  </span>
                </p>
                <ul
                  className={`mt-8 flex-1 border-t ${
                    pkg.featured ? "u-hairline-inverse" : "u-hairline"
                  }`}
                >
                  {pkg.includes.map((item) => (
                    <li
                      key={item}
                      className={`flex items-baseline gap-3 border-b py-3 text-sm ${
                        pkg.featured ? "u-hairline-inverse" : "u-hairline"
                      }`}
                    >
                      <span aria-hidden className="text-terracotta">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={pkg.cta.href}
                  className={`group relative mt-8 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-6 py-3.5 u-label transition-colors duration-300 ${
                    pkg.featured
                      ? "border-terracotta text-ivory"
                      : "border-ink text-ink hover:text-ivory"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-300 ease-studio group-hover:scale-y-100 motion-reduce:transition-none ${
                      pkg.featured ? "bg-terracotta" : "bg-ink"
                    }`}
                  />
                  <span className="relative z-10">{pkg.cta.label}</span>
                  <span
                    aria-hidden
                    className="relative z-10 transition-transform duration-300 ease-studio group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
