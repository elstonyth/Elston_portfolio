import React, { useEffect, useRef } from 'react';

export const AnimatedGrain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Defer initialization using requestIdleCallback for better loading performance
    const initGrain = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      let animationId: number;
      let frame = 0;

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      resize();
      window.addEventListener('resize', resize);

      const drawGrain = () => {
        try {
          const imageData = ctx.createImageData(canvas.width, canvas.height);
          const buffer = new Uint32Array(imageData.data.buffer);

        // Generate grain pattern
        for (let i = 0; i < buffer.length; i++) {
          // Use frame for animation
          const noise = (Math.random() + frame * 0.001) % 1;
          
          if (noise > 0.97) {
            // White grain
            const intensity = Math.floor((noise - 0.97) / 0.03 * 255);
            buffer[i] = (intensity << 24) | (255 << 16) | (255 << 8) | 255;
          } else if (noise < 0.03) {
            // Black grain
            const intensity = Math.floor((0.03 - noise) / 0.03 * 128);
            buffer[i] = (intensity << 24) | 0;
          } else {
            // Transparent
            buffer[i] = 0;
          }
        }

          ctx.putImageData(imageData, 0, 0);
        } catch (error) {
          // Silently handle drawing errors
        }
      };

      const animate = () => {
        frame++;
        
        // Update grain every 2 frames for performance
        if (frame % 2 === 0) {
          drawGrain();
        }

        animationId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationId);
      };
    };

    // Use requestIdleCallback with fallback to setTimeout
    const startGrain = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(initGrain, { timeout: 2000 });
      } else {
        setTimeout(initGrain, 100);
      }
    };

    startGrain();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9] pointer-events-none opacity-[0.015]"
      style={{ mixBlendMode: 'overlay' }}
    />
  );
};
