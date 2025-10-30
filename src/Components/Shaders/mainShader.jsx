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




float noise(vec2 p, float freq) {
  return sin(p.x * freq + uTime * 0.4) * sin(p.y * freq + uTime * 0.3);
}

void main() {
  vec2 uv = vUv;
  vec2 centeredUV = uv * 2.0 - 1.0;

  float f12 = smoothstep(0.0, 1.0, uPhase);
  float f23 = smoothstep(1.0, 2.0, uPhase);

  float r = length(centeredUV);

  float sigmaMin = mix(mix(0.06, 0.04, smoothstep(0.9, 1.1, uPhase)), 0.54, smoothstep(1.9, 2.1, uPhase)); 
  float sigmaMax = mix(mix(0.1, 0.08, smoothstep(0.9, 1.1, uPhase)), 0.08, smoothstep(1.9, 2.1, uPhase));
  float sigma = mix(sigmaMin, sigmaMax, smoothstep(0.02, 0.6, uScroll));

  float falloff = exp(- (r * r) / (1.0 * sigma * sigma));

  float phase23Factor = smoothstep(0.9, 1.1, uPhase) + smoothstep(1.9, 2.1, uPhase) - smoothstep(2.9, 3.0, uPhase);
  phase23Factor = clamp(phase23Factor, 0.0, 1.0);
  falloff = mix(falloff, pow(falloff, 2.5), phase23Factor);

  float noiseFreq = mix(mix(3.5, 5.0, smoothstep(0.9, 1.1, uPhase)), 5.0, smoothstep(1.9, 2.1, uPhase));
  float noiseAmp = mix(mix(0.03, 0.05, smoothstep(0.9, 1.1, uPhase)), 0.05, smoothstep(1.9, 2.1, uPhase));
  float n = noise(centeredUV, noiseFreq) * noiseAmp;
  falloff += n * 0.2;

  float phase1Factor = smoothstep(0.0, 0.5, uPhase);
  float phase3Factor = smoothstep(1.5, 2.0, uPhase);

  float idlePulsePhase1 = 1.0 + 0.05 * sin(uTime * 0.5);
  float idlePulsePhase3 = 10.0 + 0.05 * sin(uTime * 0.5);
  float idlePulse = mix(idlePulsePhase1, idlePulsePhase3, phase3Factor);

  float idleFactor = smoothstep(0.0, 0.1, 1.0 - uScroll);
  falloff *= mix(1.0, idlePulse, idleFactor);

  vec2 centerDistUV = centeredUV;
  float rd = length(centerDistUV);

  float colorMixRange = mix(mix(0.2, 0.4, smoothstep(0.9, 1.1, uPhase)), 0.4, smoothstep(1.9, 2.1, uPhase));
  float colorMix = smoothstep(0.0, colorMixRange, rd + n * 0.1);
  vec3 color = mix(uColorA, uColorB, colorMix);

  float edgeStart = mix(mix(50.0, 0.5, smoothstep(0.9, 1.1, uPhase)), 0.5, smoothstep(1.9, 2.1, uPhase));
  float edgeEnd = 0.3;
  float edgeFade = smoothstep(edgeStart, edgeEnd, max(abs(centeredUV.x), abs(centeredUV.y)));

  float alphaMult = mix(mix(1.5, 1.0, smoothstep(0.9, 10.1, uPhase)), 1.0, smoothstep(1.9, 2.1, uPhase));
  float alpha = falloff * edgeFade * alphaMult;
  alpha = clamp(alpha, 0.0, 1.0);

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
