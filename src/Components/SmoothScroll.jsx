// smoothScroll.js (o en tu Layout)
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.6,      // subir a 1.8–2.2 si querés más cine
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic suave
    smoothWheel: true,
    wheelMultiplier: 0.8, // menor => menos “nervio” del mouse
    touchMultiplier: 1.0,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sincronizar con ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Proxy (si usás body como scroller)
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) { lenis.scrollTo(value, { immediate: true }); }
      return lenis.scroll;
    },
    getBoundingClientRect() { return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }; },
  });

  return lenis;
}
