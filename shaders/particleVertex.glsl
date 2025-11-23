uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;

attribute vec3 initialPosition;
attribute float aRandom;
attribute float aLayer;

varying vec3 vColor;
varying float vDistance;
varying float vLayer;

// Simplified noise function (much smaller than full Simplex)
float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  
  return mix(
    mix(mix(hash(p + vec3(0,0,0)), hash(p + vec3(1,0,0)), f.x),
        mix(hash(p + vec3(0,1,0)), hash(p + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(p + vec3(0,0,1)), hash(p + vec3(1,0,1)), f.x),
        mix(hash(p + vec3(0,1,1)), hash(p + vec3(1,1,1)), f.x), f.y),
    f.z);
}

void main() {
  vec3 pos = initialPosition;
  
  float layerSpeed = mix(0.5, 1.5, aLayer / 2.0);
  float t = uTime * 0.3 * layerSpeed;
  
  // Simplified wave motion
  float wave1 = noise(pos * 0.8 + t * 0.5) * 0.4;
  float wave2 = noise(pos * 1.5 + t) * 0.2;
  
  pos.x += wave1 * layerSpeed;
  pos.y += wave2 * layerSpeed;
  pos.z += (wave1 + wave2) * 0.1;
  
  // Mouse interaction
  vec2 mouseVec = pos.xy - uMouse * vec2(4.0, 2.0);
  float mouseDist = length(mouseVec);
  float influenceRadius = 2.5;
  
  if (mouseDist < influenceRadius) {
    float force = (influenceRadius - mouseDist) / influenceRadius;
    force = pow(force, 2.0);
    vec2 pushDir = normalize(mouseVec);
    
    float parallaxStrength = mix(0.3, 1.2, aLayer / 2.0);
    pos.xy += pushDir * force * 1.2 * uHover * parallaxStrength;
    pos.z += force * 0.6 * uHover * parallaxStrength;
  }
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  // Dynamic size
  float layerSize = mix(5.0, 12.0, aLayer / 2.0);
  float sizeState = smoothstep(2.5, 0.0, mouseDist) * uHover;
  float depthSize = 1.0 / -mvPosition.z;
  
  gl_PointSize = (layerSize + sizeState * 8.0) * depthSize;
  
  vDistance = mouseDist;
  vLayer = aLayer;
}
