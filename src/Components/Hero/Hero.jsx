import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ApproachButton from "../UI/ApproachButton";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onPhase }) {
  const rootRef = useRef(null);
  const heroTLRef = useRef(null);
  const introPlayedRef = useRef(false);
  const onPhaseRef = useRef(onPhase);

  useEffect(() => {
    onPhaseRef.current = onPhase;
  }, [onPhase]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let removeHeroEnter = null;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      const steps = gsap.utils.toArray(q(".heroV-step"));
      const step0 = q('[data-phase="0"]')[0];
      const step1 = q('[data-phase="1"]')[0];
      const step2 = q('[data-phase="2"]')[0];
      if (!step0 || !step1 || !step2) return;

      const step0Titles = step0.querySelectorAll(
        ".hv-title--desktop .line, .hv-title--mobile"
      );
      const step0Texts = step0.querySelectorAll(
        ".hv-subtext--desktop, .hv-subtext--mobile"
      );

      gsap.set([step0Titles, step0Texts], {
        autoAlpha: 0,
        y: 46,
        filter: "blur(12px)",
      });

      const introTL = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      introTL
        .to(
          step0Titles,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.95,
            stagger: 0.1,
            overwrite: "auto",
          },
          0
        )
        .to(
          step0Texts,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.85,
            overwrite: "auto",
          },
          0.25
        )
        .add(() => {
          if (heroTLRef.current) heroTLRef.current.invalidate();
          ScrollTrigger.refresh();
        });

      const playIntro = () => {
        if (introPlayedRef.current) return;
        introPlayedRef.current = true;
        introTL.play(0);
      };

      if (window.__heroEnter) requestAnimationFrame(playIntro);

      const onEnter = () => playIntro();
      window.addEventListener("hero:enter", onEnter);
      removeHeroEnter = () => window.removeEventListener("hero:enter", onEnter);

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
            duration: 0.25,
            ease: "power4.out",
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
            duration: 0.3,
            ease: "power3.out",
            overwrite: true,
          });
        };

        ScrollTrigger.create({
          trigger: step0,
          start: "top top",
          end: "bottom top",
          onEnter: expandNode,
          onEnterBack: expandNode,
          onLeave: collapseNode,
          onLeaveBack: (self) =>
            self.scroll() <= self.start + 5 ? expandNode() : collapseNode(),
        });

        expandNode();
      }

      gsap.set(steps, { position: "absolute", inset: 0, autoAlpha: 0 });
      gsap.set(step0, { autoAlpha: 1 });

      const step1Subtitle = step1.querySelector(".approach-subtitle-fixed");
      const step1Titles = step1.querySelectorAll(
        ".hv-title--desktop .line, .hv-title--mobile"
      );
      const step1Texts = step1.querySelectorAll(
        ".hv-subtext--desktop, .hv-subtext--mobile"
      );

      gsap.set([step1Subtitle, ...step1Titles, ...step1Texts], {
        autoAlpha: 0,
        y: 16,
        filter: "blur(8px)",
      });

      const eyebrow = step2.querySelector(".heroH-eyebrow");
      const indexSpans = step2.querySelectorAll(".heroH-index span");

      const panels = gsap.utils.toArray(step2.querySelectorAll(".heroH-panel"));
      const panelInners = panels.map((p) => Array.from(p.querySelectorAll(".heroH-inner")));

      indexSpans.forEach((s, i) => {
        const n = String(i + 1).padStart(2, "0");
        s.textContent = n;
        s.dataset.n = n;
      });

      const setActiveIndex = (active) => {
        indexSpans.forEach((s, i) => {
          s.classList.toggle("active", i === active);
          s.textContent = s.dataset.n;
        });
      };

      setActiveIndex(0);

      gsap.set([eyebrow, ...indexSpans], {
        autoAlpha: 0,
        y: 14,
        filter: "blur(10px)",
      });

      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[0], { autoAlpha: 1 });

      gsap.set(panelInners.flat(), {
        autoAlpha: 0,
        clipPath: "inset(0 100% 0 0)",
        WebkitClipPath: "inset(0 100% 0 0)",
      });

      gsap.set(panelInners[0], {
        autoAlpha: 1,
        clipPath: "inset(0 0% 0 0)",
        WebkitClipPath: "inset(0 0% 0 0)",
      });

      panels.forEach((panel, i) => {
        const inners = Array.from(panel.querySelectorAll(".heroH-inner"));
        inners.forEach((inner) => {
          const title = inner.querySelector(".heroH-title");
          const body = inner.querySelectorAll(".heroH-body");
          const btn = inner.querySelector(".approach-btn");
          gsap.set([title, ...body, btn].filter(Boolean), {
            autoAlpha: i === 0 ? 1 : 0,
            x: i === 0 ? 0 : 40,
            filter: i === 0 ? "blur(0px)" : "blur(12px)",
          });
        });
      });

      const HOLD_READ = 0.55;
      const ANTICIPO = 0.1;
      const GAP = 0.02;

      const WIPE_IN = 0.34;
      const WIPE_OUT = 0.28;
      const CHILD_IN = 0.22;
      const CHILD_OUT = 0.18;

      const wipeIn = (tl, panelEl, innerEls, at = "<") => {
        const inners = Array.isArray(innerEls) ? innerEls : [innerEls];

        tl.to(panelEl, { autoAlpha: 1, duration: 0.01 }, at);
        tl.to(inners, { autoAlpha: 1, duration: 0.01 }, "<");

        tl.fromTo(
          inners,
          { clipPath: "inset(0 100% 0 0)", WebkitClipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            WebkitClipPath: "inset(0 0% 0 0)",
            duration: WIPE_IN,
            ease: "power3.out",
          },
          "<+=0.01"
        );

        const kids = inners.flatMap((el) => Array.from(el.children));
        tl.fromTo(
          kids,
          { autoAlpha: 0, x: 14, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            x: 0,
            filter: "blur(0px)",
            stagger: 0.04,
            duration: CHILD_IN,
            ease: "power3.out",
          },
          "<+=0.05"
        );
      };

      const wipeOut = (tl, panelEl, innerEls, at = "+=0") => {
        const inners = Array.isArray(innerEls) ? innerEls : [innerEls];
        const kids = inners.flatMap((el) => Array.from(el.children));

        tl.to(inners, { x: -8, duration: ANTICIPO, ease: "power2.out" }, at).to(
          inners,
          { x: 0, duration: 0.12, ease: "power2.out" },
          "<"
        );

        tl.to(
          inners,
          {
            clipPath: "inset(0 0% 0 100%)",
            WebkitClipPath: "inset(0 0% 0 100%)",
            duration: WIPE_OUT,
            ease: "power2.inOut",
          },
          `<+=${GAP}`
        );

        tl.to(
          kids,
          {
            autoAlpha: 0,
            x: -10,
            filter: "blur(10px)",
            stagger: 0.025,
            duration: CHILD_OUT,
            ease: "power2.inOut",
          },
          "<"
        );

        tl.to(panelEl, { autoAlpha: 0, duration: 0.01 }, "<+=0.12");
      };

      let tl;

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=420%",
          pin: true,
          anticipatePin: 1,
          scrub: 0.18,
          snap: {
            snapTo: (value) => {
              if (!tl || !tl.duration()) return value;
              const d = tl.duration();

              const p2Start = (tl.labels.STEP2 ?? 0) / d;
              const p0 = (tl.labels.H0 ?? 0) / d;
              const p1 = (tl.labels.H1 ?? p0) / d;
              const p2 = (tl.labels.H2 ?? p1) / d;

              if (value < p2Start) return value;
              if (value < p0 || value > p2) return value;

              return gsap.utils.snap([p0, p1, p2])(value);
            },
            duration: { min: 0.06, max: 0.18 },
            delay: 0,
            ease: "power3.out",
            inertia: false,
          },
          onUpdate: (self) => {
            onPhaseRef.current?.(self.progress);

            if (!tl || !tl.duration()) return;
            const t = tl.time();
            const t2 = tl.labels.STEP2 ?? 0;
            if (t < t2) return;

            const h0 = tl.labels.H0 ?? t2;
            const h1 = tl.labels.H1 ?? h0;
            const h2 = tl.labels.H2 ?? h1;

            let active = 0;
            if (t >= h2) active = 2;
            else if (t >= h1) active = 1;

            setActiveIndex(active);
          },
        },
      });

      heroTLRef.current = tl;

      tl.to({}, { duration: 0.1 });

      tl.to(step1, { autoAlpha: 1, duration: 0.01 }, "<");

      tl.to(step1Subtitle, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.18,
        ease: "power3.out",
      });

      tl.to(
        step1Titles,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.3,
          stagger: 0.045,
          ease: "power3.out",
        },
        "<+=0.04"
      );

      tl.to(
        step1Texts,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.25,
          ease: "power2.out",
        },
        "<+=0.05"
      );

      tl.fromTo(
        [...step0Titles, ...step0Texts],
        { autoAlpha: 1, y: 0, filter: "blur(0px)" },
        {
          autoAlpha: 0,
          y: -8,
          filter: "blur(6px)",
          duration: 0.28,
          ease: "power2.inOut",
          immediateRender: false,
        },
        "<"
      );

      tl.to([...step1Titles, ...step1Texts, step1Subtitle].filter(Boolean), {
        autoAlpha: 0,
        y: -10,
        filter: "blur(8px)",
        duration: 0.35,
        ease: "power2.inOut",
      });

      tl.to(step2, { autoAlpha: 1, duration: 0.01 }, "<");
      tl.addLabel("STEP2");

      tl.to(eyebrow, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.18,
        ease: "power3.out",
      }).to(
        indexSpans,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.08,
          duration: 0.28,
          ease: "power3.out",
        },
        "<+=0.04"
      );

      tl.to({}, { duration: 0.01, onStart: () => setActiveIndex(0) });

      wipeIn(tl, panels[0], panelInners[0], "<+=0.1");
      tl.addLabel("H0");
      tl.to({}, { duration: HOLD_READ });

      wipeOut(tl, panels[0], panelInners[0], "+=0");
      wipeIn(tl, panels[1], panelInners[1], `<+=${GAP}`);
      tl.addLabel("H1");
      tl.to({}, { duration: HOLD_READ });

      wipeOut(tl, panels[1], panelInners[1], "+=0");
      wipeIn(tl, panels[2], panelInners[2], `<+=${GAP}`);
      tl.addLabel("H2");
      tl.to({}, { duration: HOLD_READ });

