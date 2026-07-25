"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import BtnIcon from "@/components/ui/BtnIcon";

/**
 * Fixed nav, ported from the reference.
 *
 * Links sit dead-centre with a red dot that pops in on hover; the studio mark
 * is left, the standing CTA right. The nav has no background of its own —
 * instead it samples whichever themed section is under it (3rem from the top
 * of the viewport) and adopts that section's `theme-*` class, so the type and
 * button recolour as you scroll from lime hero → dark services → chrome
 * footer. Pages with no themed sections stay on the default theme.
 */

const THEME_PREFIX = "theme-";
const SAMPLE_OFFSET_REM = 3;
const DEFAULT_THEME = "theme-default";

/** The studio mark: the same six-point spark that sits inside the wordmark. */
function StudioMark() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden>
      <path
        fill="currentColor"
        d="M16 1.5c.63 0 1.14.5 1.16 1.13l.2 7.3 5.2-5.13a1.16 1.16 0 0 1 1.68 1.6l-4.9 5.4 7.13-.75a1.16 1.16 0 0 1 .3 2.3l-6.95 1.5 6.72 2.42a1.16 1.16 0 0 1-.7 2.2l-6.97-1.9 4.5 5.73a1.16 1.16 0 0 1-1.8 1.44l-4.4-5.86-.87 7.2a1.16 1.16 0 0 1-2.3 0l-.88-7.2-4.4 5.86a1.16 1.16 0 0 1-1.8-1.44l4.5-5.73-6.96 1.9a1.16 1.16 0 0 1-.7-2.2l6.72-2.42-6.95-1.5a1.16 1.16 0 0 1 .3-2.3l7.12.75-4.9-5.4a1.16 1.16 0 0 1 1.7-1.6l5.2 5.13.19-7.3c.02-.63.53-1.13 1.16-1.13Z"
      />
    </svg>
  );
}

export default function Nav() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Sample the themed section under the nav on every scroll frame.
  useEffect(() => {
    let queued = false;

    const themeOf = (el: Element) =>
      Array.from(el.classList).find((c) => c.startsWith(THEME_PREFIX)) ?? null;

    const sample = () => {
      const offset =
        SAMPLE_OFFSET_REM *
        parseFloat(getComputedStyle(document.documentElement).fontSize);
      let found: string | null = null;
      document.querySelectorAll("section, header, footer").forEach((el) => {
        if (!themeOf(el)) return;
        const r = el.getBoundingClientRect();
        if (r.top <= offset && r.bottom > offset) found = themeOf(el);
      });
      setTheme(found ?? DEFAULT_THEME);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        sample();
        queued = false;
      });
    };

    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => setMenuOpen(false), [pathname]);

  // The reference forces the default theme and locks scroll while the mobile
  // menu is open, so the panel always reads the same way.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navTheme = menuOpen ? DEFAULT_THEME : theme;

  return (
    <>
      <div className={`nav ${navTheme}`} data-gsap-ignore>
        {/* Ahead of the padding-global block on purpose: `.nav-links` is
            absolutely positioned with no `top`, so its static position — and
            therefore its vertical placement — comes from DOM order, exactly
            as on the reference. */}
        <div className="nav-links">
          <div className="nav-links_wrapper">
            {site.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                aria-current={pathname === link.href ? "page" : undefined}
              >
                <span className="nav-link-dot_wrap">
                  <span className="nav-link-dot" />
                </span>
                <span className="nav-link-text">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="padding-global">
          <div className="container-col-12">
            <div className="nav-container">
              <div className="nav-inner">
                <Link
                  href="/"
                  className="nav-logo"
                  aria-label={`${site.brand.name} — home`}
                >
                  <StudioMark />
                </Link>

                <div className="nav-button">
                  <BtnIcon label="Work with us" href="/contact" />
                  <button
                    type="button"
                    className="menu-button"
                    aria-expanded={menuOpen}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    <span className="btn-icon-content is-secondary">
                      <span className="btn-icon-content__mask">
                        <span className="btn-icon-content__text">
                          {menuOpen ? "Close" : "Menu"}
                        </span>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {menuOpen && (
        <div className="nav-menu-panel theme-dark" data-gsap-ignore>
          {[{ label: "Home", href: "/" }, ...site.nav].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="heading-s"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: "2em" }}>
            <BtnIcon label="Work with us" href="/contact" />
          </div>
        </div>
      )}
    </>
  );
}
