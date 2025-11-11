// src/Pages/Home.jsx
import Hero from "../Components/Hero/Hero";
import HorizontalCarousel from "../Components/Carousel/HorizontalCarousel";
import Story from "../Components/Story/Story";
export default function Home({ onPhase }) {  
  return (
    <>
  <Hero onPhase={onPhase}/>   
     <HorizontalCarousel />
      <Story />
    </>
  );
}