tl.to([eyebrow, ...indexSpans], {
  autoAlpha: 0,
  y: -8,
  filter: "blur(8px)",
  duration: 0.35,
  ease: "power2.inOut",
});


      // tl.to(step2, { autoAlpha: 0, duration: 0.01 }, "<");
    }, rootRef);

    return () => {
      removeHeroEnter?.();
      ctx.revert();
    };
  }, []);

  return (
    <section id="hero" ref={rootRef}>
      <section id="heroV" className="heroV">
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
              — We merge decades of OT expertise with cutting-edge <br />
              IT innovation to empower industries with smarter, more <br />
              efficient, and connected operations.
            </p>

            <p className="hv-subtext hv-subtext--mobile body-md">
              — We merge decades of OT expertise with cutting-edge IT innovation
              to empower industries with smarter, more efficient, and connected
              operations.
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
              — Three departments working as one to shape, implement, and evolve
              the technologies that move modern industry forward.
            </p>

            <p className="hv-subtext hv-subtext--mobile body-md">
              — Three departments working as one to shape, implement, and evolve
              the technologies that move modern industry forward.
            </p>
          </div>
        </div>

        <div className="heroV-step" data-phase="2">
          <div className="heroH-header">
            <h4 className="heroH-eyebrow subtitle-md">OUR DEPARTMENTS</h4>
            <div className="heroH-index subtitle-md">
              <span>01</span>
              <span>02</span>
              <span>03</span>
            </div>
          </div>

          <div className="heroH-viewport">
            <section className="heroH-panel heroH-panel--first">
              <div className="heroH-inner">
                <h2 className="display-xl heroH-title">AUTOMATION & CONTROLS</h2>

                <p className="body-md heroH-body">
                  We specialize in developing, integrating, building, <br />
                  and analyzing end-to-end systems to meet the <br />
                  unique automation needs of our clients.
                </p>

                <ApproachButton href="/approach/automation" className="approach-btn" />
              </div>
            </section>

            <section className="heroH-panel">
              <div className="heroH-inner">
                <h2 className="display-xl heroH-title">DIGITAL SKILLS</h2>

                <p className="body-md heroH-body heroH-body-desktop">
                  In the RTS ecosystem, Digital Skills turns industrial data into actionable
                  <br />
                  intelligence. Through our POD Services framework, we merge OT
                  <br />
                  experience, process knowledge, and computer science to engineer
                  <br />
                  the digital core of industrial operations.
                </p>

                <p className="body-md heroH-body heroH-body-mobile">
                  In the RTS ecosystem, Digital Skills turns
                  <br />
                  industrial data into actionable intelligence.
                  <br />
                  Through our POD Services framework, we merge
                  <br />
                  OT experience, process knowledge, and
                  <br />
                  computer science to engineer the digital
                  <br />
                  core of industrial operations.
                </p>

                <ApproachButton href="/approach/digital" className="approach-btn" />
              </div>
            </section>

            <section className="heroH-panel">
              <div className="heroH-inner heroH-body-mobile">
                <h2 className="display-xl heroH-title">ENERGY & INFRASTRUCTURE</h2>
                <p className="body-md heroH-body">
                  Our mission is to provide innovative, efficient, <br />
                  and reliable energy and infrastructure solutions <br />
                  that enhance operational performance, ensure <br />
                  sustainability, and drive industrial progress.
                </p>
                <ApproachButton href="/approach/energy" className="approach-btn" />
              </div>

              <div className="heroH-inner heroH-body-desktop">
                <h2 className="display-xl heroH-title">ENERGY & INFRASTRUCTURE</h2>
                <p className="body-md heroH-body">
                  Our mission is to provide innovative, efficient, and reliable energy and
                  <br />
                  infrastructure solutions that enhance operational performance, ensure
                  <br />
                  sustainability, and drive industrial progress.
                </p>
                <ApproachButton href="/approach/energy" className="approach-btn" />
              </div>
            </section>
          </div>
        </div>
      </section>
    </section>
  );
}
