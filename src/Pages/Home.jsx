import "./Home.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionRef = useRef();
useEffect(() => {
  const sections = gsap.utils.toArray(".hero-text")

  sections.forEach((section) => {
    const lines = section.querySelectorAll("h1, p")

    gsap.fromTo(lines,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 40%",
          scrub: true,
        }
      }
    )
  })
}, [])

  return (
    <section className="home" ref={sectionRef}>
      <div className="hero-text">
        <h1>SPARK INDUSTRIAL</h1>
        <h1>BRILLIANCE</h1>
        <p>
          — We merge decades of OT expertise with cutting-edge IT innovation to
          empower industries with smarter, more efficient, and connected
          operations.
        </p>
      </div>

      {/* <div className="hero-text">
        <h1>EVERY PROJECT BEGINS INSIDE</h1>
        <h1>A LIVING ECOSYSTEM</h1>
      </div>

      <div className="hero-text">
        <h1>DIGITAL SKILLS</h1>
        <h1>AND CONTROL SYSTEMS</h1>
      </div> */}
    </section>
  );
}
