"use client";

/**
 * Single place that registers every GSAP plugin the studio homepage uses.
 * All of these ship free in the core `gsap` package (3.13+), so there is no
 * Club/token setup. Import `{ gsap, ScrollTrigger, ... }` from here rather
 * than from "gsap" directly so registration happens exactly once.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
  registered = true;
}

export { gsap, ScrollTrigger, SplitText, Draggable, InertiaPlugin };
