import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CardHub from "../UI/CardHub";
import "./Hub.css";

import iconInnovation from "../../assets/hub/icon1.png";
import iconAcademy from "../../assets/hub/icon1.png";
import iconBTL from "../../assets/hub/icon1.png";

import imgInnovation from "../../assets/hub/innovation.png";
import imgAcademy from "../../assets/hub/academy.png";
import imgBTL from "../../assets/hub/below.png";
import ApproachButton from "../UI/ApproachButton";

gsap.registerPlugin(ScrollTrigger);

export default function HUB() {
  const rootRef = useRef(null);

  const cardData = [
    {
      title: "BELOW THE LINE",
      icon: iconBTL,
      image: imgBTL,
      description:
        "Below-the-line powerhouse — a creative and experiential unit where ideas meet industry.",
      descriptionLight:
        "Through initiatives like Rocking the Industry and the Data-Driven LAB, we go beyond traditional services to spark interaction, collaboration, and thought leadership.",
    },
    {
      title: "ACADEMY",
      icon: iconAcademy,
      image: imgAcademy,
      description:
        "Dedicated to advancing technical skills and knowledge in industrial automation, OT/IT convergence, and analytics.",
      descriptionLight:
        "It serves as a center of excellence both for our internal teams and for clients, helping professionals stay ahead in a rapidly evolving industry.",
    },
    {
      title: "INNOVATION LAB",
      icon: iconInnovation,
      image: imgInnovation,
      description:
        "Is more than a testing ground — it is a laboratory of ideas and execution where we develop new technologies.",
      descriptionLight:
        "Here, we develop new technologies, provide industrial tech consulting, and design pilot projects that bring innovation into real practice.",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const header = root.querySelector(".hub-fixed-header");
      const cards = gsap.utils.toArray(".hub-card-wrapper");

      gsap.set(cards, {
        y: 20,
        opacity: 0,
        filter: "blur(12px)",
      });

      gsap.set(cards, {
        y: 0,
        opacity: 0,
        filter: "blur(14px)",
      });

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
        },
      });

      intro.to(header, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
      });

      intro.to(
        cards,
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.4"
      );

      const STACK_OFFSET = 95;

      const main = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=260%",
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
        },
      });

      cards.forEach((card, i) => {
        gsap.set(card, { zIndex: i + 1 });

        main.to(
          card,
          {
            yPercent: -STACK_OFFSET * i,
            ease: "power2.out",
            duration: 1,
          },
          ">-0.15"
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hub-section" id="hub" ref={rootRef}>
      <div className="hub-fixed-header">
        <h2 className="hub-title headline-medium desktop">
          <span className="gradient-text">RTS HUB</span> IS OUR LABORATORY
          <br />
          OF IDEAS AND EXECUTION
        </h2>

        <h2 className="hub-title headline-small mobile">
          <span className="gradient-text">RTS HUB</span> IS OUR LABORATORY
          <br />
          OF IDEAS AND EXECUTION
        </h2>
         <ApproachButton label="Learn more" href="#approach" />
      </div>

      <div className="hub-stack-container">
        {cardData.map((item, i) => (
          <div className="hub-card-wrapper" key={i}>
            <CardHub {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}
