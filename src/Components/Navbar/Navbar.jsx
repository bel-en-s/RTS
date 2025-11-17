import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Navbar.css";
import logo from "../../assets/logo-rts.svg";

export default function Navbar() {
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    // ANIMACIÓN DE ENTRADA DEL NAVBAR
    gsap.fromTo(
      navRef.current,
      { y: -80, autoAlpha: 0, filter: "blur(8px)" },
      {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power4.out",
      }
    );

    // TIMELINE DEL MENÚ MOBILE (cerrado por defecto)
    tlRef.current = gsap.timeline({ paused: true });

    tlRef.current
      .set(menuRef.current, { display: "flex" }) // preparar
      .fromTo(
        menuRef.current,
        { y: -40, autoAlpha: 0, filter: "blur(12px)", scale: 0.98 },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.55,
          ease: "power4.out",
        }
      )
      .fromTo(
        menuRef.current.querySelectorAll("li, .nav-button"),
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.06,
        },
        "-=0.25"
      );
  }, []);

  const toggleMenu = () => {
    const tl = tlRef.current;
    const isOpen = tl.isActive() || tl.progress() > 0;

    if (isOpen) {
      // ANIMACIÓN DE CIERRE
      tl.reverse();
    } else {
      tl.play();
    }
  };

  return (
    <>
      <nav className="navbar" ref={navRef}>
        <div className="navbar-left">
          <img className="logo" src={logo} alt="RTS Logo" />

          <ul className="nav-links desktop-only">
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

        <button className="nav-button desktop-only">Book a meeting</button>

        {/* HAMBURGUER */}
        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* MENU MOBILE */}
      <div className="mobile-menu" ref={menuRef}>
        <ul>
          <li>
            What we do <i className="ri-arrow-down-s-line"></i>
          </li>
          <li>
            Industries <i className="ri-arrow-down-s-line"></i>
          </li>
          <li>HUB</li>
          <li>Culture</li>
        </ul>

        <button className="nav-button mobile-btn">Book a meeting</button>
      </div>
    </>
  );
}
