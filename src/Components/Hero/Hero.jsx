import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";
import ApproachButton from "../UI/ApproachButton";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onPhase }) {
  const heroRef = useRef(null);
  const indicatorRef = useRef(null);
  const ST_ID = "hero";

  useEffect(() => {
    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray(".hero-block");
      const bullets = gsap.utils.toArray(".hero-bullets .bullet");
      const bulletsPanel = document.querySelector(".hero-bullets");

      if (!blocks.length || !bulletsPanel) return;

      const steps = blocks.length - 1;

      // ------------------------------------
      // ESTADO INICIAL
      // ------------------------------------
      gsap.set(blocks, { autoAlpha: 0, x: 0, y: 0 });
      gsap.set(blocks[0], { autoAlpha: 1 });

      // Animación inicial del bloque 0
      const introTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      introTl
        .fromTo(
          ".hero-block.one .hero-title .line",
          { y: 40, opacity: 0, scale: 1.02, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.6,
            ease: "back.out(1.4)",
            stagger: { amount: 0.25, from: "start" },
            delay: 0.2,
          }
        )
        .fromTo(
          ".hero-block.one .hero-subtext",
          { y: 20, opacity: 0, filter: "blur(4px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
          },
          "-=0.9"
        );

      onPhase?.(0);

      gsap.set(bulletsPanel, { autoAlpha: 0, pointerEvents: "none" });

      // ------------------------------------
      // INDICADOR DE BULLETS
      // ------------------------------------
      const qToX = gsap.quickTo(indicatorRef.current, "x", {
        duration: 0.35,
        ease: "power2.out",
      });

      const qToW = gsap.quickTo(indicatorRef.current, "width", {
        duration: 0.35,
        ease: "power2.out",
      });

      function moveIndicator(target) {
        const ind = indicatorRef.current;
        if (!ind) return;

        if (!target) {
          gsap.to(ind, { opacity: 0, duration: 0.2 });
          return;
        }

        const wrap = ind.parentElement;
        const wRect = wrap.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();

        qToX(tRect.left - wRect.left);
        qToW(tRect.width);
        gsap.to(ind, { opacity: 1, duration: 0.2 });
      }

      function setActiveBullet(n) {
        const all = gsap.utils.toArray(".hero-bullets .bullet");

        all.forEach((b) => {
          b.classList.remove("is-active");
          b.textContent = b.dataset.b.padStart(2, "0");
        });

        const el =
          n != null
            ? document.querySelector(`.hero-bullets .bullet[data-b="${n}"]`)
            : null;

        if (el) el.classList.add("is-active");

        moveIndicator(el);
      }

      // ------------------------------------
      // TIMELINE PRINCIPAL (STEP ENGINE)
      // ------------------------------------
      const SCROLL_PER_STEP = 900;

      const tl = gsap.timeline({
        scrollTrigger: {
          id: ST_ID,
          trigger: heroRef.current,
          start: "top top",
          end: "+=" + steps * SCROLL_PER_STEP,
          pin: true,
          anticipatePin: 1,
          scrub: 1.1,
          onUpdate: (self) => {
            const phaseContinuous = self.progress * steps;
            onPhase?.(phaseContinuous);

            const idx = Math.round(phaseContinuous);

            const showBullets = idx >= 2;
            gsap.to(bulletsPanel, {
              autoAlpha: showBullets ? 1 : 0,
              pointerEvents: showBullets ? "auto" : "none",
              duration: 0.25,
              ease: "power1.out",
            });

            const map = { 2: 1, 3: 2, 4: 3 };
            setActiveBullet(map[idx] ?? null);
          },
        },
      });

      // ------------------------------------
      // TRANSICIONES ENTRE BLOQUES
      // ------------------------------------
      blocks.forEach((block, index) => {
        if (index === 0) return;

        const prev = blocks[index - 1];

        // 🎯 Reglas:
        // index === 1 → vertical
        // index >= 2 → horizontal
        const moveX = index >= 2;
        const moveY = index === 1;

        tl.addLabel(`step-${index}`);

        tl.to(prev, {
          autoAlpha: 0,
          x: moveX ? -80 : 0,
          y: moveY ? -80 : 0,
          duration: 0.9,
          ease: "power2.inOut",
        }).fromTo(
          block,
          {
            autoAlpha: 0,
            x: moveX ? 80 : 0,
            y: moveY ? 80 : 0,
          },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "power2.inOut",
          },
          "<0.1"
        );
      });

      // ------------------------------------
      // CORRECCIÓN AL SCROLLEAR HACIA ARRIBA
      // ------------------------------------
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top bottom",
        onEnterBack: () => {
          const st = ScrollTrigger.getById(ST_ID);
          if (!st) return;

          const phaseContinuous = st.progress * steps;
          const idx = Math.round(phaseContinuous);

          blocks.forEach((b, i) => {
            gsap.set(b, {
              autoAlpha: i === idx ? 1 : 0,
              x: 0,
              y: 0,
            });
          });

          const showBullets = idx >= 2;
          gsap.set(bulletsPanel, {
            autoAlpha: showBullets ? 1 : 0,
            pointerEvents: showBullets ? "auto" : "none",
          });

          const map = { 2: 1, 3: 2, 4: 3 };
          setActiveBullet(map[idx] ?? null);
        },
      });

      // ------------------------------------
      // CLICK EN BULLETS
      // ------------------------------------
      bullets.forEach((btn) => {
        btn.addEventListener("click", () => {
          const n = Number(btn.getAttribute("data-b"));
          const targetPhase = { 1: 2, 2: 3, 3: 4 }[n];

          const st = ScrollTrigger.getById(ST_ID);
          if (!st) return;

          gsap.to(st, {
            progress: targetPhase / steps,
            duration: 1.0,
            ease: "power2.inOut",
          });
        });
      });
    }, heroRef);

    return () => {
      ScrollTrigger.getById(ST_ID)?.kill();
      ctx.revert();
    };
  }, [onPhase]);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-inner">
