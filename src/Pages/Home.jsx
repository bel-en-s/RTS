// App.jsx
import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Home from "./Pages/Home.jsx";

export default function App() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({ smooth: true, lerp: 0.1 });

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
      <Navbar />
      <Home scroll={scroll} />
    </div>
  );
}
