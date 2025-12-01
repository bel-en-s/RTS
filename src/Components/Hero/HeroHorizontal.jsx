// src/Components/Hero/HeroHorizontal.jsx
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

      const indicators = rootRef.current.querySelectorAll(".heroH-index span");
      indicators.forEach((el) => {
        el.dataset.label = el.textContent.trim();
      });

      gsap.set(panels, {
        clipPath: "inset(0 100% 0 0)",
        autoAlpha: 0
      });

      gsap.set(panels[0], {
        clipPath: "inset(0 0% 0 0)",
        autoAlpha: 1
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=" + total * window.innerWidth * 1.1,
          scrub: 0.5,
          pin: true,
          snap: {
            snapTo: 1 / (total - 1),
            duration: 0.6,
            ease: "power2.out"
          },
          anticipatePin: 1,
          onUpdate: (self) => {
            const raw = self.scroll();
            const distance = self.end - self.start || 1;
            let rawProgress = (raw - self.start) / distance;
            rawProgress = Math.min(1, Math.max(0, rawProgress));

            let slide = Math.round(rawProgress * (total - 1));
            slide = Math.min(total - 1, Math.max(0, slide));

            onPhase?.(slide + 2);

            indicators.forEach((el, idx) => {
              const base = el.dataset.label || el.textContent.replace("—", "").trim();
              if (idx === slide) {
                el.classList.add("active");
                el.textContent = "— " + base;
              } else {
                el.classList.remove("active");
                el.textContent = base;
              }
            });
          }
        }
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;

        tl.to(panels[i - 1], {
          clipPath: "inset(0 0% 0 100%)",
          autoAlpha: 0,
          duration: 0.3,
          ease: "power3.inOut"
        });

        tl.set(panels[i], {
          clipPath: "inset(0 100% 0 0)",
          autoAlpha: 0
        });

        tl.to(
          panels[i],
          {
            clipPath: "inset(0 0% 0 0)",
            autoAlpha: 1,
            duration: 0.7,
            ease: "power4.out"
          },
          ">-=0.15"
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
        <section className="heroH-panel heroH-panel--first" data-phase="2">
          <div className="heroH-inner">
            <h2 className="display-xl heroH-title">AUTOMATION & CONTROLS</h2>
            <p className="body-md heroH-body">
              We specialize in developing, integrating, building, <br />
              and analyzing end-to-end systems to meet the
              <br /> unique automation needs of our clients.
            </p>
            <ApproachButton url="/approach/automation" />
          </div>
        </section>

        <section className="heroH-panel" data-phase="3">
          <div className="heroH-inner">
            <h2 className="display-xl heroH-title">DIGITAL SKILLS</h2>
            <p className="body-md heroH-body">
              In the RTS ecosystem, Digital Skills turns industrial data into
              actionable <br />
              intelligence. Through our POD Services framework, we merge OT <br />
              experience, process knowledge, and computer science to engineer <br />
              the digital core of industrial operations.
            </p>
            <ApproachButton url="/approach/digital" />
          </div>
        </section>

        <section className="heroH-panel" data-phase="4">
          <div className="heroH-inner">
            <h2 className="display-xl heroH-title">ENERGY & INFRASTRUCTURE</h2>
            <p className="body-md heroH-body">
              Our mission is to provide innovative, efficient, and reliable energy and{" "}
              <br />
              infrastructure solutions that enhance operational performance, ensure{" "}
              <br />
              sustainability, and drive industrial progress.
            </p>
            <ApproachButton url="/approach/energy" />
          </div>
        </section>
      </div>
    </section>
  );
}
