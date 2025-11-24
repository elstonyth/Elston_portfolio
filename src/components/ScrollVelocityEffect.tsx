import React, { useEffect, useRef } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';

export const ScrollVelocityEffect: React.FC = () => {
  const { velocity, direction } = useScrollProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const createParticles = (count: number) => {
      const newParticles = [];
      for (let i = 0; i < count; i++) {
        newParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: direction === 'down' ? Math.random() * 3 : -Math.random() * 3,
          life: 1,
          maxLife: 60 + Math.random() * 60,
          size: 1 + Math.random() * 2,
        });
      }
      return newParticles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new particles based on velocity
      if (velocity > 0.5 && particlesRef.current.length < 100) {
        const particlesToAdd = Math.floor(velocity * 5);
        particlesRef.current.push(...createParticles(particlesToAdd));
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy * velocity;
        particle.life--;

        if (particle.life <= 0) return false;

        const alpha = particle.life / particle.maxLife;
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        );

        gradient.addColorStop(0, `rgba(34, 211, 238, ${alpha * 0.6})`);
        gradient.addColorStop(0.5, `rgba(168, 85, 247, ${alpha * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [velocity, direction]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[6] pointer-events-none opacity-70"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
