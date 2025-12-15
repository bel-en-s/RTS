// src/Components/Hero/Hero.jsx
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

      /* =====================================================
         INTRO (por evento hero:enter) — estado inicial cinema
      ===================================================== */
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
          // clave: si ya existe el timeline scrub, reinvalidamos + refresh
          if (heroTLRef.current) heroTLRef.current.invalidate();
          ScrollTrigger.refresh();
        });

      const playIntro = () => {
        if (introPlayedRef.current) return;
        introPlayedRef.current = true;
        introTL.play(0);
      };

      // si el loader terminó antes que el Hero monte
      if (window.__heroEnter) requestAnimationFrame(playIntro);

      // escuchamos el evento del App
      const onEnter = () => playIntro();
      window.addEventListener("hero:enter", onEnter);
      removeHeroEnter = () => window.removeEventListener("hero:enter", onEnter);

      /* =====================================================
         FLOATING NODE (CTA flotante)
      ===================================================== */
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

      /* =====================================================
         GLOBAL SETUP
      ===================================================== */
      gsap.set(steps, { position: "absolute", inset: 0, autoAlpha: 0 });
      gsap.set(step0, { autoAlpha: 1 });

      /* =====================================================
         STEP 1 — APPROACH (estado inicial oculto)
      ===================================================== */
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

      /* =====================================================
         STEP 2 — HORIZONTAL (setup)
      ===================================================== */
      const eyebrow = step2.querySelector(".heroH-eyebrow");
      const indexSpans = step2.querySelectorAll(".heroH-index span");

      const panels = gsap.utils.toArray(step2.querySelectorAll(".heroH-panel"));
      const inners = panels.map((p) => p.querySelector(".heroH-inner"));

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

      gsap.set(inners, {
        autoAlpha: 0,
        clipPath: "inset(0 100% 0 0)",
        WebkitClipPath: "inset(0 100% 0 0)",
      });

      gsap.set(inners[0], {
        autoAlpha: 1,
        clipPath: "inset(0 0% 0 0)",
        WebkitClipPath: "inset(0 0% 0 0)",
      });

      panels.forEach((panel, i) => {
        const inner = panel.querySelector(".heroH-inner");
        const title = inner.querySelector(".heroH-title");
        const body = inner.querySelectorAll(".heroH-body");
        const btn = inner.querySelector(".approach-btn");

        gsap.set([title, ...body, btn], {
          autoAlpha: i === 0 ? 1 : 0,
          x: i === 0 ? 0 : 40,
          filter: i === 0 ? "blur(0px)" : "blur(12px)",
        });
      });

      const HOLD_READ = 0.55;
      const ANTICIPO = 0.1;
      const GAP = 0.02;

      const WIPE_IN = 0.34;
      const WIPE_OUT = 0.28;
      const CHILD_IN = 0.22;
      const CHILD_OUT = 0.18;

      const wipeIn = (tl, panelEl, innerEl, at = "<") => {
        tl.to(panelEl, { autoAlpha: 1, duration: 0.01 }, at);
        tl.to(innerEl, { autoAlpha: 1, duration: 0.01 }, "<");

        tl.fromTo(
          innerEl,
          { clipPath: "inset(0 100% 0 0)", WebkitClipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            WebkitClipPath: "inset(0 0% 0 0)",
            duration: WIPE_IN,
            ease: "power3.out",
          },
          "<+=0.01"
        );

        tl.fromTo(
          innerEl.children,
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

      const wipeOut = (tl, panelEl, innerEl, at = "+=0") => {
        tl.to(innerEl, { x: -8, duration: ANTICIPO, ease: "power2.out" }, at).to(
          innerEl,
          { x: 0, duration: 0.12, ease: "power2.out" },
          "<"
        );

        tl.to(
          innerEl,
          {
            clipPath: "inset(0 0% 0 100%)",
            WebkitClipPath: "inset(0 0% 0 100%)",
            duration: WIPE_OUT,
            ease: "power2.inOut",
          },
          `<+=${GAP}`
        );

        tl.to(
          innerEl.children,
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

      /* =====================================================
         MAIN TIMELINE
      ===================================================== */
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
            onPhase?.(self.progress);

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
            else active = 0;

            setActiveIndex(active);
          },
        },
      });

      heroTLRef.current = tl;

      /* =====================================================
         STEP 0 → STEP 1
      ===================================================== */
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

      // ✅ FIX CLAVE: cuando volvés para atrás, SIEMPRE vuelve a visible
      tl.fromTo(
        [...step0Titles, ...step0Texts],
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
        },
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

      /* =====================================================
         STEP 1 → STEP 2 (header)
      ===================================================== */
      tl.to([...step1Titles, ...step1Texts, step1Subtitle], {
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

      /* =====================================================
         STEP 2 — PANEL 1
      ===================================================== */
      wipeIn(tl, panels[0], inners[0], "<+=0.1");
      tl.addLabel("H0");
      tl.to({}, { duration: HOLD_READ });

      /* =====================================================
         STEP 2 — PANEL 1 → 2
      ===================================================== */
      wipeOut(tl, panels[0], inners[0], "+=0");
      wipeIn(tl, panels[1], inners[1], `<+=${GAP}`);
      tl.addLabel("H1");
      tl.to({}, { duration: HOLD_READ });

      /* =====================================================
         STEP 2 — PANEL 2 → 3
      ===================================================== */
      wipeOut(tl, panels[1], inners[1], "+=0");
      wipeIn(tl, panels[2], inners[2], `<+=${GAP}`);
      tl.addLabel("H2");
      tl.to({}, { duration: HOLD_READ });
    }, rootRef);

    return () => {
      removeHeroEnter?.();
      ctx.revert();
    };
  }, [onPhase]);

  return (
    <section id="hero" ref={rootRef}>
      <section id="heroV" className="heroV">
        {/* STEP 0 */}
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
              — We merge decades of OT expertise with cutting-edge IT
              innovation to empower industries with smarter, more
              efficient, and connected operations.
            </p>

            <p className="hv-subtext hv-subtext--mobile body-md">
              — We merge decades of OT expertise with cutting-edge IT
              innovation to empower industries with smarter, more
              efficient, and connected operations.
            </p>
          </div>
        </div>

        {/* STEP 1 */}
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
              — Three departments working as one to shape, implement, and
              evolve the technologies that move modern industry forward.
            </p>

            <p className="hv-subtext hv-subtext--mobile body-md">
              — Three departments working as one to shape, implement, and
              evolve the technologies that move modern industry forward.
            </p>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="heroV-step" data-phase="2">
          <div className="heroH-header">
            <h4 className="heroH-eyebrow">OUR DEPARTMENTS</h4>
            <div className="heroH-index">
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

                <ApproachButton url="/approach/automation" className="approach-btn" />
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

                <ApproachButton url="/approach/digital" className="approach-btn" />
              </div>
            </section>

            <section className="heroH-panel">
              <div className="heroH-inner">
                <h2 className="display-xl heroH-title">ENERGY & INFRASTRUCTURE</h2>
                <p className="body-md heroH-body">
                  Our mission is to provide innovative, efficient, <br />
                  and reliable energy and infrastructure solutions <br />
                  that enhance operational performance, ensure <br />
                  sustainability, and drive industrial progress.
                </p>
                <ApproachButton url="/approach/energy" className="approach-btn" />
              </div>
            </section>
          </div>
        </div>
      </section>
    </section>
  );
}
