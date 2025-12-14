import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Story.css";

gsap.registerPlugin(ScrollTrigger);

export default function Story({ setNavMode }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const p1 = root.querySelector(".story-panel.panel-1");
    const p2 = root.querySelector(".story-panel.panel-2");

    // Estado inicial
    gsap.set(root, { backgroundColor: "#000102" });

    gsap.set(p1, {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      zIndex: 2,
    });

    gsap.set(p2, {
      autoAlpha: 0,
      y: 120,
      filter: "blur(14px)",
      zIndex: 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=220%",
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        onEnter: () => setNavMode?.("light"),
        onEnterBack: () => setNavMode?.("light"),
      },
    });


    tl.to(
      root,
      {
        backgroundColor: "#ebeef0",
        duration: 0.3,
        ease: "none",
      },
      0
    );

    // Panel 1 OUT
    tl.to(p1, {
      autoAlpha: 0,
      y: -80,
      filter: "blur(12px)",
      ease: "power3.inOut",
      duration: 0.4,
    });

    // Panel 2 IN
    tl.to(
      p2,
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        ease: "power3.out",
        duration: 0.6,
      },
      ">-=0.25"
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [setNavMode]);

  return (
    <section className="story-section" ref={rootRef}>
      <div className="story-wrapper">
        <h4 className="story-subtitle">OUR STORY</h4>

        <div className="story-panel panel-1">
          <h2 className="story-title headline-medium">
            RTS WAS BORN IN THE <br />
            WORLD OF OPERATIONAL <br />
            TECHNOLOGY
          </h2>

          <p className="story-body story-desktop">
            — and evolved to <br />
            engineer the future <br />
            through curated <br />
            industrial innovation.
          </p>

          <p className="story-body story-mobile">
            — and evolved to <br />
            engineer the future <br />
            through curated <br />
            industrial innovation.
          </p>
        </div>

        <div className="story-panel panel-2">
          <h2 className="story-title headline-medium">
            OUR STORY ISN’T ONE OF CHANGE, <br />
            BUT OF CONTINUOUS EVOLUTION
          </h2>

          <p className="story-body">
            — from control systems <br />
            to intelligent ecosystems.
          </p>
        </div>
      </div>
    </section>
  );
}
