import React from "react";
import "./Marquee.css";

export default function Marquee() {
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

  return (
    <div className="marquee-wrapper">
      <h2 className="marquee-title">TRUSTED BY INDUSTRY LEADERS</h2>

      <div className="marquee-container">
        
        {/* FILA ARRIBA */}
        <div className="marquee-track marquee-left">
          {repeatedTop.map((src, i) => (
            <div className="logo-box" key={`top-${i}`}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>

        {/* FILA ABAJO */}
        <div className="marquee-track marquee-right">
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
