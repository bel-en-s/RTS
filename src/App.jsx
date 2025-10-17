import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Scene from "./Components/Scene.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Home from "./Pages/Home.jsx"; 

export default function App() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    lenis.on("scroll", ({ scroll }) => setScroll(scroll));
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="App">
      {/* 🔹 Navbar fija con glassmorphism */}
      <Navbar />

  
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0, // siempre detrás del contenido
        }}
      >
        <Scene scroll={scroll} />
      </Canvas>

      {/* 🔹 Contenido principal (Home) */}
      <Home />
    </div>
  );
}
