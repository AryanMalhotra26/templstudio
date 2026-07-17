import { site } from "@/content/site";
import RevealText from "@/components/motion/RevealText";
import FadeUp from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const { notFound } = site;

  return (
    <section className="flex min-h-[80svh] flex-col justify-center bg-ivory pt-28">
      <div className="mx-auto w-full max-w-site px-6 md:px-10">
        <p className="u-label text-terracotta">(404) — PAGE NOT FOUND ©</p>
        <RevealText
          text={notFound.headline}
          as="h1"
          className="mt-6 font-display text-[clamp(4rem,14vw,12rem)] leading-[0.95] tracking-[-0.02em] text-ink"
        />
        <FadeUp delay={0.2}>
          <p className="mt-6 max-w-md text-lg text-stone">{notFound.message}</p>
        </FadeUp>
        <FadeUp delay={0.3} className="mt-10">
          <Button href={notFound.cta.href} variant="primary">
            {notFound.cta.label}
          </Button>
        </FadeUp>
      </div>
    </section>
  );
}
