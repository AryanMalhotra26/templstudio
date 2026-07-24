"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { StudioReel } from "@/content/site";

/**
 * A single 9:16 vertical reel with a faked player interface (scrubber +
 * timecode + play/pause), standing in for Hildén & Kaira's Bunny/HLS
 * player. When it's the active card in a deck, the scrubber runs and the
 * timecode ticks — a cheap "it's playing" illusion with no real video.
 * Drop a real <video>/HLS source into `.reel__stage` to make it live.
 */
function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function Reel({
  reel,
  active,
}: {
  reel: StudioReel;
  active: boolean;
}) {
  const fillRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("00:00");
  const [playing, setPlaying] = useState(active);

  useGSAP(
    () => {
      const fill = fillRef.current;
      if (!fill) return;
      const progress = { p: 0 };
      gsap.killTweensOf(progress);

      if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPlaying(active);
        return;
      }
      setPlaying(true);
      const tween = gsap.to(progress, {
        p: 1,
        duration: reel.duration,
        ease: "none",
        repeat: -1,
        onUpdate() {
          gsap.set(fill, { width: `${progress.p * 100}%` });
          setTime(fmt(progress.p * reel.duration));
        },
      });
      return () => tween.kill();
    },
    { dependencies: [active], scope: fillRef },
  );

  return (
    <div className={`reel tone-${reel.tone}`}>
      <div className="reel__scrim" />

      {/* placeholder-media marker */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center">
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "Pause" : "Play"}
          className="reel__badge grid h-12 w-12 place-items-center rounded-full text-ivory transition-transform duration-300 hover:scale-110"
        >
          {playing ? (
            <span className="flex gap-[3px]">
              <span className="h-3.5 w-[3px] bg-ivory" />
              <span className="h-3.5 w-[3px] bg-ivory" />
            </span>
          ) : (
            <span className="ml-0.5 border-y-[7px] border-l-[11px] border-y-transparent border-l-ivory" />
          )}
        </button>
      </div>

      <div className="reel__ui text-ivory">
        <p className="mb-2 line-clamp-2 text-[13px] leading-snug opacity-90">
          {reel.caption}
        </p>
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider opacity-80">
          <span>{reel.views} views</span>
          <span>{reel.age}</span>
        </div>
        <div className="reel__scrub">
          <div ref={fillRef} className="reel__scrub-fill" />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10px] tabular-nums opacity-70">
          <span>{time}</span>
          <span>{fmt(reel.duration)}</span>
        </div>
      </div>

      <span className="absolute left-3 top-3 z-[2] rounded-full bg-ink/30 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-ivory/70 backdrop-blur">
        Reel · placeholder
      </span>
    </div>
  );
}
