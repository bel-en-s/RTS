// src/Components/Story/Story.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Story.css";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const rootRef = useRef(null);

  useEffect(() => {
    const section = rootRef.current;
    const panels = gsap.utils.toArray(".story-panel");

    gsap.set(panels, { autoAlpha: 0, y: 120 });
    gsap.set(panels[0], { autoAlpha: 1, y: 0 });

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=300vh",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    })
      .to({}, { duration: 0.4 })
      .to(panels[0], {
        y: -120,
        autoAlpha: 0,
        duration: 0.4,
        ease: "power3.inOut",
      })
      .to(
        panels[1],
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.4,
          ease: "power3.out",
        },
        ">-=0.15"
      )
      .to({}, { duration: 0.6 });
  }, []);

  return (
    <section className="story-section" ref={rootRef}>
      <h4 className="story-subtitle-fixed">OUR STORY</h4>

      <div className="story-panel">
        <h2 className="story-title">
          RTS WAS BORN IN THE <br /> WORLD OF
         
          OPERATIONAL <br />TECHNOLOGY…
        </h2>
        <p className="story-body">
          — and evolved to become a unique blend
          <br />
          of industrial experience and innovation.
        </p>
      </div>

      <div className="story-panel">
        <h2 className="story-title">
          OUR STORY ISN’T ONE OF CHANGE,
          <br />
          BUT OF CONTINUOUS EVOLUTION
        </h2>
        <p className="story-body">
          — from control systems to intelligent ecosystems.
        </p>
      </div>
    </section>
  );
}
