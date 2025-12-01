import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./Shaders/mainShader";
import perladoTextureURL from "../assets/gainy.jpg";
import { useEffect } from "react";


export default function Scene({ scroll, phase }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const meshes = useMemo(
    () => [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ],
    []
  );

  const focusRef = useRef();

  const perladoTexture = new THREE.TextureLoader().load(perladoTextureURL);
  perladoTexture.wrapS = perladoTexture.wrapT = THREE.MirroredRepeatWrapping;

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uTexture: { value: perladoTexture },
    }),
    []
  );

  function smoothstep(edge0, edge1, x) {
    const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (30 - 2 * t);
  }

  const positionsDesktop = [
    [
      [0, 0, 0],
      [1, 0, 2],
      [-1.5, 0, 0],
      [0, 0, 3]
    ],
    [
      [2, 0, 1],
      [2, 0, 1],
      [2, 0, 1],
      [2, 0, 1]
    ],
    [
      [-1.3, -0.2, 0],
      [0.2, 0.1, 0],
      [1.4, 0.15, 0],
      [0.2, 0.1, -0.35]
    ],
    [
      [-0.8, 0, 4],
      [0.2, 0.1, 3],
      [1.4, 0.15, 2],
      [0.2, 0.1, 1]
    ]
  ];

  const positionsMobile = [
    [
      [0, 0, 0],
      [0.8, 0, 2],
      [-1.2, 0, 0],
      [0, 0, 3]
    ],
    [
      [-0.4, 0, 1],
      [0.4, 0, 1],
      [0, 0.4, 1],
      [0, 0, 1]
    ],
    [
      [-1.0, -0.2, 0],
      [0, 0.1, 0],
      [1.0, 0.15, 0],
      [0, 0.2, -0.3]
    ],
    [
      [-0.4, 0, 3],
      [0, 0.1, 3],
      [0.8, 0.1, 2],
      [0, 0.1, 1]
    ]
  ];

  const positionsPerPhase = isMobile ? positionsMobile : positionsDesktop;

  const focusPositions = [
    [0, 0, -4.5],
    [2, 0, 0],
    [-1.3, 0.1, 3],
    [0.2, 0.15, 3],
    [1.5, 0.2, 3],
  ];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
  const lerpFactor = 0.06;

  const maxIndex = positionsPerPhase.length - 1;

  const floorIndex = Math.min(Math.floor(phase), maxIndex);
  const ceilIndex = Math.min(floorIndex + 1, maxIndex);

  const blend = THREE.MathUtils.clamp(phase - Math.floor(phase), 0, 1);

  meshes.forEach((ref, i) => {
    const mesh = ref.current;
    if (!mesh) return;

    mesh.material.uniforms.uTime.value = t + i * 1.1;

    const A = positionsPerPhase[floorIndex] || positionsPerPhase[maxIndex];
    const B = positionsPerPhase[ceilIndex] || positionsPerPhase[maxIndex];

    const [ax, ay, az] = A[i];
    const [bx, by, bz] = B[i];

    const tx = ax + (bx - ax) * blend;
    const ty = ay + (by - ay) * blend;
    const tz = az + (bz - az) * blend;

    mesh.position.x += (tx - mesh.position.x) * lerpFactor;
    mesh.position.y += (ty - mesh.position.y) * lerpFactor;
    mesh.position.z += (tz - mesh.position.z) * lerpFactor;
  });

    const focus = focusRef.current;
    if (focus) {
      focus.material.uniforms.uTime.value = t;
      const visible = phase >= 2 ? 1 : 0;
      focus.material.opacity += (visible - focus.material.opacity) * 0.08;

      const f0 = Math.floor(phase);
      const f1 = Math.min(f0 + 1, focusPositions.length - 1);
      const k = THREE.MathUtils.clamp(phase - f0, 0, 1);

      const [ax, ay, az] = focusPositions[f0];
      const [bx, by, bz] = focusPositions[f1];

      const tx = THREE.MathUtils.lerp(ax, bx, k);
      const ty = THREE.MathUtils.lerp(ay, by, k);
      const tz = THREE.MathUtils.lerp(az, bz, k);

      focus.position.x += (tx - focus.position.x) * 0.06;
      focus.position.y += (ty - focus.position.y) * 0.06;
      focus.position.z += (tz - focus.position.z) * 0.06;

      focus.material.uniforms.uColorA.value.set("#ff70ff");
      focus.material.uniforms.uColorB.value.set("#e650ff");
    }
  });

  

  return (
    <>
      {positionsPerPhase.map((_, i) => (
        <mesh key={i} ref={meshes[i]} frustumCulled={false}>
          <planeGeometry args={[30, 30, 64, 64]} />
          <shaderMaterial
            uniforms={{
              ...shaderUniforms,
              uColorA: { value: new THREE.Color("#5B25D4") },
              uColorB: { value: new THREE.Color("#5212bf") },
            }}
            transparent
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      <mesh ref={focusRef} frustumCulled={false}>
        <planeGeometry args={[30, 30, 64, 64]} />
        <shaderMaterial
          uniforms={{
            ...shaderUniforms,
            uColorA: { value: new THREE.Color("#ff70ff") },
            uColorB: { value: new THREE.Color("#e650ff") },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>
    </>
  );
}
