// Mejora basada en layout Figma mobile/desktop + hover layout
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
    // Oculta el canvas al entrar en la sección
    gsap.to("canvas", {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        onEnter: () => gsap.to("canvas", { opacity: 0, duration: 1 }),
        onLeaveBack: () => gsap.to("canvas", { opacity: 1, duration: 1 }),
      },
    });

    // Scroll horizontal
    const container = scrollContainerRef.current;
    const totalWidth = container.scrollWidth - window.innerWidth;

    gsap.to(container, {
      x: () => -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${totalWidth}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section className="horizontal-carousel" ref={sectionRef}>
      <h1 className="carousel-title headline-md">
        WE NAVIGATE AND SERVE THE MOST COMPLEX <span className="gradient-text">INDUSTRIAL GALAXIES</span>
      </h1>

      <div className="carousel-track" ref={scrollContainerRef}>
        <Card title="Oil & Gas" image={powerImage} description="High-pressure orbit where precision defines every move." />
        <Card title="Power Generation" image={powerImage} />
        <Card title="Chemicals & Petrochemicals" image={pharmaImage} />
        <Card title="Pulp & Paper" image={pulpImage} />
        <Card title="Metals & Mining" image={miningImage} />
        <Card title="Pharmaceuticals" image={pharmaImage} />
      </div>



    </section>
    
  );
}