import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import "./Loader.css";

export default function Loader({ isReady, onDone }) {
  const rootRef = useRef(null);
  const curtainRef = useRef(null);
  const contentRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading | leaving | done

  // Hook al LoadingManager global (lo usan la mayoría de loaders si no pasás manager custom)
  useEffect(() => {
    const m = THREE.DefaultLoadingManager;

    const onStart = (_, loaded, total) => {
      if (total > 0) setProgress(Math.round((loaded / total) * 100));
    };
    const onProgress = (_, loaded, total) => {
      if (total > 0) setProgress(Math.round((loaded / total) * 100));
    };
    const onLoad = () => setProgress(100);

    const prevStart = m.onStart;
    const prevProgress = m.onProgress;
    const prevLoad = m.onLoad;

    m.onStart = onStart;
    m.onProgress = onProgress;
    m.onLoad = onLoad;

    return () => {
      m.onStart = prevStart;
      m.onProgress = prevProgress;
      m.onLoad = prevLoad;
    };
  }, []);

  // Intro (aparece loader)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.set(root, { autoAlpha: 1 });
    gsap.set(curtainRef.current, { yPercent: 0 }); // cubre todo
    gsap.set(contentRef.current, { autoAlpha: 0, y: 10 });

    gsap.to(contentRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      delay: 0.15,
    });
  }, []);

  // Salida cuando está ready (telón sube y revela)
  useEffect(() => {
    if (!isReady) return;
    if (phase !== "loading") return;

    setPhase("leaving");

    const tl = gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: () => {
        setPhase("done");
        onDone?.();
      },
    });

    tl.to(contentRef.current, {
      autoAlpha: 0,
      y: -10,
      duration: 0.35,
      ease: "power3.in",
    });

    // Telón barrido a negro de abajo hacia arriba (en realidad: el negro se va hacia arriba)
    tl.to(
      curtainRef.current,
      {
        yPercent: -110,
        duration: 0.95,
      },
      "<0.05"
    );

    tl.to(
      rootRef.current,
      {
        autoAlpha: 0,
        duration: 0.2,
      },
      ">-0.15"
    );
  }, [isReady, onDone, phase]);

  if (phase === "done") return null;

  return (
    <div ref={rootRef} className="loader-root" aria-hidden={false}>
      <div ref={curtainRef} className="loader-curtain" />

      <div ref={contentRef} className="loader-content">
        <div className="loader-title">Loading</div>

        <div className="loader-meter">
          <div className="loader-bar">
            <div className="loader-barFill" style={{ width: `${progress}%` }} />
          </div>
          <div className="loader-pct">{progress}%</div>
        </div>

     
      </div>
    </div>
  );
}
