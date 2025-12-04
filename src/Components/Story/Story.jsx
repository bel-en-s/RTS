import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Story.css";

gsap.registerPlugin(ScrollTrigger);

export default function Story({ setNavMode }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const p1 = root.querySelector(".story-panel.panel-1");
    const p2 = root.querySelector(".story-panel.panel-2");

    gsap.set(root, { backgroundColor: "#000102" });

   
    gsap.set(p1, { opacity: 1, clipPath: "inset(0 0 0 0)", zIndex: 2 });
    gsap.set(p2, { opacity: 0, clipPath: "inset(100% 0 0 0)", zIndex: 1 });

    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      onEnter: () => {
        gsap.to(root, { backgroundColor: "#ebeef0", duration: 1 });
        setNavMode("light");
      }
    });


    gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=900vh",
        scrub: 1.8,
        pin: true
      }
    })

      .to({}, { duration: 8 })

      .to(
        p1,
        {
          opacity: 0,
          clipPath: "inset(0 0 100% 0)",
          duration: 8,
          ease: "power3.inOut"
        },
        "cross"
      )

      .to(
        p2,
        {
          opacity: 0.35,
          clipPath: "inset(30% 0 0 0)",
          duration: 4,
          ease: "power3.out"
        },
        "cross"
      )

      .to(
        p2,
        {
          opacity: 1,
          clipPath: "inset(0 0 0 0)",
          duration: 5,
          ease: "power3.out"
        },
        "cross+=1"
      )

      .to({}, { duration: 4 });

  }, []);

  return (
    <section className="story-section" ref={rootRef}>
      <div className="story-wrapper">
        
        <h4 className="story-subtitle">OUR STORY</h4> 

        {/* Paneles superpuestos */}
<div className="story-panel panel-1">
  <h2 className="story-title headline-medium">
    RTS WAS BORN IN THE <br /> WORLD OF OPERATIONAL <br /> TECHNOLOGY
  </h2>

  {/* DESKTOP VERSION (with <br/>) */}
  <p className="story-body story-desktop">
    — and evolved to <br />
    engineer the future <br />
    through curated <br />
    industrial innovation.
  </p>

  {/* MOBILE VERSION (natural text wrap) */}
  <p className="story-body story-mobile">
    — and evolved to <br />engineer the future <br />through curated <br />industrial innovation.
  </p>
</div>

        <div className="story-panel panel-2">
          <h2 className="story-title headline-medium">
            OUR STORY ISN’T ONE OF CHANGE, <br />
            BUT OF CONTINUOUS EVOLUTION
          </h2>

          <p className="story-body">
            — from control systems <br /> to intelligent ecosystems.
          </p>
        </div>

      </div>
    </section>
  );
}
