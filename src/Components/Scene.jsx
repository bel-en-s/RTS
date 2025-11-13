import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./Shaders/mainShader";
import perladoTextureURL from "../assets/gainy.jpg";

export default function Scene({ scroll, phase }) {
  // refs para cada plano
  const meshes = useMemo(
    () => [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ],
    []
  );

  // posiciones por fase
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

  // Colores por plano
  const planes = [
    { color1: "#5B25D4", color2: "#2e6acc" },
    { color1: "#5B25D4", color2: "#5212bf" },
    { color1: "#5212bf", color2: "#5212bf" },
    { color1: "#04CBFE", color2: "#4038af" },
  ];

  // textura perlado
  const perladoTexture = new THREE.TextureLoader().load(perladoTextureURL);
  perladoTexture.wrapS = perladoTexture.wrapT = THREE.MirroredRepeatWrapping;
  perladoTexture.minFilter = THREE.LinearMipmapLinearFilter;
  perladoTexture.magFilter = THREE.LinearFilter;

  // uniforms comunes
  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uTexture: { value: perladoTexture },
    }),
    []
  );

  // 🔥 ref donde guardamos las posiciones objetivo por fase
  const targetPositionsRef = useRef(positionsPerPhase[0]);

  // cuando cambia phase ACTUALIZAMOS el destino,
  // pero NO animamos nada todavía
  useEffect(() => {
    const targetIndex = Math.round(phase);
    targetPositionsRef.current =
      positionsPerPhase[targetIndex] || positionsPerPhase[0];
  }, [phase]);

  function smoothstep(edge0, edge1, x) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t); 
}


  
    useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // ESTO CAMBIAR
    const lerpFactor = 0.06;

    // --- fase continua
    const floorIndex = Math.floor(phase);
    const ceilIndex = Math.min(floorIndex + 1, positionsPerPhase.length - 1);
    const blend = phase - floorIndex;
    const easedBlend = smoothstep(0, 1, blend);


    meshes.forEach((ref, i) => {
      const mesh = ref.current;
      if (!mesh) return;

      mesh.material.uniforms.uTime.value = t + i * 1.2;

      // posiciones para fase floor y ceil
      const [ax, ay, az] = positionsPerPhase[floorIndex][i];
      const [bx, by, bz] = positionsPerPhase[ceilIndex][i];

      // interpolación según blend
     // ahora
const tx = ax + (bx - ax) * easedBlend;
const ty = ay + (by - ay) * easedBlend;
const tz = az + (bz - az) * easedBlend;


      // movimiento cinematográfico hacia tx,ty,tz
      mesh.position.x += (tx - mesh.position.x) * lerpFactor;
      mesh.position.y += (ty - mesh.position.y) * lerpFactor;
      mesh.position.z += (tz - mesh.position.z) * lerpFactor;
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
