import React, { useEffect, useRef } from 'react';
import { safeBrowserAPI } from '@/lib/utils';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  twinkleSpeed: number;
  hue: number;
  layer: number;
}

export const ModernParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const animationRef = useRef<number | undefined>(undefined);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | undefined>(undefined);
  const { quality } = usePerformanceMonitor(30, false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = safeBrowserAPI.prefersReducedMotion();
    const isMobile = window.innerWidth < 768;
    if (prefersReducedMotion || isMobile) {
      return;
    }

    // Adaptive particle count - Reduced for better scroll performance
    const getParticleCount = (): number => {
      switch (quality) {
        case 'low':
          return 150;
        case 'medium':
          return 300;
        case 'high':
          return 500; // Reduced from 1200 for smoother scrolling
        default:
          return 300;
      }
    };

    // Pause animations during scroll for better performance
    const handleScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const initParticles = () => {
      const count = getParticleCount();
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
      particlesRef.current = particles;
    };

    const createParticle = (): Particle => {
      // 0: Background (tiny, static), 1: Mid (slow), 2: Foreground (brighter, drifting)
      const layer = Math.random() < 0.6 ? 0 : Math.random() < 0.9 ? 1 : 2;
      
      const baseOpacity = layer === 0 ? 0.1 + Math.random() * 0.2 
                       : layer === 1 ? 0.3 + Math.random() * 0.3 
                       : 0.5 + Math.random() * 0.4;

      // Rare blue/purple stars, mostly white
      const hue = Math.random() > 0.9 ? 200 + Math.random() * 60 : 0;

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (layer === 0 ? 0.02 : layer === 1 ? 0.05 : 0.1),
        vy: (Math.random() - 0.5) * (layer === 0 ? 0.02 : layer === 1 ? 0.05 : 0.1),
        size: layer === 0 ? 0.5 + Math.random() * 0.5 
            : layer === 1 ? 0.8 + Math.random() * 0.8 
            : 1.2 + Math.random() * 1.0,
        opacity: baseOpacity,
        baseOpacity: baseOpacity,
        twinkleSpeed: 0.02 + Math.random() * 0.05,
        hue,
        layer
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      // Reset transform matrix before scaling to prevent accumulation
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, isMoving: true };
      setTimeout(() => { mouseRef.current.isMoving = false; }, 100);
    };

    const drawParticle = (particle: Particle, time: number) => {
      const { x, y, size, opacity, hue } = particle;
      
      // Twinkle effect
      const twinkle = Math.sin(time * particle.twinkleSpeed + particle.x) * 0.3;
      const currentOpacity = Math.max(0, Math.min(1, opacity + twinkle));

      // Star glow for foreground stars
      if (particle.layer === 2) {
        ctx.shadowBlur = size * 4;
        ctx.shadowColor = hue > 0 ? `hsla(${hue}, 80%, 70%, 0.5)` : 'rgba(255, 255, 255, 0.5)';
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = hue > 0 
        ? `hsla(${hue}, 70%, 85%, ${currentOpacity})` 
        : `rgba(255, 255, 255, ${currentOpacity})`;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    };

    const updateParticle = (particle: Particle) => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Parallax from mouse
      if (mouseRef.current.x !== 0) {
        const parallaxX = (mouseRef.current.x - width / 2) * 0.00005 * (particle.layer + 1);
        const parallaxY = (mouseRef.current.y - height / 2) * 0.00005 * (particle.layer + 1);
        particle.x += parallaxX;
        particle.y += parallaxY;
      }
      
      // Infinite wrapping
      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;
    };

    let lastFrameTime = 0;
    const targetFPS = 30; // Limit to 30 FPS for smoother scrolling
    const frameInterval = 1000 / targetFPS;

    const animate = (time: number) => {
      if (!canvas || !ctx) return;
      
      // Skip frames during scroll for better performance
      if (isScrollingRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Throttle to target FPS
      const deltaTime = time - lastFrameTime;
      if (deltaTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = time - (deltaTime % frameInterval);

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.clearRect(0, 0, width, height);
      
      particlesRef.current.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle, time * 0.001);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    // initParticles() removed - already called inside resize()
    
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    animate(0);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [quality]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ 
        background: 'transparent',
        willChange: 'transform',
        contain: 'strict',
      }}
      aria-hidden="true"
    />
  );
};
