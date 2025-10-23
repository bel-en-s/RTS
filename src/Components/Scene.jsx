import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Scene({ scroll }) {
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
      [2, 0, 0],
      [2, 0, -1],
      [8, 0, -1], // todas unidas
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
    const s = Math.min(scroll / 1000, 1); // scroll normalizado de 0 a 1
    const { pointer } = state;

    // captura mouse position para el efecto parallax
    mouse.current.x = (pointer.x + 1) / 2;
    mouse.current.y = (1 - pointer.y) / 2;

    // Transiciones
    const phase1to2 = THREE.MathUtils.smoothstep(s, 0.0, 0.63);
    const phase2to3 = THREE.MathUtils.smoothstep(s, 0.6, 1.0);
    const focusScroll = THREE.MathUtils.clamp((s - 0.66) / 0.34, 0, 1);

    // Fase actual (0-2, lerp suave)
    const currentPhase = THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(0, 1, phase1to2),
      2,
      phase2to3
    );

    const focusIndex = Math.floor(focusScroll * 3);

    meshes.forEach((meshRef, i) => {
      const mesh = meshRef.current;
      if (!mesh) return;

      mesh.material.uniforms.uTime.value = t + i * 2.5;
      mesh.material.uniforms.uScroll.value = s;
      mesh.material.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
      mesh.material.uniforms.uPhase.value = currentPhase;

      // Posiciones interpoladas
      const [bx, by, bz] = positionsPerPhase[0][i];
      const [mx, my, mz] = positionsPerPhase[1][i];
      const [fx, fy, fz] = positionsPerPhase[2][i];

      const x12 = THREE.MathUtils.lerp(bx, mx, phase1to2);
      const y12 = THREE.MathUtils.lerp(by, my, phase1to2);
      const z12 = THREE.MathUtils.lerp(bz, mz, phase1to2);

      const x23 = THREE.MathUtils.lerp(x12, fx, phase2to3);
      const y23 = THREE.MathUtils.lerp(y12, fy, phase2to3);
      const z23 = THREE.MathUtils.lerp(z12, fz, phase2to3);

      const intensity = parallaxIntensities[i];
      const parallaxX = pointer.x * intensity;
      const parallaxY = pointer.y * intensity;

      mesh.position.x += (x23 + parallaxX - mesh.position.x) * 0.05;
      mesh.position.y += (y23 + parallaxY - mesh.position.y) * 0.05;
      mesh.position.z = z23;

      if (i === 3) {
        const target = positionsPerPhase[2][focusIndex];
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

  gl_FragColor = vec4(color, alpha);
}
`;