import "./BannerText.css";

export default function BannerText({
  imgOne,
  imgAlt = "Banner image",

  topTitle = "WE ARE COMMITTED TO DELIVERING",
  highlight = "EFFICIENT & RELIABLE",
  topTitleEnd = "SOLUTIONS",

  kicker = "AUTOMATION & CONTROLS",
  title = "FIELD SERVICES\nDEPARTMENT",
  paragraph = "Our skilled resources are equipped to provide on-site assistance for surveys, maintenance, commissioning, start-up, audits, and performance evaluations, delivering top-tier service to meet your operational needs.",

  leftItems = [
    "Factory Acceptance Testing (FAT)",
    "Configuration and Commissioning",
    "Shutdown, Turnaround & Outage Support",
  ],
  rightItems = ["Start-up Services", "Installation Services", "Site Acceptance Testing (SAT)"],
}) {
  return (
    <section className="bt-root">
      <section className="bannerText bt-banner">

        <div className="bannerText__inner">
          <h2 className="bannerText__title">
            {topTitle} <span className="bannerText__highlight">{highlight}</span> {topTitleEnd}
          </h2>
        </div>

        {/* Image */}
        <div className="bannerText__bleed">
          {imgOne ? <img className="bannerText__img" src={imgOne} alt={imgAlt} /> : null}
        </div>

        {/* Bottom content */}
        <div className="bannerText__bottom">
          <div className="bannerText__bottomInner">
            <div className="bannerText__grid bt-gridCenter">
              <div className="bannerText__left">
                <p className="bannerText__kicker">{kicker}</p>
                <h3 className="bannerText__h3">{title}</h3>
              </div>

              <div className="bannerText__right">
                <p className="bannerText__p bt-text">{paragraph}</p>

                <div className="bannerText__lists">
                  <ul className="bannerText__list">
                    {leftItems.map((t) => (
                      <li key={t} className="bannerText__li">
                        <span className="bannerText__check" aria-hidden="true" />
                        <span className="bannerText__liText">{t}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="bannerText__list">
                    {rightItems.map((t) => (
                      <li key={t} className="bannerText__li">
                        <span className="bannerText__check" aria-hidden="true" />
                        <span className="bannerText__liText">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
