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
  twinklePhase: number;
  hue: number;
  saturation: number;
  layer: number;
  pulseSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export const ModernParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
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

    // Adaptive particle count - Balanced for performance
    const getParticleCount = (): number => {
      switch (quality) {
        case 'low':
          return 120;
        case 'medium':
          return 280;
        case 'high':
          return 450;
        default:
          return 280;
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
      const layer = Math.random() < 0.5 ? 0 : Math.random() < 0.85 ? 1 : 2;
      
      const baseOpacity = layer === 0 ? 0.15 + Math.random() * 0.25 
                       : layer === 1 ? 0.35 + Math.random() * 0.35 
                       : 0.6 + Math.random() * 0.4;

      // More colorful stars - cyan, purple, pink, blue, white
      const colorRand = Math.random();
      let hue = 0;
      let saturation = 0;
      if (colorRand > 0.7) {
        // Colored stars (30%)
        const colorType = Math.random();
        if (colorType < 0.3) {
          hue = 185 + Math.random() * 20; // Cyan
          saturation = 70 + Math.random() * 30;
        } else if (colorType < 0.6) {
          hue = 260 + Math.random() * 30; // Purple
          saturation = 60 + Math.random() * 30;
        } else if (colorType < 0.8) {
          hue = 320 + Math.random() * 30; // Pink
          saturation = 50 + Math.random() * 30;
        } else {
          hue = 210 + Math.random() * 30; // Blue
          saturation = 60 + Math.random() * 30;
        }
      }

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (layer === 0 ? 0.03 : layer === 1 ? 0.08 : 0.15),
        vy: (Math.random() - 0.5) * (layer === 0 ? 0.03 : layer === 1 ? 0.08 : 0.15),
        size: layer === 0 ? 0.6 + Math.random() * 0.6 
            : layer === 1 ? 1.0 + Math.random() * 1.0 
            : 1.5 + Math.random() * 1.2,
        opacity: baseOpacity,
        baseOpacity: baseOpacity,
        twinkleSpeed: 0.015 + Math.random() * 0.04,
        twinklePhase: Math.random() * Math.PI * 2,
        hue,
        saturation,
        layer,
        pulseSpeed: 0.5 + Math.random() * 1.5
      };
    };

    const createShootingStar = (): ShootingStar => {
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5; // Mostly diagonal
      const speed = 8 + Math.random() * 6;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 50 + Math.random() * 80,
        opacity: 0.8 + Math.random() * 0.2,
        life: 0,
        maxLife: 60 + Math.random() * 40
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
      const { x, y, size, hue, saturation, layer, twinklePhase, pulseSpeed } = particle;
      
      // Enhanced twinkle effect with phase offset
      const twinkle = Math.sin(time * particle.twinkleSpeed + twinklePhase) * 0.35;
      const pulse = Math.sin(time * pulseSpeed) * 0.1;
      const currentOpacity = Math.max(0, Math.min(1, particle.baseOpacity + twinkle + pulse));

      // Glow for stars - optimized shadowBlur values
      if (layer === 2) {
        ctx.shadowBlur = size * 3;
        ctx.shadowColor = hue > 0 
          ? `hsla(${hue}, ${saturation}%, 70%, 0.5)` 
          : 'rgba(255, 255, 255, 0.4)';
      } else if (layer === 1) {
        ctx.shadowBlur = size * 1.5;
        ctx.shadowColor = hue > 0 
          ? `hsla(${hue}, ${saturation}%, 70%, 0.3)` 
          : 'rgba(255, 255, 255, 0.2)';
      } else {
        ctx.shadowBlur = 0; // No shadow for background particles
        ctx.shadowColor = 'transparent';
      }

      // Draw star with color
      ctx.fillStyle = hue > 0 
        ? `hsla(${hue}, ${saturation}%, 85%, ${currentOpacity})` 
        : `rgba(255, 255, 255, ${currentOpacity})`;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add cross flare for bright stars
      if (layer === 2 && size > 2) {
        ctx.strokeStyle = hue > 0 
          ? `hsla(${hue}, ${saturation}%, 90%, ${currentOpacity * 0.3})` 
          : `rgba(255, 255, 255, ${currentOpacity * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x - size * 3, y);
        ctx.lineTo(x + size * 3, y);
        ctx.moveTo(x, y - size * 3);
        ctx.lineTo(x, y + size * 3);
        ctx.stroke();
      }
    };

    const drawShootingStar = (star: ShootingStar) => {
      const progress = star.life / star.maxLife;
      const fadeIn = Math.min(progress * 5, 1);
      const fadeOut = 1 - Math.pow(progress, 2);
      const alpha = star.opacity * fadeIn * fadeOut;
      
      const gradient = ctx.createLinearGradient(
        star.x, star.y,
        star.x - star.vx * (star.length / 10), 
        star.y - star.vy * (star.length / 10)
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      gradient.addColorStop(0.3, `rgba(200, 230, 255, ${alpha * 0.6})`);
      gradient.addColorStop(1, 'rgba(100, 180, 255, 0)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(
        star.x - star.vx * (star.length / 10), 
        star.y - star.vy * (star.length / 10)
      );
      ctx.stroke();
      
      // Bright head
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(200, 230, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const updateShootingStar = (star: ShootingStar): boolean => {
      star.x += star.vx;
      star.y += star.vy;
      star.life++;
      return star.life < star.maxLife;
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
    let lastShootingStarTime = 0;
    const targetFPS = 45; // Increased for smoother animation
    const frameInterval = 1000 / targetFPS;
    const shootingStarInterval = 3000 + Math.random() * 5000; // Random interval

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
      
      // Draw particles
      particlesRef.current.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle, time * 0.001);
      });
      
      // Spawn shooting stars occasionally
      if (time - lastShootingStarTime > shootingStarInterval && shootingStarsRef.current.length < 2) {
        shootingStarsRef.current.push(createShootingStar());
        lastShootingStarTime = time;
      }
      
      // Update and draw shooting stars
      ctx.shadowBlur = 0;
      shootingStarsRef.current = shootingStarsRef.current.filter(star => {
        const alive = updateShootingStar(star);
        if (alive) drawShootingStar(star);
        return alive;
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
