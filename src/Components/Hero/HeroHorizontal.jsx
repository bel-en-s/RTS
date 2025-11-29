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
      const track = rootRef.current.querySelector(".heroH-track");
      const panels = gsap.utils.toArray(".heroH-panel");

      gsap.set(panels, { width: window.innerWidth });

      const total = panels.length - 1;




      gsap.to(track, {
        x: () => -window.innerWidth * total,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => "+=" + window.innerWidth * total * 1.15,
          scrub: 0.8,
          pin: true,
          snap: 1 / total,
          onUpdate: (self) => {
            const slide = Math.round(self.progress * total);
            onPhase?.(slide + 2);
            setActive(slide);
          }
        }
      });

      function setActive(slide) {
        const dots = gsap.utils.toArray(".heroH-index span");
        dots.forEach((el, i) => {
          if (i === slide) {
            el.classList.add("active");
            el.textContent = `—0${i + 1}`;
          } else {
            el.classList.remove("active");
            el.textContent = `0${i + 1}`;
          }
        });
      }
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


      <div className="heroH-track">

        {/* PANEL 01 */}
<section className="heroH-panel heroH-panel--first" data-phase="2">
          <div className="heroH-inner">
            <h2 className="display-xl heroH-title">AUTOMATION <br/>& CONTROLS</h2>

            <p className="body-md heroH-body">
             We specialize in developing, integrating, building,  and analyzing  end-to-end systems to meet the  unique automation needs of our clients. 
            </p>

            <ApproachButton url="/approach/automation" />
          </div>
        </section>

        {/* PANEL 02 */}
        <section className="heroH-panel" data-phase="3">
          <div className="heroH-inner">
            <h2 className="display-xl heroH-title">DIGITAL SKILLS</h2>
            <p className="body-md heroH-body">
In the RTS ecosystem, Digital Skills turns industrial data into actionable intelligence. Through our POD Services framework,  we merge OT experience, process knowledge, and computer  science to engineer  the digital core of industrial operations.            </p>
            <ApproachButton url="/approach/digital" />
          </div>
        </section>

        {/* PANEL 03 */}
        <section className="heroH-panel" data-phase="4">
          <div className="heroH-inner">
            <h2 className="display-xl heroH-title">ENERGY & INFRASTRUCTURE</h2>
            <p className="body-md heroH-body">
              Reliable, efficient and sustainable industrial energy solutions…
            </p>
            <ApproachButton url="/approach/energy" />
          </div>
        </section>

      </div>
    </section>
  );
}
