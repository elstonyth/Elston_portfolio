import { useEffect, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
  isMoving: boolean;
}

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    isMoving: false,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let rafId: number;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      setPosition((prev) => ({ ...prev, isMoving: true }));

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setPosition((prev) => ({ ...prev, isMoving: false }));
      }, 150);
    };

    const updatePosition = () => {
      setPosition((prev) => ({
        x: targetX,
        y: targetY,
        isMoving: prev.isMoving,
      }));
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return position;
}
