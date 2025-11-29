// src/Components/Carousel/HorizontalCarousel.jsx
import React, { useEffect, useRef } from "react";
import "./HorizontalCarousel.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "../UI/Card";

import powerImage from "../../assets/carousel/test.jpeg";
import pharmaImage from "../../assets/carousel/test.jpeg";
import miningImage from "../../assets/carousel/test.jpeg";
import pulpImage from "../../assets/carousel/test.jpeg";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalCarousel() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = scrollContainerRef.current;

    const totalWidth = container.scrollWidth - window.innerWidth;

    gsap.to(container, {
      x: () => -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalWidth}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    const cardWidth =
      container.children[0].offsetWidth +
      parseInt(getComputedStyle(container).gap || 48);

    const totalCards = container.children.length;

    const autoTl = gsap.timeline({ repeat: -1, paused: false });

    for (let i = 0; i < totalCards; i++) {
      autoTl
        .to(container, {
          x: () => -(i * cardWidth),
          duration: 1.4,
          ease: "power3.inOut"
        })
        .to({}, { duration: 1.2 });
    }

    autoTl.to(container, {
      x: 0,
      duration: 1.4,
      ease: "power3.inOut"
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onEnter: () => autoTl.play(),
      onLeave: () => autoTl.pause(),
      onEnterBack: () => autoTl.play(),
      onLeaveBack: () => autoTl.pause()
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      autoTl.kill();
    };
  }, []);

  return (
    <section className="horizontal-carousel" ref={sectionRef}>
      <h4 className="carousel-subtitle-fixed">INDUSTRIES</h4>

      <h1 className="carousel-title headline-md headline-mobile-small">
        WE NAVIGATE AND SERVE THE MOST COMPLEX{" "}
        <span className="gradient-text">INDUSTRIAL GALAXIES</span>
      </h1>

      <div className="carousel-track" ref={scrollContainerRef}>
        <Card
          title="Oil & Gas"
          image={powerImage}
          description="We enhance operational reliability and efficiency through OT/IT integration, ensuring safe, data-driven, and continuous performance across upstream, midstream, and downstream operations."
        />

        <Card title="Power Generation" image={powerImage} />

        <Card title="Chemicals & Petrochemicals" image={pharmaImage} />

        <Card title="Pulp & Paper" image={pulpImage} />

        <Card title="Metals & Mining" image={miningImage} />

        <Card title="Pharmaceuticals" image={pharmaImage} />
      </div>
    </section>
  );
}
