// src/Components/Hero/HeroVertical.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroVertical({ onPhase }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray(".heroV-step");

      gsap.set(steps, { autoAlpha: 0, y: 80, clipPath: "inset(0 0 0 0)" });
      gsap.set(steps[0], { autoAlpha: 1, y: 0 });
      gsap.set(".heroV-cta", { autoAlpha: 0, y: 30 });

      gsap.to(".heroV-cta", {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=190%",
          scrub: 0.6,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => onPhase?.(self.progress),
        },
      });

      tl.to(".heroV-cta", {
        autoAlpha: 0,
        y: -40,
        duration: 0.3,
        ease: "power2.inOut"
      }, 0);

      tl.to(steps[0], {
        autoAlpha: 0,
        y: -80,
        clipPath: "inset(0 0 100% 0)",
        ease: "power3.inOut",
        duration: 0.35,
      });

      tl.to(
        steps[1],
        {
          autoAlpha: 1,
          y: 0,
          clipPath: "inset(0 0 0 0)",
          ease: "power3.out",
          duration: 0.35,
        },
        ">-=0.08"
      );
    }, rootRef);

    return () => ctx.revert();
  }, [onPhase]);

  return (
    <section id="heroV" className="heroV" ref={rootRef}>
      
      <div className="heroV-step" data-phase="0">
        <div className="hv-layout">

          <h1 className="hv-title hv-title--desktop display-lg">
            <span className="line">SPARK INDUSTRIAL</span><br />
            <span className="line">BRILLIANCE</span>
          </h1>

          <h1 className="hv-title hv-title--mobile display-lg">
            SPARK INDUSTRIAL<br />BRILLIANCE
          </h1>

          <p className="hv-subtext hv-subtext--desktop body-md">
            — We merge decades of OT expertise with cutting-edge
            <br />
            IT innovation to empower industries with smarter, more
            <br />
            efficient, and connected operations.
          </p>

          <p className="hv-subtext hv-subtext--mobile body-md">
            — We merge decades of OT
            <br />
            expertise with cutting-edge IT
            <br />
            innovation to empower industries
            <br />
            with smarter, more efficient, and
            <br />
            connected operations.
          </p>

          <div className="heroV-cta">
            <div className="cta-circle"></div>
            <span className="cta-text">What technical challenge are you facing today?</span>
          </div>

        </div>
      </div>

      <div className="heroV-step" data-phase="1">
        <div className="hv-layout">

          <h2 className="hv-title hv-title--desktop display-md">
            <span className="line">EVERY PROJECT BEGINS</span><br />
            <span className="line">INSIDE A LIVING ECOSYSTEM</span><br />
            <span className="line">OF EXPERTISE</span>
          </h2>

          <h2 className="hv-title hv-title--mobile display-md">
            EVERY PROJECT
            <br />
            BEGINS INSIDE A
            <br />
            LIVING ECOSYSTEM
            <br />
            OF EXPERTISE
          </h2>

          <p className="hv-subtext hv-subtext--desktop body-md">
            — Three departments working as one to
            <br />
            shape, implement, and evolve the technologies
            <br />
            that move modern industry forward.
          </p>

          <p className="hv-subtext hv-subtext--mobile body-md">
            — Three departments working
            <br />
            as one to shape, implement, and
            <br />
            evolve the technologies that move
            <br />
            modern industry forward.
          </p>
        </div>
      </div>

    </section>
  );
}
