// src/Pages/HorizontalCarousel.jsx
import React, { useEffect, useRef } from "react";
import "./HorizontalCarousel.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "../UI/Card";

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
    const cards = container.querySelectorAll(".card-component");

    const totalWidth =
      container.scrollWidth - window.innerWidth; // ancho total scrollable

    gsap.to(container, {
      x: () => -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${totalWidth}`, // duración del scroll
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
      <h1 className="carousel-title display-mdg">we navigate and serve the most complex industrial galaxies</h1>

      <div className="carousel-track" ref={scrollContainerRef}>
        <Card
          title="Proyecto A"
          subtitle="Visual Engine"
          image="/assets/img1.jpg"
          description="Renderizado interactivo en tiempo real con Three.js."
        />
        <Card
          title="Proyecto B"
          subtitle="Diseño 3D"
          image="/assets/img2.jpg"
          description="Modelado interactivo con iluminación dinámica."
        />
        <Card
          title="Proyecto C"
          subtitle="Animación"
          image="/assets/img3.jpg"
          description="Animaciones fluidas con shaders personalizados."
        />
        <Card
          title="Proyecto D"
          subtitle="Interactividad"
          image="/assets/img4.jpg"
          description="Scroll reactivo y físicas suaves con GSAP + Lenis."
        />
      </div>
    </section>
  );
}
