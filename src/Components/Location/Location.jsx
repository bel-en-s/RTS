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

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      const pinEl = q(".presence-container")[0];
      const map = q(".presence-map")[0];
      const leftEls = q(".presence-left > *");

      const markers = markersRef.current.filter(Boolean);
      const tooltips = markers
        .map((m) => m.querySelector(".marker-tooltip"))
        .filter(Boolean);

      const isMobile = () => window.innerWidth < 820;

      const setInitial = () => {
        if (!isMobile()) {
          gsap.set(leftEls, { autoAlpha: 0, y: 22, filter: "blur(10px)" });
          gsap.set(map, { autoAlpha: 0, scale: 1.05, filter: "blur(10px)" });
          gsap.set(tooltips, { autoAlpha: 0, y: 10 });
        } else {
          gsap.set(map, { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
          gsap.set(tooltips, { autoAlpha: 1, y: 0 });
        }

        gsap.set(markers, {
          autoAlpha: 0,
          scale: 0.65,
          transformOrigin: "50% 50%",
        });
      };

      const setFinal = () => {
        if (!isMobile()) {
          gsap.set(leftEls, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
          gsap.set(map, { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
          gsap.set(tooltips, { autoAlpha: 0, y: 10 });
        } else {
          gsap.set(map, { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
          gsap.set(tooltips, { autoAlpha: 1, y: 0 });
        }

        gsap.set(markers, { autoAlpha: 1, scale: 1 });
      };

      if (playedRef.current) setFinal();
      else setInitial();

      const reveal = gsap.timeline({ paused: true });

      reveal.add(() => {
        if (isMobile()) return;
      }, 0);

      reveal.to(
        leftEls,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          overwrite: "auto",
        },
        0
      );

      reveal.to(
        map,
        {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.95,
          ease: "power3.out",
          overwrite: "auto",
        },
        0.05
      );

      reveal.to(
        markers,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.22,
          stagger: 0.06,
          ease: "power2.out",
          overwrite: "auto",
        },
        0.25
      );

      const revealST = ScrollTrigger.create({
        trigger: root,
        start: "top 78%",
        once: true,
        invalidateOnRefresh: true,
        onEnter: () => {
          if (playedRef.current) return;
          playedRef.current = true;
          reveal.play(0);
        },
      });

      const pinST = ScrollTrigger.create({
        trigger: root,
        start: () => (isMobile() ? "top top" : "top top+=90"),
        end: () =>
          isMobile() ? "top top" : `+=${Math.min(window.innerHeight * 0.45, 520)}`,
        pin: !isMobile() ? pinEl : false,
        pinSpacing: !isMobile(),
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      const cleanups = [];

      const bindHover = () => {
        markers.forEach((marker) => {
          const tooltip = marker?.querySelector(".marker-tooltip");
          if (!marker || !tooltip) return;

          const onEnter = () => {
            gsap.to(marker, {
              scale: 1.25,
              duration: 0.22,
              ease: "power2.out",
              overwrite: true,
            });
            gsap.to(tooltip, {
              autoAlpha: 1,
              y: 0,
              duration: 0.22,
              ease: "power2.out",
              overwrite: true,
            });
          };

          const onLeave = () => {
            gsap.to(marker, {
              scale: 1,
              duration: 0.22,
              ease: "power2.out",
              overwrite: true,
            });
            gsap.to(tooltip, {
              autoAlpha: 0,
              y: 10,
              duration: 0.22,
              ease: "power2.out",
              overwrite: true,
            });
          };

          marker.addEventListener("mouseenter", onEnter);
          marker.addEventListener("mouseleave", onLeave);

          cleanups.push(() => {
            marker.removeEventListener("mouseenter", onEnter);
            marker.removeEventListener("mouseleave", onLeave);
          });
        });
      };

      if (!isMobile()) bindHover();

      const mm = ScrollTrigger.matchMedia({
        "(max-width: 819px)": () => {
          cleanups.forEach((fn) => fn());
        },
        "(min-width: 820px)": () => {
          if (!cleanups.length) bindHover();
        },
      });

      const img = map;
      if (img && img.complete !== true) {
        img.addEventListener("load", ScrollTrigger.refresh, { once: true });
      }

      return () => {
        mm.kill();
        revealST.kill();
        pinST.kill();
        reveal.kill();
        cleanups.forEach((fn) => fn());
      };
    }, root);

    return () => ctx.revert();
  }, []);

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
