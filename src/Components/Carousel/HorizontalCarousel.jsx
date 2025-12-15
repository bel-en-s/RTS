import React, { useEffect, useRef } from "react";
import "./HorizontalCarousel.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "../UI/Card";

import img0 from "../../assets/carousel/RTS_Industries.png";
import img1 from "../../assets/carousel/RTS_Industries-1.png";
import img2 from "../../assets/carousel/RTS_Industries-2.png";
import img3 from "../../assets/carousel/RTS_Industries-3.png";
import img4 from "../../assets/carousel/RTS_Industries-4.png";
import img5 from "../../assets/carousel/RTS_Industries-5.png";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalCarousel() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const container = scrollContainerRef.current;
      if (!section || !container) return;

      const PIN_START_OFFSET_VH = -0.2;

      const getTotalWidth = () => {
        const total = container.scrollWidth - window.innerWidth;
        return Math.max(0, total);
      };

      const getStart = () => {
        const px = Math.round(window.innerHeight * PIN_START_OFFSET_VH);
        return `top top+=${px}`;
      };

      const PIN_BUFFER = window.innerHeight * 0.3;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: getStart,
          end: () => `+=${Math.max(1, getTotalWidth() + PIN_BUFFER * 2)}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      tl.to({}, { duration: 0.05 });

      tl.to(container, {
        x: () => -getTotalWidth(),
        ease: "power2.inOut",
        duration: 1
      });

      tl.to({}, { duration: 0.2 });

      const firstCard = container.children[0];
      if (!firstCard) return;

      const gap = parseInt(getComputedStyle(container).gap || "48", 10);
      const cardWidth = firstCard.offsetWidth + gap;
      const totalCards = container.children.length;

      const autoTl = gsap.timeline({
        repeat: -1,
        paused: true,
        defaults: { ease: "power3.inOut" }
      });

      for (let i = 0; i < totalCards; i++) {
        autoTl.to(container, { x: () => -(i * cardWidth), duration: 1.6 }).to({}, { duration: 1.4 });
      }

      autoTl.to(container, { x: 0, duration: 1.6 });

      const autoST = ScrollTrigger.create({
        trigger: section,
        start: getStart,
        end: "bottom bottom",
        onEnter: () => autoTl.play(),
        onLeave: () => autoTl.pause(),
        onEnterBack: () => autoTl.play(),
        onLeaveBack: () => autoTl.pause()
      });

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        window.removeEventListener("load", onLoad);
        autoST.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
        autoTl.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="horizontal-carousel" ref={sectionRef}>
      <h4 className="carousel-subtitle-fixed subtitle-md">INDUSTRIES</h4>

      <h1 className="carousel-title headline-md headline-mobile-small">
        WE NAVIGATE AND SERVE THE MOST COMPLEX{" "}
        <span className="gradient-text">INDUSTRIAL GALAXIES</span>
      </h1>

      <div className="carousel-track" ref={scrollContainerRef}>
        <Card
          title="Oil & Gas"
          image={img0}
          description="We enhance operational reliability and efficiency through OT/IT integration, ensuring safe, data-driven, and continuous performance across upstream, midstream, and downstream operations."
        />
        <Card
          title="Power Generation"
          image={img1}
          description="We help power assets improve availability, safety, and performance through automation, monitoring, and optimized operations."
        />
        <Card
          title="Chemicals & Petrochemicals"
          image={img2}
          description="We enable smarter, safer, and more efficient operations by digitalizing processes and connecting critical data from field to boardroom."
        />
        <Card
          title="Pulp & Paper"
          image={img3}
          description="We support sustainable production through automation, energy optimization, and process digitalization — driving efficiency and lower environmental impact."
        />
        <Card
          title="Metals & Mining"
          image={img4}
          description="We enable efficient and safe mining operations through advanced automation, digital monitoring, and environmental performance tracking."
        />
        <Card
          title="Pharmaceuticals"
          image={img5}
          description="An emerging universe with strict laws of motion—traceability, accuracy, and real-time compliance."
        />
      </div>
    </section>
  );
}
