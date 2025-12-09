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
    gsap.set(p2, { opacity: 0, clipPath: "inset(35% 0 0 0)", zIndex: 1 });

    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      onEnter: () => {
        gsap.to(root, { backgroundColor: "#ebeef0", duration: 1.2, ease: "power2.out" });
        setNavMode("light");
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=3000vh",
        scrub: 3.2,
        pin: true,
        pinSpacing: true
      }
    });

    tl.to(p1, {
      opacity: 0,
      y: -120,
      clipPath: "inset(0 0 100% 0)",
      ease: "sine.inOut",
      duration: 1
    }, 0);

    tl.to(p2, {
      opacity: 0.15,
      clipPath: "inset(20% 0 0 0)",
      ease: "sine.out",
      duration: 1
    }, 0.1);

    tl.to(p2, {
      opacity: 0.45,
      clipPath: "inset(10% 0 0 0)",
      ease: "sine.out",
      duration: 1
    });

    tl.to(p2, {
      opacity: 1,
      clipPath: "inset(0% 0 0 0)",
      ease: "power1.out",
      duration: 1
    });

    tl.to(p2, {
      y: 0,
      opacity: 1,
      ease: "none",
      duration: 0.4
    });
    
  }, []);

  return (
    <section className="story-section" ref={rootRef}>
      <div className="story-wrapper">
        <h4 className="story-subtitle">OUR STORY</h4>

        <div className="story-panel panel-1">
          <h2 className="story-title headline-medium">
            RTS WAS BORN IN THE <br /> WORLD OF OPERATIONAL <br /> TECHNOLOGY
          </h2>

          <p className="story-body story-desktop">
            — and evolved to <br />
            engineer the future <br />
            through curated <br />
            industrial innovation.
          </p>

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
