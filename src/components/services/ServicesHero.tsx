import Link from "next/link";
import { site } from "@/content/site";
import BtnIcon from "@/components/ui/BtnIcon";
import { accent } from "./accent";

/**
 * Services hero — lime, asymmetric split.
 *
 * Left is the claim and the single page CTA. Right is the seven services as a
 * real jump index with their prices, so the page opens by answering the two
 * questions this page exists for ("what do you do" and "what does it cost")
 * before any scrolling happens, and gives the rest of the page a table of
 * contents rather than making people wade through it.
 */
export default function ServicesHero() {
  const { servicesPage, services } = site;

  return (
    <header className="section_services-hero theme-lime">
      <div className="padding-global">
        <div className="container-col-12">
          <div className="services-hero">
            <div className="services-hero_claim">
              <h1 className="heading-xl services-h">
                {accent(servicesPage.headline)}
              </h1>
              <p className="paragraph-m services-hero_sub">
                {servicesPage.subhead}
              </p>
              <div className="button-wrap">
                <BtnIcon
                  label={servicesPage.cta.label}
                  href={servicesPage.cta.href}
                />
              </div>
            </div>

            {/* Opted out of the global line reveal: these are links, and rows
                sitting masked below their own line would read as missing. */}
            <nav
              className="services-hero_index"
              aria-label={servicesPage.indexLabel}
              data-gsap-ignore
            >
              <p className="paragraph-xxs services-index_label">
                {servicesPage.indexLabel}
              </p>
              <ul className="services-index">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`#${service.slug}`}
                      className="services-index_row"
                    >
                      <span className="services-index_num">
                        {service.index}
                      </span>
                      <span className="services-index_name">
                        {service.name}
                      </span>
                      <span className="services-index_price">
                        {servicesPage.fromLabel} {service.startingPrice}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
