import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);

useEffect(() => {
  const blocks = gsap.utils.toArray(".hero-block");
  const total = blocks.length;

   // intro animacion
 const introTl = gsap.timeline({
  defaults: { ease: "power4.out" },
});

introTl
  // ✨ 1) Animar las líneas del título con rebote y cascada
  .fromTo(
    ".hero-block:first-child .hero-title .line",
    { 
      y: 100, 
      opacity: 0, 
      scale: 1.05,
      filter: "blur(6px)",
    },
    { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      filter: "blur(0px)",
      duration: 1.6,
      ease: "back.out(1.7)",
      stagger: { amount: 0.3, from: "start" },
      delay: 0.5,
    }
  )

  // ✨ 
  .fromTo(
    ".hero-block:first-child .hero-subtext",
    { 
      y: 50, 
      opacity: 0, 
      filter: "blur(4px)",
    },
    { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      duration: 1.2,
      ease: "power3.out",
    },
    "-=0.8"
  )

  .to(
    ".hero-block:first-child .hero-title .line",
    {
      y: -4,
      duration: 0.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 1,
    },
    "+=0.1"
  );

  
  gsap.set(blocks, { autoAlpha: 0, y: 60 });
  gsap.set(blocks[0], { autoAlpha: 1, y: 0 });

  const tl = gsap.timeline({
    id:"hero",
    scrollTrigger: {
      trigger: heroRef.current,
      start: "top top",
      end: `+=${(total - 1) * 140}vh`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      snap: {
        snapTo: (v) => {
          const steps = total - 1;
          return Math.round(v * steps) / steps;
        },
        ease: "power3.out",
        duration: 0.8,
      }
    }
  });

  blocks.forEach((el, i) => {
    const next = blocks[i + 1];
    if (!next) return;

    tl.to(el, {
      autoAlpha: 0,
      y: -40,
  
      duration: 8.3,
      ease: "power3.inOut"
    }).fromTo(
      next,
      { autoAlpha: 0, y: 90 },
      {
        autoAlpha: 1,
        y: 0,
     
        duration: 8.4,
        ease: "power3.inOut"
      },
      ">-=0.7"
    );
  });

 
  ScrollTrigger.create({
    trigger: heroRef.current,
    start: "top bottom",
    onUpdate: (self) => {
    const progress = self.progress;
    console.log("Scroll progress:", progress.toFixed(2));
  },
    onEnterBack: () => {
      const st = ScrollTrigger.getById("hero");
      if (!st) return;

      const p = st.progress;
      const idx = Math.round(p * (total - 1));
      blocks.forEach((b, i) => {
        gsap.set(b, { autoAlpha: i === idx ? 1 : 0, y: i === idx ? 0 : 60 });
      });
    }
  });
}, []);


  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-inner">
        
        <div className="hero-block">
           <div className="" data-phase="1">
            <h1 className="display-lg hero-title ">
            <span className="line line--1 ">SPARK INDUSTRIAL </span><br/>
            <span className="line line--2 ">BRILLIANCE</span>
            </h1>
        </div>
          {/* <p className="hero-subtext">—  We merge decades of OT expertise with cutting-edge IT innovation to empower industries with smarter, more efficient, and connected operations..</p> */}
        </div>

        <div className="hero-block" data-phase="1">
          <h1 className="display-md">EVERY PROJECT BEGINS<br/>INSIDE A LIVING ECOSYSTEM</h1>
          <p>— Three departments working as one across disciplines.</p>
        </div>

        <div className="hero-block">
          <h1 >AUTOMATION &<br/>CONTROLS</h1>
          <p>Specialized in integration, systems design and industrial performance.</p>
        </div>

        <div className="hero-block">
          <h1>DIGITAL SKILLS</h1>
          <p>Turning industrial data into actionable intelligence.</p>
        </div>

        <div className="hero-block">
          <h1>ENERGY &<br/>INFRASTRUCTURE</h1>
          <p>Engineering sustainable, efficient energy ecosystems.</p>
        </div>

      </div>
    </section>
  );
}
