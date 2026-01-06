import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Story.css";

gsap.registerPlugin(ScrollTrigger);

export default function Story({ setNavMode }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);

      const p1 = q(".story-panel.panel-1");
      const p2 = gsap.utils.toArray(q(".story-panel.panel-2")); // hay 2 (mobile/desktop)

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

      // ✅ Fondo cambia ANTES (tuneá este start)
      const bgST = ScrollTrigger.create({
        trigger: root,
        start: "top 75%", // antes de llegar a top (más alto = más temprano)
        onEnter: () => {
          gsap.to(root, {
            backgroundColor: "#ebeef0",
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
          setNavMode?.("light");
        },
        onLeaveBack: () => {
          gsap.to(root, {
            backgroundColor: "#000102",
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
          setNavMode?.("dark");
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=220%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(p1, {
        autoAlpha: 0,
        y: -80,
        filter: "blur(12px)",
        ease: "power3.inOut",
        duration: 0.4,
      });

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
        bgST.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    }, rootRef);

    return () => ctx.revert();
  }, [setNavMode]);

  return (
    <section className="story-section" ref={rootRef}>
      <div className="story-wrapper">
        <h4 className="story-subtitle">OUR STORY</h4>

        <div className="story-panel panel-1">
          <h2 className="story-title desktop headline-medium">
            RTS WAS BORN IN THE <br />
            WORLD OF OPERATIONAL <br />
            TECHNOLOGY
          </h2>

           <h2 className="story-title mobile headline-small">
            RTS WAS BORN IN THE <br />
            WORLD OF OPERATIONAL <br />
            TECHNOLOGY
          </h2>

          <p className="story-body desktop">
            — and evolved to 
            engineer <br />the future 
            through curated <br />
            industrial innovation.
          </p>

          <p className="story-body mobile">
            — and evolved to <br />
            engineer the future <br />
            through curated <br />
            industrial innovation.
          </p>
        </div>

        <div className="story-panel panel-2 story-mobile">
          <h2 className="story-title headline-medium desktop">
            OUR STORY ISN’T <br /> ONE OF CHANGE, <br />
            BUT OF CONTINUOUS <br />
            EVOLUTION
          </h2>

           <h2 className="story-title headline-small mobile ">
            OUR STORY ISN’T <br /> ONE OF CHANGE, <br />
            BUT OF CONTINUOUS <br />
            EVOLUTION
          </h2>

          <p className="story-body">
            — from control systems <br />
            to intelligent ecosystems.
          </p>
        </div>

        <div className="story-panel panel-2 story-desktop">
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
