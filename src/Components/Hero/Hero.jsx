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
      const steps = blocks.length - 1;

      const introTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      introTl
        .fromTo(
          ".hero-block:first-child .hero-title .line",
          { y: 100, opacity: 0, scale: 1.05, filter: "blur(6px)", yPercent: 10 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 2.6,
            ease: "back.out(1.7)",
            stagger: { amount: 0.3, from: "start" },
            delay: 0.5,
          }
        )
        .fromTo(
          ".hero-block:first-child .hero-subtext",
          { y: 50, opacity: 0, filter: "blur(4px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.8"
        );

      blocks.forEach((b, i) => {
        if (i < 2) gsap.set(b, { autoAlpha: 0, y: 60, x: 0 });
        else gsap.set(b, { autoAlpha: 0, x: 120, y: 0 });
      });

      gsap.set(blocks[0], {
        autoAlpha: 1,
        x: 0,
        y: 0,
        yPercent: 2,
      });

      onPhase?.(0);

      const bulletsPanel = document.querySelector(".hero-bullets");
      gsap.set(bulletsPanel, { autoAlpha: 0, pointerEvents: "none" });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: ST_ID,
          trigger: heroRef.current,
          start: "top top",
          end: `+=${steps * 1500}vh`,
          pin: true,
          anticipatePin: 1,
          scrub: 2.2,
          snap: false,
          onUpdate: (self) => {
            const phaseContinuous = self.progress * steps;
            onPhase?.(phaseContinuous);

            const idx = Math.round(self.progress * steps);

            const show = idx >= 2;
            gsap.to(bulletsPanel, {
              autoAlpha: show ? 1 : 0,
              pointerEvents: show ? "auto" : "none",
              duration: 0.25,
              ease: "power1.out",
            });

            const map = { 2: 1, 3: 2, 4: 3 };
            setActiveBullet(map[idx] ?? null);
          },
        },
      });

      if (blocks[1]) {
        tl.to(blocks[0], {
          autoAlpha: 0,
          y: -40,
          duration: 1.0,
          ease: "power2.inOut",
        }).fromTo(
          blocks[1],
          { autoAlpha: 0, y: 90 },
          { autoAlpha: 1, y: 0, duration: 1.0, ease: "power2.inOut" },
          ">-=0.6"
        );
      }

      if (blocks[2]) {
        tl.to(blocks[1], {
          autoAlpha: 0,
          y: -40,
          duration: 1.0,
          ease: "power2.inOut",
        }).fromTo(
          blocks[2],
          { autoAlpha: 0, y: 90, x: 0 },
          { autoAlpha: 1, y: 0, x: 0, duration: 1.0, ease: "power2.inOut" },
          ">-=0.6"
        );
      }

      if (blocks[3]) {
        tl.to(blocks[2], {
          autoAlpha: 0,
          x: -120,
          duration: 1.1,
          ease: "sine.inOut",
        }).fromTo(
          blocks[3],
          { autoAlpha: 0, x: 120 },
          { autoAlpha: 1, x: 0, duration: 1.1, ease: "sine.inOut" },
          ">-=0.45"
        );
      }

      if (blocks[4]) {
        tl.to(blocks[3], {
          autoAlpha: 0,
          x: -120,
          duration: 1.1,
          ease: "sine.inOut",
        }).fromTo(
          blocks[4],
          { autoAlpha: 0, x: 120 },
          { autoAlpha: 1, x: 0, duration: 1.1, ease: "sine.inOut" },
          ">-=0.45"
        );
      }

      if (blocks[5]) {
        tl.to(blocks[4], {
          autoAlpha: 0,
          x: -120,
          duration: 1.1,
          ease: "sine.inOut",
        }).fromTo(
          blocks[5],
          { autoAlpha: 0, x: 120 },
          { autoAlpha: 1, x: 0, duration: 1.1, ease: "sine.inOut" },
          ">-=0.45"
        );
      }

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top bottom",
        onEnterBack: () => {
          const st = ScrollTrigger.getById(ST_ID);
          if (!st) return;

          const idx = Math.round(st.progress * steps);

          blocks.forEach((b, i) => {
            if (i < 2) {
              gsap.set(b, {
                autoAlpha: i === idx ? 1 : 0,
                y: i === idx ? 0 : 60,
                x: 0,
              });
            } else {
              gsap.set(b, {
                autoAlpha: i === idx ? 1 : 0,
                x: i === idx ? 0 : 120,
                y: 0,
              });
            }
          });

          gsap.set(bulletsPanel, {
            autoAlpha: idx >= 2 ? 1 : 0,
            pointerEvents: idx >= 2 ? "auto" : "none",
          });

          const map = { 2: 1, 3: 2, 4: 3 };
          setActiveBullet(map[idx] ?? null);
        },
      });

      function setActiveBullet(n) {
        const all = gsap.utils.toArray(".hero-bullets .bullet");

        all.forEach((b) => {
          b.classList.remove("is-active");
          b.textContent = b.dataset.b.padStart(2, "0");
        });

        const el = n
          ? document.querySelector(`.hero-bullets .bullet[data-b="${n}"]`)
          : null;

        if (el) {
          el.classList.add("is-active");
          el.textContent = el.textContent;
        }

        moveIndicator(el);
      }

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

      bullets.forEach((btn) => {
        btn.addEventListener("click", () => {
          const n = Number(btn.getAttribute("data-b"));
          const targetPhase = { 1: 2, 2: 3, 3: 4 }[n];

          const st = ScrollTrigger.getById(ST_ID);
          if (!st) return;

          const progress = targetPhase / steps;

          gsap.to(st, {
            progress,
            duration: 1.0,
            ease: "power2.inOut",
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
        
        {/* BLOCK 0 -------------------------------------------------- */}
        <div className="hero-block one" data-phase="0">
          <div className="hero-left">
            <h1 className="hero-title display-lg">
              <span className="line">SPARK INDUSTRIAL</span>
              <br />
              <span className="line">BRILLIANCE</span>
            </h1>
          </div>

          <div className="hero-right">
            <p className="hero-subtext hero-subtext--desktop">
              — We merge decades of OT expertise with cutting-edge
              <br />
              IT innovation to empower industries with smarter, more
              <br />
              efficient, and connected operations.
            </p>

            <p className="hero-subtext hero-subtext--mobile">
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

        {/* BLOCK 1 -------------------------------------------------- */}
        <div className="hero-block two" data-phase="1">
          <h2 className="display-md hero-title hero-title--ecosystem-desktop">
            <span className="line display-md">EVERY PROJECT BEGINS</span>
            <br />
            <span className="line display-md">INSIDE A LIVING ECOSYSTEM</span>
            <br />
            <span className="line display-md">OF EXPERTISE</span>
          </h2>

          <h2 className="display-md hero-title hero-title--ecosystem-mobile">
            EVERY PROJECT
            <br />
            BEGINS INSIDE A
            <br />
            LIVING ECOSYSTEM
            <br />
            OF EXPERTISE
          </h2>

          <p className="body-md two-subtext two-subtext--desktop">
            — Three departments working as one to
            <br />
            shape, implement, and evolve the technologies
            <br />
            that move modern industry forward.
          </p>

          <p className="body-md two-subtext two-subtext--mobile">
            — Three departments working
            <br />
            as one to shape, implement, and
            <br />
            evolve the technologies that move
            <br />
            modern industry forward
          </p>
        </div>

        {/* BULLETS -------------------------------------------------- */}
        <div className="hero-bullets" aria-label="Departments">
          <span className="bullets-label">OUR DEPARTMENTS</span>

          <div className="bullets-wrap">
            <div className="bullet-indicator" ref={indicatorRef} />

            <button className="bullet" data-b="1" type="button">01</button>
            <button className="bullet" data-b="2" type="button">02</button>
            <button className="bullet" data-b="3" type="button">03</button>
          </div>
        </div>

        {/* BLOCK 2 -------------------------------------------------- */}
        <div className="hero-block three" data-phase="2" data-bullet="1">
          <h2 className="display-md">
            AUTOMATION &
            <br />CONTROLS
          </h2>

          {/* DESKTOP TEXT EXACTO */}
          <p className="body-md three-subtext three-subtext--desktop">
            We specialize in developing, integrating, building,
            <br />
            and analyzing end-to-end systems to meet the
            <br />
            unique automation needs of our clients. 
          </p>

          {/* MOBILE TEXT EXACTO */}
          <p className="body-md three-subtext three-subtext--mobile">
            We specialize in developing, integrating, building,
            <br />
            and analyzing end-to-end systems to meet the
            <br />
            unique automation needs of our clients.
            <br />
            <br />
            Within this department, we have a specialized
            <br />
            Honeywell Elite Team dedicated exclusively to
            <br />
            supporting companies implementing Honeywell-
            <br />
            based hardware and control systems.
          </p>

          <ApproachButton label="Our approach" />
        </div>

      
       <div className="hero-block four" data-phase="3" data-bullet="2">
          <h2 className="display-md">DIGITAL SKILLS</h2>

        <p className="body-md four-subtext four-subtext--desktop">
          In the RTS ecosystem, Digital Skills turns industrial data into actionable<br/>
          intelligence. Through our POD Services framework, we merge OT<br/>
          experience, process knowledge, and computer science to engineer<br/>
          the digital core of industrial operations.
        </p>


           <p className="body-md four-subtext four-subtext--mobile">
            In the RTS ecosystem, Digital Skills turns<br/>
            industrial data into actionable intelligence.<br/>
            Through our POD Services framework, we merge<br/>
            OT experience, process knowledge, and<br/>
            computer science to engineer the digital core of<br/>
            industrial operations.
          </p>


            <ApproachButton label="Our approach" />
        </div>


    
        <div className="hero-block five" data-phase="4" data-bullet="3">
          <h2 className="display-md">ENERGY &<br />INFRASTRUCTURE</h2>

          <p className="body-md five-subtext five-subtext--desktop">
            Our mission is to provide innovative, efficient, and<br />
            reliable energy and infrastructure solutions that enhance operational performance, ensure<br />
            sustainability, and drive industrial progress.
          </p>

          <p className="body-md five-subtext five-subtext--mobile">
            Our mission is to provide innovative, efficient,<br />
            and reliable energy and infrastructure solutions<br />
            that enhance operational performance, ensure<br />
            sustainability, and drive industrial progress.
          </p>

          <ApproachButton label="Our approach" />
        </div>

      </div>
      <div className="hero-spacer"></div>

    </section>
  );
}
