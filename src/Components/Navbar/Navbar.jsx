import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img className="logo" src="src\assets\logo-rts.svg" alt="RTS Logo" />
        <ul className="nav-links">
          <li>What we do ▾</li>
          <li>Industries ▾</li>
          <li>HUB</li>
          <li>Culture</li>
        </ul>
      </div>
      <button className="nav-button">Book a meeting</button>
    </nav>
  );
}
