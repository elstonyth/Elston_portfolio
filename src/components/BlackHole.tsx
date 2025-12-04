import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { safeBrowserAPI } from '@/lib/utils';

interface BlackHoleProps {
  className?: string;
  size?: number;
}

export const BlackHole: React.FC<BlackHoleProps> = ({ className = '', size = 280 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse parallax (desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 50, damping: 20 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);
  
  // Scroll-linked effects
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);
  const scrollScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  // Check for reduced motion preference and mobile
  const prefersReducedMotion = safeBrowserAPI.prefersReducedMotion();
  const isMobile = safeBrowserAPI.isTouchDevice();

  // Mouse move handler for parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMobile || prefersReducedMotion) return;
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Subtle parallax offset (max 8px movement)
    const offsetX = ((e.clientX - centerX) / window.innerWidth) * 8;
    const offsetY = ((e.clientY - centerY) / window.innerHeight) * 8;
    
    mouseX.set(offsetX);
    mouseY.set(offsetY);
  }, [isMobile, prefersReducedMotion, mouseX, mouseY]);

  useEffect(() => {
    // Add mouse listener for parallax
    if (!isMobile && !prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, isMobile, prefersReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size for proper rendering
    canvas.width = size * (window.devicePixelRatio || 1);
    canvas.height = size * (window.devicePixelRatio || 1);

    const gl = canvas.getContext('webgl');
    if (!gl) {
      setWebglFailed(true);
      return;
    }

    // Vertex shader
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader - Premium Black Hole with accretion disk and cyan/purple palette
    const fsSource = `
      precision highp float;
      uniform float t;
      uniform vec2 r;
      uniform float pulse;
      
      // Custom tanh function for vec2
      vec2 myTanh(vec2 x) {
        vec2 ex = exp(x);
        vec2 emx = exp(-x);
        return (ex - emx) / (ex + emx);
      }
      
      void main() {
        vec4 o_bg = vec4(0.0);
        vec4 o_anim = vec4(0.0);
        vec4 o_disk = vec4(0.0);
        
        vec2 uv = (gl_FragCoord.xy * 2.0 - r) / r.y;

        // ---------------------------
        // Accretion Disk - Glowing ring with rotation
        // ---------------------------
        {
          // Tilt the disk for 3D perspective
          vec2 diskUV = uv;
          diskUV.y *= 2.5; // Squash vertically for tilt effect
          
          float dist = length(diskUV);
          float angle = atan(diskUV.y, diskUV.x);
          
          // Rotating ring at ~70% radius
          float ringRadius = 0.72;
          float ringWidth = 0.08;
          float ring = smoothstep(ringWidth, 0.0, abs(dist - ringRadius));
          
          // Add rotation and variation to the ring
          float rotatedAngle = angle + t * 0.15;
          float variation = sin(rotatedAngle * 3.0) * 0.3 + sin(rotatedAngle * 7.0 + t * 0.2) * 0.15;
          ring *= (0.7 + variation);
          
          // Asymmetric brightness (brighter on one side - Doppler effect)
          float asymmetry = 0.6 + 0.4 * sin(angle + 1.57);
          ring *= asymmetry;
          
          // Cyan-purple gradient for the disk
          vec3 diskColor = mix(
            vec3(0.13, 0.83, 0.93), // Cyan
            vec3(0.55, 0.36, 0.98), // Purple
            0.5 + 0.5 * sin(rotatedAngle * 2.0)
          );
          
          o_disk = vec4(diskColor * ring * 0.6, ring * 0.5);
        }

        // ---------------------------
        // Background (Image) Layer - Event horizon ring
        // ---------------------------
        {
          vec2 p_img = uv * mat2(1.0, -1.0, 1.0, 1.0);
          vec2 l_val = myTanh(p_img * 5.0 + 2.0);
          l_val = min(l_val, l_val * 3.0);
          vec2 clamped = clamp(l_val, -2.0, 0.0);
          float diff_y = clamped.y - l_val.y;
          float safe_px = abs(p_img.x) < 0.001 ? 0.001 : p_img.x;
          float term = (0.1 - max(0.01 - dot(p_img, p_img) / 200.0, 0.0) * (diff_y / safe_px))
                       / abs(length(p_img) - 0.7);
          o_bg += vec4(term);
          o_bg *= max(o_bg, vec4(0.0));
        }

        // ---------------------------
        // Foreground (Animation) Layer - Slower, smoother motion
        // ---------------------------
        {
          vec2 p_anim = uv / 0.7;
          vec2 d = vec2(-1.0, 1.0);
          float denom = 0.1 + 5.0 / dot(5.0 * p_anim - d, 5.0 * p_anim - d);
          vec2 c = p_anim * mat2(1.0, 1.0, d.x / denom, d.y / denom);
          vec2 v = c;
          
          // Slower rotation: t * 0.08 instead of t * 0.2
          v *= mat2(cos(log(length(v)) + t * 0.08 + vec4(0.0, 33.0, 11.0, 0.0))) * 5.0;
          
          vec4 animAccum = vec4(0.0);
          // Reduced iterations for smoother look (7 instead of 9)
          for (int i = 1; i <= 7; i++) {
            float fi = float(i);
            animAccum += sin(vec4(v.x, v.y, v.y, v.x)) + vec4(1.0);
            // Slower inner motion: t * 0.4 instead of just t
            v += 0.7 * sin(vec2(v.y, v.x) * fi + t * 0.4) / fi + 0.5;
          }
          
          // Cyan/purple color mapping
          vec4 colorMap = vec4(0.8, 0.2, -0.6, 0.0);
          
          vec4 animTerm = 1.0 - exp(-exp(c.x * colorMap)
                            / animAccum
                            / (0.1 + 0.1 * pow(length(sin(v / 0.3) * 0.2 + c * vec2(1.0, 2.0)) - 1.0, 2.0))
                            / (1.0 + 7.0 * exp(0.3 * c.y - dot(c, c)))
                            / (0.03 + abs(length(p_anim) - 0.7)) * 0.15);
          o_anim += animTerm;
        }

        // ---------------------------
        // Gravitational Lensing Edge Glow
        // ---------------------------
        float dist = length(uv);
        float lensingGlow = smoothstep(0.8, 0.6, dist) * smoothstep(0.4, 0.55, dist);
        vec3 lensColor = mix(vec3(0.9, 0.95, 1.0), vec3(0.13, 0.83, 0.93), 0.3);
        vec4 o_lens = vec4(lensColor * lensingGlow * 0.25, lensingGlow * 0.2);

        // ---------------------------
        // Blend all layers with breathing pulse
        // ---------------------------
        vec4 coreColor = mix(o_bg, o_anim, 0.55) * 1.3;
        vec4 finalColor = coreColor + o_disk + o_lens;
        
        // Apply breathing pulse (subtle brightness variation)
        finalColor.rgb *= (1.0 + pulse * 0.08);
        
        // Add subtle vignette darkening at edges
        vec2 vignetteUV = gl_FragCoord.xy / r;
        float vignette = 1.0 - smoothstep(0.3, 0.9, length(vignetteUV - 0.5) * 1.4);
        finalColor *= vignette * 0.3 + 0.7;
        
        finalColor = clamp(finalColor, 0.0, 1.0);
        gl_FragColor = finalColor;
      }
    `;

    // Shader compilation
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      if (!vertexShader || !fragmentShader) return null;
      
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return null;
      }
      return program;
    }

    const program = createProgram(gl, vsSource, fsSource);
    if (!program) {
      setWebglFailed(true);
      return;
    }
    
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 't');
    const resolutionLocation = gl.getUniformLocation(program, 'r');
    const pulseLocation = gl.getUniformLocation(program, 'pulse');

    // Full-screen quad
    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Enable transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Resize with balanced quality/performance
    const resize = () => {
      // Lower DPR cap on mobile for performance
      const maxDpr = isMobile ? 1.5 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    resize();

    const startTime = performance.now();
    let isTabVisible = true;
    
    // Tab visibility handling - pause when tab not visible
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Render loop with performance optimizations
    let lastFrameTime = 0;
    const targetFPS = prefersReducedMotion ? 15 : (isMobile ? 30 : 60);
    const frameInterval = 1000 / targetFPS;
    
    const render = (currentTime: number) => {
      // Skip frames when tab not visible or to limit FPS
      if (!isTabVisible) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }
      
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = currentTime - (elapsed % frameInterval);
      
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      // Slower time progression for reduced motion
      const timeMultiplier = prefersReducedMotion ? 0.3 : 1;
      const delta = ((performance.now() - startTime) / 1000) * timeMultiplier;
      
      // Breathing pulse: subtle sine wave every ~12 seconds
      const pulse = Math.sin(delta * 0.52) * 0.5 + 0.5;
      
      gl.uniform1f(timeLocation, delta);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(pulseLocation, pulse);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationRef.current = requestAnimationFrame(render);
    };
    
    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [size, isMobile, prefersReducedMotion]);

  // CSS fallback for when WebGL is not available - cyan/purple palette
  if (webglFailed) {
    return (
      <motion.div 
        className={`relative ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: size, height: size }}
      >
        {/* Outer glow - cyan/purple */}
        <div 
          className="absolute -inset-4 rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)',
          }}
        />
        {/* CSS-only black hole fallback */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(34,211,238,0.25) 0%, rgba(139,92,246,0.15) 25%, rgba(30,20,50,0.9) 45%, #000 65%)',
            boxShadow: '0 0 60px rgba(34,211,238,0.3), 0 0 100px rgba(139,92,246,0.2), inset 0 0 40px rgba(0,0,0,0.9)',
          }}
        />
        {/* Inner dark core */}
        <div className="absolute inset-[20%] rounded-full bg-black"
          style={{ boxShadow: 'inset 0 0 30px rgba(139,92,246,0.2), 0 0 20px rgba(0,0,0,0.8)' }}
        />
        {/* Subtle animated ring */}
        <motion.div 
          className="absolute inset-[10%] rounded-full border border-cyan-500/20"
          animate={{ 
            rotate: 360,
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      ref={containerRef}
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ 
        width: size, 
        height: size,
        x: parallaxX,
        y: parallaxY,
        opacity: scrollOpacity,
        scale: scrollScale,
      }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect behind - cyan/purple palette with hover boost */}
      <motion.div 
        className="absolute -inset-8 blur-3xl transition-all duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(139,92,246,0.15) 40%, transparent 70%)',
        }}
        animate={{
          opacity: isHovered ? [0.7, 0.9, 0.7] : [0.5, 0.7, 0.5],
          scale: isHovered ? [1.05, 1.12, 1.05] : [1, 1.05, 1],
        }}
        transition={{
          duration: isHovered ? 4 : 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Secondary outer glow ring - enhanced on hover */}
      <motion.div 
        className="absolute -inset-4 rounded-full transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, transparent 50%, rgba(139,92,246,0.1) 70%, transparent 90%)',
        }}
        animate={{ opacity: isHovered ? 0.7 : 0.4 }}
      />
      
      {/* Hover glow burst */}
      <motion.div 
        className="absolute -inset-12 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 60%)',
        }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 0.9,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </motion.div>
  );
};

export default BlackHole;
