"use client";

import { motion } from "framer-motion";
import { type ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

interface Segment {
  word: string;
  accent: boolean;
}

/**
 * Parse a headline string from site.ts: words wrapped in *asterisks*
 * become italic serif accent words.
 */
function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  for (const chunk of text.split(/(\*[^*]+\*)/g)) {
    if (!chunk) continue;
    const accent = chunk.startsWith("*") && chunk.endsWith("*");
    const clean = accent ? chunk.slice(1, -1) : chunk;
    for (const word of clean.split(/\s+/).filter(Boolean)) {
      segments.push({ word, accent });
    }
  }
  return segments;
}

interface RevealTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  accentClassName?: string;
  delay?: number;
  once?: boolean;
}

/**
 * Kinetic headline reveal: each word masked in an overflow-hidden span,
 * translating from 110% up into place with a stagger.
 */
export default function RevealText({
  text,
  as: Tag = "h2",
  className = "",
  accentClassName = "font-display italic text-terracotta",
  delay = 0,
  once = true,
}: RevealTextProps) {
  const segments = parseSegments(text);

  return (
    <Tag className={className}>
      <span className="sr-only">{text.replace(/\*/g, "")}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-10%" }}
        transition={{ staggerChildren: 0.035, delayChildren: delay }}
      >
        {segments.map((seg, i) => (
          <span key={i}>
            <span className="u-mask">
              <motion.span
                className={`inline-block ${seg.accent ? accentClassName : ""}`}
                variants={{
                  hidden: { y: "110%" },
                  visible: {
                    y: "0%",
                    transition: { duration: 0.8, ease: EASE },
                  },
                }}
              >
                {seg.word}
              </motion.span>
            </span>
            {i < segments.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
