import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onPhase }) {
  const heroRef = useRef(null);
  const indicatorRef = useRef(null);
  const ST_ID = "hero";

  useEffect(() => {
    const ctx = gsap.context(() => {

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop, isMobile } = context.conditions;

          const blocks = gsap.utils.toArray(".hero-block");
          const bulletsPanel = document.querySelector(".hero-bullets");
          const bullets = gsap.utils.toArray(".hero-bullets .bullet");
          const steps = blocks.length - 1;

          /* =============================
              ESTADOS INICIALES
          ============================= */
          blocks.forEach((b, i) => {
            if (i < 2) gsap.set(b, { autoAlpha: 0, y: 60, x: 0 });
            else gsap.set(b, { autoAlpha: 0, x: 120, y: 0 });
          });

          gsap.set(blocks[0], { autoAlpha: 1, x: 0, y: 0 });

          onPhase?.(0);
          gsap.set(bulletsPanel, { autoAlpha: 0, pointerEvents: "none" });

          /* =============================
              TIMELINE MAIN
          ============================= */

          const endDistance = isMobile ? steps * 400 : steps * 1500;

          const tl = gsap.timeline({
            scrollTrigger: {
              id: ST_ID,
              trigger: heroRef.current,
              start: "top top",
              end: `+=${endDistance}vh`,
              pin: true,
              scrub: 1.2,
              anticipatePin: 1,
              snap: isDesktop
                ? {
                    snapTo: (v) => Math.round(v * steps) / steps,
                    duration: 1,
                    ease: "power3.out",
                  }
                : false,
              onUpdate: (self) => {
                const phaseContinuous = self.progress * steps;
                onPhase?.(phaseContinuous);

                const idx = Math.round(self.progress * steps);
                const show = idx >= 2;

                gsap.to(bulletsPanel, {
                  autoAlpha: show ? 1 : 0,
                  pointerEvents: show ? "auto" : "none",
                  duration: 0.2,
                });
              },
            },
          });

          /* =============================
              TRANSICIONES ENTRE BLOQUES
          ============================= */

          const dur = isMobile ? 0.7 : 1.1;
          const off = isMobile ? 80 : 120;

          for (let i = 0; i < steps; i++) {
            const out = blocks[i];
            const inn = blocks[i + 1];

            tl.to(out, {
              autoAlpha: 0,
              x: i < 2 ? 0 : -off,
              y: i < 2 ? -40 : 0,
              duration: dur,
              ease: "sine.inOut",
            }).fromTo(
              inn,
              {
                autoAlpha: 0,
                x: i < 1 ? 0 : off,
                y: i < 1 ? 90 : 0,
              },
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: dur,
                ease: "sine.inOut",
              },
              ">-=0.4"
            );
          }

          /* =============================
              BULLET INDICATOR
          ============================= */

          const qToX = gsap.quickTo(indicatorRef.current, "x", { duration: 0.25 });
          const qToW = gsap.quickTo(indicatorRef.current, "width", { duration: 0.25 });

          bullets.forEach((btn) => {
            btn.addEventListener("click", () => {
              if (isMobile) return; // no bullets in mobile

              const n = Number(btn.dataset.b); // 1–3
              const targetPhase = { 1: 2, 2: 3, 3: 4 }[n];
              const st = ScrollTrigger.getById(ST_ID);
              if (!st) return;

              gsap.to(st, {
                progress: targetPhase / steps,
                duration: 1,
                ease: "power2.inOut",
              });
            });
          });

          function setActiveBullet(n) {
            bullets.forEach((b) => b.classList.remove("is-active"));
            const el = document.querySelector(`.bullet[data-b="${n}"]`);
            if (el) el.classList.add("is-active");
          }

          return () => {
            ScrollTrigger.getById(ST_ID)?.kill();
          };
        }
      );

      return () => mm.revert();
    }, heroRef);

    return () => ctx.revert();
  }, [onPhase]);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-inner">

        {/* BULLETS (desktop only) */}
        <div className="hero-bullets">
          <div className="bullet-indicator" ref={indicatorRef} />
          <button className="bullet" data-b="1">01</button>
          <button className="bullet" data-b="2">02</button>
          <button className="bullet" data-b="3">03</button>
        </div>

        {/* Slide 0 */}
        <div className="hero-block one" data-phase="0">
          <div className="hero-left">
            <h1 className="hero-title display-lg">
              <span className="line">SPARK INDUSTRIAL</span><br />
              <span className="line">BRILLIANCE</span>
            </h1>
          </div>

          <div className="hero-right">
            {/* DESKTOP */}
            <p className="hero-subtext hero-subtext--desktop">
              — We merge decades of OT expertise with cutting-edge<br />
              IT innovation to empower industries with smarter, more<br />
              efficient, and connected operations.
            </p>

            {/* MOBILE */}
            <p className="hero-subtext hero-subtext--mobile">
              — We merge decades of OT<br />
              expertise with cutting-edge IT<br />
              innovation to empower industries<br />
              with smarter, more efficient, and<br />
              connected operations.
            </p>
          </div>
        </div>

        {/* Slide 1 */}
        <div className="hero-block two" data-phase="1">
          <h2 className="display-md hero-title">
            <span className="line">EVERY PROJECT BEGINS</span><br />
            <span className="line">INSIDE A LIVING ECOSYSTEM</span><br />
            <span className="line">OF EXPERTISE</span>
          </h2>
          <p className="body-md">
            — Three departments working as one to shape, implement, and
            evolve the technologies that move modern industry forward.
          </p>
        </div>

        {/* Slide 2 */}
        <div className="hero-block three" data-phase="2">
          <h2 className="display-md">AUTOMATION &<br />CONTROLS</h2>
          <p className="body-md">Specialized in integration, systems design and performance.</p>
        </div>

        {/* Slide 3 */}
        <div className="hero-block" data-phase="3">
          <h2 className="display-md">DIGITAL SKILLS</h2>
          <p className="body-md">Data pipelines, dashboards, AI-assisted operations.</p>
        </div>

        {/* Slide 4 */}
        <div className="hero-block" data-phase="4">
          <h2 className="display-md">RTS HUB</h2>
          <p className="body-md">Where innovation, culture and engineering meet.</p>
        </div>

      </div>
    </section>
  );
}
