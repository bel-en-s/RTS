import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "../Components/Hero/Hero";
import HorizontalCarousel from "../Components/Carousel/HorizontalCarousel";
import Story from "../Components/Story/Story";
import Banner from "../Components/Banner/Banner";
import Marquee from "../Components/Marquee/Marquee";
import Hub from "../Components/Hub/Hub";
import Location from "../Components/Location/Location";

import bannerImg from "../assets/Banner.jpeg";

gsap.registerPlugin(ScrollTrigger);

export default function Home({ onPhase, setNavMode }) {
  const whiteBlockRef = useRef(null);

  useEffect(() => {
    const whiteBlock = whiteBlockRef.current;
    const root = document.documentElement; // :root

    const st = ScrollTrigger.create({
      trigger: whiteBlock,
      start: "top center",
      end: "bottom center",
      scrub: false,

      onEnter: () => {
        gsap.to(root, {
          "--color-bg": "var(--color-bg-light)",   // #ffffff
          "--color-text": "var(--color-text-light)", // #000000
          duration: 0.4,
          ease: "none",
        });

        gsap.delayedCall(0.25, () => {
          setNavMode("light");
          window.dispatchEvent(new Event("navLight"));
        });
      },

      onEnterBack: () => {
        gsap.to(root, {
          "--color-bg": "var(--color-bg-light)",
          "--color-text": "var(--color-text-light)",
          duration: 0.4,
          ease: "none",
        });

        gsap.delayedCall(0.25, () => {
          setNavMode("light");
          window.dispatchEvent(new Event("navLight"));
        });
      },

      onLeave: () => {
        gsap.to(root, {
          "--color-bg": "#000000",
          "--color-text": "#ffffff",
          duration: 0.4,
          ease: "none",
        });

        gsap.delayedCall(0.25, () => {
          setNavMode("dark");
          window.dispatchEvent(new Event("navDark"));
        });
      },

      onLeaveBack: () => {
        gsap.to(root, {
          "--color-bg": "#000000",
          "--color-text": "#ffffff",
          duration: 0.4,
          ease: "none",
        });

        gsap.delayedCall(0.25, () => {
          setNavMode("dark");
          window.dispatchEvent(new Event("navDark"));
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [setNavMode]);

  return (
    <>
      <Hero onPhase={onPhase} />
      <div className="hero-outro-spacer" />

      <HorizontalCarousel />
      <Marquee />

      <div ref={whiteBlockRef}>
        <Story setNavMode={setNavMode} />
        <Hub />
        <Location/>
      </div>

     <Banner
        variant="image"
        backgroundImage={bannerImg}
        titleClassName="display-medium"
        titleDesktop={"LET'S SPARK YOUR\nINDUSTRIAL BRILLIANCE"}
        titleMobile={"LET'S SPARK\nYOUR INDUSTRIAL\nBRILLIANCE"}
        bodyDesktop={
          "Every challenge is an opportunity. Share yours, and\nlet’s explore how to bring your vision to life."
        }
        bodyMobile={
          "Every challenge is an opportunity.\nShare yours, and let’s explore how to\nbring your vision to life."
        }
        buttons={[
          { label: "Book a meeting now", href: "#book", variant: "primary" },
        ]}
        start="top top"
      />

    </>
  );
}
