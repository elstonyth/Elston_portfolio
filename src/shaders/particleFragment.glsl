varying float vDistance;
varying float vLayer;
uniform float uTime;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  
  if (dist > 0.5) discard;
  
  // Soft circular particle with glow
  float core = 1.0 - smoothstep(0.0, 0.3, dist);
  float glow = 1.0 - smoothstep(0.0, 0.5, dist);
  glow = pow(glow, 1.5);
  
  // Color palette (cyan to purple)
  vec3 deepPurple = vec3(0.4, 0.2, 1.0);
  vec3 cyan = vec3(0.0, 0.9, 1.0);
  vec3 electricBlue = vec3(0.2, 0.6, 1.0);
  
  // Mouse interaction color
  float mouseInfluence = smoothstep(2.0, 0.0, vDistance);
  
  // Base color (depth-based gradient)
  vec3 baseColor = mix(deepPurple, electricBlue, vLayer / 2.0);
  baseColor = mix(baseColor, cyan, mouseInfluence * 0.6);
  
  // Breathing effect
  float breath = sin(uTime * 1.2) * 0.15 + 0.85;
  
  // Layer brightness
  float layerBrightness = mix(0.5, 1.2, vLayer / 2.0);
  
  vec3 finalColor = baseColor * breath * layerBrightness;
  
  // Alpha
  float alpha = mix(glow * 0.6, core, 0.5);
  float depthFade = mix(0.6, 1.0, vLayer / 2.0);
  alpha *= depthFade;
  alpha += mouseInfluence * 0.3;
  alpha = clamp(alpha, 0.0, 1.0);
  
  gl_FragColor = vec4(finalColor, alpha);
}
