"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the overlay menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-studio ${
          scrolled
            ? "border-b u-hairline bg-ivory/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          className={`mx-auto flex max-w-site items-center justify-between px-6 transition-all duration-500 ease-studio md:px-10 ${
            scrolled ? "py-3.5 md:py-4" : "py-5 md:py-7"
          }`}
        >
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-tight text-ink"
          >
            {site.brand.name}
            <span className="text-terracotta">.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {site.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`u-label u-underline-sweep transition-colors duration-300 ${
                  pathname === link.href
                    ? "text-terracotta"
                    : "text-ink hover:text-terracotta"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={site.hero.primaryCta.href}
              className="group relative overflow-hidden rounded-full border border-ink px-5 py-2.5 u-label text-ink transition-colors duration-300 hover:text-ivory"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-300 ease-studio group-hover:scale-y-100 motion-reduce:transition-none"
              />
              <span className="relative z-10">{site.hero.primaryCta.label}</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="u-label relative z-[70] text-ink md:hidden"
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </nav>
      </header>

      {/* Full-screen ink overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[60] flex flex-col justify-between bg-ink px-6 pb-10 pt-28"
          >
            <motion.nav
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.07, delayChildren: 0.15 }}
              className="flex flex-col gap-2"
            >
              {[{ label: "Home", href: "/" }, ...site.nav].map((link) => (
                <span key={link.href} className="u-mask">
                  <motion.span
                    className="block"
                    variants={{
                      hidden: { y: "110%" },
                      visible: {
                        y: "0%",
                        transition: { duration: 0.8, ease: EASE },
                      },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`font-display text-5xl tracking-tight transition-colors duration-300 ${
                        pathname === link.href
                          ? "italic text-terracotta"
                          : "text-ivory"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.span>
                </span>
              ))}
            </motion.nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-end justify-between border-t u-hairline-inverse pt-6"
            >
              <div>
                <p className="u-label text-stone">{site.brand.location}</p>
                <a
                  href={`mailto:${site.brand.email}`}
                  className="u-label u-underline-sweep mt-1 inline-block text-ivory"
                >
                  {site.brand.email}
                </a>
              </div>
              <p className="u-label text-stone">EST. {site.brand.est}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
