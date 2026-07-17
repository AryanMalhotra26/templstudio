import type { Metadata } from "next";
import { site } from "@/content/site";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/motion/Marquee";
import Intro from "@/components/home/Intro";
import ServicesList from "@/components/home/ServicesList";
import FeaturedWork from "@/components/home/FeaturedWork";
import Process from "@/components/home/Process";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";

export const metadata: Metadata = {
  title: site.seo.home.title,
  description: site.seo.home.description,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={site.marqueeItems} tilt />
      <Intro />
      <ServicesList />
      <FeaturedWork />
      <Process />
      <Testimonials />
      <FaqSection />
      <Marquee items={site.marqueeItems} inverted glyph="✺" />
    </>
  );
}
