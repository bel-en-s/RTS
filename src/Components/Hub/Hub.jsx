import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CardHub from "../UI/CardHub";
import "./HUB.css";

import iconInnovation from "../../assets/hub/innovation.png";
import iconAcademy from "../../assets/hub/academy.png";
import iconBTL from "../../assets/hub/below.png";

gsap.registerPlugin(ScrollTrigger);

export default function HUB() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;

        ScrollTrigger.create({
          trigger: card,
          start: "top top+=140",
          endTrigger: cards[i + 1],
          end: "top top+=140",
          pin: true,
          pinSpacing: false,
        });

        ScrollTrigger.create({
          trigger: cards[i + 1],
          start: "top bottom-=200",
          end: "top top+=140",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(card, {
              y: -p * 40,
              opacity: 1 - p * 0.7,
              scale: 1 - p * 0.04,
              zIndex: 10 - i,
            });
          },
        });
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hub-section" ref={sectionRef}>
      <div className="hub-container">
        <div className="hub-header">
          <h4 className="hub-subtitle">RTS HUB</h4>
          <h2 className="hub-title">
            RTS HUB IS OUR LABORATORY
            <br />
            OF IDEAS AND EXECUTION
          </h2>
        </div>

        <div className="hub-cards-stack">
          {[
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
                "Dedicated to advancing technical skills and knowledge in industrial automation, OT/IT, and analytics.",
            },
            {
              title: "INNOVATION LAB",
              icon: iconInnovation,
              description:
                "More than a testing ground — it is a laboratory of ideas and execution where we develop new technologies.",
            },
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
      </div>
    </section>
  );
}
