import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./Shaders/mainShader";
import perladoTextureURL from "../assets/gainy.jpg";

export default function Scene({ scroll, phase }) {

  // =============================================================================
  //  REFS PARA LAS BOLAS BASE (las 4 capas grandes de la nebulosa)
  // =============================================================================
  const meshes = useMemo(
    () => [
      React.createRef(), // izquierda
      React.createRef(), // centro
      React.createRef(), // derecha
      React.createRef(), // atrás del foco
    ],
    []
  );

  //  ref del FOCO (esfera rosada / plano rosado)
  const focusRef = useRef();

  // =============================================================================
  //  TEXTURA PRINCIPAL DEL SHADER
  // =============================================================================
  const perladoTexture = new THREE.TextureLoader().load(perladoTextureURL);
  perladoTexture.wrapS = perladoTexture.wrapT = THREE.MirroredRepeatWrapping;

  // =============================================================================
  //  UNIFORMS BASE QUE COMPARTEN TODAS LAS BOLAS
  // =============================================================================
  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uTexture: { value: perladoTexture },
    }),
    []
  );

  // =============================================================================
  //  Suavizado tipo smoothstep (lo uso para blends de fase)
  // =============================================================================
  function smoothstep(edge0, edge1, x) {
    const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (30 - 2 * t);
  }

  // =============================================================================
  //  POSICIONES DE LAS BOLAS POR FASE
  // =============================================================================
  const positionsPerPhase = [
    // FASE 0 — compacta
    [
      [0, 0, 0],
      [1, 0, 2],
      [-1.5, 0, 0],
      [0, 0, 3]
    ],

    // FASE 1 — juntitas a la derecha
    [
      [2, 0, 1],
      [2, 0, 1],
      [2, 0, 1],
      [2, 0, 1]
    ],

    // FASE 2 — 3 bolas estabilizadas
    [
      [-1.3, -0.2, 0],
      [0.2, 0.1, 0],
      [1.4, 0.15, 0],
      [0.2, 0.1, -0.35]
    ],

    // FASE 3 — mismas bolas, el foco se desliza
    [
      [-0.8, 0, 4],
      [0.2, 0.1, 3],
      [1.4, 0.15, 2],
      [0.2, 0.1, 1]
    ]
  ];

  // =============================================================================
  // POSICIONES DEL FOCO POR FASE (esto es lo nuevo que agrego)
  // =============================================================================
  //  defino una posición del foco para cada fase, así lo hago acompañar
  //    todo el recorrido desde 0 → 1 → 2 → 3.
  const focusPositions = [
    [0, 0, -4.5],    // fase 0 — acompaña al cluster inicial
    [2, 0, 0],      // fase 1 — acompaña el movimiento hacia derecha
    [-1.3, 0.1, 3],  // fase 2 — foco aparece en el centro
    [0.2, 0.15, 3], // fase 3 — foco se desplaza a la derecha
  ];

  // =============================================================================
  //  COLORES BASE DE CADA CAPA
  // =============================================================================
  const planes = [
    { color1: "#5B25D4", color2: "#2e6acc" },
    { color1: "#5B25D4", color2: "#5212bf" },
    { color1: "#5212bf", color2: "#5212bf" },
    { color1: "#04CBFE", color2: "#4038af" },
  ];

  // =============================================================================
  //  USE FRAME — ANIMACIÓN POR FRAME
  // =============================================================================
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const lerpFactor = 0.06;

    // Fases enteras
    const floorIndex = Math.floor(phase);
    const ceilIndex = Math.min(floorIndex + 1, positionsPerPhase.length - 1);

    // Blend fraccional entre fase actual y siguiente
    const blend = phase - floorIndex;
    const easedBlend = THREE.MathUtils.clamp(blend, 0, 1);

    // ---------------------------------------------------------------------------
    //  ANIMO LAS 4 BOLAS BASE
    // ---------------------------------------------------------------------------
    meshes.forEach((ref, i) => {
      const mesh = ref.current;
      if (!mesh) return;

      mesh.material.uniforms.uTime.value = t + i * 1.1;

      // POSICIÓN INTERPOLADA ENTRE FASES
      const [ax, ay, az] = positionsPerPhase[floorIndex][i];
      const [bx, by, bz] = positionsPerPhase[ceilIndex][i];

      const tx = ax + (bx - ax) * easedBlend;
      const ty = ay + (by - ay) * easedBlend;
      const tz = az + (bz - az) * easedBlend;

      mesh.position.x += (tx - mesh.position.x) * lerpFactor;
      mesh.position.y += (ty - mesh.position.y) * lerpFactor;
      mesh.position.z += (tz - mesh.position.z) * lerpFactor;

      // BLEND DE COLOR HACIA TONOS MÁS FRÍOS EN FASE 2–3
      const blueShift = phase < 2 ? 0 : smoothstep(2, 3, phase);
      const baseA = new THREE.Color(planes[i].color1);
      const baseB = new THREE.Color(planes[i].color2);

      const targetA = baseA.clone().lerp(new THREE.Color("#4f70ff"), blueShift * 0.4);
      const targetB = baseB.clone().lerp(new THREE.Color("#6a8aff"), blueShift * 0.5);

      mesh.material.uniforms.uColorA.value.copy(targetA);
      mesh.material.uniforms.uColorB.value.copy(targetB);

      mesh.scale.set(1, 1, 1);
    });

    // ---------------------------------------------------------------------------
    //  ANIMO EL FOCO — con interpolación entre TODAS las fases
    // ---------------------------------------------------------------------------
    const focus = focusRef.current;
    if (focus) {

      focus.material.uniforms.uTime.value = t;

      // 👉 Hago que la opacidad aparezca recién en fase 2
      const visible = phase >= 2 ? 1 : 0;
      focus.material.opacity += (visible - focus.material.opacity) * 0.08;

      // Fases enteras para el foco
      const f0 = Math.floor(phase);
      const f1 = Math.min(f0 + 1, focusPositions.length - 1);

      // Blend fraccional del foco
      const k = THREE.MathUtils.clamp(phase - f0, 0, 1);

      // POSICIÓN DEL FOCO INTERPOLADA ENTRE FASES
      const [ax, ay, az] = focusPositions[f0];
      const [bx, by, bz] = focusPositions[f1];

      const tx = THREE.MathUtils.lerp(ax, bx, k);
      const ty = THREE.MathUtils.lerp(ay, by, k);
      const tz = THREE.MathUtils.lerp(az, bz, k);

      // Muevo suavemente el foco hacia el target
      focus.position.x += (tx - focus.position.x) * 0.06;
      focus.position.y += (ty - focus.position.y) * 0.06;
      focus.position.z += (tz - focus.position.z) * 0.06;

      // Colores del foco (rosa suave)
      focus.material.uniforms.uColorA.value.set("#ff70ff");
      focus.material.uniforms.uColorB.value.set("#e650ff");

      focus.scale.set(1, 1, 1);
    }
  });

  return (
    <>
      {/*  bolas base (4 planos grandes) */}
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

      {/*  FOCO  */}
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
