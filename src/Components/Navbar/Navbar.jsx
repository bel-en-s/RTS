import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import "./Navbar.css";
import logo from "../../assets/logo-rts.svg";

export default function Navbar({ navMode }) {
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const menuIconRef = useRef(null);
  const closeIconRef = useRef(null);

  const tlMenu = useRef(null);
  const tlIcon = useRef(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -50, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1, ease: "power4.out" }
    );

    tlMenu.current = gsap.timeline({ paused: true });
    tlMenu.current
      .set(menuRef.current, { display: "flex" })
      .fromTo(
        menuRef.current,
        { autoAlpha: 0, y: -20, scale: 0.98, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
        }
      );

    gsap.set(closeIconRef.current, { autoAlpha: 0 });

    tlIcon.current = gsap.timeline({ paused: true });
    tlIcon.current
      .to(menuIconRef.current, {
        autoAlpha: 0,
        scale: 0.4,
        rotate: 90,
        duration: 0.22,
        ease: "power2.inOut",
      })
      .to(
        closeIconRef.current,
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 0.25,
          ease: "power2.out",
        },
        "-=0.15"
      );
  }, []);

  const toggleMenu = () => {
    if (open) {
      tlMenu.current.reverse();
      tlIcon.current.reverse();
      setOpen(false);
    } else {
      tlMenu.current.play();
      tlIcon.current.play();
      setOpen(true);
    }
  };

  return (
    <>
      <div className="navbar-wrapper">
        <nav className="navbar" ref={navRef}>
          <div className="navbar-left">
            <img src={logo} className="logo" alt="RTS" />

            <ul className="nav-links desktop-only">
              <li>What we do</li>
              <li>Industries</li>
              <li>HUB</li>
              <li>Culture</li>
            </ul>
          </div>

          <button className="nav-button desktop-only">Book a meeting</button>

          <button className="hamburger-btn" onClick={toggleMenu}>
            <Menu ref={menuIconRef} size={20} color="white" />
            <X ref={closeIconRef} size={20} color="white" />
          </button>
        </nav>
      </div>

      <div className="mobile-menu" ref={menuRef}>
        <ul>
          <li>What we do</li>
          <li>Industries</li>
          <li>HUB</li>
          <li>Culture</li>
        </ul>

        <button className="nav-button mobile-btn">Book a meeting</button>
      </div>
    </>
  );
}
