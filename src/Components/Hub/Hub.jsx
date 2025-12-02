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

  const cardData = [
    {
      title: "BELOW THE LINE",
      icon: iconBTL,
      description:
        "Below-the-line powerhouse — a creative and experiential unit where ideas meet industry.",
    },
    {
      title: "ACADEMY",
      icon: iconAcademy,
      description:
        "Dedicated to advancing technical skills and knowledge in industrial automation, OT/IT convergence, and analytics.",
    },
    {
      title: "INNOVATION LAB",
      icon: iconInnovation,
      description:
        "More than a testing ground — it is a laboratory of ideas and execution where we develop new technologies.",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    /** 📌 1) Pin largoooo para permitir las 3 animaciones */
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=600vh", // ANTES ERA 350vh → ahora hay LUGAR para las 3 cards
      scrub: true,
      pin: true,
      anticipatePin: 1,
    });

    /** 📌 2) Stacking Awwwards */
    cards.forEach((card, i) => {
      if (i === 0) return; // la primera no se anima, es la base inicial

      ScrollTrigger.create({
        trigger: cards[i],
        start: "top center",
        end: "top top-=200",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // card anterior (i - 1) se oculta detrás de la actual
          gsap.to(cards[i - 1], {
            y: -120 * progress,
            scale: 1 - 0.08 * progress,
            opacity: 1 - 0.5 * progress,
            filter: `blur(${progress * 3}px)`,
            zIndex: 30 - i,
            duration: 0,
          });
        },
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
        {cardData.map((item, i) => (
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
