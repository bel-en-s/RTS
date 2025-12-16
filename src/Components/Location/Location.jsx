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
  const playedRef = useRef(false);

  const markerData = [
    { name: "BUENOS AIRES" },
    { name: "HUSTON" },
    { name: "BAHÍA BLANCA" },
    { name: "TAMPICO" },
    { name: "MADRID" },
    { name: "SANTIAGO DE CHILE" },
  ];



  return (
    <section className="presence-section" ref={rootRef}>
      <div className="presence-container">
        <div className="presence-left">
          <h4 className="presence-label">LOCATION</h4>
          <h2 className="presence-title">GLOBAL PRESENCE</h2>

          <p className="presence-text">
            From America to Europe, we deliver world-class engineering, integration,
            and field services. With offices and partners across key regions, we
            combine global experience with local insight to support every stage of
            your industrial automation journey.
          </p>

          <ApproachButton />
        </div>

        <div className="presence-right">
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
    </section>
  );
}
