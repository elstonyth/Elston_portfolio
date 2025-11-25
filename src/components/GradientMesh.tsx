import React, { useEffect, useRef } from 'react';

export const GradientMesh: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      return;
    }

    let animationId: number;
    let time = 0;
    let isScrolling = false;
    let scrollTimeout: number | undefined;
    let lastFrameTime = 0;
    const targetFPS = 24; // Lower FPS for gradient (doesn't need high fps)
    const frameInterval = 1000 / targetFPS;

    // Pause during scroll
    const handleScroll = () => {
      isScrolling = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
      }, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Deep Void Palette
    const colors = [
      { r: 10, g: 10, b: 30 },   // Deep Void
      { r: 20, g: 0, b: 40 },    // Dark Nebula
      { r: 0, g: 20, b: 50 },    // Deep Ocean
      { r: 30, g: 0, b: 60 },    // Cosmic Dust
    ];

    const drawGradient = () => {
      try {
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        // Base Void
        ctx.fillStyle = '#030305';
        ctx.fillRect(0, 0, width, height);

        // Nebula Cloud 1
        const gradient1 = ctx.createRadialGradient(
          width * 0.3 + Math.sin(time * 0.2) * 100,
          height * 0.4 + Math.cos(time * 0.15) * 100,
          0,
          width * 0.3,
          height * 0.4,
          width * 0.8
        );
        
        // Nebula Cloud 2
        const gradient2 = ctx.createRadialGradient(
          width * 0.7 + Math.cos(time * 0.18) * 120,
          height * 0.6 + Math.sin(time * 0.22) * 80,
          0,
          width * 0.7,
          height * 0.6,
          width * 0.7
        );

        const c1 = colors[0];
        const c2 = colors[1];

        gradient1.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.3)`);
        gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');

        gradient2.addColorStop(0, `rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.2)`);
        gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.globalCompositeOperation = 'screen';
        
        ctx.fillStyle = gradient1;
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = gradient2;
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'source-over';
        
        // Vignette for depth
        const vignette = ctx.createRadialGradient(
          width / 2, height / 2, width * 0.3,
          width / 2, height / 2, width
        );
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
        
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);

      } catch (error) {
        // Canvas rendering errors are non-critical - fail silently in production
        if (import.meta.env.DEV) {
          console.warn('GradientMesh render error:', error);
        }
      }
    };

    const animate = (frameTime: number) => {
      // Skip during scroll
      if (isScrolling) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Throttle frame rate
      const deltaTime = frameTime - lastFrameTime;
      if (deltaTime < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = frameTime - (deltaTime % frameInterval);

      if (!prefersReducedMotion) {
        time += 0.005; // Very slow movement
      }
      drawGradient();
      animationId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{ 
        willChange: 'transform',
        contain: 'strict',
      }}
    />
  );
};
