import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CardHub from "../UI/CardHub";
import "./Hub.css";

import iconInnovation from "../../assets/hub/innovation.png";
import iconAcademy from "../../assets/hub/academy.png";
import iconBTL from "../../assets/hub/below.png";

gsap.registerPlugin(ScrollTrigger);

export default function HUB() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=350vh",
      scrub: true,
      pin: true
    });

    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;

      ScrollTrigger.create({
        trigger: card,
        start: `top+=${i * 120} center`,
        end: `top+=${(i + 1) * 120} center`,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(card, {
            y: p * -80,
            scale: 1 - p * 0.07,
            opacity: 1 - p * 0.45,
            zIndex: 20 - i
          });
        }
      });
    });

    ScrollTrigger.refresh();
  }, []);

  return (
    <section className="hub-section" ref={sectionRef}>

      <div className="hub-fixed-header">
        <h4 className="hub-subtitle">RTS HUB</h4>

        <h2 className="hub-title">
          <span className="gradient-text">RTS HUB</span> IS OUR LABORATORY
          <br />
          OF IDEAS AND EXECUTION
        </h2>
      </div>

      <div className="hub-stack-container">
        {[
          {
            title: "BELOW THE LINE",
            icon: iconBTL,
            description:
              "Below-the-line powerhouse — a creative and experiential unit where ideas meet industry."
          },
          {
            title: "ACADEMY",
            icon: iconAcademy,
            description:
              "Dedicated to advancing technical skills and knowledge in industrial automation, OT/IT convergence, and analytics."
          },
          {
            title: "INNOVATION LAB",
            icon: iconInnovation,
            description:
              "More than a testing ground — it is a laboratory of ideas and execution where we develop new technologies."
          }
        ].map((item, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="hub-card-wrapper"
          >
            <CardHub {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}
