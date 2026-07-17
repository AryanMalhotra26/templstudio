import Link from "next/link";
import { featuredWork, site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import FadeUp from "@/components/motion/FadeUp";
import ParallaxImage from "@/components/motion/Parallax";
import Button from "@/components/ui/Button";

/** Ink section: asymmetric editorial grid of featured case studies. */
export default function FeaturedWork() {
  const { home } = site;

  return (
    <section className="bg-ink text-ivory">
      <div className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel text={home.work.label} tone="stone" />
            <RevealText
              text={home.work.headline}
              as="h2"
              className="mt-6 max-w-4xl font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-ivory"
            />
          </div>
          <p aria-hidden className="u-label hidden pb-3 text-stone lg:block">
            ({String(featuredWork.length).padStart(2, "0")}) — PROJECTS ©
          </p>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-16 md:mt-20 md:grid-cols-2 md:gap-y-24">
          {featuredWork.map((item, i) => {
            const tall = i % 2 === 0;
            return (
              <FadeUp
                key={item.slug}
                className={i % 2 === 1 ? "md:mt-32" : undefined}
                delay={0.08 * (i % 2)}
              >
                <Link
                  href={`/work/${item.slug}`}
                  data-cursor="View"
                  className="group block"
                >
                  <div className="overflow-hidden">
                    <ParallaxImage
                      src={item.cover.src}
                      alt={item.cover.alt}
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className={`${
                        tall ? "aspect-[4/5]" : "aspect-[4/3]"
                      } transition-transform duration-700 ease-studio group-hover:scale-[1.03] motion-reduce:transition-none`}
                    />
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-4 border-t u-hairline-inverse pt-4">
                    <p className="u-label text-stone">
                      ({String(i + 1).padStart(2, "0")}) {item.client} ·{" "}
                      {item.category} · {item.year}
                    </p>
                    <span
                      aria-hidden
                      className="u-label shrink-0 text-stone transition-all duration-300 ease-studio group-hover:translate-x-1 group-hover:text-terracotta"
                    >
                      ↗
                    </span>
                  </div>
                  <h3 className="mt-3 max-w-md font-display text-2xl leading-snug tracking-[-0.02em] transition-colors duration-300 group-hover:text-terracotta md:text-3xl">
                    {item.summary}
                  </h3>
                </Link>
              </FadeUp>
            );
          })}
        </div>

        <div className="mt-16 md:mt-20">
          <Button href={home.work.cta.href} variant="inverse">
            {home.work.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
