// src/App.jsx
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import GridHelper from "./styles/gridHelper.jsx";



import Home from "./Pages/Home";
import Scene from "./Components/Scene.jsx";
import Navbar from "./Components/Navbar/Navbar";

import "./App.css";
import "./styles/Tokens.css";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [scroll, setScroll] = useState(0);
  const [phase, setPhase] = useState(0);

  const lenisRef = useRef(null);

useEffect(() => {
  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 0.7,
    touchMultiplier: 1.0,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

    lenisRef.current = lenis;


    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ({ scroll }) => {
    setScroll(scroll);   // sync scrolles
  });


    gsap.ticker.add(ScrollTrigger.update);

    // 🔹 Proxy: ScrollTrigger usa el contenedor real
    ScrollTrigger.scrollerProxy(".scroll-container", {
      scrollTop(value) {
        return arguments.length 
          ? lenis.scrollTo(value, { immediate: true })
          : lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    // 🔹 Default: todos los triggers usan este scroller
    ScrollTrigger.defaults({ scroller: ".scroll-container" });

    // forzar refresh 
    setTimeout(() => ScrollTrigger.refresh(), 80);

    return () => {
      lenis.destroy();
      ScrollTrigger.kill();
    };
  }, []);


  function LenisRaf() {
    useFrame((state) => {
      lenisRef.current?.raf(state.clock.elapsedTime * 1000);
    });
    return null;
  }


  return (
    <>
     {/* <GridHelper /> */}
      <Navbar />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      >
        {/* <LenisRaf /> */}

    
        <Scene scroll={scroll} phase={phase} />

        <EffectComposer multisampling={0}>
          <Noise opacity={0.2} />
          <Bloom intensity={0.8} luminanceThreshold={0.2} />
          <Fluid radius={0.08} force={0.8} swirl={0.8} fluidColor="#000" blend={0} curl={0.8} distortion={0.86} />
          <Vignette darkness={0.85} />
        </EffectComposer>
      </Canvas>

 
      <div className="scroll-container" style={{ position: "relative", zIndex: 1 }}>
        <Home onPhase={setPhase} />
        <div style={{ height: "120vh" }} />
      </div>
    </>
  );
}
