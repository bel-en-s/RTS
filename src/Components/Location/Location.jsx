import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Location.css";
import mapImg from "../../assets/map.png";
import ApproachButton from "../UI/ApproachButton";

gsap.registerPlugin(ScrollTrigger);

export default function Location() {
  const markersRef = useRef([]);
  const rootRef = useRef(null);

  const markerData = [
    { name: "BUENOS AIRES" },
    { name: "HUSTON" },
    { name: "BAHÍA BLANCA" },
    { name: "TAMPICO" },
    { name: "MADRID" },
    { name: "SANTIAGO DE CHILE" },
  ];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const setOverlap = () => {
      const hub = document.querySelector("#hub");
      const spacer = hub ? hub.closest(".pin-spacer") : null;

      if (!spacer) {
        root.style.setProperty("--loc-overlap", "0px");
        return;
      }

      const spacerH = spacer.offsetHeight;
      const vh = window.innerHeight;

      const extra = Math.max(0, spacerH - vh);
      const maxOverlap = vh * 0.75;
      const buffer = Math.min(180, vh * 0.22);

      const overlap = Math.max(0, Math.min(extra, maxOverlap) - buffer);
      root.style.setProperty("--loc-overlap", `${overlap}px`);
    };

    setOverlap();
    requestAnimationFrame(() => ScrollTrigger.refresh());

    const onResize = () => {
      setOverlap();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize, { once: true });

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section className="presence-section" ref={rootRef} id="location">
      <div className="presence-container">
        <div className="presence-left">
          <h4 className="presence-label">LOCATION</h4>
          <h2 className="presence-title">GLOBAL PRESENCE</h2>

          <p className="presence-text presence-text-desktop">
            From America to Europe, we deliver world-class engineering, integration,
            and field services. With offices and partners across key regions, we
            combine global experience with local insight to support every stage of
            your industrial automation journey.
          </p>

          <p className="presence-text presence-text-mobile">
            From America to Europe, we deliver world-class engineering, integration,
            and field services. With offices and partners across key regions, we
            combine global experience with local insight to support every stage of
            your industrial automation journey.
          </p>

          <ApproachButton label="Book a meeting now" />
        </div>

        <div className="presence-right">
          <div className="presence-canvas">
            <div className="presence-mapWrap">
              <img src={mapImg} alt="Global map" className="presence-map" />
            </div>

            {markerData.map((item, i) => (
              <div
                key={i}
                ref={(el) => (markersRef.current[i] = el)}
                className={`marker m${i + 1}`}
              >
                <div className="marker-tooltip">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
