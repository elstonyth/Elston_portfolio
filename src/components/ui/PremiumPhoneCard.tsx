import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PremiumPhoneCardProps {
  className?: string;
}

// WebGL Black Hole Shader Component
const BlackHoleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Vertex shader
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader - Swirling vortex/black hole effect
    const fsSource = `
      precision highp float;
      uniform float t;
      uniform vec2 r;

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
        
        float angle = atan(uv.y, uv.x);
        float dist = length(uv);
        
        // Swirl effect
        float swirl = sin(dist * 10.0 - t * 2.0 + angle * 3.0) * 0.5 + 0.5;
        float spiral = sin(angle * 5.0 + dist * 8.0 - t * 1.5) * 0.5 + 0.5;
        
        // Black hole center
        float hole = smoothstep(0.0, 0.4, dist);
        float ring = smoothstep(0.3, 0.5, dist) * smoothstep(0.8, 0.5, dist);
        
        // Color mixing
        vec3 color1 = vec3(0.4, 0.2, 0.8); // Purple
        vec3 color2 = vec3(0.2, 0.6, 1.0); // Cyan
        vec3 color3 = vec3(0.8, 0.3, 0.6); // Pink
        
        vec3 col = mix(color1, color2, swirl);
        col = mix(col, color3, spiral * 0.5);
        col *= ring * 1.5;
        col += vec3(0.1, 0.15, 0.3) * (1.0 - dist * 0.5);
        
        // Glow
        col += color2 * 0.3 * exp(-dist * 2.0);
        
        // Darken center
        col *= hole;
        
        // Outer fade
        col *= smoothstep(1.5, 0.8, dist);
        
        gl_FragColor = vec4(col, 1.0);
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
    if (!program) return;
    
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 't');
    const resolutionLocation = gl.getUniformLocation(program, 'r');

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

    // Resize
    const resize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    resize();

    const startTime = performance.now();
    
    // Render loop
    const render = () => {
      const delta = (performance.now() - startTime) / 1000;
      gl.uniform1f(timeLocation, delta);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationRef.current = requestAnimationFrame(render);
    };
    
    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full rounded-2xl"
      style={{ display: 'block' }}
    />
  );
};

export const PremiumPhoneCard: React.FC<PremiumPhoneCardProps> = ({ className = '' }) => {
  return (
    <div className={`premium-phone-wrapper ${className}`} style={{ willChange: 'transform' }}>
      {/* Main background glow */}
      <div 
        className="absolute -inset-8 rounded-[60px] opacity-40 blur-3xl pointer-events-none"
        style={{
          background: 'linear-gradient(40deg, #8983F7, #A3DAFB 70%)',
          willChange: 'opacity'
        }}
      />

      {/* Phone container */}
      <motion.div 
        className="premium-phone relative z-10 w-72 h-[17rem] rounded-[40px] flex flex-col overflow-hidden bg-black"
        style={{
          boxShadow: '0 25px 80px rgba(137, 131, 247, 0.25), 0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
        whileHover={{ 
          y: -5,
          boxShadow: '0 35px 100px rgba(137, 131, 247, 0.35), 0 15px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-3 text-xs text-white/40 z-10">
          <span className="font-medium tracking-wide">4:20</span>
          <div className="flex items-center gap-2">
            <div 
              className="w-0 h-0 border-solid"
              style={{
                borderWidth: '0 5px 6px 5px',
                borderColor: 'transparent transparent rgba(255,255,255,0.4) transparent',
                transform: 'rotate(135deg)'
              }}
            />
            <div className="w-4 h-2 rounded-sm bg-white/40" />
          </div>
        </div>

        {/* Black Hole Canvas */}
        <div className="flex-1 overflow-hidden rounded-[40px]">
          <BlackHoleCanvas />
        </div>

        {/* Bottom notch indicator */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2 z-10">
          <div className="w-32 h-1 rounded-full bg-white/20" />
        </div>
      </motion.div>

      {/* Static decorative dots */}
      <div 
        className="absolute w-1.5 h-1.5 rounded-full pointer-events-none opacity-40"
        style={{ background: '#A3DAFB', left: '20%', top: '15%' }}
      />
      <div 
        className="absolute w-1 h-1 rounded-full pointer-events-none opacity-30"
        style={{ background: '#A3DAFB', left: '75%', top: '25%' }}
      />
    </div>
  );
};

export default PremiumPhoneCard;
