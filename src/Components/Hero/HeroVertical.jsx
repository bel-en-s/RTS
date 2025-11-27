
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

          <h1 className="hv-title display-lg">
            <span className="line">SPARK INDUSTRIAL</span><br />
            <span className="line">BRILLIANCE</span>
          </h1>

          <p className="hv-subtext body-md">
            — We merge decades of OT expertise with cutting-edge IT innovation
            to empower industries...
          </p>
        </div>
      </div>

    
      <div className="heroV-step" data-phase="1">
        <div className="hv-layout">

          <h2 className="hv-title display-md">
            <span className="line">EVERY PROJECT BEGINS</span><br />
            <span className="line">INSIDE A LIVING ECOSYSTEM</span><br />
            <span className="line">OF EXPERTISE</span>
          </h2>

          <p className="hv-subtext body-md">
            — Three departments working as one...
          </p>

        </div>
      </div>

    </section>
  );
}
