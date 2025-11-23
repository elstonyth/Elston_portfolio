import React, { useEffect, useRef } from 'react';

export const AuroraEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    class Wave {
      constructor(
        public y: number,
        public length: number,
        public amplitude: number,
        public frequency: number,
        public speed: number,
        public color: string
      ) {}

      draw(ctx: CanvasRenderingContext2D, time: number) {
        ctx.beginPath();
        ctx.moveTo(0, this.y);

        for (let x = 0; x < canvas.width; x++) {
          const y =
            this.y +
            Math.sin((x / this.length + time * this.speed) * Math.PI * 2) *
              this.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, this.y - this.amplitude, 0, this.y + this.amplitude);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    const waves = [
      new Wave(canvas.height * 0.2, 300, 40, 0.02, 0.3, 'rgba(34, 211, 238, 0.08)'),
      new Wave(canvas.height * 0.25, 250, 35, 0.025, 0.25, 'rgba(59, 130, 246, 0.06)'),
      new Wave(canvas.height * 0.3, 350, 45, 0.015, 0.35, 'rgba(168, 85, 247, 0.07)'),
      new Wave(canvas.height * 0.35, 280, 38, 0.022, 0.28, 'rgba(236, 72, 153, 0.05)'),
    ];

    const drawAurora = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'screen';

      waves.forEach((wave) => {
        wave.draw(ctx, time);
      });

      ctx.globalCompositeOperation = 'source-over';
    };

    const animate = () => {
      if (!prefersReducedMotion) {
        time += 0.005;
      }
      drawAurora();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[2] pointer-events-none opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
