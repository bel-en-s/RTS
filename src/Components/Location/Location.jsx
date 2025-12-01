import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Location.css";
import mapImg from "../../assets/map.png";

export default function Location() {
  const markersRef = useRef([]);
  const timelinesRef = useRef([]);

  const markerData = [
    { name: "HOUSTON" },
    { name: "BUENOS AIRES" },
    { name: "BAHÍA BLANCA" },
    { name: "TAMPICO" },
    { name: "MADRID" },
    { name: "SANTIAGO DE CHILE" },
  ];

  useEffect(() => {
    const isMobile = window.innerWidth < 820;
    const markers = markersRef.current;

    markers.forEach((marker, i) => {
      const tooltip = marker.querySelector(".marker-tooltip");

      // SKIP animaciones en mobile (tooltip always visible)
      if (isMobile) return;

      // Creamos timeline por marker
      const tl = gsap.timeline({ paused: true });

      tl.to(marker, {
        scale: 1.25,
        duration: 0.25,
        ease: "power2.out",
      });

      tl.to(
        tooltip,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          ease: "power3.out",
        },
        "<0.05"
      );

      // Guardamos timeline
      timelinesRef.current[i] = tl;

      // Hover in
      marker.addEventListener("mouseenter", () => {
        timelinesRef.current[i].play();
      });

      // Hover out
      marker.addEventListener("mouseleave", () => {
        timelinesRef.current[i].reverse();
      });
    });
  }, []);

  return (
    <section className="presence-section">
      <div className="presence-container">

        <div className="presence-left">
          <span className="presence-label">LOCATIONS</span>

          <h2 className="presence-title">GLOBAL PRESENCE</h2>

          <p className="presence-text">
            From America to Europe, we deliver world-class engineering,
            integration, and field services. With offices and partners across
            key regions, we combine global experience with local insight to
            support every stage of your industrial automation journey.
          </p>
        </div>

        <div className="presence-right">
          <img src={mapImg} alt="Global map" className="presence-map" />

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
