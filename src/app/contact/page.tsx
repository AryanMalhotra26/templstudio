import type { Metadata } from "next";
import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import FadeUp from "@/components/motion/FadeUp";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: site.seo.contact.title,
  description: site.seo.contact.description,
};

export default function ContactPage() {
  const { contact, brand, footer } = site;

  return (
    <section className="bg-ivory pt-36 md:pt-48">
      <div className="mx-auto grid max-w-site gap-16 px-6 pb-24 md:grid-cols-2 md:gap-10 md:px-10 md:pb-40">
        {/* Left: headline + direct contact */}
        <div>
          <SectionLabel text={contact.label} />
          <RevealText
            text={contact.headline}
            as="h1"
            className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.02] tracking-[-0.02em] text-ink"
          />
          <FadeUp delay={0.15}>
            <p className="mt-8 max-w-md text-lg text-stone">{contact.subhead}</p>
          </FadeUp>

          <FadeUp delay={0.2} className="mt-12 border-t u-hairline pt-8">
            <p className="u-label text-stone">{contact.form.emailNote}</p>
            <a
              href={`mailto:${brand.email}`}
              className="u-underline-sweep mt-2 inline-block font-display text-2xl tracking-[-0.02em] text-ink hover:text-terracotta md:text-4xl"
            >
              {brand.email}
            </a>
            <p className="u-label mt-6 text-terracotta">{contact.responseNote}</p>
          </FadeUp>

          <FadeUp delay={0.25} className="mt-12 flex gap-6">
            {footer.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="u-label u-underline-sweep text-stone hover:text-ink"
              >
                {social.label} ↗
              </a>
            ))}
          </FadeUp>
        </div>

        {/* Right: the form */}
        <FadeUp delay={0.2}>
          <ContactForm />
        </FadeUp>
      </div>
    </section>
  );
}
