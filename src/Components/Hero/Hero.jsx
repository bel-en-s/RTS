// src/Components/Hero/Hero.jsx
import HeroVertical from "./HeroVertical";
import HeroHorizontal from "./HeroHorizontal";
import "./Hero.css";

export default function Hero({ onPhase }) {
  return (
    <section id="hero">
    <HeroVertical onPhase={onPhase} />
  
    <div id="hero-transition-overlay"></div>
  
    <HeroHorizontal onPhase={onPhase} />
  </section>
  
  );
}
