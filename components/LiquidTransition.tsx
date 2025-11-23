import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LiquidTransitionProps {
  isActive: boolean;
  color?: string;
  duration?: number;
  onComplete?: () => void;
}

export const LiquidTransition: React.FC<LiquidTransitionProps> = ({
  isActive,
  color = '#00ffff',
  duration = 1.5,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrame: number;
    let startTime: number | null = null;

    const metaballs: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    for (let i = 0; i < 8; i++) {
      metaballs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: 50 + Math.random() * 100,
      });
    }

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      if (elapsed > duration) {
        if (onComplete) onComplete();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      metaballs.forEach((ball) => {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x < 0 || ball.x > canvas.width) ball.vx *= -1;
        if (ball.y < 0 || ball.y > canvas.height) ball.vy *= -1;
      });

      const threshold = 1.0;
      const step = 4;

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          let sum = 0;

          metaballs.forEach((ball) => {
            const dx = x - ball.x;
            const dy = y - ball.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            sum += (ball.radius * ball.radius) / (dist * dist);
          });

          if (sum > threshold) {
            const index = (y * canvas.width + x) * 4;
            const intensity = Math.min(sum / 2, 1);

            const rgb = hexToRgb(color);
            data[index] = rgb.r * intensity;
            data[index + 1] = rgb.g * intensity;
            data[index + 2] = rgb.b * intensity;
            data[index + 3] = 255 * intensity;

            for (let dy = 0; dy < step; dy++) {
              for (let dx = 0; dx < step; dx++) {
                const fillIndex = ((y + dy) * canvas.width + (x + dx)) * 4;
                data[fillIndex] = data[index];
                data[fillIndex + 1] = data[index + 1];
                data[fillIndex + 2] = data[index + 2];
                data[fillIndex + 3] = data[index + 3];
              }
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, color, duration, onComplete]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 255, b: 255 };
  };

  if (!isActive) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
};

export const BlobTransition: React.FC<{
  isActive: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
}> = ({ isActive, direction = 'up' }) => {
  const variants = {
    up: {
      initial: { y: '100%' },
      animate: { y: '-100%' },
    },
    down: {
      initial: { y: '-100%' },
      animate: { y: '100%' },
    },
    left: {
      initial: { x: '100%' },
      animate: { x: '-100%' },
    },
    right: {
      initial: { x: '-100%' },
      animate: { x: '100%' },
    },
  };

  if (!isActive) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial="initial"
      animate="animate"
      exit="initial"
      variants={variants[direction]}
      transition={{
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ff00ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,50 Q25,0 50,50 T100,50 L100,100 L0,100 Z"
          fill="url(#blobGradient)"
          initial={{ d: 'M0,50 Q25,0 50,50 T100,50 L100,100 L0,100 Z' }}
          animate={{
            d: [
              'M0,50 Q25,0 50,50 T100,50 L100,100 L0,100 Z',
              'M0,30 Q25,60 50,30 T100,30 L100,100 L0,100 Z',
              'M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z',
            ],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </motion.div>
  );
};
