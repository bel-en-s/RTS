import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Story.css";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    // pin normal
    const pin = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=140%",
      pin: true,
      pinSpacing: true,
    });

    // transición con gsap (rápida, confiable)
    const colorTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=140%",
      onEnter: () =>
        gsap.to("body", {
          backgroundColor: "#ffffff",
          color: "#000000",
          duration: 0.25, // ⚡ súper rápida
          ease: "none",
          overwrite: true,
        }),
      onLeave: () =>
        gsap.to("body", {
          backgroundColor: "#000000",
          color: "#ffffff",
          duration: 0.25,
          ease: "none",
          overwrite: true,
        }),
      onEnterBack: () =>
        gsap.to("body", {
          backgroundColor: "#ffffff",
          color: "#000000",
          duration: 0.25,
          ease: "none",
          overwrite: true,
        }),
      onLeaveBack: () =>
        gsap.to("body", {
          backgroundColor: "#000000",
          color: "#ffffff",
          duration: 0.25,
          ease: "none",
          overwrite: true,
        }),
    });

    return () => {
      pin.kill();
      colorTrigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="story-section">
      <div className="story-content">
        <h2 className="story-title">Story Placeholder</h2>
       
      </div>
    </section>
  );
}
