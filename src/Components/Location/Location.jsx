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
      const tooltips = markers.map((m) => m.querySelector(".marker-tooltip")).filter(Boolean);

      const isMobile = () => window.innerWidth < 820;

      const setDesktopInitial = () => {
        gsap.set(leftEls, { autoAlpha: 0, y: 18, filter: "blur(10px)" });
        gsap.set(map, { autoAlpha: 0, scale: 1.03, filter: "blur(10px)" });
        gsap.set(markers, { autoAlpha: 0, scale: 0.7, transformOrigin: "50% 50%" });
        gsap.set(tooltips, { autoAlpha: 0, y: 10 });
      };

      const setDesktopFinal = () => {
        gsap.set(leftEls, { autoAlpha: 1, y: 0, filter: "none" });
        gsap.set(map, { autoAlpha: 1, scale: 1, filter: "none" });
        gsap.set(markers, { autoAlpha: 1, scale: 1 });
        gsap.set(tooltips, { autoAlpha: 0, y: 10 });
        gsap.set([leftEls, map], { clearProps: "filter" });
      };

      const setMobileFinal = () => {
        gsap.set(leftEls, { autoAlpha: 1, y: 0, filter: "none" });
        gsap.set(map, { autoAlpha: 1, scale: 1, filter: "none" });
        gsap.set(markers, { autoAlpha: 1, scale: 1 });
        gsap.set(tooltips, { autoAlpha: 1, y: 0 });
        gsap.set([leftEls, map], { clearProps: "filter" });
      };

      const bindHover = () => {
        const cleanups = [];

        markers.forEach((marker) => {
          const tooltip = marker?.querySelector(".marker-tooltip");
          if (!marker || !tooltip) return;

          const onEnter = () => {
            gsap.to(marker, { scale: 1.22, duration: 0.22, ease: "power2.out", overwrite: true });
            gsap.to(tooltip, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out", overwrite: true });
          };

          const onLeave = () => {
            gsap.to(marker, { scale: 1, duration: 0.22, ease: "power2.out", overwrite: true });
            gsap.to(tooltip, { autoAlpha: 0, y: 10, duration: 0.22, ease: "power2.out", overwrite: true });
          };

          marker.addEventListener("mouseenter", onEnter);
          marker.addEventListener("mouseleave", onLeave);

          cleanups.push(() => {
            marker.removeEventListener("mouseenter", onEnter);
            marker.removeEventListener("mouseleave", onLeave);
          });
        });

        return () => cleanups.forEach((fn) => fn());
      };

      let revealTL = null;
      let revealST = null;
      let pinST = null;
      let unbindHover = null;

      const buildDesktop = () => {
        if (playedRef.current) setDesktopFinal();
        else setDesktopInitial();

        revealTL = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

        revealTL
          .to(leftEls, { autoAlpha: 1, y: 0, filter: "none", duration: 0.8, stagger: 0.08 }, 0)
          .to(map, { autoAlpha: 1, scale: 1, filter: "none", duration: 0.9 }, 0.05)
          .to(markers, { autoAlpha: 1, scale: 1, duration: 0.22, stagger: 0.06, ease: "power2.out" }, 0.22)
          .set([leftEls, map], { clearProps: "filter" });

        revealST = ScrollTrigger.create({
          trigger: root,
          start: "top 90%",
          once: true,
          onEnter: () => {
            if (playedRef.current) return;
            playedRef.current = true;
            revealTL.play(0);
          },
        });

       const PIN_OFFSET = 140;
const PIN_LEN = () => Math.min(window.innerHeight * 0.35, 360);

pinST = ScrollTrigger.create({
  trigger: root,
  start: `top top+=${PIN_OFFSET}`,
  end: () => `+=${PIN_LEN()}`,
  pin: isMobile() ? false : pinEl,
  pinSpacing: false,
  anticipatePin: 1,
  invalidateOnRefresh: true,
});

        unbindHover = bindHover();
      };

      const buildMobile = () => {
        setMobileFinal();
      };

      const killAll = () => {
        unbindHover?.();
        unbindHover = null;

        revealST?.kill();
        revealST = null;

        pinST?.kill();
        pinST = null;

        revealTL?.kill();
        revealTL = null;
      };

      const rebuild = () => {
        killAll();
        if (isMobile()) buildMobile();
        else buildDesktop();
        ScrollTrigger.refresh();
      };

      rebuild();

      const onResize = () => rebuild();
      window.addEventListener("resize", onResize);

      if (map && map.complete !== true) {
        map.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
      }

      return () => {
        window.removeEventListener("resize", onResize);
        killAll();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="presence-section" ref={rootRef}>
      {/* <div className="presence-container">
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
      </div> */}
    </section>
  );
}
