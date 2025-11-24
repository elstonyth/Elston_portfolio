import React, { useEffect, useRef } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

interface TrailPoint {
  x: number;
  y: number;
  life: number;
  vx: number; // velocity x for smoother interpolation
  vy: number; // velocity y for smoother interpolation
}

export const MouseTrail: React.FC = () => {
  const { x, y, isMoving } = useMousePosition();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const smoothPosRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());

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

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const now = Date.now();
      const deltaTime = Math.min((now - lastTimeRef.current) / 16.67, 2); // Cap at 2x for stability
      lastTimeRef.current = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse position with lerp for fluid motion
      const lerpFactor = 0.15;
      smoothPosRef.current.x += (x - smoothPosRef.current.x) * lerpFactor;
      smoothPosRef.current.y += (y - smoothPosRef.current.y) * lerpFactor;

      // Add new trail points with velocity for smoother interpolation
      if (isMoving) {
        const dx = smoothPosRef.current.x - lastPosRef.current.x;
        const dy = smoothPosRef.current.y - lastPosRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Balanced threshold for smooth but not too dense trail
        if (distance > 4) {
          const vx = dx / deltaTime;
          const vy = dy / deltaTime;
          
          trailRef.current.push({
            x: smoothPosRef.current.x,
            y: smoothPosRef.current.y,
            life: 1,
            vx,
            vy,
          });
          lastPosRef.current = { x: smoothPosRef.current.x, y: smoothPosRef.current.y };
        }
      }

      // Update and draw trail with smoother decay
      trailRef.current = trailRef.current.filter((point, index) => {
        // Faster decay for shorter trail
        point.life -= 0.018 * deltaTime;

        if (point.life <= 0) return false;

        // Ease out cubic for smoother fade
        const easedLife = 1 - Math.pow(1 - point.life, 3);
        
        // Moderate size for subtle elegance
        const size = 24 * easedLife;
        
        const gradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          size
        );

        // More subtle alpha
        const alpha = easedLife * 0.3;
        gradient.addColorStop(0, `rgba(34, 211, 238, ${alpha})`);
        gradient.addColorStop(0.4, `rgba(168, 85, 247, ${alpha * 0.7})`);
        gradient.addColorStop(0.7, `rgba(139, 92, 246, ${alpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Moderate trail length for balance
      if (trailRef.current.length > 40) {
        trailRef.current.shift();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [x, y, isMoving]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[6] pointer-events-none opacity-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
