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
    const navbar = document.querySelector(".navbar");


    const switchNavbar = (mode) => {
      gsap.to(navbar, {
        backgroundColor:
          mode === "dark"
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.12)",
        color: mode === "dark" ? "#fff" : "#000",
        duration: 0.5,
      });

      gsap.to(".hamburger-btn", {
        backgroundColor: mode === "dark" ? "#424146" : "#fff",
        duration: 0.5,
      });
    };


    gsap.set(panels, { autoAlpha: 0, y: 120 });
    gsap.set(panels[0], { autoAlpha: 1, y: 0 });


    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=500vh",  
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    tl.to({}, { duration: 0.38 });

    tl.to(panels[0], {
      y: -120,
      autoAlpha: 0,
      duration: 0.58,
      ease: "power3.inOut",
    });

    tl.to(panels[1], {
      y: 0,
      autoAlpha: 1,
      duration: 0.18,
      ease: "power3.out",
    }, ">-=0.05");


    tl.to({}, { duration: 0.80 });

    ScrollTrigger.create({
      trigger: section,
      start: "top 5%",
      end: "bottom 5%",
      onEnter: () => switchNavbar("light"),
      onEnterBack: () => switchNavbar("light"),
      onLeave: () => switchNavbar("dark"),
      onLeaveBack: () => switchNavbar("dark"),
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section className="story-section" ref={rootRef}>
      <h4 className="story-subtitle-fixed">OUR STORY</h4>

      <div className="story-panel">
        <h2 className="story-title">
          RTS WAS BORN IN THE WORLD OF
          <br />
          OPERATIONAL TECHNOLOGY…
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

