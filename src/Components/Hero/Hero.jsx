import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const blocks = gsap.utils.toArray(".hero-block");
    const total = blocks.length;

    gsap.set(blocks, { autoAlpha: 0, y: 60 });
    gsap.set(blocks[0], { autoAlpha: 1, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: `+=${total * 120}vh`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1
      }
    });

    blocks.forEach((el, i) => {
      const next = blocks[i + 1];
      if (!next) return;

      tl.to(el, {
        autoAlpha: 0,
        y: -40,
        duration: 1.4,
        ease: "power2.inOut"
      }).fromTo(
        next,
        { autoAlpha: 0, y: 90 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.4,
          ease: "power2.out"
        },
        "<"
      );
    });
  }, []);


  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-inner">

        <div className="hero-block">
          <h1 className="display-lg">SPARK INDUSTRIAL BRILLIANCE</h1>
      

          <p className="body-lg">
            — We merge decades of OT expertise with cutting-edge IT innovation...
          </p>
        </div>

        <div className="hero-block">
          <h1>EVERY PROJECT BEGINS<br/>INSIDE A LIVING ECOSYSTEM</h1>
          <p>— Three departments working as one across disciplines.</p>
        </div>

        <div className="hero-block">
          <h1>AUTOMATION &<br/>CONTROLS</h1>
          <p>Specialized in integration, systems design and industrial performance.</p>
        </div>

        <div className="hero-block">
          <h1>DIGITAL SKILLS</h1>
          <p>Turning industrial data into actionable intelligence.</p>
        </div>

        <div className="hero-block">
          <h1>ENERGY &<br/>INFRASTRUCTURE</h1>
          <p>Engineering sustainable, efficient energy ecosystems.</p>
        </div>

      </div>
    </section>
  );
}

