export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uScroll;
uniform vec2 uMouse;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uPhase;
uniform sampler2D uTexture;

// --- ruido 2D base ---
float noise(vec2 p, float freq) {
  return sin(p.x * freq + uTime * 0.4) * sin(p.y * freq + uTime * 0.3);
}

// --- ruido 3D simple (hash + interpolación) ---
float hash(vec3 p) {
  return fract(sin(dot(p, vec3(7,157,113))) * 43758.5453);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
      mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
      f.y
    ),
    mix(
      mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
      mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
      f.y
    ),
    f.z
  );
}

// --- FBM (fractal brownian motion) ---
float fbm(vec3 p) {
  float n = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    n += amp * noise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return n;
}

void main() {
  vec2 uv = vUv;
  vec2 centeredUV = uv * 2.0 - 1.0;

  // --- parámetros de fase ---
  float f12 = smoothstep(0.0, 1.0, uPhase);
  float f23 = smoothstep(1.0, 2.0, uPhase);

  float r = length(centeredUV);

  float sigmaMin = mix(mix(0.06, 0.04, smoothstep(0.9, 1.1, uPhase)), 0.54, smoothstep(1.9, 2.1, uPhase)); 
  float sigmaMax = mix(mix(0.1, 0.08, smoothstep(0.9, 1.1, uPhase)), 0.08, smoothstep(1.9, 2.1, uPhase));
  float sigma = mix(sigmaMin, sigmaMax, smoothstep(0.02, 0.6, uScroll));

  // --- forma radial principal ---
  float falloff = exp(- (r * r) / (1.0 * sigma * sigma));

  float phase23Factor = smoothstep(0.9, 1.1, uPhase) + smoothstep(1.9, 2.1, uPhase) - smoothstep(2.9, 3.0, uPhase);
  phase23Factor = clamp(phase23Factor, 0.0, 1.0);
  falloff = mix(falloff, pow(falloff, 2.5), phase23Factor);

  // --- ruido de desplazamiento ---
  float noiseFreq = mix(mix(3.5, 5.0, smoothstep(0.9, 1.1, uPhase)), 5.0, smoothstep(1.9, 2.1, uPhase));
  float noiseAmp = mix(mix(0.03, 0.05, smoothstep(0.9, 1.1, uPhase)), 0.05, smoothstep(1.9, 2.1, uPhase));
  float n = noise(centeredUV, noiseFreq) * noiseAmp;
  falloff += n * 0.2;

  // --- pulsación idle ---
  float phase3Factor = smoothstep(1.5, 2.0, uPhase);
  float idlePulsePhase1 = 1.0 + 0.05 * sin(uTime * 0.5);
  float idlePulsePhase3 = 10.0 + 0.05 * sin(uTime * 0.5);
  float idlePulse = mix(idlePulsePhase1, idlePulsePhase3, phase3Factor);

  float idleFactor = smoothstep(0.0, 0.1, 1.0 - uScroll);
  falloff *= mix(1.0, idlePulse, idleFactor);

  // --- mezcla de color ---
  float colorMixRange = mix(mix(0.2, 0.4, smoothstep(0.9, 1.1, uPhase)), 0.4, smoothstep(1.9, 2.1, uPhase));
  float colorMix = smoothstep(0.0, colorMixRange, r + n * 0.1);
  vec3 color = mix(uColorA, uColorB, colorMix);

  // --- desvanecimiento en bordes ---
  float edgeStart = mix(mix(50.0, 0.5, smoothstep(0.9, 1.1, uPhase)), 0.5, smoothstep(1.9, 2.1, uPhase));
  float edgeEnd = 0.3;
  float edgeFade = smoothstep(edgeStart, edgeEnd, max(abs(centeredUV.x), abs(centeredUV.y)));

  float alphaMult = mix(mix(1.5, 1.0, smoothstep(0.9, 10.1, uPhase)), 1.0, smoothstep(1.9, 2.1, uPhase));
  float alpha = falloff * edgeFade * alphaMult;
  alpha = clamp(alpha, 0.0, 1.0);

  // --- iridiscencia dinámica ---
  float phase2Mask = smoothstep(0.7, 1.2, uPhase) * (1.0 - smoothstep(1.2, 1.5, uPhase));
  vec3 iridescent = vec3(
    0.5 + 0.5 * sin(uTime + centeredUV.x * 5.0),
    0.5 + 0.5 * sin(uTime * 1.3 + centeredUV.y * 5.0),
    0.5 + 0.5 * sin(uTime * 1.7 + centeredUV.x * 3.0)
  );
  color = mix(color, iridescent, phase2Mask * 0.8);

  // --- textura perlada / detalle ---
  vec2 detailUV = vUv * 6.0 + vec2(sin(uTime*0.05), cos(uTime*0.08)) * 0.01;
  vec3 tex = texture2D(uTexture, detailUV).rgb;
  float luma = dot(tex, vec3(0.299, 0.587, 0.114));

  // modula brillo por luminancia de la textura (relieve suave)
  color *= mix(0.9, 1.15, luma);

  // mezcla sutil del color con la textura (mantiene tu paleta)
  color = mix(color, tex, 0.12);

  gl_FragColor = vec4(color, alpha);
}
`;
