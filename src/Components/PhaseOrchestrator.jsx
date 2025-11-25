import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Detecta qué .hero-block está visible y comunica la fase al parent.
 * Usa data-phase="0", "1", "2" en cada bloque.
 */
export default function PhaseOrchestrator({ onPhaseChange }) {
  useEffect(() => {
    // limpiar cualquier instancia previa
    ScrollTrigger.getAll().forEach((st) => st.kill());

    const blocks = gsap.utils.toArray(".hero-block");
    if (!blocks.length) {
      console.warn("[PhaseOrchestrator] ⚠️ No hay bloques con clase .hero-block");
      return;
    }

    console.log("[PhaseOrchestrator] ✅ Detectados", blocks.length, "bloques de texto");

    const proxy = { value: 0 };

    const setPhaseSmooth = (targetPhase) => {
      gsap.to(proxy, {
        value: targetPhase,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => {
          onPhaseChange?.(proxy.value);
        },
      });
    };

    // Crear un ScrollTrigger por bloque
    blocks.forEach((block) => {
      const phaseIndex = parseFloat(block.dataset.phase);
      ScrollTrigger.create({
        trigger: block,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          console.log("🟢 Enter → bloque fase", phaseIndex);
          setPhaseSmooth(phaseIndex);
        },
        onEnterBack: () => {
          console.log("🟡 EnterBack → bloque fase", phaseIndex);
          setPhaseSmooth(phaseIndex);
        },
        onLeave: () => {
          console.log("🔵 Leave → bloque fase", phaseIndex);
        },
      });
    });


    return () => {
      console.log("[PhaseOrchestrator] 🔻 Cleanup ScrollTriggers");
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [onPhaseChange]);

  return null;
}
