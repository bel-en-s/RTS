
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Banner.css";

gsap.registerPlugin(ScrollTrigger);

function Multiline({ text }) {
  if (!text) return null;
  const lines = String(text).split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i !== lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

function ActionButton({ label, href, onClick, variant = "primary", download }) {
  const className = `banner-cta banner-cta--${variant}`;

  if (href) {
    return (
      <a
        className={className}
        href={href}
        download={download ? true : undefined}
      >
        {label}
      </a>
    );
  }

  return (
    <button className={className} type="button" onClick={onClick}>
      {label}
    </button>
  );
}

export default function Banner({
  variant = "image",
  backgroundImage,

  titleDesktop,
  titleMobile,
  bodyDesktop,
  bodyMobile,

  buttons = [],
  start = "top 85%",

  titleClassName = "headline-medium",
  titleMobileClassName = "headline-small",

  bodyClassName = "body-lg",
  bodyMobileClassName = "body-lg",

  actionsDirection = "row",
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      if (!root) return;

      const inner = root.querySelector(".banner-inner");
      const title = root.querySelector(".banner-title");
      const body = root.querySelector(".banner-body");
      const actions = root.querySelector(".banner-actions");

      gsap.set(root, { scale: 1.05 });
      if (inner) gsap.set(inner, { opacity: 0 });

      if (title) gsap.set(title, { opacity: 0, y: 40, filter: "blur(14px)" });
      if (body) gsap.set(body, { opacity: 0, y: 32, filter: "blur(10px)" });
      if (actions)
        gsap.set(actions, { opacity: 0, y: 24, filter: "blur(8px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start,
          once: true,
        },
      });

      tl.to(root, { scale: 1, duration: 1.4, ease: "power3.out" });

      if (inner) tl.to(inner, { opacity: 1, duration: 0.2 }, "-=1.1");

      if (title)
        tl.to(
          title,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
          },
          "-=1"
        );

      if (body)
        tl.to(
          body,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        );

      if (actions)
        tl.to(
          actions,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.45"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [start]);

  const isGlow = variant === "glow";

  return (
    <section
      className={`banner ${isGlow ? "banner--glow" : "banner--image"}`}
      ref={rootRef}
    >
      {backgroundImage && (
        <div
          className="banner-bg"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      )}

      <div className="banner-inner">
        <h2 className="banner-title">
          <span className={`banner-titleDesktop desktop ${titleClassName}`}>
            <Multiline text={titleDesktop} />
          </span>

          <span className={`banner-titleMobile mobile ${titleMobileClassName}`}>
            <Multiline text={titleMobile ?? titleDesktop} />
          </span>
        </h2>

        {(bodyDesktop || bodyMobile) && (
          <p className="banner-body">
            <span className={`banner-bodyDesktop desktop ${bodyClassName}`}>
              <Multiline text={bodyDesktop} />
            </span>

            <span className={`banner-bodyMobile mobile ${bodyMobileClassName}`}>
              <Multiline text={bodyMobile ?? bodyDesktop} />
            </span>
          </p>
        )}

        {buttons?.length > 0 && (
          <div className="banner-actions" data-direction={actionsDirection}>
            {buttons.map((b, idx) => (
              <ActionButton key={idx} {...b} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

