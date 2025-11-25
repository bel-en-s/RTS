import React from "react";
import "./Marquee.css";
import logo from "../../assets/react.svg";

export default function Marquee() {
  const logos = Array(8).fill(logo);

  return (
    <div className="marquee-wrapper">
      <h2 className="marquee-title">TRUSTED BY INDUSTRY LEADERS</h2>

      <div className="marquee-container">
        <div className="marquee-track marquee-scroll-left">
          <div className="marquee-group">
            {logos.map((img, idx) => (
              <div className="logo-box" key={`top-${idx}`}>
                <img src={img} alt={`logo-${idx}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="marquee-track marquee-scroll-right">
          <div className="marquee-group">
            {logos.map((img, idx) => (
              <div className="logo-box" key={`bottom-${idx}`}>
                <img src={img} alt={`logo-${idx}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
