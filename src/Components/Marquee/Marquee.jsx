import React, { useEffect, useRef } from "react";
import "./Marquee.css";

export default function Marquee() {
  const topTrackRef = useRef(null);
  const bottomTrackRef = useRef(null);

  const topLogos = [
    `${import.meta.env.BASE_URL}logos/logo-1.png`,
    `${import.meta.env.BASE_URL}logos/logo-2.png`,
    `${import.meta.env.BASE_URL}logos/logo-3.png`,
    `${import.meta.env.BASE_URL}logos/logo-4.png`,
  ];

  const bottomLogos = [
    `${import.meta.env.BASE_URL}logos/logo-5.png`,
    `${import.meta.env.BASE_URL}logos/logo-6.png`,
    `${import.meta.env.BASE_URL}logos/logo-7.png`,
    `${import.meta.env.BASE_URL}logos/logo-8.png`,
  ];

  const repeatedTop = [...topLogos, ...topLogos];
  const repeatedBottom = [...bottomLogos, ...bottomLogos];

  useEffect(() => {
    const setMove = (track) => {
      if (!track) return;
      const width = track.scrollWidth / 2;
      track.style.setProperty("--move", width + "px");
    };

    setMove(topTrackRef.current);
    setMove(bottomTrackRef.current);
  }, []);

  return (
    <div className="marquee-wrapper">
      <h2 className="marquee-title">TRUSTED BY INDUSTRY LEADERS</h2>

      <div className="marquee-container">
        <div className="marquee-track marquee-left" ref={topTrackRef}>
          {repeatedTop.map((src, i) => (
            <div className="logo-box" key={`top-${i}`}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>

        <div className="marquee-track marquee-right" ref={bottomTrackRef}>
          {repeatedBottom.map((src, i) => (
            <div className="logo-box" key={`bottom-${i}`}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
