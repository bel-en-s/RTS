import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "../Components/Hero/Hero";
import HorizontalCarousel from "../Components/Carousel/HorizontalCarousel";
import Story from "../Components/Story/Story";
import Banner from "../Components/Banner/Banner";
import Marquee from "../Components/Marquee/Marquee";

gsap.registerPlugin(ScrollTrigger);

export default function Home({ onPhase }) {
  const storyRef = useRef(null);
  const hubRef = useRef(null);
  const presenceRef = useRef(null);

  useEffect(() => {
    const whiteSections = [
      storyRef.current,
      hubRef.current,
      presenceRef.current,
    ];

    whiteSections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        scroller: ".scroll-container",

        onEnter: () =>
          gsap.to("body", {
            backgroundColor: "#fff",
            color: "#000",
            duration: 0.35,
            ease: "none",
          }),

        onEnterBack: () =>
          gsap.to("body", {
            backgroundColor: "#fff",
            color: "#000",
            duration: 0.35,
            ease: "none",
          }),

        onLeave: () =>
          gsap.to("body", {
            backgroundColor: "#000",
            color: "#fff",
            duration: 0.35,
            ease: "none",
          }),

        onLeaveBack: () =>
          gsap.to("body", {
            backgroundColor: "#000",
            color: "#fff",
            duration: 0.35,
            ease: "none",
          }),
      });
    });
  }, []);

  return (
    <>
      <Hero onPhase={onPhase} />

      <div className="hero-outro-spacer"></div>

      <HorizontalCarousel />
      <Marquee />

      <div ref={storyRef}>
        <Story />
      </div>

      <div ref={hubRef} style={{ height: "100vh" }}>
        {/* HUB aquí */}
      </div>

      <div ref={presenceRef} style={{ height: "100vh" }}>
        {/* GLOBAL PRESENCE aquí */}
      </div>

      <Banner />
    </>
  );
}
