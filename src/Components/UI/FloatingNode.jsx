// src/Components/UI/FloatingNode.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./FloatingNode.css";

export default function FloatingNode() {
  const nodeRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const isDesktop = window.innerWidth > 820;


    if (isDesktop) {
      const hoverIn = () => {
        gsap.to(node, {
          y: -6,
          duration: 0.95,
          lerp: 0.9,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const hoverOut = () => {
        gsap.to(node, {
          y: 0,
          duration: 0.95,
          lerp: 0.9,
          ease: "power3.inOut",
          overwrite: "auto",
        });
      };

      node.addEventListener("mouseenter", hoverIn);
      node.addEventListener("mouseleave", hoverOut);

      return () => {
        node.removeEventListener("mouseenter", hoverIn);
        node.removeEventListener("mouseleave", hoverOut);
      };
    }
  }, []);
  return (
    <button className="floating-node collapsed" type="button" ref={nodeRef}>
      <div className="fn-outer-circle">
        <div className="fn-ring"></div>
      </div>
      <div className="fn-text body-sm">
        What technical challenge are you facing today?
      </div>
    </button>
  );
}
