"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Desktop-only custom cursor: an 8px terracotta dot with a spring-smoothed
 * trailing ring. Elements with data-cursor="View" / "Open" expand the ring
 * and show the label. Never rendered on touch or for reduced motion.
 */
export default function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || reduceMotion) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") : null);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [reduceMotion, x, y]);

  if (!enabled) return null;

  const expanded = label !== null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      {/* trailing ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute left-0 top-0"
      >
        <motion.div
          animate={{
            width: expanded ? 64 : 32,
            height: expanded ? 64 : 32,
            opacity: visible ? 1 : 0,
            backgroundColor: expanded
              ? "rgba(196, 80, 44, 0.95)"
              : "rgba(196, 80, 44, 0)",
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-terracotta"
        >
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="u-label !text-[10px] text-ivory"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      {/* dot */}
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <motion.div
          animate={{ opacity: visible && !expanded ? 1 : 0 }}
          className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terracotta"
        />
      </motion.div>
    </div>
  );
}
