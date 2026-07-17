"use client";

import Link from "next/link";
import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import FadeUp from "@/components/motion/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";

/**
 * The footer CTA + footer. The gigantic headline fills terracotta on hover
 * via a clip-path sweep across a layered copy of the text.
 */
export default function Footer() {
  const { footer, brand } = site;
  const plain = footer.ctaHeadline.replace(/\*/g, "");

  return (
    <footer className="bg-ink text-ivory">
      {/* Giant CTA */}
      <div className="mx-auto max-w-site px-6 pb-16 pt-24 md:px-10 md:pb-24 md:pt-40">
        <SectionLabel text={footer.ctaLabel} tone="stone" />
        <Link
          href={footer.ctaHref}
          data-cursor="Open"
          className="group relative mt-6 block w-fit"
        >
          <RevealText
            text={footer.ctaHeadline}
            as="span"
            className="block font-display text-[clamp(3.5rem,11vw,12rem)] leading-[0.95] tracking-tight text-ivory"
            accentClassName="italic"
          />
          {/* terracotta sweep layer */}
          <span
            aria-hidden
            className="absolute inset-0 block font-display text-[clamp(3.5rem,11vw,12rem)] leading-[0.95] tracking-tight text-terracotta transition-[clip-path] duration-700 ease-studio [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
          >
            {plain.split(" ").map((word, i, arr) => {
              const italic =
                footer.ctaHeadline.includes(`*${word}*`) ||
                footer.ctaHeadline.includes(`*${word}`);
              return (
                <span key={i} className={italic ? "italic" : undefined}>
                  {word}
                  {i < arr.length - 1 ? " " : ""}
                </span>
              );
            })}
          </span>
        </Link>
        <FadeUp className="mt-8">
          <a
            href={`mailto:${brand.email}`}
            className="u-label u-underline-sweep text-stone hover:text-ivory"
          >
            {brand.email}
          </a>
        </FadeUp>
      </div>

      {/* Footer columns */}
      <div className="border-t u-hairline-inverse">
        <div className="mx-auto grid max-w-site gap-10 px-6 py-12 md:grid-cols-4 md:px-10 md:py-16">
          <div className="md:col-span-2">
            <p className="font-display text-xl font-semibold tracking-tight">
              {brand.name}
              <span className="text-terracotta">.</span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-stone">{brand.tagline}</p>
            <p className="u-label mt-6 text-stone">
              {brand.location} — EST. {brand.est}
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-3">
            {footer.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="u-label u-underline-sweep w-fit text-ivory/80 hover:text-ivory"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            {footer.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="u-label u-underline-sweep w-fit text-ivory/80 hover:text-ivory"
              >
                {social.label} ↗
              </a>
            ))}
            <a
              href={`mailto:${brand.email}`}
              className="u-label u-underline-sweep mt-2 w-fit text-ivory/80 hover:text-ivory"
            >
              {brand.email}
            </a>
          </div>
        </div>
        <div className="border-t u-hairline-inverse">
          <div className="mx-auto flex max-w-site flex-col gap-2 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
            <p className="u-label text-stone">{footer.legal}</p>
            <p className="u-label text-stone">
              {brand.location.toUpperCase()} — EST. {brand.est} ©
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
