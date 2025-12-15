// src/Components/Loader/Loader.jsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import "./Loader.css";

export default function Loader({ isReady, onDone }) {
  const rootRef = useRef(null);
  const curtainRef = useRef(null);
  const contentRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading | finishing | leaving | done

  const hasRealProgressRef = useRef(false);
  const simTweenRef = useRef(null);

/* =====================================================
   SCROLL LOCK mientras el Loader está montado
===================================================== */
useEffect(() => {
  // (opcional) si querés forzar que arranque siempre arriba:
  // window.scrollTo(0, 0);

  const body = document.body;
  const html = document.documentElement;

  const scrollY = window.scrollY || 0;

  // Guardamos estilos previos por si tenés cosas custom
  const prev = {
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    bodyWidth: body.style.width,
    bodyOverflow: body.style.overflow,
    htmlOverflow: html.style.overflow,
  };

  // Lock tipo iOS-safe (evita “bounce”)
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";

  // Extra-hard lock (wheel/touch/keys)
  const prevent = (e) => e.preventDefault();

  const preventKeys = (e) => {
    const keys = ["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
    if (keys.includes(e.code)) e.preventDefault();
  };

  window.addEventListener("wheel", prevent, { passive: false });
  window.addEventListener("touchmove", prevent, { passive: false });
  window.addEventListener("keydown", preventKeys, { passive: false });

  return () => {
    window.removeEventListener("wheel", prevent);
    window.removeEventListener("touchmove", prevent);
    window.removeEventListener("keydown", preventKeys);

    // Restore estilos
    body.style.position = prev.bodyPosition;
    body.style.top = prev.bodyTop;
    body.style.left = prev.bodyLeft;
    body.style.right = prev.bodyRight;
    body.style.width = prev.bodyWidth;
    body.style.overflow = prev.bodyOverflow;
    html.style.overflow = prev.htmlOverflow;

    // Volvemos al scroll donde estaba
    window.scrollTo(0, scrollY);
  };
}, []);

  useEffect(() => {
    const m = THREE.DefaultLoadingManager;

    const prevStart = m.onStart;
    const prevProgress = m.onProgress;
    const prevLoad = m.onLoad;

    m.onStart = (_url, loaded, total) => {
      if (total > 0) {
        hasRealProgressRef.current = true;
        setProgress(Math.min(100, Math.round((loaded / total) * 100)));
      }
    };

    m.onProgress = (_url, loaded, total) => {
      if (total > 0) {
        hasRealProgressRef.current = true;
        setProgress(Math.min(100, Math.round((loaded / total) * 100)));
      }
    };

    m.onLoad = () => {
      hasRealProgressRef.current = true;
      setProgress(100);
    };

    return () => {
      m.onStart = prevStart;
      m.onProgress = prevProgress;
      m.onLoad = prevLoad;
    };
  }, []);

  /* =====================================================
     Intro (aparece loader)
  ===================================================== */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.set(root, { autoAlpha: 1 });
    gsap.set(curtainRef.current, { yPercent: 0 });
    gsap.set(contentRef.current, { autoAlpha: 0, y: 12, filter: "blur(10px)" });

    gsap.to(contentRef.current, {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.85,
      ease: "power3.out",
      delay: 0.12,
    });
  }, []);

  /* =====================================================
     Fallback (si NO hay assets reales): simula hasta 92%
  ===================================================== */
  useEffect(() => {
    if (phase !== "loading") return;

    const t = setTimeout(() => {
      if (hasRealProgressRef.current) return;

      simTweenRef.current?.kill();

      const obj = { p: progress };
      simTweenRef.current = gsap.to(obj, {
        p: 92,
        duration: 2.2,
        ease: "power1.out",
        onUpdate: () => setProgress(Math.min(100, Math.round(obj.p))),
      });
    }, 300);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* =====================================================
     FINISH + EXIT: llega a 100, lo muestra 1 frame y sale
  ===================================================== */
  useEffect(() => {
    if (!isReady) return;
    if (phase !== "loading") return;

    setPhase("finishing");
    simTweenRef.current?.kill();

    const obj = { p: progress };

    gsap.to(obj, {
      p: 100,
      duration: 0.55,
      ease: "power2.out",
      onUpdate: () => setProgress(Math.min(100, Math.round(obj.p))),
      onComplete: () => {
        setProgress(100);

        requestAnimationFrame(() => {
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
            filter: "blur(10px)",
            duration: 0.35,
            ease: "power3.in",
          });

          tl.to(
            curtainRef.current,
            { yPercent: -110, duration: 1.05 },
            "<0.05"
          );

          tl.to(rootRef.current, { autoAlpha: 0, duration: 0.2 }, ">-0.18");
        });
      },
    });
  }, [isReady, phase, progress, onDone]);

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
