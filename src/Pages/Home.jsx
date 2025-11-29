import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "../Components/Hero/Hero";
import HorizontalCarousel from "../Components/Carousel/HorizontalCarousel";
import Story from "../Components/Story/Story";
import Banner from "../Components/Banner/Banner";
import Marquee from "../Components/Marquee/Marquee";
import Hub from "../Components/Hub/Hub";

gsap.registerPlugin(ScrollTrigger);

export default function Home({ onPhase, setNavMode }) {
  const whiteBlockRef = useRef(null);

  useEffect(() => {
    const whiteBlock = whiteBlockRef.current;

    ScrollTrigger.create({
      trigger: whiteBlock,
      start: "top center",
      end: "bottom center",

      onEnter: () => {
        gsap.to("body", {
          backgroundColor: "#ebeef0",
          color: "#000",
          duration: 0.4,
          ease: "none",
        });
         gsap.delayedCall(0.25, () => {
    setNavMode("light");
    window.dispatchEvent(new Event("navLight"));
  });

        window.dispatchEvent(new Event("navLight"));   // <—
      },

      onEnterBack: () => {
        gsap.to("body", {
          backgroundColor: "#ebeef0",
          color: "#000",
          duration: 0.4,
          ease: "none",
        });
         gsap.delayedCall(0.25, () => {
    setNavMode("light");
    window.dispatchEvent(new Event("navLight"));
  });

        window.dispatchEvent(new Event("navLight"));   // <—
      },

      onLeave: () => {
        gsap.to("body", {
          backgroundColor: "#000",
          color: "#ebeef0",
          duration: 0.4,
          ease: "none",
        });
        setNavMode("dark");

        window.dispatchEvent(new Event("navDark"));    // <—
      },

      onLeaveBack: () => {
        gsap.to("body", {
          backgroundColor: "#000",
          color: "#ebeef0",
          duration: 0.4,
          ease: "none",
        });
        setNavMode("dark");

        window.dispatchEvent(new Event("navDark"));    // <—
      },
    });
  }, []);

  return (
    <>
      <Hero onPhase={onPhase} />
      <div className="hero-outro-spacer"></div>

      <HorizontalCarousel />
      <Marquee />

      <div ref={whiteBlockRef}>
        <Story />
        <Hub />
        <div style={{ height: "100vh" }}></div>
      </div>

      <Banner />
    </>
  );
}
