"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { site, type PackageSegment } from "@/content/site";
import SplitReveal from "@/components/studio/SplitReveal";
import MomentumGroup from "@/components/studio/MomentumGroup";
import FadeUp from "@/components/motion/FadeUp";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Three-tier pricing on a dark studio panel with an animated local/ecom
 * segment toggle. The framer `motion.div` owns entrance/exit + layout while
 * an inner `[data-momentum-target]` holds the visible card, so the
 * momentum-hover flick (via MomentumGroup) never fights framer's transform.
 */
export default function Packages() {
  const { packages, servicesPage } = site;
  const { segments } = servicesPage.packages;
  const [segment, setSegment] = useState<PackageSegment>(segments[0].id);
  const visible = packages.filter((p) => p.segment === segment);

  return (
    <section
      data-studio-theme="ink"
      data-nav-theme="ink"
      className="border-t [border-color:var(--hair)]"
    >
      <div className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-32">
        <p className="u-label text-[color:var(--muted)]">{servicesPage.packages.label}</p>
        <SplitReveal
          text={servicesPage.packages.headline}
          as="h2"
          className="mt-6 max-w-4xl font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em]"
        />
        <FadeUp delay={0.1}>
          <p className="mt-6 max-w-xl text-[color:var(--muted)]">
            {servicesPage.packages.subhead}
          </p>
        </FadeUp>

        {/* Segment toggle */}
        <FadeUp delay={0.15} className="mt-12">
          <div
            role="tablist"
            aria-label="Package segments"
            className="inline-flex rounded-full border p-1 [border-color:var(--hair)]"
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
                    selected ? "text-ivory" : "text-[color:var(--muted)] hover:text-ivory"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="segment-pill"
                      transition={{ duration: 0.45, ease: EASE }}
                      className="absolute inset-0 rounded-full bg-terracotta"
                    />
                  )}
                  <span className="relative z-10">{seg.label}</span>
                </button>
              );
            })}
          </div>
        </FadeUp>

        {/* Cards */}
        <MomentumGroup className="mt-14 grid gap-6 md:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((pkg, i) => (
              <motion.div
                key={`${pkg.segment}-${pkg.name}`}
                data-momentum-el
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
              >
                <div
                  data-momentum-target
                  className={`momentum-target flex h-full flex-col rounded-3xl border p-8 md:p-10 ${
                    pkg.featured
                      ? "border-terracotta bg-terracotta text-ivory"
                      : "text-ivory [border-color:var(--hair)]"
                  }`}
                  style={pkg.featured ? undefined : { background: "#1c1a17" }}
                >
                  {pkg.featured ? (
                    <p className="u-label mb-6 w-fit border border-ivory/40 px-3 py-1.5 text-ivory">
                      {servicesPage.packages.featuredTag}
                    </p>
                  ) : (
                    <p className="mb-6 h-[30px]" aria-hidden />
                  )}
                  <h3 className="font-display text-3xl tracking-[-0.02em]">{pkg.name}</h3>
                  <p
                    className={`mt-2 text-sm ${
                      pkg.featured ? "text-ivory/80" : "text-[color:var(--muted)]"
                    }`}
                  >
                    {pkg.blurb}
                  </p>
                  <p className="mt-8 font-display text-5xl tracking-[-0.02em]">
                    {pkg.price}
                    <span
                      className={`ml-1 font-body text-base ${
                        pkg.featured ? "text-ivory/80" : "text-[color:var(--muted)]"
                      }`}
                    >
                      {pkg.priceNote}
                    </span>
                  </p>
                  <ul
                    className={`mt-8 flex-1 border-t ${
                      pkg.featured ? "border-ivory/25" : "[border-color:var(--hair)]"
                    }`}
                  >
                    {pkg.includes.map((item) => (
                      <li
                        key={item}
                        className={`flex items-baseline gap-3 border-b py-3 text-sm ${
                          pkg.featured ? "border-ivory/25" : "[border-color:var(--hair)]"
                        }`}
                      >
                        <span aria-hidden className={pkg.featured ? "text-ivory" : "text-terracotta"}>
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={pkg.cta.href}
                    className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 u-label transition-transform duration-300 hover:-translate-y-0.5 ${
                      pkg.featured
                        ? "bg-ivory text-ink"
                        : "border border-ivory/40 text-ivory hover:border-ivory"
                    }`}
                  >
                    <span>{pkg.cta.label}</span>
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </MomentumGroup>
      </div>
    </section>
  );
}
