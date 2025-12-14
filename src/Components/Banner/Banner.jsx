import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Banner.css";
import Button from "../UI/ApproachButton";
import bgBanner from "../../assets/Banner.jpeg";

gsap.registerPlugin(ScrollTrigger);

export default function Banner() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const inner = root.querySelector(".banner-inner");
      const title = root.querySelector(".banner-title");
      const body = root.querySelector(".banner-body");
      const button = root.querySelector(".banner-button");

      gsap.set(root, {
        filter: "blur(0px)",
      });

      gsap.set(inner, {
        opacity: 0,
      });

      gsap.set(title, {
        opacity: 0,
        y: 40,
        filter: "blur(14px)",
      });

      gsap.set(body, {
        opacity: 0,
        y: 32,
        filter: "blur(10px)",
      });

      gsap.set(button, {
        opacity: 0,
        y: 24,
        filter: "blur(8px)",
      });

      gsap.set(root, {
        scale: 1.05,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
        },
      });

      tl.to(root, {
        scale: 1,
        duration: 1.4,
        ease: "power3.out",
      });

      tl.to(
        inner,
        {
          opacity: 1,
          duration: 0.2,
          ease: "none",
        },
        "-=1.1"
      );

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

      tl.to(
        button,
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
  }, []);

  return (
    <section
      className="banner"
      ref={rootRef}
      style={{ backgroundImage: `url(${bgBanner})` }}
    >
      <div className="banner-inner">
        <h2 className="banner-title display-md">
          <span className="desktop">
            LET’S SPARK YOUR
            <br />
            INDUSTRIAL BRILLANCE
          </span>
          <span className="mobile display-md">
            LET’S SPARK
            <br />
            YOUR INDUSTRIAL
            <br />
            BRILLANCE
          </span>
        </h2>

        <p className="banner-body body-lg">
          <span className="desktop">
            Every challenge is an opportunity. Share yours, and
            <br />
            let’s explore how to bring your vision to life.
          </span>
          <span className="mobile body-lg">
            Every challenge is an opportunity. Share yours,
            <br />
            and let’s explore how to
            <br />
            bring your vision to life.
          </span>
        </p>

        <div className="banner-button">
          <Button label="Book a meeting now" />
        </div>
      </div>
    </section>
  );
}
