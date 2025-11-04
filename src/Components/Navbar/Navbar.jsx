import React from "react";
import "./Navbar.css";
import logo from "../../assets/logo-rts.svg"; 

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img className="logo" src={logo} alt="RTS Logo" />
        <ul className="nav-links">
          <li>
            What we do <i className="ri-arrow-down-s-line"></i>
          </li>
          <li>
            Industries <i className="ri-arrow-down-s-line"></i>
          </li>
          <li>HUB</li>
          <li>Culture</li>
        </ul>
      </div>

      <button className="nav-button">Book a meeting</button>
    </nav>
  );
}
