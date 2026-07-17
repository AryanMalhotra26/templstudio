import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getTestimonialById,
  getWorkBySlug,
  site,
} from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import FadeUp, { Stagger, StaggerItem } from "@/components/motion/FadeUp";
import ParallaxImage from "@/components/motion/Parallax";
import Counter from "@/components/motion/Counter";

export function generateStaticParams() {
  return site.work.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const item = getWorkBySlug(params.slug);
  if (!item) return {};
  return {
    title: `${item.client} — ${item.category}`,
    description: item.summary,
  };
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const item = getWorkBySlug(params.slug);
  if (!item) notFound();

  const { workPage } = site;
  const labels = workPage.caseStudy;
  const index = site.work.findIndex((w) => w.slug === item.slug);
  const prev = site.work[(index - 1 + site.work.length) % site.work.length];
  const next = site.work[(index + 1) % site.work.length];
  const testimonial = item.testimonialRef
    ? getTestimonialById(item.testimonialRef)
    : undefined;

  return (
    <article className="bg-ivory">
      {/* Hero */}
      <header className="pt-36 md:pt-48">
        <div className="mx-auto max-w-site px-6 md:px-10">
          <FadeUp>
            <Link
              href="/work"
              className="u-label u-underline-sweep text-stone hover:text-terracotta"
            >
              ← {labels.backLabel}
            </Link>
          </FadeUp>
          <RevealText
            text={item.client}
            as="h1"
            className="mt-6 max-w-5xl font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.02] tracking-[-0.02em] text-ink"
          />
          <FadeUp delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg text-stone">{item.summary}</p>
          </FadeUp>
          <FadeUp
            delay={0.2}
            className="mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t u-hairline pt-5"
          >
            <p className="u-label text-stone">
              CLIENT — <span className="text-ink">{item.client}</span>
            </p>
            <p className="u-label text-stone">
              SERVICES — <span className="text-ink">{item.category}</span>
            </p>
            <p className="u-label text-stone">
              YEAR — <span className="text-ink">{item.year}</span>
            </p>
          </FadeUp>
        </div>
        <div className="mx-auto mt-12 max-w-site px-6 md:mt-16 md:px-10">
          <ParallaxImage
            src={item.cover.src}
            alt={item.cover.alt}
            priority
            sizes="100vw"
            className="aspect-[16/10] w-full md:aspect-[21/10]"
          />
        </div>
      </header>

      {/* Challenge → Approach */}
      <section className="mx-auto max-w-site px-6 py-20 md:px-10 md:py-32">
        <div className="grid gap-14 md:grid-cols-2 md:gap-10">
          <FadeUp>
            <p className="u-label text-terracotta">{labels.challengeLabel}</p>
            <p className="mt-6 font-display text-2xl leading-snug tracking-[-0.02em] text-ink md:text-3xl">
              {item.challenge}
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="u-label text-terracotta">{labels.approachLabel}</p>
            <p className="mt-6 text-stone md:text-lg">{item.approach}</p>
          </FadeUp>
        </div>
      </section>

      {/* Results */}
      <section className="bg-ink text-ivory">
        <div className="mx-auto max-w-site px-6 py-20 md:px-10 md:py-32">
          <FadeUp>
            <p className="u-label text-stone">{labels.resultsLabel}</p>
          </FadeUp>
          <Stagger className="mt-10 grid grid-cols-1 gap-px border-t u-hairline-inverse pt-8 sm:grid-cols-3">
            {item.results.map((stat) => (
              <StaggerItem
                key={stat.label}
                className="py-6 sm:border-l sm:first:border-l-0 sm:px-8 sm:first:pl-0 u-hairline-inverse"
              >
                <Counter
                  stat={stat}
                  valueClassName="text-[clamp(2.5rem,4.5vw,4rem)] text-ivory"
                  labelClassName="text-stone"
                />
              </StaggerItem>
            ))}
          </Stagger>

          {testimonial && (
            <FadeUp className="mt-20 border-t u-hairline-inverse pt-12">
              <blockquote className="max-w-4xl font-display text-2xl italic leading-snug tracking-[-0.02em] md:text-4xl">
                “{testimonial.quote}”
              </blockquote>
              <p className="u-label mt-8 text-stone">
                {testimonial.author} — {testimonial.role},{" "}
                <span className="text-ivory">{testimonial.business}</span>
              </p>
            </FadeUp>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-site px-6 py-20 md:px-10 md:py-32">
        <FadeUp>
          <p className="u-label text-terracotta">{labels.galleryLabel}</p>
        </FadeUp>
        <div className="mt-10 grid gap-10">
          {item.gallery.map((image) => (
            <FadeUp key={image.src}>
              <ParallaxImage
                src={image.src}
                alt={image.alt}
                sizes="100vw"
                className="aspect-[16/10] w-full"
              />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Prev / next navigation */}
      <nav
        aria-label="Project navigation"
        className="border-t u-hairline"
      >
        <div className="mx-auto grid max-w-site md:grid-cols-2">
          <Link
            href={`/work/${prev.slug}`}
            className="group border-b u-hairline px-6 py-10 transition-colors duration-300 hover:bg-ink md:border-b-0 md:border-r md:px-10 md:py-16"
          >
            <p className="u-label text-stone">← {labels.prevLabel}</p>
            <p className="mt-3 font-display text-2xl tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-ivory md:text-4xl">
              {prev.client}
            </p>
          </Link>
          <Link
            href={`/work/${next.slug}`}
            className="group px-6 py-10 text-right transition-colors duration-300 hover:bg-ink md:px-10 md:py-16"
          >
            <p className="u-label text-stone">{labels.nextLabel} →</p>
            <p className="mt-3 font-display text-2xl tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-ivory md:text-4xl">
              {next.client}
            </p>
          </Link>
        </div>
      </nav>
    </article>
  );
}
