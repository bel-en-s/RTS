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
      const blocks = gsap.utils.toArray(".hero-block");
      const bullets = gsap.utils.toArray(".hero-bullets .bullet");
      const steps = blocks.length - 1; // con 6 bloques => steps = 5

      // --- Intro (vertical)
      const introTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      introTl
        .fromTo(
          ".hero-block:first-child .hero-title .line",
          { y: 100, opacity: 0, scale: 1.05, filter: "blur(6px)" },
          {
            y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
            duration: 1.6, ease: "back.out(1.7)",
            stagger: { amount: 0.3, from: "start" },
            delay: 0.5,
          }
        )
        .fromTo(
          ".hero-block:first-child .hero-subtext",
          { y: 50, opacity: 0, filter: "blur(4px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
          "-=0.8"
        );

      // --- Estado inicial: fases 0 y 1 usan Y; fases 2..5 usan X
      blocks.forEach((b, i) => {
        if (i < 2) gsap.set(b, { autoAlpha: 0, y: 60, x: 0 });
        else gsap.set(b, { autoAlpha: 0, x: 120, y: 0 });
      });
      gsap.set(blocks[0], { autoAlpha: 1, y: 0, x: 0 });

      onPhase?.(0);

      // panel 01/02/03 oculto hasta fase 2
      const bulletsPanel = document.querySelector(".hero-bullets");
      gsap.set(bulletsPanel, { autoAlpha: 0, pointerEvents: "none" });

      // --- Timeline principal
      const tl = gsap.timeline({
        scrollTrigger: {
          id: ST_ID,
          trigger: heroRef.current,
          start: "top top",
          end: `+=${steps * 180}vh`,
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          snap: {
            snapTo: (v) => Math.round(v * steps) / steps,
            ease: "power3.out",
            duration: 1.0,
          },
          onUpdate: (self) => {
            const idx = Math.round(self.progress * steps);
            onPhase?.(idx);

            // mostrar panel desde fase 2
            const show = idx >= 2;
            gsap.to(bulletsPanel, {
              autoAlpha: show ? 1 : 0,
              pointerEvents: show ? "auto" : "none",
              duration: 0.25,
              ease: "power1.out",
            });

            // encender bullet (2→01, 3→02, 4→03; 0,1,5 sin bullet)
            const map = { 2: 1, 3: 2, 4: 3 };
            setActiveBullet(map[idx] ?? null);
          },
          // markers: true,
        },
      });

      // === TRANSICIONES ===
      // 0 -> 1 (VERTICAL)
      if (blocks[1]) {
        tl.to(blocks[0], {
          autoAlpha: 0, y: -40, duration: 1.0, ease: "power2.inOut",
        }).fromTo(
          blocks[1],
          { autoAlpha: 0, y: 90 },
          { autoAlpha: 1, y: 0, duration: 1.0, ease: "power2.inOut" },
          ">-=0.6"
        );
      }

      // 1 -> 2 (VERTICAL)  ✅ como pediste
      if (blocks[2]) {
        tl.to(blocks[1], {
          autoAlpha: 0, y: -40, duration: 1.0, ease: "power2.inOut",
        }).fromTo(
          blocks[2],
          { autoAlpha: 0, y: 90, x: 0 },           // entra vertical
          { autoAlpha: 1, y: 0, x: 0, duration: 1.0, ease: "power2.inOut" },
          ">-=0.6"
        );
      }

      // 2 -> 3 (LATERAL)
      if (blocks[3]) {
        tl.to(blocks[2], {
          autoAlpha: 0, x: -120, duration: 1.1, ease: "sine.inOut",
        }).fromTo(
          blocks[3],
          { autoAlpha: 0, x: 120 },
          { autoAlpha: 1, x: 0, duration: 1.1, ease: "sine.inOut" },
          ">-=0.45"
        );
      }

      // 3 -> 4 (LATERAL)
      if (blocks[4]) {
        tl.to(blocks[3], {
          autoAlpha: 0, x: -120, duration: 1.1, ease: "sine.inOut",
        }).fromTo(
          blocks[4],
          { autoAlpha: 0, x: 120 },
          { autoAlpha: 1, x: 0, duration: 1.1, ease: "sine.inOut" },
          ">-=0.45"
        );
      }

      // 4 -> 5 (LATERAL)
      if (blocks[5]) {
        tl.to(blocks[4], {
          autoAlpha: 0, x: -120, duration: 1.1, ease: "sine.inOut",
        }).fromTo(
          blocks[5],
          { autoAlpha: 0, x: 120 },
          { autoAlpha: 1, x: 0, duration: 1.1, ease: "sine.inOut" },
          ">-=0.45"
        );
      }

      // --- Re-entrar mantiene ejes correctos + panel
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top bottom",
        onEnterBack: () => {
          const st = ScrollTrigger.getById(ST_ID);
          if (!st) return;
          const idx = Math.round(st.progress * steps);
          blocks.forEach((b, i) => {
            if (i < 2) gsap.set(b, { autoAlpha: i === idx ? 1 : 0, y: i === idx ? 0 : 60, x: 0 });
            else gsap.set(b, { autoAlpha: i === idx ? 1 : 0, x: i === idx ? 0 : 120, y: 0 });
          });
          gsap.set(bulletsPanel, {
            autoAlpha: idx >= 2 ? 1 : 0,
            pointerEvents: idx >= 2 ? "auto" : "none",
          });
          const map = { 2: 1, 3: 2, 4: 3 };
          setActiveBullet(map[idx] ?? null);
        },
      });

      // === Bullets: estado + indicador + click ===
      function setActiveBullet(n) {
        const all = gsap.utils.toArray(".hero-bullets .bullet");
        all.forEach((b) => b.classList.remove("is-active"));
        const el = n ? document.querySelector(`.hero-bullets .bullet[data-b="${n}"]`) : null;
        if (el) el.classList.add("is-active");
        moveIndicator(el);
      }

      const qToX = gsap.quickTo(indicatorRef.current, "x", { duration: 0.35, ease: "power2.out" });
      const qToW = gsap.quickTo(indicatorRef.current, "width", { duration: 0.35, ease: "power2.out" });
      function moveIndicator(target) {
        const ind = indicatorRef.current;
        if (!ind) return;
        if (!target) { gsap.to(ind, { opacity: 0, duration: 0.2 }); return; }
        const wrap = ind.parentElement;
        const wRect = wrap.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        qToX(tRect.left - wRect.left);
        qToW(tRect.width);
        gsap.to(ind, { opacity: 1, duration: 0.2 });
      }

      // Click 01/02/03 → fases 2/3/4
      bullets.forEach((btn) => {
        btn.addEventListener("click", () => {
          const n = Number(btn.getAttribute("data-b")); // 1..3
          const targetPhase = { 1: 2, 2: 3, 3: 4 }[n];
          const st = ScrollTrigger.getById(ST_ID);
          if (!st) return;
          const progress = targetPhase / steps;
          gsap.to(st, {
            progress,
            duration: 1.0,
            ease: "power2.inOut",
            onUpdate: () => st.scroll(),
          });
        });
      });

      return () => {
        ScrollTrigger.getById(ST_ID)?.kill();
        ctx.revert();
      };
    }, heroRef);

    return () => ctx.revert();
  }, [onPhase]);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-inner">

        {/* Panel 01/02/03 — lo muestra/oculta GSAP a partir de fase 2 */}
        <div className="hero-bullets" aria-label="Departments">
          <div className="bullet-indicator" ref={indicatorRef} />
          <button className="bullet" data-b="1" type="button">01</button>
          <button className="bullet" data-b="2" type="button">02</button>
          <button className="bullet" data-b="3" type="button">03</button>
        </div>

        {/* 0 — Intro */}
        <div className="hero-block" data-phase="0">
          <h1 className="display-lg hero-title">
            <span className="line">SPARK INDUSTRIAL</span><br />
            <span className="line">BRILLIANCE</span>
          </h1>
          <p className="body-md hero-subtext">— We merge decades of OT expertise...</p>
        </div>

        {/* 1 — Ecosystem */}
        <div className="hero-block" data-phase="1">
          <h2 className="display-md hero-title">
            <span className="line">EVERY PROJECT BEGINS</span><br />
            <span className="line">INSIDE A LIVING ECOSYSTEM OF EXPERTISE</span>
          </h2>
          <p className="body-md">— Three departments working as one to  shape, implement, and evolve the technologies that move modern industry forward..</p>
        </div>

        {/* 2 — Automation & Controls */}
        <div className="hero-block" data-phase="2" data-bullet="1">
          <h2 className="display-md">AUTOMATION &<br />CONTROLS</h2>
          <p className="body-md">Specialized in integration, systems design and industrial performance.</p>
        </div>

        {/* 3 — Digital Skills */}
        <div className="hero-block" data-phase="3" data-bullet="2">
          <h2 className="display-md">DIGITAL SKILLS</h2>
          <p className="body-md">The digital core: data pipelines, dashboards, AI-assisted operations.</p>
        </div>

        {/* 4 — RTS HUB */}
        <div className="hero-block" data-phase="4" data-bullet="3">
          <h2 className="display-md">RTS HUB</h2>
          <p className="body-md">Where innovation, culture and engineering meet.</p>
        </div>

        {/* 5 — Extra slide lateral (ajusta el contenido)
        <div className="hero-block" data-phase="5">
          <h2 className="display-md">OPERATIONS INTELLIGENCE</h2>
          <p className="body-md">Orchestrating people, processes and data for resilient factories.</p>
        </div> */}
      </div>
    </section>
  );
}
