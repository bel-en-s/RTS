// src/Components/UI/FloatingNode.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./FloatingNode.css";

export default function FloatingNode() {
  const nodeRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const isDesktop = window.innerWidth > 820;

    // ✅ Estado base: colapsado y oculto (antes del loader)
    node.classList.add("collapsed");
    node.classList.remove("expanded");

    gsap.set(node, {
      autoAlpha: 0,
      y: 40,
      filter: "blur(14px)",
      // opcional: aseguramos geometría colapsada (match a tu collapseNode del Hero)
      height: 60,
      bottom: 32,
      right: 32,
      xPercent: 0,
      pointerEvents: "none",
    });

    let introPlayed = false;

    const playIntro = () => {
      if (introPlayed) return;
      introPlayed = true;

      // dejamos un flag por si querés gatear cosas desde Hero
      window.__nodeReady = true;

      gsap.fromTo(
        node,
        { y: 40, autoAlpha: 0, filter: "blur(14px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.15,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(node, { pointerEvents: "auto" });
          },
        }
      );
    };

    // Si el loader terminó antes que el nodo monte
    if (window.__heroEnter) requestAnimationFrame(playIntro);

    // Escuchamos el mismo evento del loader
    const onEnter = () => playIntro();
    window.addEventListener("hero:enter", onEnter);

    // HOVER (solo desktop)
    let hoverIn, hoverOut;
    if (isDesktop) {
      hoverIn = () => {
        gsap.to(node, {
          y: -6,
          duration: 0.95,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      hoverOut = () => {
        gsap.to(node, {
          y: 0,
          duration: 0.95,
          ease: "power3.inOut",
          overwrite: "auto",
        });
      };

      node.addEventListener("mouseenter", hoverIn);
      node.addEventListener("mouseleave", hoverOut);
    }

    return () => {
      window.removeEventListener("hero:enter", onEnter);
      if (isDesktop) {
        node.removeEventListener("mouseenter", hoverIn);
        node.removeEventListener("mouseleave", hoverOut);
      }
    };
  }, []);

  return (
    <button className="floating-node collapsed" type="button" ref={nodeRef}>
      <div className="fn-outer-circle">
        <div className="fn-ring"></div>
      </div>
      <div className="fn-text body-sm">What technical challenge are you facing today?</div>
    </button>
  );
}
