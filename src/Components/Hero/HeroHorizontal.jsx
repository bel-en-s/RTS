import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ApproachButton from "../UI/ApproachButton";

gsap.registerPlugin(ScrollTrigger);

export default function HeroHorizontal({ onPhase }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".heroH-panel");
      const total = panels.length;
      const viewportWidth = window.innerWidth;
      const indicators = rootRef.current.querySelectorAll(".heroH-index span");

      indicators.forEach((el) => {
        el.dataset.label = el.textContent.trim();
      });

      gsap.set(panels, {
        autoAlpha: 0,
        xPercent: 8,
        filter: "blur(18px)",
        clipPath: "inset(0 100% 0 0)",
      });

      gsap.set(panels[0], {
        autoAlpha: 1,
        xPercent: 0,
        filter: "blur(0px)",
        clipPath: "inset(0 0% 0 0)",
      });

      panels.forEach((panel) => {
        const elements = panel.querySelectorAll(".heroH-title, .heroH-body, .approach-btn");
        gsap.set(elements, {
          opacity: 0,
          xPercent: 14,
          filter: "blur(14px)",
        });
      });

      const scrollLength = viewportWidth * total * 1.45;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=" + scrollLength,
          scrub: 0.4,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const raw = self.progress;
            const slide = Math.round(raw * (total - 1));
            onPhase?.(slide + 2);

            indicators.forEach((el, idx) => {
              const base = el.dataset.label;
              if (idx === slide) {
                el.classList.add("active");
                el.textContent = "— " + base;
              } else {
                el.classList.remove("active");
                el.textContent = base;
              }
            });
          },
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) {
          tl.to(
            panel.querySelectorAll(".heroH-title, .heroH-body, .approach-btn"),
            {
              opacity: 1,
              xPercent: 0,
              filter: "blur(0px)",
              duration: 0.5,
              stagger: 0.1,
              ease: "power3.out",
            }
          );
          return;
        }

        const prev = panels[i - 1];
        const curr = panels[i];

        tl.to(prev, {
          autoAlpha: 0,
          xPercent: -8,
          filter: "blur(22px)",
          clipPath: "inset(0 0% 0 100%)",
          duration: 0.5,
          ease: "power3.inOut",
        });

        tl.set(curr, {
          autoAlpha: 0,
          xPercent: 12,
          filter: "blur(22px)",
          clipPath: "inset(0 100% 0 0)",
        });

        tl.to(curr, {
          autoAlpha: 1,
          xPercent: 0,
          clipPath: "inset(0 0% 0 0)",
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
        });

        tl.to(
          curr.querySelectorAll(".heroH-title, .heroH-body, .approach-btn"),
          {
            opacity: 1,
            xPercent: 0,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.8"
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [onPhase]);
  return (
    <section id="hero-horizontal" className="heroH" ref={rootRef}>
      <div className="heroH-header">
        <h4>OUR DEPARTMENTS</h4>
        <div className="heroH-index">
          <span>01</span>
          <span>02</span>
          <span>03</span>
        </div>
      </div>

      <div className="heroH-viewport">

        <section className="heroH-panel heroH-panel--first">
          <div className="heroH-inner">
            <h2 className="display-xl heroH-title">AUTOMATION & CONTROLS</h2>
            <p className="body-md heroH-body">
              We specialize in developing, integrating, building, <br />
              and analyzing end-to-end systems to meet the <br />
              unique automation needs of our clients.
            </p>
            <ApproachButton url="/approach/automation" className="approach-btn" />
          </div>
        </section>

        <section className="heroH-panel">
          <div className="heroH-inner">
            <h2 className="display-xl heroH-title">DIGITAL SKILLS</h2>
            <p className="body-md heroH-body heroH-body-desktop">
  In the RTS ecosystem, Digital Skills turns industrial data into actionable
  <br />
  intelligence. Through our POD Services framework, we merge OT
  <br />
  experience, process knowledge, and computer science to engineer
  <br />
  the digital core of industrial operations.
</p>

<p className="body-md heroH-body heroH-body-mobile">
  In the RTS ecosystem, Digital Skills turns
  <br />
  industrial data into actionable intelligence.
  <br />
  Through our POD Services framework, we merge
  <br />
  OT experience, process knowledge, and
  <br />
  computer science to engineer the digital
  <br />
  core of industrial operations.
</p>

            <ApproachButton url="/approach/digital" className="approach-btn" />
          </div>
        </section>

        <section className="heroH-panel">
          <div className="heroH-inner">
            <h2 className="display-xl heroH-title">ENERGY & INFRASTRUCTURE</h2>
            <p className="body-md heroH-body">
              Our mission is to provide innovative, efficient, <br />
              and reliable energy and infrastructure solutions <br />
              that enhance operational performance, ensure <br />
              sustainability, and drive industrial progress.
            </p>
            <ApproachButton url="/approach/energy" className="approach-btn" />
          </div>
        </section>

      </div>
    </section>
  );
}
