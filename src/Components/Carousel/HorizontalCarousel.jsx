
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

    const getTotalWidth = () =>
      container.scrollWidth - window.innerWidth;

    const PIN_BUFFER = window.innerHeight * 0.3;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getTotalWidth() + PIN_BUFFER * 2}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to({}, { duration: 0.05 });

    tl.to(container, {
      x: () => -getTotalWidth(),
      ease: "power2.inOut",
      duration: 1,
    });

    tl.to({}, { duration: 0.20 });

    const cardWidth =
      container.children[0].offsetWidth +
      parseInt(getComputedStyle(container).gap || 48);

    const totalCards = container.children.length;

    const autoTl = gsap.timeline({
      repeat: -1,
      paused: true,
      defaults: { ease: "power3.inOut" },
    });

    for (let i = 0; i < totalCards; i++) {
      autoTl
        .to(container, {
          x: () => -(i * cardWidth),
          duration: 1.6,
        })
        .to({}, { duration: 1.4 });
    }

    autoTl.to(container, {
      x: 0,
      duration: 1.6,
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top top+=10%",
      end: "bottom bottom",
      onEnter: () => autoTl.play(),
      onLeave: () => autoTl.pause(),
      onEnterBack: () => autoTl.play(),
      onLeaveBack: () => autoTl.pause(),
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tl.kill();
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

        <Card
          title="Power Generation"
          image={powerImage}
          description="We help petrochemical plants achieve smarter, safer, and more efficient operations by digitalizing processes and connecting critical data from field to boardroom."
        />

        <Card
          title="Chemicals & Petrochemicals"
          image={pharmaImage}
          description="We support sustainable pulp and paper production through automation, energy optimization, and process digitalization — driving efficiency, circularity, and lower environmental impact."
        />

        <Card
          title="Pulp & Paper"
          image={pulpImage}
          description="We enable sustainable, efficient, and safe mining operations through advanced automation, digital monitoring, and environmental performance tracking that reduce impact and optimize resources."
        />

        <Card
          title="Metals & Mining"
          image={miningImage}
          description="An emerging universe with strict laws of motion—traceability, accuracy, and real-time compliance."
        />

        <Card title="Pharmaceuticals" image={pharmaImage} />
      </div>
    </section>
  );
}

