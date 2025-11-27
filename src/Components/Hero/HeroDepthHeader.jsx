import { useEffect, useState } from "react";
import "./Hero.css"; // usa tu css general

export default function HeroDeptHeader({ phase }) {
  const active = Math.round(phase);

  return (
    <div className="hero-dept-fixed">
      <h4 className="hero-dept-label">OUR DEPARTMENTS</h4>

      <div className="hero-dept-index">
        <span className={active === 2 ? "on" : ""}>01</span>
        <span className={active === 3 ? "on" : ""}>02</span>
        <span className={active === 4 ? "on" : ""}>03</span>
      </div>
    </div>
  );
}
