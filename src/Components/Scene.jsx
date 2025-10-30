import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./Shaders/mainShader";
import perladoTextureURL from "../assets/perlado.png";

export default function Scene({ scroll, phase }) {
  
  

  const meshes = useMemo(
    () => [React.createRef(), React.createRef(), React.createRef(), React.createRef()],
    []
  );

  const mouse = useRef({ x: 0.8, y: 0.5 });

  const hoveredPlane = useRef(null);

  const positionsPerPhase = [
    [
      [0, 0.5, 3],
      [2, 0, 0],
      [1.2, 0, -1],
      [0, 0, 2],
    ],
    [
      [2, 0, -1],
      [2, 0, -1],
      [2, 0, -1],
      [2, 0, -1],
    ],
    [
      [-2, 0, -1],
      [0, 0, -1],
      [2, 0, -1],
      [0, 3, -1],
    ],
  ];

  

  const parallaxIntensities = [0.1, 0.2, 0.3, 0.0];

  const planes = [
    { color1: "rgba(12, 146, 202, 1)", color2: "#8A38F5" },
    { color1: "#5334aa", color2: "#3f40cc" },
    { color1: "#6a19ca", color2: "#3f40cc" },
    { color1: "#03303a", color2: "#03303a" },
  ];



const textureLoader = new THREE.TextureLoader();
const perladoTexture = textureLoader.load(perladoTextureURL);
perladoTexture.wrapS = perladoTexture.wrapT = THREE.MirroredRepeatWrapping;

const shaderUniforms = useMemo(
  () => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uColorA: { value: new THREE.Color() },
    uColorB: { value: new THREE.Color() },
    uPhase: { value: 0 },
    uRippleCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uRippleStrength: { value: 0.0 },
    uTexture: { value: perladoTexture },
  }),
  []
);


  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const s = Math.min(scroll / 1000, 1);
    const { pointer } = state;

    mouse.current.x = (pointer.x + 1) / 2;
    mouse.current.y = (1 - pointer.y) / 2;

    meshes.forEach((meshRef, i) => {
      const mesh = meshRef.current;
      if (!mesh) return;

      mesh.material.uniforms.uTime.value = t + i * 2.5;
      mesh.material.uniforms.uScroll.value = s;
      mesh.material.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);

      
      const prevPhase = mesh.material.uniforms.uPhase.value;
      const smoothedPhase = THREE.MathUtils.lerp(prevPhase, phase, 0.08);
      mesh.material.uniforms.uPhase.value = smoothedPhase;

      const p0 = positionsPerPhase[0][i];
      const p1 = positionsPerPhase[1][i];
      const p2 = positionsPerPhase[2][i];

      let targetPos = [0, 0, 0];
      if (smoothedPhase <= 1.0) {
        const localT = THREE.MathUtils.clamp(smoothedPhase, 0, 1);
        targetPos[0] = THREE.MathUtils.lerp(p0[0], p1[0], localT);
        targetPos[1] = THREE.MathUtils.lerp(p0[1], p1[1], localT);
        targetPos[2] = THREE.MathUtils.lerp(p0[2], p1[2], localT);
      } else {
        const localT = THREE.MathUtils.clamp(smoothedPhase - 1.0, 0, 1);
        targetPos[0] = THREE.MathUtils.lerp(p1[0], p2[0], localT);
        targetPos[1] = THREE.MathUtils.lerp(p1[1], p2[1], localT);
        targetPos[2] = THREE.MathUtils.lerp(p1[2], p2[2], localT);
      }

      const intensity = parallaxIntensities[i];
      const parallaxX = pointer.x * intensity;
      const parallaxY = pointer.y * intensity;

      mesh.position.x += (targetPos[0] + parallaxX - mesh.position.x) * 0.05;
      mesh.position.y += (targetPos[1] + parallaxY - mesh.position.y) * 0.05;
      mesh.position.z = targetPos[2];

      let focusIndex = 0;
      const focusT = THREE.MathUtils.clamp(
        smoothedPhase <= 1 ? smoothedPhase : smoothedPhase - 1,
        0,
        1
      );
      focusIndex = Math.floor(focusT * 3);
      focusIndex = Math.min(Math.max(focusIndex, 0), 2);

      if (i === 3) {
        const target = positionsPerPhase[2][focusIndex] || p2;
        mesh.position.x += (target[0] - mesh.position.x) * 0.05;
        mesh.position.y += (target[1] - mesh.position.y) * 0.05;

        mesh.material.uniforms.uColorA.value.lerpColors(
          new THREE.Color("#024151"),
          new THREE.Color(planes[focusIndex].color1),
          0.8
        );
        mesh.material.uniforms.uColorB.value.lerpColors(
          new THREE.Color("#024151"),
          new THREE.Color(planes[focusIndex].color2),
          0.8
        );
      }
    });
  });

    const handlePointerMove = (e, index) => {
    e.stopPropagation();
    
    hoveredPlane.current = index;
    const uv = e.uv; // coordenadas del punto de intersección (0–1)
    const mesh = meshes[index].current;
    if (mesh) {
      mesh.material.uniforms.uRippleCenter.value.lerp(uv, 0.2);
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    hoveredPlane.current = null;
  };

  return (
    <>
      <ambientLight intensity={0.3} />
      {planes.map((props, i) => (
        <mesh key={i} ref={meshes[i]}
        frustumCulled={false}
         onPointerMove={(e) => handlePointerMove(e, i)}
          onPointerOut={handlePointerOut}>
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
