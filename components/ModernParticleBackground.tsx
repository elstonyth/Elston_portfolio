import React, { useEffect, useRef, useState } from 'react';
import { safeBrowserAPI } from '../lib/utils';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

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
  const animationRef = useRef<number>();
  const [isScrolling, setIsScrolling] = useState(false);
  const { quality } = usePerformanceMonitor(30, isScrolling);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = safeBrowserAPI.prefersReducedMotion();
    if (prefersReducedMotion) return;

    // Adaptive particle count - Increased for dense starfield
    const getParticleCount = (): number => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) return quality === 'low' ? 150 : 300;
      switch (quality) {
        case 'low': return 400;
        case 'medium': return 800;
        case 'high': return 1500; // Dense starfield on high end
        default: return 800;
      }
    };

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

    const animate = (time: number) => {
      if (!canvas || !ctx) return;
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
    initParticles();
    
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    animate(0);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [quality]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    />
  );
};
