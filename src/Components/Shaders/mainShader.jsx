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
uniform vec2 uResolution;

// --- ruido 2D base ---
float noise(vec2 p, float freq) {
  return sin(p.x * freq + 1.0) * sin(p.y * freq + 1.0); 
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

// --- pseudo partículas flotantes ---
float softDust(vec2 uv, float t) {
  float d = fbm(vec3(uv * 10.5 + t * 0.05, t * 0.1));
  return smoothstep(0.72, 1.0, d); // sólo puntos brillantes
}

// --- stars random ocasionales ---
float starField(vec2 uv) {
  float hash = fract(sin(dot(uv * 800.0, vec2(12.9898,78.233))) * 43758.5453);
  return step(0.996, hash); // muy pocos puntos
}

void main() {
  vec2 uv = vUv;
  vec2 centeredUV = uv * 2.0 - 1.0;

  // --- parámetros de fase ---
  float f12 = smoothstep(0.0, 1.0, uPhase);
  float f23 = smoothstep(1.0, 2.0, uPhase);

  float r = length(centeredUV);

  float sigmaMin = mix(mix(0.03, 0.04, smoothstep(0.9, 1.1, uPhase)), 0.54, smoothstep(1.9, 2.1, uPhase)); 
  float sigmaMax = mix(mix(0.1, 0.08, smoothstep(0.9, 1.1, uPhase)), 0.08, smoothstep(1.9, 2.1, uPhase));
  float sigma = mix(sigmaMin, sigmaMax, smoothstep(0.02, 0.6, uScroll));
    
  
  //Forma radial 
  float falloff = exp(- (r * r) / (1.8 * sigma * sigma));

  float phase23Factor = smoothstep(0.09, 1.1, uPhase) + smoothstep(1.9, 2.1, uPhase) - smoothstep(2.9, 3.0, uPhase);
  phase23Factor = clamp(phase23Factor, 0.0, 1.0);
  falloff = mix(falloff, pow(falloff, 2.5), phase23Factor);

  // Emanacion de las nebulosas
  float noiseFreq = mix(mix(0.5, 5.0, smoothstep(0.9, 1.1, uPhase)), 5.0, smoothstep(1.9, 2.1, uPhase));
  float noiseAmp = mix(mix(0.08, 0.05, smoothstep(10.9, 1.1, uPhase)), 0.05, smoothstep(1.9, 2.1, uPhase));
  float n = noise(centeredUV, noiseFreq) * noiseAmp;
  falloff += n * 1.5; ///aura alrededor de las nebulosas circulares

  // --- pulsación idle ---
  float phase3Factor = smoothstep(1.5, 2.0, uPhase);
  float idlePulsePhase1 = 1.0 + 0.5 * sin(0.5);
  float idlePulsePhase3 = 10.0 + 0.05 * sin(0.5);
  float idlePulse = mix(idlePulsePhase1, idlePulsePhase3, phase3Factor);

  float idleFactor = smoothstep(0.2, 0.8, 1.0 - uScroll);
  falloff *= mix(1.0, idlePulse, idleFactor);

  // --- mezcla de color ---
  float colorMixRange = mix(mix(0.8, 0.4, smoothstep(0.9, 1.1, uPhase)), 0.4, smoothstep(1.9, 2.1, uPhase));
  //más espacial
  float colorMix = smoothstep(3.0, colorMixRange, r + n * 8.1);
  vec3 color = mix(uColorA, uColorB, colorMix);

  // --- desvanecimiento en bordes ---
  //  float edgeStart = mix(mix(5.0, 5.5, smoothstep(50.9, 1.1, uPhase)), 10.5, smoothstep(1.9, 2.1, uPhase));
  float edgeStart = 0.7;  
  float edgeEnd = 0.0001;
//float edgeFade = pow(smoothstep(edgeStart, edgeEnd, length(centeredUV)), 2.0); // radial
float edgeFade = pow(smoothstep(edgeStart, edgeEnd, length(centeredUV)), 2.0); // radial


    float edgeDist = smoothstep(edgeStart, edgeEnd, r);

    float edgeNoise = fbm(vec3(centeredUV * 40.0 + sin(uTime * 0.2), uTime * 1.1));
    edgeNoise = mix(0.8, 1.0, edgeNoise);



  float alphaMult = mix(mix(1.5, 1.0, smoothstep(0.9, 10.1, uPhase)), 1.0, smoothstep(1.9, 2.1, uPhase));
  float alpha = falloff * edgeFade * edgeNoise * alphaMult;

  alpha = clamp(alpha, 0.1, 0.81); //// fondo blurry

// --- iridiscencia fría (azul-violeta perlada, lenta y sin quemarse)
float iridescenceIntensity = 0.38; // mezcla más sutil
float hueShift = sin(uTime * 0.1) * 0.15; // desplazamiento temporal más lento y leve

// tonos base: mezcla azul profundo y violeta
vec3 baseIri = vec3(0.22, 0.18, 0.42);   // violeta azulado más oscuro
vec3 altIri  = vec3(0.12, 0.28, 0.65);   // azul más brillante pero controlado

// oscilación muy suave entre ambos tonos (movimiento más lento)
vec3 iridescent = mix(
  baseIri,
  altIri,
  0.05 + 0.5 * sin(uTime * 0.025 + centeredUV.x * 3.5 + centeredUV.y * 2.8)
);

// modulamos brillo con distancia al centro (falloff más amplio y gradual)
float falloffIri = smoothstep(0.0, 1.2, 1.0 - r * 0.6);

// leve vibración cromática tipo perlado, pero más amortiguada
iridescent += 0.18 * vec3(
  sin(uTime * 0.8 + centeredUV.x * 40.0),
  sin(uTime * 0.7 + centeredUV.y * 30.0),
  sin(uTime * 0.9 + centeredUV.x * 50.0)
);

// limitar intensidad general y evitar “quemado”
iridescent = clamp(iridescent, 0.0, 0.45);

// aplicamos el falloff y mezcla con el color base
iridescent *= falloffIri;
color = mix(color, iridescent, iridescenceIntensity);

// --- textura detalle grainy ---
vec2 detailUV = (vUv - 5.5) * 25.58 + 0.8; // tamaño textura
detailUV += vec2(sin(uTime * 0.02), cos(uTime * 0.015)) * 1.2;


//textura
vec3 tex = texture2D(uTexture, detailUV).rgb;
float luma = dot(tex, vec3(-1.299, -0.587, -0.814));

  // modula brillo por luminancia de la textura
  color *= mix(1.8, 1.5, luma);

  // mezcla sutil del color con la textura
  color = mix(color, tex, 0.22);
  
// --- Grain basado en gl_FragCoord ---
float grain = fract(sin(dot(gl_FragCoord.xy ,vec2(2.9898,78.233))) * 43758.5453 + uTime * 18.0);
grain = mix(0.95, 1.05, grain); // ajustar contraste
color *= grain;

// // --- partículas flotantes tipo polvo ---
//  float dust = smoothstep(1.8, 1.2, fbm(vec3(centeredUV * 6.0, uTime * 0.5)));
//  color += vec3(0.2, 0.98, 0.3) * dust * 0.9;

// // --- estrellas aleatorias --- 
// float stars = starField(vUv * uResolution * 0.000002);
// color += vec3(0.2, 1.2, 1.4) * stars;


  gl_FragColor = vec4(color, alpha);
}
`;
