import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Scene({ scroll }) {
  const meshes = useMemo(
    () => [React.createRef(), React.createRef(), React.createRef(), React.createRef()],
    []
  );

  const mouse = useRef({ x: 0.5, y: 0.5 });

  const basePositions = useMemo(
    () => [
      [0, 0, -1],
      [-1, -1, -1],
      [1.2, -1, -1],
      [0, -2, -1],
    ],
    []
  );

  const targetPositions = useMemo(
    () => [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    []
  );

  const parallaxIntensities = [0.1, 0.2, 0.3, 0.4];

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
    }),
    []
  );

  const planes = [
    { color1: "#0c92ca", color2: "#8A38F5" },
    { color1: "#1AD9FF", color2: "#17B1D9" },
    { color1: "#6a19ca", color2: "#1eb7cb" },
    { color1: "#3f40cc", color2: "#7b7cff" },
  ];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const s = Math.min(scroll / 1000, 1);

    const { pointer } = state;
    mouse.current.x = (pointer.x + 1) / 2;
    mouse.current.y = (1 - pointer.y) / 2;

    meshes.forEach((meshRef, i) => {
      const mesh = meshRef.current;
      if (mesh) {
        mesh.material.uniforms.uTime.value = t + i * 2.0;
        mesh.material.uniforms.uScroll.value = s;
        mesh.material.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);

        const [bx, by, bz] = basePositions[i];
        const [tx, ty, tz] = targetPositions[i];

        const baseX = THREE.MathUtils.lerp(bx, tx, s);
        const baseY = THREE.MathUtils.lerp(by, ty, s);
        const baseZ = THREE.MathUtils.lerp(bz, tz, s);

        const intensity = parallaxIntensities[i];
        const parallaxX = pointer.x * intensity;
        const parallaxY = pointer.y * intensity;

        mesh.position.x += ((baseX + parallaxX) - mesh.position.x) * 0.05;
        mesh.position.y += ((baseY + parallaxY) - mesh.position.y) * 0.05;
        mesh.position.z = baseZ;

        const scaleFactor = THREE.MathUtils.lerp(1, 2.5, s);
        mesh.scale.set(scaleFactor, scaleFactor, 1);
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

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  float noise(vec2 p) {
    return sin(p.x * 3.0 + uTime * 0.4) * sin(p.y * 4.0 + uTime * 0.3);
  }

  // Warping distortion tipo lente de agua
  vec2 waterDistortion(vec2 uv, vec2 center, float time) {
    vec2 dir = uv - center;
    float dist = length(dir);
    float ripple = sin(40.0 * dist - time * 5.0) * 0.02;
    float falloff = smoothstep(0.2, 0.0, dist);
    return uv + normalize(dir) * ripple * falloff;
  }

  void main() {
    vec2 uv = vUv;
    vec2 centeredUV = uv * 2.0 - 1.0;
    float r = length(centeredUV);

    float sigma = mix(0.06, 0.1, smoothstep(0.02, 0.6, uScroll));
    float falloff = exp(- (r * r) / (1.0 * sigma * sigma));

    float n = noise(centeredUV * 3.5) * 0.03;
    falloff += n * 0.2;

float idlePulse = 1.0 + 0.05 * sin(uTime * 0.5);    float idleFactor = smoothstep(0.0, 0.1, 1.0 - uScroll);
    falloff *= mix(1.0, idlePulse, idleFactor);

    // Distorsionar UV para efecto de agua
    vec2 distortedUV = waterDistortion(vUv, uMouse, uTime);

    // Recalcular color con UVs distorsionadas
    vec2 centerDistUV = distortedUV * 2.0 - 1.0;
    float rd = length(centerDistUV);
    float colorMix = smoothstep(0.0, 0.2, rd + n * 0.1);
    vec3 color = mix(uColorA, uColorB, colorMix);

    float edgeFade = smoothstep(5.0, 0.9, max(abs(centeredUV.x), abs(centeredUV.y)));
    float alpha = falloff * edgeFade * 1.5;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`;
