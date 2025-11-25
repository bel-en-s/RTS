// src/Pages/Home.jsx
import Hero from "../Components/Hero/Hero";
import HorizontalCarousel from "../Components/Carousel/HorizontalCarousel";
import Story from "../Components/Story/Story";
import Banner from "../Components/Banner/Banner";
export default function Home({ onPhase }) {  
  return (
    <>
      <Hero onPhase={onPhase}/> 
      <div className="hero-outro-spacer"></div>  
     <HorizontalCarousel />
      <Story />
      <Banner />
    </>
  );
} 
