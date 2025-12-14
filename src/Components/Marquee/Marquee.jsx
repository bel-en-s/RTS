import React, { useEffect, useRef } from "react";
import "./Marquee.css";

export default function Marquee() {
  const topTrackRef = useRef(null);
  const bottomTrackRef = useRef(null);

  const top = [
    `${import.meta.env.BASE_URL}logos/logo-1.png`,
    `${import.meta.env.BASE_URL}logos/logo-2.png`,
    `${import.meta.env.BASE_URL}logos/logo-3.png`,
    `${import.meta.env.BASE_URL}logos/logo-4.png`,
  ];

  const bottom = [
    `${import.meta.env.BASE_URL}logos/logo-5.png`,
    `${import.meta.env.BASE_URL}logos/logo-6.png`,
    `${import.meta.env.BASE_URL}logos/logo-7.png`,
    `${import.meta.env.BASE_URL}logos/logo-8.png`,
  ];

  const duplicatedTop = [...top, ...top, ...top];
  const duplicatedBottom = [...bottom, ...bottom, ...bottom];

  useEffect(() => {
    const setupTrack = (track) => {
      if (!track) return;

      const recalc = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const move = track.scrollWidth / 2;
            track.style.setProperty("--move", `${move}px`);
          });
        });
      };

      // Recalcular cuando carguen imágenes
      const imgs = [...track.querySelectorAll("img")];
      let loaded = 0;

      imgs.forEach((img) => {
        if (img.complete) {
          loaded++;
          if (loaded === imgs.length) recalc();
        } else {
          img.onload = () => {
            loaded++;
            if (loaded === imgs.length) recalc();
          };
        }
      });

      // Recalcular en resize
      window.addEventListener("resize", recalc);

      return () => window.removeEventListener("resize", recalc);
    };

    const clean1 = setupTrack(topTrackRef.current);
    const clean2 = setupTrack(bottomTrackRef.current);

    return () => {
      clean1?.();
      clean2?.();
    };
  }, []);

  return (
    <div className="marquee-wrapper">
      <h2 className="marquee-title ">TRUSTED BY INDUSTRY LEADERS</h2>

      <div className="marquee-container">
        <div className="marquee-track marquee-left" ref={topTrackRef}>
          {duplicatedTop.map((src, i) => (
            <div className="logo-box" key={"t"+i}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>

        <div className="marquee-track marquee-right" ref={bottomTrackRef}>
          {duplicatedBottom.map((src, i) => (
            <div className="logo-box" key={"b"+i}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
