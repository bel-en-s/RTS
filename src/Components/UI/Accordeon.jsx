import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Accordeon.css";

export default function Accordion({
  items = [],
  defaultOpen = 0,
  allowCollapse = true,
  className = "",
}) {
  const [openIndex, setOpenIndex] = useState(
    typeof defaultOpen === "number" ? defaultOpen : -1
  );

  const panelRefs = useRef([]);
  const innerRefs = useRef([]);
  const iconRefs = useRef([]);
  const prevOpenRef = useRef(openIndex);

  const setPanelRef = (i) => (el) => (panelRefs.current[i] = el);
  const setInnerRef = (i) => (el) => (innerRefs.current[i] = el);
  const setIconRef = (i) => (el) => (iconRefs.current[i] = el);

  // estado inicial
  useLayoutEffect(() => {
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      const isOpen = i === openIndex;

      gsap.set(panel, { height: isOpen ? "auto" : 0, overflow: "hidden" });

      const inner = innerRefs.current[i];
      if (inner) gsap.set(inner, { autoAlpha: isOpen ? 1 : 0, y: isOpen ? 0 : -8 });

      const icon = iconRefs.current[i];
      if (icon) gsap.set(icon, { rotate: isOpen ? 45 : 0 }); // "+" rotado 45° => "×"
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // animaciones
  useLayoutEffect(() => {
    const prev = prevOpenRef.current;
    const next = openIndex;
    if (prev === next) return;

    const closeItem = (i) => {
      const panel = panelRefs.current[i];
      const inner = innerRefs.current[i];
      const icon = iconRefs.current[i];
      if (!panel) return;

      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

      if (icon) tl.to(icon, { rotate: 0, duration: 0.22, ease: "power2.out" }, 0);

      if (inner) {
        tl.to(inner, { autoAlpha: 0, y: -8, duration: 0.18, ease: "power2.out" }, 0);
      }

      tl.to(panel, { height: 0, duration: 0.42, ease: "power3.inOut" }, 0.02);

      return tl;
    };

    const openItem = (i) => {
      const panel = panelRefs.current[i];
      const inner = innerRefs.current[i];
      const icon = iconRefs.current[i];
      if (!panel) return;

      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

      if (icon) tl.to(icon, { rotate: 45, duration: 0.26, ease: "power2.out" }, 0);

      tl.to(panel, { height: "auto", duration: 0.5, ease: "power3.inOut" }, 0);

      if (inner) {
        tl.fromTo(
          inner,
          { autoAlpha: 0, y: -8 },
          { autoAlpha: 1, y: 0, duration: 0.26, ease: "power2.out" },
          0.14
        );
      }

      return tl;
    };

    if (prev !== -1) closeItem(prev);
    if (next !== -1) openItem(next);

    prevOpenRef.current = next;
  }, [openIndex]);

  const toggle = (i) => {
    setOpenIndex((curr) => {
      if (curr === i) return allowCollapse ? -1 : curr;
      return i;
    });
  };

  return (
    <div className={`automation-accordion ${className}`}>
      {items.map((it, i) => {
        const isOpen = i === openIndex;

        return (
          <article key={it.id ?? i} className={`accItem ${isOpen ? "is-open" : ""}`}>
            <header className="accHead">
              <button
                className="accToggle"
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
                <h3 className="title-body">{it.title}</h3>

                <span className="accIconBtn" aria-hidden="true">
                  <span className="accIcon" ref={setIconRef(i)}>
                    +
                  </span>
                </span>
              </button>
            </header>

            <div className="accPanel" ref={setPanelRef(i)}>
              <div className="accInner" ref={setInnerRef(i)}>
                {it.body ? <p className="accBody">{it.body}</p> : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
