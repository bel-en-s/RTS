import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";

import Home from "./Pages/Home";
import Scene from "./Components/Scene.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";

import "./App.css";
import "./styles/Tokens.css";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [scroll, setScroll] = useState(0);
  const [phase, setPhase] = useState(0);

  const lenisRef = useRef(null);
  const velocityRef = useRef(0);

  // --- Inicializar Lenis una sola vez
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,            // mayor duración => scroll más cinematográfico
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic suave
      smoothWheel: true,
      wheelMultiplier: 0.6,     // menos sensibilidad
      touchMultiplier: 1.0,
    });

    lenisRef.current = lenis;

    // Sincronizar Lenis y ScrollTrigger
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ({ scroll, velocity }) => {
      setScroll(scroll);
      velocityRef.current = velocity ?? 0;
      ScrollTrigger.update();
    });

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) lenis.scrollTo(value, { immediate: true });
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.kill();
    };
  }, []);

  // --- Sincronizar el raf de Lenis con Three.js (Canvas)
  function LenisRaf() {
    useFrame((state) => {
      const lenis = lenisRef.current;
      if (lenis) lenis.raf(state.clock.elapsedTime * 1000);
    });
    return null;
  }

  return (
    <>

      <Navbar />
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          zIndex: 9999,
          background: "rgba(0,0,0,0.65)",
          color: "#00ffcc",
          fontFamily: "monospace",
          fontSize: "13px",
          padding: "10px 14px",
          borderRadius: "10px",
          border: "1px solid rgba(0,255,255,0.3)",
          boxShadow: "0 0 8px rgba(0,255,255,0.2)",
          pointerEvents: "none",
          backdropFilter: "blur(6px)",
        }}
      >
        <div>🌀 <strong>PHASE DEBUG</strong></div>
        <div>phase: {phase.toFixed(2)}</div>
        <div>vel: {velocityRef.current.toFixed(2)}</div>
        <div>
          active:{" "}
          <span
            style={{
              color:
                phase < 0.7 ? "#ff6" : phase < 1.4 ? "#0f0" : "#f66",
            }}
          >
            {phase < 0.7
              ? "PHASE 1 — SPARK"
              : phase < 1.4
              ? "PHASE 2 — ECOSYSTEM"
              : "PHASE 3 — AUTOMATION"}
          </span>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      >
        <LenisRaf />
        <Scene scroll={scroll} phase={phase} velocity={velocityRef.current} />

        <EffectComposer multisampling={0}>
          <Noise opacity={0.2} />
          <Bloom intensity={0.8} luminanceThreshold={0.2} />
          <Fluid
            radius={0.08}
            force={0.8}
            swirl={0.8}
            fluidColor="#000000"
            blend={0}
            curl={0.8}
            distortion={0.86}
          />
          <Vignette darkness={0.85} />
        </EffectComposer>
      </Canvas>

      <div className="scroll-container" style={{ position: "relative", zIndex: 1 }}>
        <Home onPhase={setPhase} />
        <div style={{ height: "150vh" }} />
      </div>
    </>
  );
}
