import { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Loader from "./Components/Loader/Loader";
import Navbar from "./Components/Navbar/Navbar";
import FloatingNode from "./Components/UI/FloatingNode";
import Home from "./Pages/Home";
import Footer from "./Components/Footer/Footer";
import AutomationControls from "./Pages/AutomationControls";

import "./App.css";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const location = useLocation();

  const [scroll, setScroll] = useState(0);
  const [phase, setPhase] = useState(0);
  const [navMode, setNavMode] = useState("dark");

  const [isReady, setIsReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  const lenisRef = useRef(null);
  const rafIdRef = useRef(0);

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
      cancelAnimationFrame(rafIdRef.current);
      gsap.ticker.remove(ScrollTrigger.update);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [loaderDone]);

  // ✅ En cada navegación: mato triggers del Home + fuerzo fondo/estado + scroll top
  useEffect(() => {
    if (!loaderDone) return;

    const isHome = location.pathname === "/";

    // 1) Evitar que triggers “viejos” sigan tocando navMode/fondo
    ScrollTrigger.getAll().forEach((st) => st.kill());

    // 2) Forzar look en páginas internas
    if (!isHome) {
      setNavMode("dark");
      document.documentElement.style.backgroundColor = "#000102";
      document.body.style.backgroundColor = "#000102";
    } else {
      // Home maneja navMode con su lógica (Story, etc.)
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
    }

    // 3) Scroll top + refresh
    lenisRef.current?.scrollTo(0, { immediate: true });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, [location.pathname, loaderDone]);

  // Hero gate después del loader (si lo necesitás)
  useEffect(() => {
    if (!loaderDone) return;
    gsap.set("#hero", { visibility: "visible" });
    window.__heroEnter = true;
    window.dispatchEvent(new Event("hero:enter"));
  }, [loaderDone]);

  return (
    <>
      {!loaderDone && (
        <Loader isReady={isReady} onDone={() => setLoaderDone(true)} />
      )}

      {/* ✅ show={loaderDone} si querés que la navbar “entre” después del loader */}
      <Navbar navMode={navMode} show={loaderDone} />
      <FloatingNode phase={phase} />

      <div className="main-container">
        <div className="scroll-container" style={{ position: "relative", zIndex: 3 }}>
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
    </>
  );
}
