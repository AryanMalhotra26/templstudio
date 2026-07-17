"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import { Stagger, StaggerItem } from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";

/**
 * The centerpiece interaction: full-width hairline service rows. On desktop,
 * hovering a row sweeps an ink fill up behind it (text inverts to ivory) and
 * floats a 320×400 image beside the cursor, spring-smoothed. Touch devices
 * get a static thumbnail layout instead.
 */
export default function ServicesList() {
  const { services, home } = site;
  const [active, setActive] = useState<number | null>(null);
  const [isFine, setIsFine] = useState(false);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 25, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 25, mass: 0.5 });

  useEffect(() => {
    setIsFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const hoverEnabled = isFine && !reduceMotion;

  return (
    <section id="services" className="bg-ivory">
      <div
        className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-36"
        onMouseMove={
          hoverEnabled
            ? (e) => {
                x.set(e.clientX);
                y.set(e.clientY);
              }
            : undefined
        }
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel text={home.services.label} />
            <RevealText
              text={home.services.headline}
              as="h2"
              className="mt-6 max-w-4xl font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-ink"
            />
          </div>
          <p
            aria-hidden
            className="u-outline-text hidden select-none font-display text-7xl italic text-stone/70 lg:block"
          >
            ✺
          </p>
        </div>

        <Stagger className="mt-14 border-t u-hairline md:mt-20" stagger={0.05}>
          {services.map((service, i) => (
            <StaggerItem key={service.slug}>
              <Link
                href={`/services#${service.slug}`}
                data-cursor="Open"
                onMouseEnter={hoverEnabled ? () => setActive(i) : undefined}
                onMouseLeave={hoverEnabled ? () => setActive(null) : undefined}
                className="group relative flex items-center gap-5 overflow-hidden border-b u-hairline px-2 py-6 md:gap-10 md:px-5 md:py-8"
              >
                {/* ink fill sweep */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-studio group-hover:scale-y-100 motion-reduce:transition-none"
                />

                {/* Static thumbnail for touch devices */}
                {!hoverEnabled && (
                  <span className="relative z-10 block h-20 w-16 shrink-0 overflow-hidden md:h-24 md:w-20">
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </span>
                )}

                <span
                  aria-hidden
                  className="u-outline-text relative z-10 hidden w-20 shrink-0 font-display text-5xl text-ink transition-colors duration-500 group-hover:text-terracotta sm:block md:text-6xl"
                >
                  {service.index}
                </span>

                <span className="relative z-10 min-w-0 flex-1">
                  <span className="block font-display text-2xl leading-tight tracking-[-0.02em] text-ink transition-all duration-500 ease-studio group-hover:translate-x-3 group-hover:text-ivory motion-reduce:transition-none md:text-5xl">
                    {service.name}
                  </span>
                  <span className="mt-1 block text-sm text-stone transition-colors duration-500 group-hover:text-stone-light md:hidden">
                    {service.shortDescription}
                  </span>
                </span>

                <span className="relative z-10 hidden max-w-xs text-right text-sm text-stone transition-colors duration-500 group-hover:text-ivory/80 md:block">
                  {service.shortDescription}
                </span>

                <span
                  aria-hidden
                  className="relative z-10 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border u-hairline text-ink transition-all duration-500 ease-studio group-hover:border-terracotta group-hover:bg-terracotta group-hover:text-ivory md:flex"
                >
                  ↗
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12">
          <Button href={home.services.cta.href} variant="ghost">
            {home.services.cta.label}
          </Button>
        </div>
      </div>

      {/* Floating cursor-following image (desktop only) */}
      {hoverEnabled && (
        <motion.div
          aria-hidden
          style={{ x: springX, y: springY }}
          className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
        >
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-8 top-0 h-[400px] w-[320px] -translate-y-1/2 overflow-hidden"
              >
                <Image
                  src={services[active].image}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
