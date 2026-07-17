import Image from "next/image";
import Link from "next/link";
import { featuredWork, site } from "@/content/site";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeUp from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";

/** Ink section: asymmetric editorial grid of featured case studies. */
export default function FeaturedWork() {
  const { home } = site;

  return (
    <section className="bg-ink text-ivory">
      <div className="mx-auto max-w-site px-6 py-24 md:px-10 md:py-32">
        <SectionHeader
          label={home.work.label}
          headline={home.work.headline}
          lede={home.work.lede}
          meta={`(${String(featuredWork.length).padStart(2, "0")}) PROJECTS ©`}
          tone="dark"
        />

        <div className="mt-14 grid gap-x-10 gap-y-16 md:mt-20 md:grid-cols-2 md:gap-y-24">
          {featuredWork.map((item, i) => {
            const tall = i % 2 === 0;
            return (
              <FadeUp
                key={item.slug}
                className={i % 2 === 1 ? "md:mt-24" : undefined}
                delay={0.08 * (i % 2)}
              >
                <Link
                  href={`/work/${item.slug}`}
                  data-cursor="View"
                  className="group block"
                >
                  <div
                    className={`relative overflow-hidden ${
                      tall ? "aspect-[4/5]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={item.cover.src}
                      alt={item.cover.alt}
                      fill
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-studio group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-4 border-t u-hairline-inverse pt-4">
                    <p className="u-label text-stone-light">
                      ({String(i + 1).padStart(2, "0")}) {item.client} ·{" "}
                      {item.category} · {item.year}
                    </p>
                    <span
                      aria-hidden
                      className="u-label shrink-0 text-stone-light transition-all duration-300 ease-studio group-hover:translate-x-1 group-hover:text-terracotta"
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
