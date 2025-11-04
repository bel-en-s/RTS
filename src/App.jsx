import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home";
import "./App.css";
import "./styles/tokens.css";


gsap.registerPlugin(ScrollTrigger);

export default function App() {

  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.1,            // suavidad
      wheelMultiplier: 0.9, // control velocidad
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
  }, []);

  return (
    <>
      <Navbar />

      <div className="layout-container">
        {/* helper grilla*/}
        <div className="grid-helper">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} />
          ))}
        </div>

        <Home />
      </div>
    </>
  );
}
