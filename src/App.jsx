import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";

import Scene from "./Components/Scene.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Home from "./Pages/Home.jsx";

// Scroll
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
gsap.registerPlugin(ScrollTrigger);

// Postprocessing
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function App() {
  const [scroll, setScroll] = useState(0);
  const [phase, setPhase] = useState(0);
  const lenisRef = useRef(null);

  // lenissss
  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.08,
      wheelMultiplier: 0.8,
    });
    lenisRef.current = lenis;

    // Avanza Lenis en su propio loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Actualizar el scroll reactivo
    lenis.on("scroll", ({ scroll }) => {
      setScroll(scroll);
      ScrollTrigger.update();
    });

    // GSAP timeline para controlar las fases (0 → 1 → 2)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        markers: false, // true false
      },
    });

    tl.to({}, { duration: 1, onUpdate: () => setPhase(0) }) // Fase 1
      .to({}, { duration: 8, onUpdate: () => setPhase(1) }) // Fase 2
      .to({}, { duration: 1, onUpdate: () => setPhase(2) }); // Fase 3

    // Limpieza
    return () => {
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
      lenis.destroy();
    };
  }, []);

  //ntegrar Lenis al render loop 
  const LenisRaf = () => {
    useFrame((state) => {
      const lenis = lenisRef.current;
      if (lenis) lenis.raf(state.clock.elapsedTime * 1000);
    });
    return null;
  };

  return (
    <div className="App">
      <Navbar />

      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 100, // atrás del contenido
        }}
      >
      
        <LenisRaf />

        {/* Escena reactiva a scroll + fase */}
        <Scene scroll={scroll} phase={phase} />

  
        <EffectComposer>
          <Bloom
            mipmapBlur
            intensity={0.0515}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
          <Noise premultiply opacity={1} />
          <Vignette
            offset={0.4}
            darkness={0.8}
            eskil={false}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>

      {/*altura contenedor */}
      <div className="scroll-container">
        <Home />
      </div>
    </div>
  );
}
