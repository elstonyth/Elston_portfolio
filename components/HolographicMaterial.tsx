import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HolographicMaterialProps {
  color?: THREE.Color | string;
  fresnelPower?: number;
  scanlineSpeed?: number;
  iridescence?: number;
  opacity?: number;
}

export const HolographicMaterial: React.FC<HolographicMaterialProps> = ({
  color = '#00ffff',
  fresnelPower = 3.0,
  scanlineSpeed = 1.0,
  iridescence = 0.5,
  opacity = 0.8,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uFresnelPower: { value: fresnelPower },
      uScanlineSpeed: { value: scanlineSpeed },
      uIridescence: { value: iridescence },
      uOpacity: { value: opacity },
    }),
    [color, fresnelPower, scanlineSpeed, iridescence, opacity]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uFresnelPower;
    uniform float uScanlineSpeed;
    uniform float uIridescence;
    uniform float uOpacity;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    // Simplex 2D noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    void main() {
      // 1. FRESNEL EFFECT (edge glow)
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), uFresnelPower);
      
      // 2. IRIDESCENT COLOR SHIFT (based on view angle)
      float angleShift = dot(viewDir, vNormal) * 0.5 + 0.5;
      vec3 iridescent1 = vec3(0.0, 1.0, 1.0); // Cyan
      vec3 iridescent2 = vec3(1.0, 0.0, 1.0); // Magenta
      vec3 iridescent3 = vec3(0.0, 1.0, 0.5); // Green-cyan
      
      vec3 iridescentColor = mix(
        mix(iridescent1, iridescent2, angleShift),
        iridescent3,
        sin(angleShift * 3.14159 + uTime * 0.5) * 0.5 + 0.5
      );
      
      // 3. ANIMATED SCANLINES (cyberpunk aesthetic)
      float scanline = sin(vWorldPosition.y * 20.0 - uTime * uScanlineSpeed * 5.0) * 0.5 + 0.5;
      scanline = pow(scanline, 10.0) * 0.3;
      
      // 4. NOISE TEXTURE (organic variation)
      float noise = snoise(vUv * 5.0 + uTime * 0.2) * 0.5 + 0.5;
      noise = pow(noise, 2.0) * 0.2;
      
      // 5. HOLOGRAPHIC INTERFERENCE PATTERN
      float interference = sin(vUv.x * 50.0 + uTime) * sin(vUv.y * 50.0 - uTime * 0.7);
      interference = interference * 0.5 + 0.5;
      interference = pow(interference, 5.0) * 0.15;
      
      // 6. COMBINE EFFECTS
      vec3 baseColor = uColor;
      
      // Add iridescence
      baseColor = mix(baseColor, iridescentColor, uIridescence * angleShift);
      
      // Add fresnel glow
      baseColor += fresnel * 0.5;
      
      // Add scanlines
      baseColor += scanline;
      
      // Add noise texture
      baseColor += noise;
      
      // Add interference
      baseColor += interference;
      
      // 7. ALPHA (edge glow + base opacity)
      float alpha = mix(uOpacity * 0.6, 1.0, fresnel * 0.8);
      alpha += scanline * 0.3;
      alpha = clamp(alpha, 0.0, 1.0);
      
      gl_FragColor = vec4(baseColor, alpha);
    }
  `;

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
      side={THREE.DoubleSide}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  );
};
