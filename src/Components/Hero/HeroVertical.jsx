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
            bottom: 48,
            right: "50%",
            xPercent: 50,
            ease: "power4.out",
            duration: 0.9,
            overwrite: true,
          });
        };

        const collapseNode = () => {
          node.classList.add("collapsed");
          node.classList.remove("expanded");
          gsap.to(node, {
            height: 60,
            bottom: 32,
            right: 32,
            xPercent: 0,
            ease: "power3.out",
            duration: 0.95,
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
            if (self.scroll() <= self.start + 5) expandNode();
            else collapseNode();
          },
        });

        expandNode();
      }

      gsap.set(steps, { autoAlpha: 0, y: 80 });
      gsap.set(steps[0], { autoAlpha: 1, y: 0 });

      if (node && isDesktop) {
        gsap.set(node, { position: "fixed", bottom: 48, right: "50%" });
        gsap.set(node, { xPercent: 50 });
        node.classList.add("expanded");
      }

      if (node && !isDesktop) {
        gsap.set(node, {
          position: "fixed",
          bottom: 32,
          right: 32,
          height: 60,
        });
        node.classList.add("collapsed");
      }

      const titleLines = rootRef.current.querySelectorAll(
        ".hv-title--desktop .line, .hv-title--mobile"
      );

      gsap.set(titleLines, {
        opacity: 0,
        yPercent: 40,
        filter: "blur(12px)",
      });

      gsap.to(titleLines, {
        opacity: 1,
        yPercent: 0,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.2,
      });

      const subtexts = rootRef.current.querySelectorAll(
        ".hv-subtext--desktop, .hv-subtext--mobile"
      );

      gsap.set(subtexts, {
        opacity: 0,
        y: 32,
        filter: "blur(8px)",
      });

      gsap.to(subtexts, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power3.out",
        delay: 0.6,
      });

      const step2 = steps[1];
      const step2Subtitle = step2.querySelector(".approach-subtitle-fixed");
      const step2Titles = step2.querySelectorAll(
        ".hv-title--desktop .line, .hv-title--mobile"
      );
      const step2Texts = step2.querySelectorAll(
        ".hv-subtext--desktop, .hv-subtext--mobile"
      );

      gsap.set(step2Subtitle, {
        autoAlpha: 0,
        y: 24,
        filter: "blur(8px)",
      });

      gsap.set(step2Titles, {
        autoAlpha: 0,
        yPercent: 40,
        filter: "blur(12px)",
      });

      gsap.set(step2Texts, {
        autoAlpha: 0,
        y: 32,
        filter: "blur(8px)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=185%",
          scrub: 0.12,
          pin: true,
          onUpdate: (self) => onPhase?.(self.progress),
        },
      });

      tl.to(steps[0], {
        autoAlpha: 0,
        y: -80,
        clipPath: "inset(0 0 100% 0)",
        duration: 0.25,
        ease: "power3.inOut",
      });

      tl.to(
        steps[1],
        {
          autoAlpha: 1,
          y: 0,
          clipPath: "inset(0 0 0 0)",
          duration: 0.25,
          ease: "power3.out",
        },
        ">-=0.1"
      );

      tl.to(step2Subtitle, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.25,
        ease: "power3.out",
      });

      tl.to(
        step2Titles,
        {
          autoAlpha: 1,
          yPercent: 0,
          filter: "blur(0px)",
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.08,
        },
        ">+=0.05"
      );

      tl.to(
        step2Texts,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.35,
          ease: "power3.out",
        },
        ">+=0.05"
      );
    }, rootRef);

    return () => ctx.revert();
  }, [onPhase]);

  return (
    <section id="heroV" className="heroV" ref={rootRef}>
      <div className="heroV-step" data-phase="0">
        <div className="hv-layout">
          <h1 className="hv-title hv-title--desktop display-lg">
            <span className="line">SPARK INDUSTRIAL</span>
            <br />
            <span className="line">BRILLIANCE</span>
          </h1>

          <h1 className="hv-title hv-title--mobile display-lg">
            SPARK INDUSTRIAL
            <br />
            BRILLIANCE
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
        </div>
      </div>

      <div className="heroV-step" data-phase="1">
        <div className="hv-layout-2">
          <h4 className="approach-subtitle-fixed">THE APPROACH</h4>

          <h2 className="hv-title hv-title--desktop display-md">
            <span className="line">EVERY PROJECT BEGINS</span>
            <br />
            <span className="line">INSIDE A LIVING ECOSYSTEM</span>
            <br />
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
