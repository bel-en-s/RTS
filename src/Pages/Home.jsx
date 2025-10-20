import "./Home.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const texts = gsap.utils.toArray(".hero-text");

      texts.forEach((text, i) => {
        if (i === 0) return;
        gsap.fromTo(
          text,
          { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 50 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: text,
              start: `${i * 100}% center`,
              end: `${(i + 1) * 100}% center`,
              scrub: true,
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="home" ref={sectionRef}>
      <div className="hero-text">
        <h1>SPARK INDUSTRIAL</h1>
        <h1>BRILLIANCE</h1>
      </div>

      <div className="hero-text">
        <h1>EVERY PROJECT BEGINS INSIDE</h1>
        <h1>A LIVING ECOSYSTEM</h1>
      </div>

      <div className="hero-text">
        <h1>DIGITAL SKILLS</h1>
        <h1>AND CONTROL SYSTEMS</h1>
      </div>
    </section>
  );
}
