// src/Components/Navbar/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTransition } from "../../Transition/Transition";
import "./Navbar.css";
import logo from "../../../assets/logo-rts.svg";

export default function Navbar({ navMode }) {
  const { go } = useTransition();
  const location = useLocation();

  // ✅ BASE real (dev/prod) según Vite: "/" o "/RTS/"
  const BASE = import.meta.env.BASE_URL; // ej: "/RTS/"
  const baseNoSlashEnd = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;

  const navRef = useRef(null);
  const menuRef = useRef(null);
  const menuIconRef = useRef(null);
  const closeIconRef = useRef(null);

  const tlMenu = useRef(null);
  const tlIcon = useRef(null);

  const ddWhatRef = useRef(null);
  const ddIndRef = useRef(null);
  const ddWhatIconRef = useRef(null);
  const ddIndIconRef = useRef(null);

  const ddTL = useRef({ what: null, industries: null });

  const [open, setOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(null);
  const [ddMobileOpen, setDdMobileOpen] = useState(null);

  const whatWeDoItems = [
    { label: "Automation & Controls", to: "/automation-controls" },
    { label: "Digitalization", href: "#digital" },
    { label: "OT Cybersecurity", href: "#security" },
    { label: "Engineering Services", href: "#services" },
  ];

  const industriesItems = [
    { label: "Oil & Gas", href: "#industries" },
    { label: "Power Generation", href: "#industries" },
    { label: "Mining", href: "#industries" },
    { label: "Pharma", href: "#industries" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -60, autoAlpha: 0, filter: "blur(10px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power4.out",
          delay: 0.2,
        }
      );

      tlMenu.current = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          if (menuRef.current) menuRef.current.style.display = "none";
        },
      });

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

      const makeDropdownTL = (el) => {
        const tl = gsap.timeline({
          paused: true,
          onReverseComplete: () => {
            if (el) el.style.display = "none";
          },
        });

        tl.set(el, { display: "block" })
          .fromTo(
            el,
            { autoAlpha: 0, y: -10, filter: "blur(10px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.28,
              ease: "power3.out",
            }
          )
          .fromTo(
            el.querySelectorAll(".nav-dd-item"),
            { y: -6, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.22,
              ease: "power2.out",
              stagger: 0.03,
            },
            "-=0.18"
          );

        return tl;
      };

      ddTL.current.what = makeDropdownTL(ddWhatRef.current);
      ddTL.current.industries = makeDropdownTL(ddIndRef.current);
    }, navRef);

    const handleOutside = (e) => {
      if (!navRef.current?.contains(e.target)) {
        closeDropdowns();
      }
    };

    window.addEventListener("mousedown", handleOutside);
    return () => {
      window.removeEventListener("mousedown", handleOutside);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    closeDropdowns();
    setDdMobileOpen(null);
    if (open) {
      tlMenu.current?.reverse();
      tlIcon.current?.reverse();
      setOpen(false);
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    if (open) {
      tlMenu.current?.reverse();
      tlIcon.current?.reverse();
      setOpen(false);
    } else {
      tlMenu.current?.play(0);
      tlIcon.current?.play(0);
      setOpen(true);
    }
  };

  const animateIcon = (iconEl, isOpen) => {
    if (!iconEl) return;
    gsap.to(iconEl, {
      rotate: isOpen ? 180 : 0,
      y: isOpen ? 1 : 0,
      duration: 0.28,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const closeDropdowns = () => {
    ddTL.current.what?.reverse();
    ddTL.current.industries?.reverse();
    animateIcon(ddWhatIconRef.current, false);
    animateIcon(ddIndIconRef.current, false);
    setDdOpen(null);
  };

  const openDropdown = (key) => {
    const other = key === "what" ? "industries" : "what";

    if (ddOpen === key) {
      ddTL.current[key]?.reverse();
      animateIcon(
        key === "what" ? ddWhatIconRef.current : ddIndIconRef.current,
        false
      );
      setDdOpen(null);
      return;
    }

    if (ddOpen === other) {
      ddTL.current[other]?.reverse();
      animateIcon(
        other === "what" ? ddWhatIconRef.current : ddIndIconRef.current,
        false
      );
    }

    ddTL.current[key]?.play(0);
    animateIcon(
      key === "what" ? ddWhatIconRef.current : ddIndIconRef.current,
      true
    );
    setDdOpen(key);
  };

  const toggleMobileDropdown = (key) => {
    setDdMobileOpen((prev) => (prev === key ? null : key));
  };

  const closeMobileMenuHard = () => {
    setDdMobileOpen(null);
    closeDropdowns();
    if (open) {
      tlMenu.current?.reverse();
      tlIcon.current?.reverse();
      setOpen(false);
    }
  };

  // ✅ CLAVE: Home -> HARD RELOAD a BASE para ver Loader / reset total
  const navigateWithTransition = (path) => {
    closeMobileMenuHard();

    // ✅ volver a "entrada inicial"
    if (path === "/") {
      window.location.assign(BASE); // ej: "/RTS/"
      return;
    }

    // ✅ SPA normal con transición
    if (go) {
      go(path);
      return;
    }

    // ✅ fallback respetando BASE
    window.location.assign(`${baseNoSlashEnd}${path}`);
  };

  // ✅ para hash sections: si no estás en Home, recarga a BASE + hash (y verás Loader)
  const goHomeHash = (hash) => {
    closeMobileMenuHard();
    window.location.assign(`${BASE}${hash}`);
  };

  const renderDropdownItemDesktop = (item) => {
    const isInternal = !!item.to;

    // ✅ href correcto (sin rutas relativas peligrosas)
    const href = item.to
      ? `${baseNoSlashEnd}${item.to}`
      : item.href?.startsWith("#")
      ? `${BASE}${item.href}` // "/RTS/#..."
      : item.href;

    return (
      <a
        key={item.label}
        href={href}
        className="nav-dd-item dd-titlebody"
        onClick={(e) => {
          if (isInternal) {
            e.preventDefault();
            navigateWithTransition(item.to);
            return;
          }

          // hash -> si no estás en home, recargá al home+hash
          if (item.href?.startsWith("#") && location.pathname !== "/") {
            e.preventDefault();
            goHomeHash(item.href);
            return;
          }

          closeDropdowns();
        }}
      >
        <i className="ri-corner-down-right-line dd-corner-icon" />
        <span className="dd-label">{item.label}</span>
      </a>
    );
  };

  const renderDropdownItemMobile = (item) => {
    const isInternal = !!item.to;

    const href = item.to
      ? `${baseNoSlashEnd}${item.to}`
      : item.href?.startsWith("#")
      ? `${BASE}${item.href}`
      : item.href;

    return (
      <a
        key={item.label}
        href={href}
        className="m-dd-item dd-titlebody"
        onClick={(e) => {
          if (isInternal) {
            e.preventDefault();
            navigateWithTransition(item.to);
            return;
          }

          if (item.href?.startsWith("#") && location.pathname !== "/") {
            e.preventDefault();
            goHomeHash(item.href);
            return;
          }

          closeMobileMenuHard();
        }}
      >
        <i className="ri-corner-down-right-line dd-corner-icon" />
        <span className="dd-label">{item.label}</span>
      </a>
    );
  };

  return (
    <>
      <div className="navbar-wrapper">
        <nav
          className={`navbar ${navMode === "light" ? "light" : "dark"}`}
          ref={navRef}
        >
          <div className="navbar-left">
            {/* ✅ Logo: Home con HARD reload (Loader visible) */}
            <a
              href={BASE}
              className="logo-link"
              onClick={(e) => {
                e.preventDefault();
                navigateWithTransition("/");
              }}
            >
              <img src={logo} className="logo" alt="RTS" />
            </a>

            <ul className="nav-links desktop-only">
              <li className={`nav-item has-dd ${ddOpen === "what" ? "selected" : ""}`}>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => openDropdown("what")}
                >
                  <span>What we do</span>
                  <i ref={ddWhatIconRef} className="ri-arrow-down-s-line nav-dd-icon" />
                </button>

                <div ref={ddWhatRef} className="nav-dropdown">
                  {whatWeDoItems.map(renderDropdownItemDesktop)}
                </div>
              </li>

              <li
                className={`nav-item has-dd ${
                  ddOpen === "industries" ? "selected" : ""
                }`}
              >
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => openDropdown("industries")}
                >
                  <span>Industries</span>
                  <i ref={ddIndIconRef} className="ri-arrow-down-s-line nav-dd-icon" />
                </button>

                <div ref={ddIndRef} className="nav-dropdown">
                  {industriesItems.map(renderDropdownItemDesktop)}
                </div>
              </li>

              {/* ✅ Hash links: si estás fuera de Home, recarga a BASE + #... */}
              <li className="nav-item">
                <a
                  className="nav-link plain"
                  href={`${BASE}#hub`}
                  onClick={(e) => {
                    if (location.pathname !== "/") {
                      e.preventDefault();
                      goHomeHash("#hub");
                      return;
                    }
                    closeDropdowns();
                  }}
                >
                  HUB
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link plain"
                  href={`${BASE}#culture`}
                  onClick={(e) => {
                    if (location.pathname !== "/") {
                      e.preventDefault();
                      goHomeHash("#culture");
                      return;
                    }
                    closeDropdowns();
                  }}
                >
                  Culture
                </a>
              </li>
            </ul>
          </div>

          <button className="nav-button desktop-only">Book a meeting</button>

          <button className="hamburger-btn" onClick={toggleMenu}>
            <Menu
              ref={menuIconRef}
              size={20}
              color="white"
              style={{ position: "absolute" }}
            />
            <X ref={closeIconRef} size={20} color="white" />
          </button>
        </nav>
      </div>

      <div className="mobile-menu" ref={menuRef}>
        <ul className="mobile-list">
          <li className={`m-item ${ddMobileOpen === "what" ? "selected" : ""}`}>
            <button
              type="button"
              className="m-link"
              onClick={() => toggleMobileDropdown("what")}
            >
              <span>What we do</span>
              <i
                className={`ri-arrow-down-s-line m-dd-icon ${
                  ddMobileOpen === "what" ? "open" : ""
                }`}
              />
            </button>

            <div className={`m-dd ${ddMobileOpen === "what" ? "open" : ""}`}>
              {whatWeDoItems.map(renderDropdownItemMobile)}
            </div>
          </li>

          <li className={`m-item ${ddMobileOpen === "industries" ? "selected" : ""}`}>
            <button
              type="button"
              className="m-link"
              onClick={() => toggleMobileDropdown("industries")}
            >
              <span>Industries</span>
              <i
                className={`ri-arrow-down-s-line m-dd-icon ${
                  ddMobileOpen === "industries" ? "open" : ""
                }`}
              />
            </button>

            <div className={`m-dd ${ddMobileOpen === "industries" ? "open" : ""}`}>
              {industriesItems.map(renderDropdownItemMobile)}
            </div>
          </li>

          <li className="m-item">
            <a
              className="m-link plain"
              href={`${BASE}#hub`}
              onClick={(e) => {
                if (location.pathname !== "/") {
                  e.preventDefault();
                  goHomeHash("#hub");
                  return;
                }
                closeMobileMenuHard();
              }}
            >
              HUB
            </a>
          </li>

          <li className="m-item">
            <a
              className="m-link plain"
              href={`${BASE}#culture`}
              onClick={(e) => {
                if (location.pathname !== "/") {
                  e.preventDefault();
                  goHomeHash("#culture");
                  return;
                }
                closeMobileMenuHard();
              }}
            >
              Culture
            </a>
          </li>
        </ul>

        <button className="nav-button mobile-btn" onClick={closeMobileMenuHard}>
          Book a meeting
        </button>
      </div>
    </>
  );
}
