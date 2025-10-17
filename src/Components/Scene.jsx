import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

function Particles({ count = 500, radius = 1.8, color = "white" }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * radius; // Uniform distribution in sphere volume
      pos[i] = r * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count, radius]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function DetachingParticles({ count = 800, radius = 1.5, color1, color2 }) {
  const geometryRef = useRef();

  const [positions, velocities, lifes, alphas, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const lifeArr = new Float32Array(count);
    const alphaArr = new Float32Array(count);
    const col = new Float32Array(count * 3);

    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);

    for (let i = 0; i < count; i++) {
      const mix = Math.random();
      col[i * 3] = c1.r * (1 - mix) + c2.r * mix;
      col[i * 3 + 1] = c1.g * (1 - mix) + c2.g * mix;
      col[i * 3 + 2] = c1.b * (1 - mix) + c2.b * mix;

      respawn(i, pos, vel, lifeArr, alphaArr, radius);
    }
    return [pos, vel, lifeArr, alphaArr, col];
  }, [count, radius, color1, color2]);

  function respawn(idx, pos, vel, lifeArr, alphaArr, radius) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    pos[idx * 3] = x;
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = z;

    const outward = new THREE.Vector3(x, y, z).normalize();
    outward.multiplyScalar(0.4 + Math.random() * 0.6); // speed 0.4 to 1.0

    const randomDir = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize().multiplyScalar(0.3 + Math.random() * 0.4); // increased random for more dispersion

    outward.add(randomDir);

    vel[idx * 3] = outward.x;
    vel[idx * 3 + 1] = outward.y;
    vel[idx * 3 + 2] = outward.z;

    lifeArr[idx] = 3 + Math.random() * 4; // life 3-7 seconds for longer trails
    alphaArr[idx] = 1.0;
  }

  useFrame((state, delta) => {
    for (let i = 0; i < count; i++) {
      lifes[i] -= delta;
      if (lifes[i] < 0) {
        respawn(i, positions, velocities, lifes, alphas, radius);
      } else {
        positions[i * 3] += velocities[i * 3] * delta;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;

        // Fade out in the last 1.5 seconds
        if (lifes[i] < 1.5) {
          alphas[i] = lifes[i] / 1.5;
        } else {
          alphas[i] = 1;
        }
      }
    }

    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.attributes.alpha.needsUpdate = true;
    geometryRef.current.attributes.color.needsUpdate = true; // if colors change, but here static
  });

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-alpha" array={alphas} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
        vertexShader={`
          attribute float alpha;
          attribute vec3 color;
          varying float vAlpha;
          varying vec3 vColor;
          void main() {
            vAlpha = alpha;
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 3.0 * (300.0 / -mvPosition.z); // Size attenuation
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          varying vec3 vColor;
          void main() {
            vec2 coord = gl_PointCoord - 0.5;
            if (length(coord) > 0.5) discard; // Circular points
            gl_FragColor = vec4(vColor, vAlpha * 0.8);
          }
        `}
      />
    </points>
  );
}

function NebulaSphere({ scroll, color1, color2, speed, offset }) {
  const groupRef = useRef();
  const shaderRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    const scrollFactor = Math.min(scroll / 1000, 1);

    // Subtle idle floating with small amplitude, enhanced slightly by scroll
    const amplitude = 0.2 + 1.3 * scrollFactor; // Base 0.2 for idle float, up to ~1.5 with scroll
    groupRef.current.position.x = Math.sin(t) * amplitude;
    groupRef.current.position.y = Math.cos(t * 1.3) * (amplitude * 0.8);

    shaderRef.current.uniforms.uTime.value = t;
    shaderRef.current.uniforms.uMix.value = scrollFactor;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.5, 128, 128]} />
        <shaderMaterial
          ref={shaderRef}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color(color1) },
            uColor2: { value: new THREE.Color(color2) },
            uMix: { value: 0 },
          }}
          vertexShader={`
            varying vec3 vPosition;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vPosition;
            varying vec2 vUv;
            uniform float uTime;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform float uMix;

            float random(vec2 st) {
              return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            float noise(vec2 st) {
              vec2 i = floor(st);
              vec2 f = fract(st);

              float a = random(i);
              float b = random(i + vec2(1.0, 0.0));
              float c = random(i + vec2(0.0, 1.0));
              float d = random(i + vec2(1.0, 1.0));

              vec2 u = f * f * (3.0 - 2.0 * f);
              return mix(a, b, u.x) +
                     (c - a)* u.y * (1.0 - u.x) +
                     (d - b) * u.x * u.y;
            }

            float fbm(vec2 st) {
              float value = 0.0;
              float amplitude = 0.5;
              for (int i = 0; i < 8; i++) { // Increased to 8 octaves for more grain
                value += amplitude * noise(st);
                st *= 2.2; // Slightly higher lacunarity for finer grain
                amplitude *= 0.5;
              }
              return value;
            }

            void main() {
              vec2 st = vUv * 6.0; // Increased scale for finer grain
              float n = fbm(st + uTime * 0.03);

              // Nebula-like clouds with smoother gradients
              float clouds = smoothstep(0.2, 0.95, n);

              // Enhanced gradient mixing
              vec3 color = mix(uColor1, uColor2, clouds * (1.0 + 0.2 * sin(uTime * 0.1)));
             color += vec3(0.5, 0.3, 0.6) * pow(clouds, 2.0) * sin(uTime * 0.4 + n * 4.0);


              // Interior glow with radial gradient influence
              float dist = length(vUv - 0.5);
              float radialGlow = smoothstep(0.6, 0.0, dist);

              //radial glow
             color += vec3(0.6, 0.3, 1.0) * radialGlow * (0.8 + 0.4 * clouds);


              // Alpha with smoother falloff for blur-like edges
              float alpha = smoothstep(1.2, 0.3, length(vPosition)) * 0.85;
              alpha *= (1.0 - dist * 0.5);

              gl_FragColor = vec4(color, alpha + 0.25);
            }
          `}
        />
      </mesh>
      <Particles count={1200} radius={7.5} color="#a855f7" />

      <Particles count={900} radius={3.6} color="#d4befe" />
      <DetachingParticles count={800} radius={6.5} color1={color1} color2={color2} />
    </group>
  );
}

export default function Scene({ scroll }) {
  return (
    <>
      {/* <ambientLight intensity={0.0} />
      <pointLight position={[0, 0, 4]} intensity={0.0} color="#4b0082" /> */}

      <NebulaSphere
        scroll={scroll}
        color1="#3a0ca3"
        color2="#a4508b"
        speed={0.3}
        offset={0}
      />
      <NebulaSphere
        scroll={scroll}
        color1="#4361ee"
        color2="#7209b7"
        speed={0.2}
        offset={2}
      />

      <EffectComposer>
       <Bloom
  intensity={80.0} // mucho más intenso
  radius={0.5} // expansión mayor
  luminanceThreshold={0.015} // detecta más zonas
  luminanceSmoothing={1.5}
/>

        <Noise opacity={0.68} premultiply blendFunction={BlendFunction.ADD} /> // Increased for more grainy effect
      </EffectComposer>
    </>
  );
}