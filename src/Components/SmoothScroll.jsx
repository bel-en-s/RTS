import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis global (body scroller) sincronizado con ScrollTrigger.
 * Usá UN SOLO SmoothScroll en la App (fuera del Canvas).
 */
export default function SmoothScroll({
  lerp = 0.12,
  wheelMultiplier = 0.9,
  touchMultiplier = 1.2,
  duration, // opcional: animación isócrona
}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp,
      duration,
      wheelMultiplier,
      touchMultiplier,
      smoothWheel: true,
      smoothTouch: true,
      gestureOrientation: "vertical",
    });
    lenisRef.current = lenis;

    // Conducir Lenis con el ticker de GSAP para máxima compatibilidad
    const update = (t) => {
      lenis.raf(t * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Mantener ScrollTrigger al día
    lenis.on("scroll", () => ScrollTrigger.update());

    // Resize/Refresh
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [lerp, wheelMultiplier, touchMultiplier, duration]);

  return null;
}
