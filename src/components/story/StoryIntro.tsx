import { story } from "@/content/story";

/**
 * Story section 2 — who's telling it. One centred line, then the two founders
 * as tall 2:3 portraits with their names set in half-opacity serif underneath.
 */
export default function StoryIntro() {
  const { intro } = story;

  return (
    <section className="section_story-intro theme-dark">
      <div className="section-padding-128px">
        <div className="padding-global">
          <div className="container-col-08">
            <div className="story-intro">
              <h2 className="heading-m">{intro.headline}</h2>

              <div className="story-intro_cards">
                {intro.founders.map((f) => (
                  <div className="story-intro_card" key={f.name}>
                    <div className="story-intro_card-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.image} alt={f.name} />
                    </div>
                    <div className="story-intro_card-name">
                      <h3 className="story-intro-card_h">{f.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
