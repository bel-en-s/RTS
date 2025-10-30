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
        // 🔤 Separar letras
        const letters = text.querySelectorAll("h1, p");
        letters.forEach((el) => {
          el.innerHTML = el.textContent
            .split("")
            .map((char) =>
              char === " "
                ? `<span class="char space">&nbsp;</span>`
                : `<span class="char">${char}</span>`
            )
            .join("");
        });

        const chars = text.querySelectorAll(".char");

        // timeline con scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: text,
            start: `${i * 100}% center`,
            end: `${(i + 1) * 100}% center`,
            scrub: true,
            pin: false,
            anticipatePin: 1,
          },
        });

        // aimación de entrada (rotan desde atrás)
        tl.fromTo(
          chars,
          {
            opacity: 0,
            rotateX: -90,
            transformOrigin: "bottom center",
            y: 50,
          },
          {
            opacity: 1,
            rotateX: 0,
            y: 0,
            stagger: 0.03,
            duration: 1.2,
            ease: "back.out(1.7)",
          }
        );

        // 🎞️ Animación de salida (rotan hacia adelante)
        tl.to(chars, {
          opacity: 0,
          rotateX: 90,
          y: -50,
          stagger: 0.02,
          duration: 1,
          ease: "power2.inOut",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
