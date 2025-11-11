// src/Pages/Home.jsx
import Hero from "../Components/Hero/Hero";
import HorizontalCarousel from "../Components/Carousel/HorizontalCarousel";

export default function Home({ onPhase }) {  
  return (
    <>
  <Hero onPhase={onPhase}/>   
     <HorizontalCarousel />
    </>
  );
}
