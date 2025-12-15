import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";

import Loader from "./Components/Loader/Loader";
import Navbar from "./Components/Navbar/Navbar";
import FloatingNode from "./Components/UI/FloatingNode";
import Home from "./Pages/Home";
import Footer from "./Components/Footer/Footer";
import Scene from "./Components/Scene";

import "./App.css";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [scroll, setScroll] = useState(0);
  const [phase, setPhase] = useState(0);
  const [navMode, setNavMode] = useState("dark");

  const [isReady, setIsReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  const lenisRef = useRef(null);

  /* --------------------------------------------------
     ⏳ TIEMPO MÍNIMO DE LOADER (AWWWARDS FEEL)
  -------------------------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  /* --------------------------------------------------
     🌀 LENIS + SCROLLTRIGGER (POST LOADER)
  -------------------------------------------------- */
  useEffect(() => {
    if (!loaderDone) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.7,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ({ scroll }) => setScroll(scroll));

    gsap.ticker.add(ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(".scroll-container", {
      scrollTop(value) {
        return arguments.length
          ? lenis.scrollTo(value, { immediate: true })
          : lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.defaults({ scroller: ".scroll-container" });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      lenis.destroy();
      ScrollTrigger.killAll();
    };
  }, [loaderDone]);

useEffect(() => {
  if (!loaderDone) return;

  gsap.set("#hero", { visibility: "visible" });

  // 🔔 Avisar al hero que ya puede animar
  window.dispatchEvent(new Event("hero:enter"));
}, [loaderDone]);

  return (
    <>
      {!loaderDone && (
        <Loader
          isReady={isReady}
          onDone={() => setLoaderDone(true)}
        />
      )}

      <Navbar navMode={navMode} />
      <FloatingNode phase={phase} />

      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Scene scroll={scroll} phase={phase} />
        <EffectComposer multisampling={0}>
          <Noise opacity={0.2} />
          <Bloom intensity={0.8} luminanceThreshold={0.2} />
          <Fluid radius={0.08} force={0.8} swirl={0.8} curl={0.8} distortion={0.86} />
          <Vignette darkness={0.85} />
        </EffectComposer>
      </Canvas>

      <div className="main-container">
        <div className="scroll-container" style={{ position: "relative", zIndex: 3 }}>
          <Home onPhase={setPhase} setNavMode={setNavMode} />
          <Footer />
        </div>
      </div>
    </>
  );
}
