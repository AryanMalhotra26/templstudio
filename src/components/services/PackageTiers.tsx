"use client";

import { useState, type CSSProperties } from "react";
import { site, type PackageSegment } from "@/content/site";
import BtnIcon from "@/components/ui/BtnIcon";
import MomentumGroup from "@/components/studio/MomentumGroup";
import { accent } from "./accent";

/**
 * Three tiers per audience, with a tab switch between the two audiences.
 *
 * The featured tier is raised and filled lime rather than being a third
 * identical box, so the recommendation is legible before its badge is read.
 *
 * The swap is a keyed remount plus a CSS enter animation, deliberately not
 * `AnimatePresence`. Two reasons. Prices must never be missing, and a stalled
 * JS frameloop leaves an `initial: { opacity: 0 }` card invisible with no way
 * back — the same class of failure that left the old hero parked outside its
 * mask. A CSS animation is driven by the document timeline instead, so it
 * cannot be stranded by main-thread work. Second, an exit transition on a
 * fixed three-card swap buys nothing except the chance of leaving a ghost
 * card behind mid-flight, which is exactly what it did.
 */
export default function PackageTiers() {
  const { packages, servicesPage } = site;
  const { segments, headline, subhead, featuredTag } = servicesPage.packages;
  const [segment, setSegment] = useState<PackageSegment>(segments[0].id);
  const visible = packages.filter((p) => p.segment === segment);

  return (
    <section className="section_packages theme-white">
      <div className="section-padding-128px">
        <div className="padding-global">
          <div className="container-col-12">
            <div className="packages_head">
              <h2 className="heading-m services-h">{accent(headline)}</h2>
              <p className="paragraph-s packages_sub">{subhead}</p>
            </div>

            {/* A tab bar rather than a pill toggle: the page's whole shape
                system is square. Each tab owns its own rule and scales it in,
                so there is nothing to measure and nothing to animate in JS. */}
            <div
              className="packages_tabs"
              role="tablist"
              aria-label="Package audience"
              data-gsap-ignore
            >
              {segments.map((seg) => (
                <button
                  key={seg.id}
                  type="button"
                  role="tab"
                  aria-selected={segment === seg.id}
                  onClick={() => setSegment(seg.id)}
                  className="packages_tab"
                  data-active={segment === seg.id ? "true" : "false"}
                >
                  <span>{seg.label}</span>
                  <span className="packages_tab-rule" aria-hidden />
                </button>
              ))}
            </div>

            {/* Keyed on the segment so the cards remount: that restarts the
                CSS enter animation, and re-runs MomentumGroup's `useGSAP` so
                the hover flick binds to the cards actually on screen.
                `data-gsap-ignore` is load-bearing, not cosmetic: SplitText
                would rewrite each card's heading innerHTML, and React then
                throws on removeChild when the segment switches. */}
            <div data-gsap-ignore>
              <MomentumGroup className="packages_grid" key={segment}>
                {visible.map((pkg, i) => (
                  <div
                    key={pkg.name}
                    data-momentum-el
                    data-featured={pkg.featured ? "true" : "false"}
                    className="package-cell"
                    style={{ "--i": i } as CSSProperties}
                  >
                    <div
                      data-momentum-target
                      className="package-card"
                      data-featured={pkg.featured ? "true" : "false"}
                    >
                      {pkg.featured && (
                        <p className="package-card_tag">{featuredTag}</p>
                      )}

                      <h3 className="heading-xs package-card_name">
                        {pkg.name}
                      </h3>
                      <p className="package-card_blurb">{pkg.blurb}</p>

                      <p className="package-card_price">
                        <span className="package-card_amount">{pkg.price}</span>
                        <span className="package-card_note">
                          {pkg.priceNote}
                        </span>
                      </p>

                      <ul className="package-card_list">
                        {pkg.includes.map((item) => (
                          <li key={item}>
                            <span className="package-card_mark" aria-hidden />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <div className="package-card_cta">
                        <BtnIcon
                          label={pkg.cta.label}
                          href={pkg.cta.href}
                          variant={pkg.featured ? "secondary" : "primary"}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </MomentumGroup>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
