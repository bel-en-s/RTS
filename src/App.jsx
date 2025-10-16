// App.jsx
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Scene from "./Components/Scene.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx"; // 🔹 Importamos la nueva navbar

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
      {/* 🔹 Navbar fija y transparente con glassmorphism */}
      <Navbar />

      {/* 🔹 Canvas 3D en background */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0, // el canvas va detrás de todo
        }}
      >
        <Scene scroll={scroll} />
      </Canvas>

      {/* 🔹 Contenido scrollable por encima del canvas */}
      <section className="scroll-section">
        <div className="hero-text">
          <h1>AUTOMATION & CONTROLS</h1>
          <p>
            We specialize in developing, integrating, building, and analyzing
            end-to-end systems to meet the automation needs of our clients.
          </p>
          <button className="cta-btn">Our approach</button>
        </div>
      </section>
    </div>
  );
}
