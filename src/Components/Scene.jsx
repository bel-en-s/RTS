import { useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

function GradientSphere({ scroll, color1, color2, speed, offset }) {
  const ref = useRef();
  const shaderRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    const scrollFactor = Math.min(scroll / 1000, 1);

    // movimiento suave con scroll
    ref.current.position.x = Math.sin(t) * 1.5 * scrollFactor;
    ref.current.position.y = Math.cos(t * 1.3) * 1.2 * scrollFactor;

    // animación del gradiente interno
    shaderRef.current.uniforms.uTime.value = t;
    shaderRef.current.uniforms.uMix.value = scrollFactor;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        ref={shaderRef}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(color1) },
          uColor2: { value: new THREE.Color(color2) },
          uMix: { value: 0 },
        }}
        vertexShader={`
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vPosition;
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform float uMix;

          // ruido simple pseudoaleatorio
          float noise(vec3 p) {
            return fract(sin(dot(p ,vec3(12.9898,78.233,54.53))) * 43758.5453);
          }

          void main() {
            float n = noise(vPosition * 3.0 + uTime * 0.1);
            float gradient = smoothstep(-0.2, 1.0, n);
            vec3 color = mix(uColor1, uColor2, gradient + sin(uTime * 0.5) * 0.1);
            color = mix(color, vec3(1.0), 0.2 * uMix);
            gl_FragColor = vec4(color, 0.85);
          }
        `}
      />
    </mesh>
  );
}

export default function Scene({ scroll }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 4]} intensity={2} color="#ffffff" />
      <GradientSphere
        scroll={scroll}
        color1="#ff00ff"
        color2="#00ffff"
        speed={0.6}
        offset={0}
      />
      <GradientSphere
        scroll={scroll}
        color1="#00bfff"
        color2="#ff0040"
        speed={0.4}
        offset={2}
      />

      {/* Efectos de postprocesado */}
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
        />
        <Noise opacity={0.15} premultiply blendFunction={BlendFunction.ADD} />
      </EffectComposer>
    </>
  );
}
