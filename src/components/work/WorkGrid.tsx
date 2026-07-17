"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { site, workCategories } from "@/content/site";
import ParallaxImage from "@/components/motion/Parallax";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Filterable editorial grid with animated layout reordering. */
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

      {/* Grid */}
      <motion.div layout className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item, i) => (
            <motion.div
              key={item.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Link
                href={`/work/${item.slug}`}
                data-cursor="View"
                className="group block"
              >
                <div className="overflow-hidden">
                  <ParallaxImage
                    src={item.cover.src}
                    alt={item.cover.alt}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className={`${
                      i % 2 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"
                    } transition-transform duration-700 ease-studio group-hover:scale-[1.03] motion-reduce:transition-none`}
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4 border-t u-hairline pt-4">
                  <p className="u-label text-stone">
                    ({String(i + 1).padStart(2, "0")}) {item.client} ·{" "}
                    {item.category} · {item.year}
                  </p>
                  <span
                    aria-hidden
                    className="u-label shrink-0 text-stone transition-all duration-300 ease-studio group-hover:translate-x-1 group-hover:text-terracotta"
                  >
                    ↗
                  </span>
                </div>
                <h2 className="mt-3 max-w-md font-display text-2xl leading-snug tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-terracotta md:text-3xl">
                  {item.summary}
                </h2>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
