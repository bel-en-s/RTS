// Components/PhaseOrchestrator.jsx
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Orquesta la "phase" de la escena leyendo data-scene-phase en cada .hero-block.
 * NO hace pin (eso lo maneja Hero). Sólo setea 0/1/2 con tween suave al entrar/salir cada bloque.
 */
export default function PhaseOrchestrator({ onPhaseChange }) {
  useEffect(() => {
    const blocks = gsap.utils.toArray(".hero .hero-block");
    if (!blocks.length) return;

    const phaseProxy = { value: 0 };
    const setPhaseSmooth = (target, dur = 0.5) => {
      gsap.to(phaseProxy, {
        value: target,
        duration: dur,
        ease: "power2.out",
        onUpdate: () => onPhaseChange?.(phaseProxy.value),
      });
    };

    const triggers = blocks.map((el) => {
      const attr = el.getAttribute("data-scene-phase");
      const targetPhase = Number.isFinite(+attr)
        ? Math.max(0, Math.min(2, +attr))
        : 0;

      return ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter:     () => setPhaseSmooth(targetPhase, 0.4),
        onEnterBack: () => setPhaseSmooth(targetPhase, 0.4),
        // ❌ sin onUpdate: fase exacta por bloque para respetar tus posiciones originales
      });
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [onPhaseChange]);

  return null;
}
