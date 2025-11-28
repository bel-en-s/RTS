// src/Components/Hero/HeroHorizontal.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroHorizontal({ onPhase }) {
  const rootRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".heroH-panel");
      const track = rootRef.current.querySelector(".heroH-track");

      gsap.set(panels, { width: window.innerWidth });

      const totalSlides = panels.length - 1;

      const tl = gsap.to(track, {
        x: () => -window.innerWidth * totalSlides,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => "+=" + window.innerWidth * totalSlides * 1.25,
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          snap: 1 / totalSlides,
          onUpdate: (self) => {
            const slide = Math.round(self.progress * totalSlides);
            onPhase?.(slide + 2);
            setActive(slide);
          },
        },
      });

      function setActive(slide) {
        const labels = gsap.utils.toArray(".heroH-index span");
        labels.forEach((el, i) => {
          if (i === slide) {
            el.classList.add("active");
            el.textContent = `–0${i + 1}`;
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
      
      <div className="heroH-index">
        <span>01</span>
        <span>02</span>
        <span>03</span>
      </div>

      <div className="heroH-track">

        <section className="heroH-panel" data-phase="2">
          <div className="heroH-inner">
            <h2 className="display-md">AUTOMATION & CONTROLS</h2>
            <p className="body-md">We specialize in developing, integrating and building OT/IT systems…</p>
          </div>
        </section>

        <section className="heroH-panel" data-phase="3">
          <div className="heroH-inner">
            <h2 className="display-md">DIGITAL SKILLS</h2>
            <p className="body-md">Turning industrial data into actionable intelligence…</p>
          </div>
        </section>

        <section className="heroH-panel" data-phase="4">
          <div className="heroH-inner">
            <h2 className="display-md">ENERGY & INFRASTRUCTURE</h2>
            <p className="body-md">Reliable, efficient and sustainable energy/infrastructure solutions…</p>
          </div>
        </section>

      </div>
    </section>
  );
}
