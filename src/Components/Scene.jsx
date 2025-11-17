import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./Shaders/mainShader";
import perladoTextureURL from "../assets/gainy.jpg";

export default function Scene({ scroll, phase }) {
  // REFERENCIAS PARA LAS BOLAS BASE
  const meshes = useMemo(
    () => [
      React.createRef(), // izquierda
      React.createRef(), // centro
      React.createRef(), // derecha
      React.createRef(), // cuarta (no importa en fases 2–3, queda detrás)
    ],
    []
  );

  // FOCO INDEPENDIENTE
  const focusRef = useRef();

  // TEXTURA
  const perladoTexture = new THREE.TextureLoader().load(perladoTextureURL);
  perladoTexture.wrapS = perladoTexture.wrapT = THREE.MirroredRepeatWrapping;

  // UNIFORMS BASE
  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uTexture: { value: perladoTexture },
    }),
    []
  );

  // SUAVIZADO
  function smoothstep(edge0, edge1, x) {
    const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - x), 0, 1);
    return t * t * (3 - 2 * t);
  }

  // POSICIONES POR FASE
  const positionsPerPhase = [
    // ------------------------------------------------
    // FASE 0 — COMPACTA
    // ------------------------------------------------
    [
      [0, 0, 4.5],
      [1, 0, 3],
      [-2, 0, 0],
      [0, 0, 4],
    ],

    // ------------------------------------------------
    // FASE 1 — TODAS JUNTAS A LA DERECHA
    // ------------------------------------------------
    [
      [2, 1, 1],
      [2, 1, 1],
      [2, 1, 1],
      [2, 1, 1],
    ],

    // ------------------------------------------------
    // FASE 2 — 3 BOLAS ESTABILIZADAS
    // ------------------------------------------------
    [
      [-1.3, -0.2, 0], // izquierda
      [0.2, 0.1, 0],   // centro
      [1.4, 0.15, 0],  // derecha
      [0.2, 0.1, -0.35], // atrás del foco
    ],

    // ------------------------------------------------
    // FASE 3 — MISMAS BOLAS, EL FOCO SE DESLIZA
    // ------------------------------------------------
    [
      [-1.3, -0.2, 0],
      [0.2, 0.1, 0],
      [1.4, 0.15, 0],
      [0.2, 0.1, -0.35],
    ],
  ];

  // COLORES BASE
  const planes = [
    { color1: "#5B25D4", color2: "#2e6acc" },
    { color1: "#5B25D4", color2: "#5212bf" },
    { color1: "#5212bf", color2: "#5212bf" },
    { color1: "#04CBFE", color2: "#4038af" },
  ];

  // ----------------------------------------------------
  // ⚡ USE FRAME — ANIMACIÓN
  // ----------------------------------------------------

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const lerpFactor = 0.06;

    const floorIndex = Math.floor(phase);
    const ceilIndex = Math.min(floorIndex + 1, positionsPerPhase.length - 1);
    const blend = phase - floorIndex;
    const easedBlend = THREE.MathUtils.clamp(blend, 0, 1);

    // ------------------------------------------------
    // ANIMAR BOLAS BASE
    // ------------------------------------------------
    meshes.forEach((ref, i) => {
      const mesh = ref.current;
      if (!mesh) return;

      mesh.material.uniforms.uTime.value = t + i * 1.1;

      const [ax, ay, az] = positionsPerPhase[floorIndex][i];
      const [bx, by, bz] = positionsPerPhase[ceilIndex][i];

      const tx = ax + (bx - ax) * easedBlend;
      const ty = ay + (by - ay) * easedBlend;
      const tz = az + (bz - az) * easedBlend;

      mesh.position.x += (tx - mesh.position.x) * lerpFactor;
      mesh.position.y += (ty - mesh.position.y) * lerpFactor;
      mesh.position.z += (tz - mesh.position.z) * lerpFactor;

      // ❄ Se vuelven un poco más azules en fase 2–3
      const blueShift = phase < 2 ? 0 : smoothstep(2, 3, phase);
      const baseA = new THREE.Color(planes[i].color1);
      const baseB = new THREE.Color(planes[i].color2);

      const targetA = baseA.clone().lerp(new THREE.Color("#4f70ff"), blueShift * 0.4);
      const targetB = baseB.clone().lerp(new THREE.Color("#6a8aff"), blueShift * 0.5);

      mesh.material.uniforms.uColorA.value.copy(targetA);
      mesh.material.uniforms.uColorB.value.copy(targetB);

      mesh.scale.set(1, 1, 1);
    });

    // ------------------------------------------------
    // 🔥 FOCO
    // ------------------------------------------------

    const focus = focusRef.current;
    if (focus) {
      focus.material.uniforms.uTime.value = t;

      // Foco solo visible en fase >=2
      const visible = phase >= 2 ? 1 : 0;
      focus.material.opacity += (visible - focus.material.opacity) * 0.1;

      // Posiciones
      const pLeft = positionsPerPhase[2][0];
      const pCenter = positionsPerPhase[2][1];
      const pRight = positionsPerPhase[2][2];

      // Lógica: izquierda → centro → derecha
      let target = pLeft;

      if (phase >= 2 && phase < 2.5) {
        // izquierda → centro
        const k = smoothstep(2, 2.5, phase);
        target = [
          THREE.MathUtils.lerp(pLeft[0], pCenter[0], k),
          THREE.MathUtils.lerp(pLeft[1], pCenter[1], k),
          THREE.MathUtils.lerp(pLeft[2], pCenter[2], k),
        ];
      } else if (phase >= 2.5) {
        // centro → derecha
        const k = smoothstep(2.5, 3, phase);
        target = [
          THREE.MathUtils.lerp(pCenter[0], pRight[0], k),
          THREE.MathUtils.lerp(pCenter[1], pRight[1], k),
          THREE.MathUtils.lerp(pCenter[2], pRight[2], k),
        ];
      }

      // Interpolar posición del foco
      focus.position.x += (target[0] - focus.position.x) * 0.08;
      focus.position.y += (target[1] - focus.position.y) * 0.08;
      focus.position.z = 0.3;

      // Color rosa suave y transparente
      const pinkA = new THREE.Color("rgba(255,112,255,0.7)");
      const pinkB = new THREE.Color("rgba(230,80,255,0.7)");

      focus.material.uniforms.uColorA.value.copy(pinkA);
      focus.material.uniforms.uColorB.value.copy(pinkB);

      focus.scale.set(1, 1, 1);
    }
  });

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------
  return (
    <>
      {/* bolas base */}
      {planes.map((props, i) => (
        <mesh key={i} ref={meshes[i]} frustumCulled={false}>
          <planeGeometry args={[30, 30, 64, 64]} />
          <shaderMaterial
            uniforms={{
              ...shaderUniforms,
              uColorA: { value: new THREE.Color(props.color1) },
              uColorB: { value: new THREE.Color(props.color2) },
            }}
            transparent
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* FOCO */}
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
