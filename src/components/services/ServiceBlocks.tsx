import Image from "next/image";
import { site } from "@/content/site";
import FadeUp from "@/components/motion/FadeUp";
import RevealText from "@/components/motion/RevealText";
import Button from "@/components/ui/Button";

/**
 * Each service as an alternating full-width block: sticky image column +
 * scrolling text column on desktop, stacked on mobile.
 */
export default function ServiceBlocks() {
  const { services, servicesPage, hero } = site;

  return (
    <div>
      {services.map((service, i) => {
        const reversed = i % 2 === 1;
        return (
          <section
            key={service.slug}
            id={service.slug}
            className="scroll-mt-24 border-t u-hairline"
          >
            <div
              className={`mx-auto grid max-w-site gap-10 px-6 py-16 md:grid-cols-2 md:gap-16 md:px-10 md:py-28 ${
                reversed ? "" : ""
              }`}
            >
              {/* Sticky image column */}
              <div className={reversed ? "md:order-2" : ""}>
                <div className="md:sticky md:top-28">
                  <FadeUp>
                    <div className="u-grain relative aspect-[4/5] max-h-[70vh] w-full overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.imageAlt}
                        fill
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </FadeUp>
                </div>
              </div>

              {/* Text column */}
              <div className={reversed ? "md:order-1" : ""}>
                <FadeUp>
                  <p className="u-label text-terracotta">
                    ({service.index}) — {servicesPage.fromLabel}{" "}
                    <span className="text-ink">{service.startingPrice}</span>
                  </p>
                </FadeUp>
                <RevealText
                  text={service.name}
                  as="h2"
                  className="mt-5 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-ink"
                />
                <FadeUp delay={0.1}>
                  <p className="mt-4 font-display text-xl italic text-stone md:text-2xl">
                    {service.shortDescription}
                  </p>
                  <p className="mt-6 max-w-lg text-stone">{service.description}</p>
                </FadeUp>

                <FadeUp delay={0.15} className="mt-10">
                  <p className="u-label text-stone">
                    {servicesPage.deliverablesLabel}
                  </p>
                  <ul className="mt-4 border-t u-hairline">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-4 border-b u-hairline py-3"
                      >
                        <span aria-hidden className="u-label text-terracotta">
                          ✓
                        </span>
                        <span className="u-label !text-[13px] !normal-case !tracking-normal text-ink">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </FadeUp>

                <FadeUp delay={0.2} className="mt-10">
                  <Button href={hero.primaryCta.href} variant="ghost">
                    {hero.primaryCta.label}
                  </Button>
                </FadeUp>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
