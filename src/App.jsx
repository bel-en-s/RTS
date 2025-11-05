import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";

import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home";
import Scene from "./Components/Scene.jsx";

import "./App.css";
import "./styles/tokens.css";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [scroll, setScroll] = useState(0);
  const [phase, setPhase] = useState(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.1,
      wheelMultiplier: 0.8,
    });
    lenisRef.current = lenis;

    

    // ScrollTrigger + Lenis
    const st = ScrollTrigger.create({
      trigger: ".scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => setPhase(self.progress * 2), // 0..2 (tres fases)
    });

    lenis.on("scroll", ({ scroll }) => {
      setScroll(scroll);
      ScrollTrigger.update();
    });

    return () => {
      st.kill();
      lenis.destroy();
    };
  }, []);

  // Sincronizar Lenis con el loop de R3F
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

      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      >
        <LenisRaf />
        <Scene scroll={scroll} phase={phase} />

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
{/* <div className="grid-helper">
  {Array.from({ length: 2 + Number(getComputedStyle(document.documentElement).getPropertyValue('--columns') || 13) }).map((_, i) => (
    <div key={i} />
  ))}
</div> */}

      <div className="scroll-container" style={{ position: "relative", zIndex: 1 }}>
        <Home />
        
        <div style={{ height: "150vh" }} />
      </div>
    </>
  );
}
