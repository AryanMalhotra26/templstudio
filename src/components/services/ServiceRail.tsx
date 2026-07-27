"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

/**
 * The seven services as one composed section rather than seven repeated
 * blocks: a sticky index rail on the left that lights the service you are
 * currently reading, and the detail panels scrolling past it on the right.
 *
 * The old page stacked seven identical image-left/text-right splits, which
 * gave a reader no sense of where they were or how much was left. The rail
 * is the fix — it doubles as in-page navigation and as a progress readout.
 *
 * Active state comes from an IntersectionObserver with a band across the
 * middle of the viewport, not a scroll listener: no per-frame work, and it
 * behaves the same on touch, wheel and keyboard.
 */
export default function ServiceRail() {
  const { services, servicesPage } = site;
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const panels = Array.from(
      root.querySelectorAll<HTMLElement>(".service-panel"),
    );
    if (!panels.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = panels.indexOf(entry.target as HTMLElement);
          if (i >= 0) setActive(i);
        });
      },
      // A thin band across the viewport's middle: whichever panel crosses it
      // owns the rail. Panels are taller than the band, so exactly one does.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    panels.forEach((panel) => io.observe(panel));
    return () => io.disconnect();
  }, []);

  const total = String(services.length).padStart(2, "0");

  return (
    <section ref={rootRef} className="section_service-rail theme-dark">
      <div className="padding-global">
        <div className="container-col-12">
          <div className="service-rail">
            {/* Rail. Its own text is state, not prose, so it opts out of the
                global reveal and stays readable while it is pinned. */}
            <div className="service-rail_aside" data-gsap-ignore>
              <nav
                className="service-rail_nav"
                aria-label={servicesPage.indexLabel}
              >
                <ol className="service-rail_list">
                  {services.map((service, i) => (
                    <li key={service.slug}>
                      <a
                        href={`#${service.slug}`}
                        className="service-rail_link"
                        data-active={i === active ? "true" : "false"}
                        aria-current={i === active ? "true" : undefined}
                      >
                        <span className="service-rail_num">
                          {service.index}
                        </span>
                        <span className="service-rail_name">
                          {service.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <p className="service-rail_count" aria-hidden>
                <span className="is-current">
                  {String(active + 1).padStart(2, "0")}
                </span>
                <span> / {total}</span>
              </p>
            </div>

            <div className="service-rail_panels">
              {services.map((service, i) => (
                <article
                  key={service.slug}
                  id={service.slug}
                  className="service-panel"
                >
                  <span className="service-panel_ghost" aria-hidden>
                    {service.index}
                  </span>

                  {/* Below the desktop tier the rail has nowhere to live, so
                      each panel carries its own position instead. Without it
                      seven full-height panels give a phone no sense of how
                      far in you are or how much is left. */}
                  <span className="service-panel_step" aria-hidden>
                    {service.index} / {total}
                  </span>

                  <div className="service-panel_head">
                    <h2 className="heading-s services-h">{service.name}</h2>
                    <p className="paragraph-l service-panel_lede">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="service-panel_plate">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      width={640}
                      height={800}
                      // Seven full-width plates on a phone is the page's
                      // whole image weight; only the first is ever near
                      // the fold.
                      loading={i === 0 ? undefined : "lazy"}
                      decoding="async"
                    />
                  </div>

                  <div className="service-panel_body">
                    <p className="paragraph-s service-panel_copy">
                      {service.description}
                    </p>
                    <p className="service-panel_price" data-gsap-ignore>
                      <span className="service-panel_from">
                        {servicesPage.fromLabel}
                      </span>
                      <span className="service-panel_amount">
                        {service.startingPrice}
                      </span>
                    </p>
                  </div>

                  <div className="service-panel_deliverables" data-gsap-ignore>
                    <p className="service-panel_deliverables-label">
                      {servicesPage.deliverablesLabel}
                    </p>
                    <ul className="service-panel_list">
                      {service.deliverables.map((item) => (
                        <li key={item}>
                          <span className="service-panel_mark" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
