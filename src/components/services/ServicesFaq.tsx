"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { accent } from "./accent";

/**
 * Closing FAQ. One row open at a time; the plus turns into a cross so the
 * control states its own affordance rather than relying on the row moving.
 *
 * The open/close is a `grid-template-rows: 0fr → 1fr` transition rather than
 * an animated height, for the same reason as the package swap: it runs on the
 * compositor, so a stalled frame loop can never leave an answer stuck at
 * height zero. `prefers-reduced-motion` is handled by the global reduce block
 * in globals.css, which flattens every transition on the page.
 */
export default function ServicesFaq() {
  const { faq, servicesPage } = site;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section_services-faq theme-default">
      <div className="section-padding-128px">
        <div className="padding-global">
          <div className="container-col-12">
            <div className="services-faq">
              <h2 className="heading-m services-h services-faq_h">
                {accent(servicesPage.faq.headline)}
              </h2>

              {/* Opted out of the global reveal, and not optional: SplitText
                  rewrites the innerHTML of every heading it touches, which
                  would wrap these buttons in its own line masks and orphan
                  them from React. The rows would then render but never open,
                  and the next re-render throws on removeChild. */}
              <div className="services-faq_list" data-gsap-ignore>
                {faq.map((item, i) => {
                  const isOpen = open === i;
                  const panelId = `faq-panel-${i}`;
                  return (
                    <div
                      className="services-faq_row"
                      data-open={isOpen ? "true" : "false"}
                      key={item.question}
                    >
                      <h3>
                        <button
                          type="button"
                          className="services-faq_q"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setOpen(isOpen ? null : i)}
                        >
                          <span>{item.question}</span>
                          <span className="services-faq_icon" aria-hidden>
                            <span className="services-faq_bar" />
                            <span className="services-faq_bar is-vertical" />
                          </span>
                        </button>
                      </h3>

                      <div className="services-faq_a" id={panelId} role="region">
                        <div className="services-faq_a-inner">
                          <p className="paragraph-s">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
