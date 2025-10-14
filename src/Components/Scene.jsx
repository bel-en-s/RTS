import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Scene() {
  const cubeRef = useRef();

  useEffect(() => {
    // Animación con ScrollTrigger
    gsap.to(cubeRef.current.rotation, {
      x: Math.PI * 2,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
    gsap.to(cubeRef.current.position, {
      z: -3,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
  }, []);

  useFrame(() => {
    cubeRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#00ffcc" roughness={0.3} metalness={0.6} />
    </mesh>
  );
}
