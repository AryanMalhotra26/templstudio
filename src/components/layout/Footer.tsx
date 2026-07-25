import Link from "next/link";
import { site } from "@/content/site";
import { home } from "@/content/home";
import ChromeWordmark from "@/components/ui/ChromeWordmark";

/**
 * Footer, ported from the reference: a full-viewport brushed-chrome plate with
 * the wordmark across the top, the sitemap bottom-left, two chrome-object
 * cards bottom-right, and a hairline legal bar.
 */
export default function Footer() {
  const { footer } = home;

  return (
    <footer className="footer theme-chrome" data-gsap-ignore>
      <div className="footer-bg" />
      <div className="padding-global">
        <div className="container-col-12">
          <div className="footer_wrapper">
            <ChromeWordmark
              className="footer-logo"
              itemClassName="footer-logo_item"
              idPrefix="footer"
            />

            <div className="footer-main">
              <div className="footer-main_top">
                <div className="footer-main_sitemap">
                  <h2 className="footer-main_title">{footer.sitemapTitle}</h2>
                  <div className="footer-main_sitemap-links">
                    {footer.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="footer-main_link paragraph-regular"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="footer-main_cards">
                  {footer.cards.map((card) => (
                    <div key={card.title} className="footer-main_card">
                      <p className="paragraph-m">{card.title}</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.object.src}
                        alt={card.object.alt}
                        className={`footer-main_card-img${
                          card.title === "Social" ? " is-social" : ""
                        }`}
                      />
                      <div className="footer-main_card-links">
                        {card.links.map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            className="footer-social_link paragraph-xs"
                            aria-label={l.label}
                          >
                            {l.glyph}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="footer-main_bottom">
                <div className="footer-main_bottom-col">
                  <span className="paragraph-xs">
                    ©{site.brand.est} {footer.legal}
                  </span>
                  {footer.bottomLinks.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      className="footer-bottom_link paragraph-xs"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
                <span className="footer-bottom_link paragraph-xs">
                  {footer.credit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
