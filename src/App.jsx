import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion"
import { BlendFunction } from 'postprocessing'
import Scene from "./Components/Scene.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Home from "./Pages/Home.jsx";
import HorizontalCarousel from "./Components/Carousel/HorizontalCarousel.jsx";

import "./Pages/Home.css";


gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [scroll, setScroll] = useState(0);
  const [phase, setPhase] = useState(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      // lerp: 0.01,
      wheelMultiplier: 0.8,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ({ scroll }) => {
      setScroll(scroll);
      ScrollTrigger.update();
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    tl.to({}, { duration: 1, onUpdate: () => setPhase(0) }) // fase 1
      .to({}, { duration: 1, onUpdate: () => setPhase(1) }) // fase 2
      .to({}, { duration: 1, onUpdate: () => setPhase(2) }); // fase 3

    return () => {
      tl.kill();
      lenis.destroy();
    };
  }, []);

  const LenisRaf = () => {
    useFrame((state) => {
      const lenis = lenisRef.current;
      if (lenis) lenis.raf(state.clock.elapsedTime * 1000);
    });
    return null;
  };

  return (
    <div className="App">
      <Navbar/>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ position: "fixed", inset: 0, zIndex: 100000 }}
      >
        <LenisRaf />
        <Scene scroll={scroll} phase={phase} />

        <EffectComposer multisampling={0}>
          {/* <Bloom intensity={0.8} luminanceThreshold={0.2} /> */}
          <Noise opacity={0.2} />
         <Fluid
          radius={0.08}
          force={0.5}
          swirl={0.2}
          fluidColor="#000000"   
          blend={0}              
          curl={0.1}
          distortion={0.3}
        />

          <Vignette darkness={0.9} />
          {/* <ChromaticAberration offset={[0.007, 0.007]} radial /> */}
        </EffectComposer>
      </Canvas>

      <div className="scroll-container">
        <Home />
        <HorizontalCarousel />
      </div>
    </div>
  );
}
