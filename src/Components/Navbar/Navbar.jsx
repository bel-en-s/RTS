import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Navbar.css";
import logo from "../../assets/logo-rts.svg";

export default function Navbar() {
  const navRef = useRef(null);

  useEffect(() => {
    // Estado inicial: arriba, invisible, con blur
    gsap.fromTo(
      navRef.current,
      { y: -80, autoAlpha: 0, filter: "blur(8px)" },
      {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power4.out",
        delay: 0.3, // opcional: pequeño retardo
      }
    );
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
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
