import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { vertexShader, fragmentShader } from "./Shaders/mainShader";
import perladoTextureURL from "../assets/gainy.jpg";

export default function Scene({ scroll, phase }) {
  const meshes = useMemo(
    () => [React.createRef(), React.createRef(), React.createRef(), React.createRef()],
    []
  );

  const positionsPerPhase = [
    // fase 0 (compacta)
    [
      [0, 0, 4.5],
      [1, 0, 3],
      [-2, 0, 0],
      [0, 0, 4],
    ],
    // fase 1 (expansión)
    [
      [2, 1, 1],
      [2, 1, 1],
      [2, 1, 1],
      [2, 1, 1],
    ],
    // fase 2 (dispersión)
    [
      [-2, 0, -1],
      [2, 0, -1],
      [0, 3, -1],
      [0, -2, -1],
    ],
  ];

  const planes = [
    { color1: "#5B25D4", color2: "#2e6acc" },
    { color1: "#5B25D4", color2: "#5212bf" },
    { color1: "#5212bf", color2: "#5212bf" },
    { color1: "#04CBFE", color2: "#4038af" },
  ];

  const perladoTexture = new THREE.TextureLoader().load(perladoTextureURL);
  perladoTexture.wrapS = perladoTexture.wrapT = THREE.MirroredRepeatWrapping;
  perladoTexture.minFilter = THREE.LinearMipmapLinearFilter;
  perladoTexture.magFilter = THREE.LinearFilter;

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uTexture: { value: perladoTexture },
    }),
    []
  );

  // 🚀 Transición entre fases
  useEffect(() => {
    if (!meshes[0].current) return;
    const targetIndex = Math.round(phase);
    const targetPositions = positionsPerPhase[targetIndex] || positionsPerPhase[0];

    meshes.forEach((ref, i) => {
      const mesh = ref.current;
      if (!mesh) return;
      const [tx, ty, tz] = targetPositions[i];
      gsap.to(mesh.position, {
        x: tx,
        y: ty,
        z: tz,
        duration: 0.6,
        ease: "power3.out",
      });
    });

    console.log("🌀 Changed to PHASE:", targetIndex);
  }, [phase]);

  // ⏱️ Animar tiempo uniform para shaders
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshes.forEach((ref, i) => {
      const mesh = ref.current;
      if (mesh) mesh.material.uniforms.uTime.value = t + i * 1.2;
    });
  });

  return (
    <>
      {planes.map((props, i) => (
        <mesh key={i} ref={meshes[i]} frustumCulled={false}>
          <planeGeometry args={[30, 30, 64, 64]} />
          <shaderMaterial
            uniforms={{
              ...shaderUniforms,
              uColorA: { value: new THREE.Color(props.color1) },
              uColorB: { value: new THREE.Color(props.color2) },
            }}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}
