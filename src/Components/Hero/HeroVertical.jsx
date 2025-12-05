import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroVertical({ onPhase }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      const steps = gsap.utils.toArray(".heroV-step");
      const node = document.querySelector(".floating-node");
      const isDesktop = window.innerWidth > 820;
if (node && isDesktop) {
  const expandNode = () => {
    node.classList.add("expanded");
    node.classList.remove("collapsed");

    gsap.to(node, {
      // width: 373,
      // height: 80,
      bottom: 48,
      right: "50%",
      xPercent: 50,
      ease: "power4.out",
      duration: 0.6,
      overwrite: true,
    });
  };

  const collapseNode = () => {
    node.classList.add("collapsed");
    node.classList.remove("expanded");

    gsap.to(node, {
      // width: 60,
      height: 60,
      bottom: 32,
      right: 32,
      xPercent: 0,
      ease: "power3.out",
      duration: 0.45,
      overwrite: true,
    });
  };

  ScrollTrigger.create({
    trigger: rootRef.current.querySelector('[data-phase="0"]'),
    start: "top top",
    end: "bottom top",
    onEnter: expandNode,
    onEnterBack: expandNode,
    onLeave: collapseNode,
    onLeaveBack: (self) => {
 
    if (self.scroll() <= self.start + 5) {
      expandNode();
    } else {
      collapseNode();
    }
  },
  });

  expandNode(); // estado inicial
}

      gsap.set(steps, { autoAlpha: 0, y: 80 });
      gsap.set(steps[0], { autoAlpha: 1, y: 0 });
      // gsap.set(".heroV-cta", { autoAlpha: 0, y: 40 });

      if (node && isDesktop) {
        // posición original del nodo expandido
        gsap.set(node, {
          position: "fixed",
          bottom: 48,
          right: "50%",
          // width: 373,
          // height: 80,
        });

        // xPercent SOLO se aplica como set
        gsap.set(node, { xPercent: 50 });
        node.classList.add("expanded");
      }

      if (node && !isDesktop) {
        gsap.set(node, {
          position: "fixed",
          bottom: 32,
          right: 32,
          // width: 60,
          height: 60,
        });
        node.classList.add("collapsed");
      }



      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=185%",
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => onPhase?.(self.progress),
        }
      });

      // tl.from(".heroV-cta", {
      //   autoAlpha: 1,
      //   y: 0,
      //   duration: 0.6,
      //   ease: "power3.out",
      // }, 0.5);

      // tl.to(".heroV-cta", {
      //   autoAlpha: 0,
      //   y: -40,
      //   duration: 0.25,
      //   ease: "power2.inOut"
      // }, ">-=0.15");





      tl.to(steps[0], {
        autoAlpha: 0,
        y: -80,
        clipPath: "inset(0 0 100% 0)",
        duration: 0.35,
        ease: "power3.inOut"
      });

      tl.to(steps[1], {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0 0 0 0)",
        duration: 0.35,
        ease: "power3.out"
      }, ">-=0.1");

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
            — We merge decades of OT expertise with cutting-edge<br />
            IT innovation to empower industries with smarter, more<br />
            efficient, and connected operations.
          </p>

          <p className="hv-subtext hv-subtext--mobile body-md">
            — We merge decades of OT<br />
            expertise with cutting-edge IT<br />
            innovation to empower industries<br />
            with smarter, more efficient, and<br />
            connected operations.
          </p>
        </div>
      </div>

      <div className="heroV-step" data-phase="1">
        <div className="hv-layout-2">
          <h4 className="approach-subtitle-fixed">THE APPROACH</h4>

          <h2 className="hv-title hv-title--desktop display-md">
            <span className="line">EVERY PROJECT BEGINS</span><br />
            <span className="line">INSIDE A LIVING ECOSYSTEM</span><br />
            <span className="line">OF EXPERTISE</span>
          </h2>

          <h2 className="hv-title hv-title--mobile display-md">
            EVERY PROJECT<br />
            BEGINS INSIDE A<br />
            LIVING ECOSYSTEM<br />
            OF EXPERTISE
          </h2>

          <p className="hv-subtext hv-subtext--desktop body-md">
            — Three departments working as one to<br />
            shape, implement, and evolve the technologies<br />
            that move modern industry forward.
          </p>

          <p className="hv-subtext hv-subtext--mobile body-md">
            — Three departments working<br />
            as one to shape, implement, and<br />
            evolve the technologies that move<br />
            modern industry forward.
          </p>
        </div>
      </div>
    </section>
  );
}
