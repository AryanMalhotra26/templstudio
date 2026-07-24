"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { site, workCategories } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial case-study index. Filterable, animated-reorder rows that
 * alternate media side, lead with the client name, and surface each
 * project's top result stats as call-outs — the same layered treatment as
 * the story timeline.
 */
export default function WorkGrid() {
  const { work, workPage } = site;
  const categories = [workPage.allFilter, ...workCategories()];
  const [filter, setFilter] = useState(workPage.allFilter);
  const visible =
    filter === workPage.allFilter
      ? work
      : work.filter((w) => w.category === filter);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => {
          const selected = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`relative rounded-full border px-5 py-2.5 u-label transition-colors duration-300 ${
                selected
                  ? "border-ink text-ivory"
                  : "u-hairline text-ink hover:border-ink"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="work-filter-pill"
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0 rounded-full bg-ink"
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Case-study index */}
      <motion.div layout className="mt-14 border-t u-hairline">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item, i) => {
            const mediaLeft = i % 2 === 0;
            return (
              <motion.article
                key={item.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="border-b u-hairline py-12 md:py-20"
              >
                <Link
                  href={`/work/${item.slug}`}
                  data-cursor="View"
                  className="group grid items-center gap-8 md:grid-cols-2 md:gap-16"
                >
                  {/* Media */}
                  <div className={mediaLeft ? "" : "md:order-2"}>
                    <div
                      className={`relative aspect-[4/3] overflow-hidden rounded-2xl tone-${(i % 4) + 1}`}
                    >
                      <Image
                        src={item.cover.src}
                        alt={item.cover.alt}
                        fill
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-studio group-hover:scale-[1.05] motion-reduce:transition-none"
                      />
                      <span className="absolute left-5 top-4 font-mono text-[11px] uppercase tracking-widest text-ivory mix-blend-difference">
                        {String(i + 1).padStart(2, "0")} / {String(work.length).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className={mediaLeft ? "" : "md:order-1"}>
                    <div className="flex items-center gap-3">
                      <span className="u-label text-terracotta">{item.category}</span>
                      <span className="u-label text-stone">— {item.year}</span>
                    </div>
                    <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.0] tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-terracotta">
                      {item.client}
                    </h2>
                    <p className="mt-4 max-w-md text-stone">{item.summary}</p>

                    {/* Result call-outs */}
                    <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t u-hairline pt-6">
                      {item.results.slice(0, 3).map((stat) => (
                        <div key={stat.label}>
                          <p className="font-display text-3xl tracking-[-0.02em] text-ink md:text-4xl">
                            {stat.prefix ?? ""}
                            {stat.value}
                            {stat.suffix ?? ""}
                          </p>
                          <p className="mt-1 max-w-[9rem] font-mono text-[10px] uppercase leading-snug tracking-widest text-stone">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <span className="mt-8 inline-flex items-center gap-2 u-label text-ink transition-colors duration-300 group-hover:text-terracotta">
                      View case study
                      <span
                        aria-hidden
                        className="transition-transform duration-300 ease-studio group-hover:translate-x-1 motion-reduce:transition-none"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