<div className="hero-block one" data-phase="0">
 <div className="hero-left">

  {/* DESKTOP TITLE */}
  <h1 className="hero-title display-lg title-desktop">
    <span className="line">SPARK INDUSTRIAL</span>
    <br />
    <span className="line">BRILLIANCE</span>
  </h1>

  {/* MOBILE TITLE */}
  <h1 className="hero-title display-lg title-mobile">
    SPARK INDUSTRIAL BRILLIANCE
  </h1>

</div>

  <div className="hero-right">


    <p className="hero-subtext hero-subtext--desktop">
      — We merge decades of OT expertise with cutting-edge<br />
      IT innovation to empower industries with smarter,<br />
      more efficient, and connected operations.
    </p>

   
    <p className="hero-subtext hero-subtext--mobile">
      — We merge decades of OT expertise<br />
      with cutting-edge IT innovation to<br />
      empower industries with smarter,<br />
      more efficient, and connected<br />
      operations.
    </p>

  </div>
</div>


        {/* BLOQUE 1 --------------------------------------- */}
        <div className="hero-block two" data-phase="1">
          <h2 className="display-md hero-title hero-title--ecosystem-desktop">
            <span className="line">EVERY PROJECT BEGINS</span>
            <span className="line">INSIDE A LIVING ECOSYSTEM</span>
            <span className="line">OF EXPERTISE</span>
          </h2>

          <p className="body-md two-subtext two-subtext--desktop">
            — Three departments working as one to shape, implement,
            and evolve the technologies that move modern industry forward.
          </p>
        </div>

        {/* BULLETS --------------------------------------- */}
        <div className="hero-bullets" aria-label="Departments">
          <span className="bullets-label">OUR DEPARTMENTS</span>

          <div className="bullets-wrap">
            <div className="bullet-indicator" ref={indicatorRef} />

            <button className="bullet" data-b="1">01</button>
            <button className="bullet" data-b="2">02</button>
            <button className="bullet" data-b="3">03</button>
          </div>
        </div>

        {/* BLOQUES 2-3-4 (no los toco porque no pediste aún) */}
        <div className="hero-block three" data-phase="2">
          <h2 className="display-md">AUTOMATION & CONTROLS</h2>
          <ApproachButton label="Our approach" />
        </div>

        <div className="hero-block four" data-phase="3">
          <h2 className="display-md">DIGITAL SKILLS</h2>
          <ApproachButton label="Our approach" />
        </div>

        <div className="hero-block five" data-phase="4">
          <h2 className="display-md">ENERGY & INFRASTRUCTURE</h2>
          <ApproachButton label="Our approach" />
        </div>
      </div>
    </section>
  );
}
