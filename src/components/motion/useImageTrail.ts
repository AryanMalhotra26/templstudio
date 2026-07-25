"use client";

import { useEffect, type RefObject } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Cursor image trail — a port of the reference's `initImageTrail`.
 *
 * Moving the pointer across the wrapper drops images behind it: once the
 * cursor has travelled more than `innerWidth / moveDistance` since the last
 * drop, the next image in the pool is placed under the cursor and the one
 * `trailLength` drops ago starts fading. Anything that hasn't moved for
 * `stopDuration` fades too, so the trail dissolves when you stop.
 *
 * Pointer-only and desktop-only (>= `minWidth`), and it's armed/disarmed by a
 * ScrollTrigger so only the chapter you're actually looking at is listening.
 */

export interface ImageTrailConfig {
  minWidth?: number;
  moveDistance?: number;
  stopDuration?: number;
  trailLength?: number;
}

export function useImageTrail(
  wrapperRef: RefObject<HTMLElement | null>,
  config: ImageTrailConfig = {}
) {
  const {
    minWidth = 992,
    moveDistance = 15,
    stopDuration = 350,
    trailLength = 8,
  } = config;

  useEffect(() => {
    registerGsap();

    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (window.innerWidth < minWidth) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const images = Array.from(
      wrapper.querySelectorAll<HTMLElement>('[data-trail="item"]')
    );
    if (!images.length) return;

    let globalIndex = 0;
    let last = { x: 0, y: 0 };
    let active = false;
    let interval: number | null = null;
    const stamps = new Map<HTMLElement, number>();

    const activate = (image: HTMLElement, x: number, y: number) => {
      const rect = image.getBoundingClientRect();
      Object.assign(image.style, {
        left: `${x - rect.width / 2}px`,
        top: `${y - rect.height / 2}px`,
        zIndex: String(globalIndex),
        display: "block",
      });
      stamps.set(image, Date.now());
      gsap.fromTo(
        image,
        { autoAlpha: 0, scale: 0.8 },
        { scale: 1, autoAlpha: 1, duration: 0.2, overwrite: true }
      );
      last = { x, y };
    };

    const fadeOut = (image: HTMLElement) => {
      gsap.to(image, {
        opacity: 0,
        scale: 0.2,
        duration: 0.8,
        ease: "expo.out",
        overwrite: true,
        onComplete: () => gsap.set(image, { autoAlpha: 0 }),
      });
    };

    const onMove = (e: MouseEvent) => {
      if (!active) return;
      const box = wrapper.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;

      if (Math.hypot(x - last.x, y - last.y) <= window.innerWidth / moveDistance)
        return;

      const lead = images[globalIndex % images.length];
      const tail =
        globalIndex >= trailLength
          ? images[(globalIndex - trailLength) % images.length]
          : null;

      activate(lead, x, y);
      if (tail) fadeOut(tail);
      globalIndex++;
    };

    const sweep = () => {
      const now = Date.now();
      stamps.forEach((stamp, image) => {
        if (now - stamp > stopDuration) {
          fadeOut(image);
          stamps.delete(image);
        }
      });
    };

    const start = () => {
      if (active || window.innerWidth < minWidth) return;
      active = true;
      wrapper.addEventListener("mousemove", onMove);
      interval = window.setInterval(sweep, 100);
    };

    const stop = () => {
      if (!active) return;
      active = false;
      wrapper.removeEventListener("mousemove", onMove);
      if (interval) window.clearInterval(interval);
      interval = null;
      images.forEach(fadeOut);
      stamps.clear();
    };

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter: start,
      onEnterBack: start,
      onLeave: stop,
      onLeaveBack: stop,
    });

    const onResize = () => {
      if (window.innerWidth < minWidth) stop();
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      trigger.kill();
      window.removeEventListener("resize", onResize);
    };
  }, [wrapperRef, minWidth, moveDistance, stopDuration, trailLength]);
}
