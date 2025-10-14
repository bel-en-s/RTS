import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import Lenis from "@studio-freight/lenis";

function Box() {
  const ref = useRef();

  useFrame((state) => {
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff6f61" />
    </mesh>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ smooth: true });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div style={{ width: "100vw", height: "400vh", background: "black" }}>
      <Canvas
        camera={{ position: [0, 0, 4] }}
        style={{ position: "fixed", top: 0, left: 0 }}
      >
        <color attach="background" args={["#111111"]} />
        <ambientLight intensity={1} />
        <directionalLight position={[3, 3, 3]} />
        <Box />
      </Canvas>

      {/* Sección scrollable */}
      <section
        style={{
          height: "400vh",
          color: "white",
          padding: "20px",
          fontFamily: "sans-serif",
        }}
      >
        <h1>Scroll suave con Lenis</h1>
        <p>Esto es contenido de ejemplo para scrollear.</p>
      </section>
    </div>
  );
}
