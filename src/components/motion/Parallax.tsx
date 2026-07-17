"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Scroll-linked parallax: the image translates Y ±8% inside an
 * overflow-hidden frame, with the inner image scaled to 1.15 so
 * edges never show.
 */
export default function ParallaxImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`u-grain relative overflow-hidden ${className}`}>
      <motion.div
        style={reduceMotion ? undefined : { y }}
        className="absolute inset-0 scale-[1.15]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
