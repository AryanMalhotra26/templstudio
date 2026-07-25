"use client";

import { useEffect, type RefObject } from "react";
import { registerGsap, gsap } from "@/lib/gsap";

/**
 * The ambient "objects drifting up the screen" loop, used twice on the
 * homepage: for the hero's rising photo cards and for the chrome objects
 * behind the services heading.
 *
 * Ported value-for-value from the reference's two copies of the same routine.
 * Each item picks a fixed horizontal lane (alternating left/right by index),
 * a random duration, rotation and scale, then travels from 300px below the
 * fold to 300px above it on a linear ease, fading in over the first 10% and
 * out over the last 18%. A slow yoyo adds a little rotational drift.
 */

export interface RisingMediaConfig {
  duration: { min: number; max: number };
  staggerDelay: number;
  rotation: { min: number; max: number };
  leftZone: { min: number; max: number };
  rightZone: { min: number; max: number };
  scaleVariation: number;
  fadeOutStart: number;
}

export const HERO_RISING: RisingMediaConfig = {
  duration: { min: 12, max: 15 },
  staggerDelay: 2.5,
  rotation: { min: -12, max: 12 },
  leftZone: { min: -42, max: -20 },
  rightZone: { min: 20, max: 42 },
  scaleVariation: 0.08,
  fadeOutStart: 0.82,
};

export const OBJECTS_RISING: RisingMediaConfig = {
  ...HERO_RISING,
  leftZone: { min: -50, max: -30 },
  rightZone: { min: 30, max: 50 },
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function useRisingMedia(
  wrapperRef: RefObject<HTMLElement | null>,
  itemSelector: string,
  config: RisingMediaConfig,
  { desktopOnly = false }: { desktopOnly?: boolean } = {}
) {
  useEffect(() => {
    registerGsap();

    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (desktopOnly && window.innerWidth < 768) return;

    const items = Array.from(
      wrapper.querySelectorAll<HTMLElement>(itemSelector)
    );
    if (!items.length) return;

    let viewportHeight = window.innerHeight;

    const timelines = items.map((item, index) => {
      const zone = index % 2 === 0 ? config.leftZone : config.rightZone;
      const startX = rand(zone.min, zone.max);
      const duration = rand(config.duration.min, config.duration.max);
      const rotation = rand(config.rotation.min, config.rotation.max);
      const scale = 1 + rand(-config.scaleVariation, config.scaleVariation);

      const reset = {
        x: `${startX}vw`,
        y: viewportHeight + 300,
        opacity: 0,
      };

      gsap.set(item, {
        position: "absolute",
        top: 0,
        left: "50%",
        xPercent: -50,
        willChange: "transform",
        ...reset,
      });

      const tl = gsap.timeline({
        delay: index * config.staggerDelay,
        repeat: -1,
        repeatDelay: 0,
        onRepeat: () => gsap.set(item, reset),
      });

      tl.to(item, {
        y: -(viewportHeight + 300),
        x: `${startX}vw`,
        rotation,
        scale,
        duration,
        ease: "none",
        onUpdate() {
          const p = this.progress();
          if (p < 0.1) gsap.set(item, { opacity: p / 0.1 });
          else if (p > config.fadeOutStart) {
            const fade = (p - config.fadeOutStart) / (1 - config.fadeOutStart);
            gsap.set(item, { opacity: 1 - fade });
          } else gsap.set(item, { opacity: 1 });
        },
      });

      tl.to(
        item,
        {
          rotation: rotation + rand(-3, 3),
          duration: duration / 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 2,
        },
        0
      );

      return tl;
    });

    let resizeTimer: number;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        viewportHeight = window.innerHeight;
      }, 250);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      timelines.forEach((tl) => tl.kill());
      gsap.set(items, { clearProps: "all" });
    };
  }, [wrapperRef, itemSelector, config, desktopOnly]);
}
