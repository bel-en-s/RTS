import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./BannerText.css";

gsap.registerPlugin(ScrollTrigger);

export default function BannerText({
  imgOne,
  imgTwo,
  imgAlt = "Banner image",

  topTitle = "WE ARE COMMITTED TO DELIVERING",
  highlight = "EFFICIENT & RELIABLE",
  topTitleEnd = "SOLUTIONS",

  // Panel 1
  kicker = "AUTOMATION & CONTROLS",
  title = "FIELD SERVICES\nDEPARTMENT",
  paragraph =
    "Our skilled resources are equipped to provide on-site assistance for surveys, maintenance, commissioning, start-up, audits, and performance evaluations, delivering top-tier service to meet your operational needs.",
  leftItems = [
    "Factory Acceptance Testing (FAT)",
    "Configuration and Commissioning",
    "Shutdown, Turnaround & Outage Support",
  ],
  rightItems = ["Start-up Services", "Installation Services", "Site Acceptance Testing (SAT)"],

  // Panel 2
  nextKicker = "AUTOMATION & CONTROLS",
  nextTitle = "COMMERCIAL\nDEPARTMENT",
  nextParagraph =
    "This department regularly conducts product and service presentations tailored to various industrial processes, helping customers adapt to the latest technological advancements.\n\nBy fostering strategic agreements, we aim to maximize value for both our customers and RTS, prioritizing long-term partnerships and focusing on corporate, global, and regional collaborations.",
  nextLeftItems = ["Customer engagement", "Product presentations", "Process alignment"],
  nextRightItems = ["Long-term partnerships", "Regional support", "Global collaboration"],
}) {
  const rootRef = useRef(null);
  const pinRef = useRef(null);

  const wipeRef = useRef(null);
  const contentARef = useRef(null);
  const contentBRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    const hasWipe = !!imgTwo;

    const ctx = gsap.context(() => {
      // init (anti flash)
      if (hasWipe && wipeRef.current) {
        gsap.set(wipeRef.current, {
          clipPath: "inset(100% 0% 0% 0%)",
          WebkitClipPath: "inset(100% 0% 0% 0%)",
          willChange: "clip-path",
        });
      }

      if (contentBRef.current) {
        gsap.set(contentBRef.current, {
          autoAlpha: 0,
          y: 10,
          visibility: "visible",
          willChange: "transform,opacity",
        });
      }
      if (contentARef.current) {
        gsap.set(contentARef.current, { autoAlpha: 1, y: 0, willChange: "transform,opacity" });
      }

      // Timeline en “fases” (0..1 = wipe, luego hold)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 1.35)}`, // 👈 más largo para hold final
          pin: pin,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      // 0) pequeño hold inicial (opcional, premium)
      tl.to({}, { duration: 0.15 });

      // 1) wipe imagen B (bottom -> top)
      if (hasWipe && wipeRef.current) {
        tl.to(
          wipeRef.current,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            WebkitClipPath: "inset(0% 0% 0% 0%)",
            duration: 0.75,
          },
          0.0
        );
      }

      // 2) textos: A sale / B entra, durante el wipe
      if (contentARef.current) {
        tl.to(contentARef.current, { autoAlpha: 0, y: -10, duration: 0.25 }, 0.15);
      }
      if (contentBRef.current) {
        tl.to(contentBRef.current, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.3);
      }

      // 3) ✅ hold final: se queda pinneado mostrando imagen terminada
      tl.to({}, { duration: 0.45 });

      // refresh cuando cargan imágenes
      const imgs = root.querySelectorAll("img");
      const onLoad = () => ScrollTrigger.refresh();
      imgs.forEach((img) => {
        if (!img.complete) img.addEventListener("load", onLoad);
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);

      return () => {
        imgs.forEach((img) => img.removeEventListener("load", onLoad));
        window.removeEventListener("resize", onResize);
      };
    }, root);

    return () => ctx.revert();
  }, [imgTwo]);

  const renderLists = (l, r) => {
    const has = Array.isArray(l) && l.length && Array.isArray(r) && r.length;
    if (!has) return null;

    return (
      <div className="bannerText__lists">
        <ul className="bannerText__list">
          {l.map((t) => (
            <li key={t} className="bannerText__li">
              <span className="bannerText__check" aria-hidden="true" />
              <span className="bannerText__liText">{t}</span>
            </li>
          ))}
        </ul>

        <ul className="bannerText__list">
          {r.map((t) => (
            <li key={t} className="bannerText__li">
              <span className="bannerText__check" aria-hidden="true" />
              <span className="bannerText__liText">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section className="bt-root" ref={rootRef}>
      <section className="bannerText bt-banner" ref={pinRef}>
        <div className="bannerText__inner">
          <h2 className="bannerText__title">
            {topTitle} <span className="bannerText__highlight">{highlight}</span> {topTitleEnd}
          </h2>
        </div>

        <div className="bannerText__bleed">
          {imgOne ? <img className="bannerText__img bannerText__img--base" src={imgOne} alt={imgAlt} /> : null}

          {imgTwo ? (
            <div ref={wipeRef} className="bt-wipe">
              <img className="bannerText__img bannerText__img--next" src={imgTwo} alt={imgAlt} />
            </div>
          ) : null}
        </div>

        <div className="bannerText__bottom">
          <div className="bannerText__bottomInner">
            {/* PANEL A */}
            <div ref={contentARef} className="bt-content bt-content--a">
              <div className="bannerText__grid bt-gridCenter">
                <div className="bannerText__left">
                  <p className="bannerText__kicker">{kicker}</p>
                  <h3 className="bannerText__h3">{title}</h3>
                </div>

                <div className="bannerText__right">
                  <p className="bannerText__p bt-text">{paragraph}</p>
                  {renderLists(leftItems, rightItems)}
                </div>
              </div>
            </div>

            {/* PANEL B (overlay) */}
            <div ref={contentBRef} className="bt-content bt-content--b" aria-hidden="true">
              <div className="bannerText__grid bt-gridCenter">
                <div className="bannerText__left">
                  <p className="bannerText__kicker">{nextKicker}</p>
                  <h3 className="bannerText__h3">{nextTitle}</h3>
                </div>

                <div className="bannerText__right">
                  <p className="bannerText__p bt-text bt-preline">{nextParagraph}</p>
                  {renderLists(nextLeftItems, nextRightItems)}
                </div>
              </div>
            </div>
            {/* /PANEL B */}
          </div>
        </div>
      </section>
    </section>
  );
}
