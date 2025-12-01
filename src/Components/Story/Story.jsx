// src/Components/Story/Story.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Story.css";

gsap.registerPlugin(ScrollTrigger);

export default function Story({ setNavMode }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const section = rootRef.current;
    const panels = gsap.utils.toArray(section.querySelectorAll(".story-panel"));

    gsap.set(section, { backgroundColor: "#000000" });
    gsap.set(panels, { autoAlpha: 0, y: 120 });
    gsap.set(panels[0], { autoAlpha: 1, y: 0 });

    ScrollTrigger.create({
      trigger: section,
      start: "top 50%",
      end: "top 150%",
      onEnter: () => {
        gsap.set(section, { backgroundColor: "#000000" });
        setNavMode("dark");
      },
      onEnterBack: () => {
        gsap.set(section, { backgroundColor: "#000000" });
        setNavMode("dark");
      }
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      onEnter: () => {
        gsap.to(section, { backgroundColor: "#ebeef0", duration: 0.2 });
        setNavMode("light");
      },
      onEnterBack: () => {
        gsap.to(section, { backgroundColor: "#ebeef0", duration: 0.2 });
        setNavMode("light");
      },
      onLeaveBack: () => {
        gsap.to(section, { backgroundColor: "#000000", duration: 0.4 });
        setNavMode("dark");
      }
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=400vh",
        scrub: 0.2,
        pin: true
      }
    })
    .to({}, { duration: 1.5 })
    .to(panels[0], { y: -120, autoAlpha: 0, duration: 0.5 })
    .to(panels[1], { y: 0, autoAlpha: 1, duration: 0.5 }, ">-=0.2");

  }, []);

  return (
    <section className="story-section" ref={rootRef}>
      <div className="story-wrapper">
        <h4 className="story-subtitle">OUR STORY</h4>

        <div className="story-panel">
          <h2 className="story-title headline-medium">
            RTS WAS BORN IN THE <br /> WORLD OF OPERATIONAL <br /> TECHNOLOGY
          </h2>
          <p className="story-body">
           — and evolved to engineer 
            <br />
            the future through curated 
             <br />
            industrial innovation.
          </p>
        </div>

        <div className="story-panel">
          <h2 className="story-title">
            OUR STORY ISN’T ONE OF CHANGE, <br />
            BUT OF CONTINUOUS EVOLUTION
          </h2>
          <p className="story-body">
            — from control systems to intelligent ecosystems.
          </p>
        </div>
      </div>
    </section>
  );
}
