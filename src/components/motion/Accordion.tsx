"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { FaqItem } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * FAQ accordion: hairline-divided rows, Fraunces questions, a plus icon
 * that rotates 45° into ×, height animated with AnimatePresence.
 * Only one item open at a time.
 */
export default function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="border-t u-hairline">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b u-hairline">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
            >
              <span className="font-display text-xl tracking-tight transition-colors duration-300 group-hover:text-terracotta md:text-3xl">
                {item.question}
              </span>
              <motion.span
                aria-hidden
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border u-hairline text-lg font-light md:h-11 md:w-11"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-8 text-stone">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
