import { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";

import Loader from "./Components/Loader/Loader";
import Navbar from "./Components/UI/Navbar/Navbar";
import FloatingNode from "./Components/UI/FloatingNode";
import Home from "./Pages/Home";
import Footer from "./Components/Footer/Footer";
import Scene from "./Components/Scene";
import AutomationControls from "./Pages/AutomationControls";
import Transition from "./Components/Transition/Transition";

import "./App.css";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const location = useLocation();
  const transitionRef = useRef(null); // Referencia vital para la transición

  const [scroll, setScroll] = useState(0);
  const [phase, setPhase] = useState(0);
  const [navMode, setNavMode] = useState("dark");

  const [isReady, setIsReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  const lenisRef = useRef(null);
  const rafIdRef = useRef(0);
  const stTickRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loaderDone) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.7,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };
    rafIdRef.current = requestAnimationFrame(raf);

    lenis.on("scroll", ({ scroll }) => setScroll(scroll));

    const onTick = () => ScrollTrigger.update();
    stTickRef.current = onTick;
    gsap.ticker.add(onTick);

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
      cancelAnimationFrame(rafIdRef.current);
      if (stTickRef.current) gsap.ticker.remove(stTickRef.current);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [loaderDone]);

  useEffect(() => {
    if (!loaderDone) return;
    gsap.set("#hero", { visibility: "visible" });
    window.__heroEnter = true;
    window.dispatchEvent(new Event("hero:enter"));
  }, [loaderDone]);

  useEffect(() => {
    if (!loaderDone) return;
    const isHome = location.pathname === "/";
    if (!isHome) {
      setNavMode("dark");
      document.documentElement.style.backgroundColor = "#000102";
      document.body.style.backgroundColor = "#000102";
    } else {
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
    }
  }, [location.pathname, loaderDone]);

  return (
    <>
      {!loaderDone && (
        <Loader isReady={isReady} onDone={() => setLoaderDone(true)} />
      )}

      <Transition ref={transitionRef} enabled={loaderDone} lenisRef={lenisRef}>
        <Navbar navMode={navMode} />
        <FloatingNode phase={phase} />

        <div className="main-container">
          <div
            className="scroll-container"
            style={{ position: "relative", zIndex: 3 }}
          >
            <Routes>
              <Route
                path="/"
                element={<Home onPhase={setPhase} setNavMode={setNavMode} />}
              />
              <Route
                path="/automation-controls"
                element={<AutomationControls setNavMode={setNavMode} />}
              />
              <Route
                path="*"
                element={<Home onPhase={setPhase} setNavMode={setNavMode} />}
              />
            </Routes>
            <Footer />
          </div>
        </div>
      </Transition>
    </>
  );
}
