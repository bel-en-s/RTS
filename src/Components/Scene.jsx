import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Scene({ scroll, phase }) {

  const meshes = useMemo(
    () => [React.createRef(), React.createRef(), React.createRef(), React.createRef()],
    []
  );

  const mouse = useRef({ x: 0.5, y: 0.5 });

  // 
  const positionsPerPhase = [
    // Phase1
    [
      [0, 0.5, 3],
      [2, 0, 0],
      [1.2, 0, -1],
      [0, 0, 2], // foco inicial
    ],
    // Phase2
    [
      [2, 0, -1],
      [2, 0, -1],
      [2, 0, -1],
      [2, 0, -1], // todas unidas
    ],
    // Phase3
    [
      [-2, 0, -1],
      [0, 0, -1],
      [2, 0, -1],
      [0, 3, -1], // se separan de nuevo
    ],
  ];


  // efecto parallax con mouse
  const parallaxIntensities = [0.1, 0.2, 0.3, 0.0];

  // colores 
  const planes = [
    { color1: "rgba(12, 146, 202, 1)", color2: "#8A38F5" },
    { color1: "#5334aa", color2: "#3f40cc" },
    { color1: "#6a19ca", color2: "#3f40cc" },
    { color1: "#03303a", color2: "#03303a" }, // foco
  ];

  // 
  // const phaseValues = {
  //   sigmaMin: [0.06, 0.04, 0.06], // Phase2: bajo para condensado/perla
  //   sigmaMax: [0.1, 0.08, 0.1],
  //   noiseFreq: [3.5, 5.0, 3.5], // Phase2: alta para textura fina
  //   noiseAmp: [0.03, 0.05, 0.03],
  //   colorMixRange: [0.2, 0.4, 0.2], // Phase2: amplio para gradiente suave, menos quemado
  //   alphaMultiplier: [1.5, 1.0, 1.5], // Phase2: bajo para no quemar
  //   edgeFadeStart: [5.0, 0.5, 5.0], // Phase2: bajo para bordes definidos
  //   edgeFadeEnd: [0.3, 0.3, 0.3],
  // };

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uPhase: { value: 0 }, // Para condicionar en shader
    }),
    []
  );

  //animacion

  useFrame((state) => {
  const t = state.clock.getElapsedTime();
  // normalizo scroll si lo querés usar
  const s = Math.min(scroll / 1000, 1);
  const { pointer } = state;

  // mouse para parallax
  mouse.current.x = (pointer.x + 1) / 2;
  mouse.current.y = (1 - pointer.y) / 2;

  // Para suavizar la fase (evitamos saltos bruscos)
  // cada mesh tiene su propio uniform uPhase, que iremos acercando a la prop `phase`
  // además usamos esa versión suavizada para calcular las posiciones objetivo
  meshes.forEach((meshRef, i) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // actualizar uniforms de tiempo / mouse / scroll
    mesh.material.uniforms.uTime.value = t + i * 2.5;
    mesh.material.uniforms.uScroll.value = s;
    mesh.material.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);

    // suavizamos el valor de uPhase para evitar saltos
    const prevPhase = mesh.material.uniforms.uPhase.value;
    const smoothedPhase = THREE.MathUtils.lerp(prevPhase, phase, 0.08); // ajuste la rapidez cambiando 0.08
    mesh.material.uniforms.uPhase.value = smoothedPhase;

    // --- calculo de posiciones interpoladas usando smoothedPhase ---
    // p0 = fase 0, p1 = fase 1, p2 = fase 2
    const p0 = positionsPerPhase[0][i];
    const p1 = positionsPerPhase[1][i];
    const p2 = positionsPerPhase[2][i];

    // si smoothedPhase está entre 0 y 1 -> interpolamos entre p0 y p1
    // si está entre 1 y 2 -> interpolamos entre p1 y p2 (localT va de 0 a 1)
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

    // parallax (aplicado despacio)
    const intensity = parallaxIntensities[i];
    const parallaxX = pointer.x * intensity;
    const parallaxY = pointer.y * intensity;

    mesh.position.x += (targetPos[0] + parallaxX - mesh.position.x) * 0.05;
    mesh.position.y += (targetPos[1] + parallaxY - mesh.position.y) * 0.05;
    mesh.position.z = targetPos[2];

    // --- lógica especial para la mesh 3 (foco) ---
    // calculamos focusIndex de forma segura usando la versión suavizada de la fase
    // Queremos que focusIndex sea 0,1,2 según la subposición dentro de la fase final
    // Usamos un map simple: si estamos en la segunda mitad (smoothedPhase > 1) el focusIndex
    // dependerá de (smoothedPhase - 1) mapeado a 0..1
    let focusIndex = 0;
    const focusT = THREE.MathUtils.clamp((smoothedPhase <= 1 ? smoothedPhase : smoothedPhase - 1) , 0, 1);
    // por ejemplo: dividir en 3 posiciones discretas (0,1,2)
    focusIndex = Math.floor(focusT * 3);
    focusIndex = Math.min(Math.max(focusIndex, 0), 2); // clamp 0..2

    if (i === 3) {
      const target = positionsPerPhase[2][focusIndex] || p2;
      mesh.position.x += (target[0] - mesh.position.x) * 0.05;
      mesh.position.y += (target[1] - mesh.position.y) * 0.05;
      // colores con lerp seguro
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


   return (
    <>
      <ambientLight intensity={0.3} />
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
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}


// === Shaders ===
const vertexShader =  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uScroll;
uniform vec2 uMouse;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uPhase;

float noise(vec2 p, float freq) {
  return sin(p.x * freq + uTime * 0.4) * sin(p.y * freq + uTime * 0.3);
}

void main() {
  vec2 uv = vUv;
  // posicion
  vec2 centeredUV = uv * 2.0 - 1.0;


  // Suaviza entre fase 1 y 2:
float f12 = smoothstep(0.0, 1.0, uPhase);

// Suaviza entre fase 2 y 3:
float f23 = smoothstep(1.0, 2.0, uPhase);

  float r = length(centeredUV);

 // Apertura por fase. Hace suve la transicion entre ellas
  float sigmaMin = mix(mix(0.06, 0.04, smoothstep(0.9, 1.1, uPhase)), 0.54, smoothstep(1.9, 2.1, uPhase)); 
  float sigmaMax = mix(mix(0.1, 0.08, smoothstep(0.9, 1.1, uPhase)), 0.08, smoothstep(1.9, 2.1, uPhase));
  float sigma = mix(sigmaMin, sigmaMax, smoothstep(0.02, 0.6, uScroll));

  float falloff = exp(- (r * r) / (1.0 * sigma * sigma));

  // Para definición circular (brusco en phase2/3)
  float phase23Factor = smoothstep(0.9, 1.1, uPhase) + smoothstep(1.9, 2.1, uPhase) - smoothstep(2.9, 3.0, uPhase); // 1 en phase2 o 3
  phase23Factor = clamp(phase23Factor, 0.0, 1.0);
  falloff = mix(falloff, pow(falloff, 2.5), phase23Factor);

  // Noise por fase
  float noiseFreq = mix(mix(3.5, 5.0, smoothstep(0.9, 1.1, uPhase)), 5.0, smoothstep(1.9, 2.1, uPhase));
  float noiseAmp = mix(mix(0.03, 0.05, smoothstep(0.9, 1.1, uPhase)), 0.05, smoothstep(1.9, 2.1, uPhase));
  float n = noise(centeredUV, noiseFreq) * noiseAmp;
  falloff += n * 0.2;


  // acá en la segunda fase, donde estan todas juntas, subir bastante
float phase1Factor = smoothstep(0.0, 0.5, uPhase);
float phase3Factor = smoothstep(1.5, 2.0, uPhase);

// Pulse diferente por fase
float idlePulsePhase1 = 1.0 + 0.05 * sin(uTime * 0.5);
float idlePulsePhase3 = 10.0 + 0.05 * sin(uTime * 0.5);
float idlePulse = mix(idlePulsePhase1, idlePulsePhase3, phase3Factor);

float idleFactor = smoothstep(0.0, 0.1, 1.0 - uScroll);
falloff *= mix(1.0, idlePulse, idleFactor);

  vec2 centerDistUV = centeredUV;
  float rd = length(centerDistUV);

  // ColorMix por fase
  float colorMixRange = mix(mix(0.2, 0.4, smoothstep(0.9, 1.1, uPhase)), 0.4, smoothstep(1.9, 2.1, uPhase));
  float colorMix = smoothstep(0.0, colorMixRange, rd + n * 0.1);
  vec3 color = mix(uColorA, uColorB, colorMix);


  // EdgeFade por fase
  float edgeStart = mix(mix(50.0, 0.5, smoothstep(0.9, 1.1, uPhase)), 0.5, smoothstep(1.9, 2.1, uPhase));
  float edgeEnd = 0.3;
  float edgeFade = smoothstep(edgeStart, edgeEnd, max(abs(centeredUV.x), abs(centeredUV.y)));

  // Alpha por fase
  float alphaMult = mix(mix(1.5, 1.0, smoothstep(0.9, 10.1, uPhase)), 1.0, smoothstep(1.9, 2.1, uPhase));
  float alpha = falloff * edgeFade * alphaMult;
  alpha = clamp(alpha, 0.0, 1.0);

  
  //material iridescent para etapa 2 cuando la bola es 1

float phase2Mask = smoothstep(0.7, 1.2, uPhase) * (1.0 - smoothstep(1.2, 1.5, uPhase));


    vec3 iridescent = vec3(
      0.5 + 0.5 * sin(uTime + centeredUV.x * 5.0),
      0.5 + 0.5 * sin(uTime * 1.3 + centeredUV.y * 5.0),
      0.5 + 0.5 * sin(uTime * 1.7 + centeredUV.x * 3.0)
    );

    color = mix(color, iridescent, phase2Mask * 0.8);

      gl_FragColor = vec4(color, alpha);
    }
`;