import React, { useEffect, useState } from 'react';

export const CursorGlow: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      if (!isVisible) {
        setIsVisible(true);
        currentX = targetX;
        currentY = targetY;
      }
    };

    const animate = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      
      currentX += dx * 0.15;
      currentY += dy * 0.15;

      setMousePosition({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed pointer-events-none z-[5] mix-blend-screen transition-opacity duration-300"
        style={{
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.08), transparent 70%)`,
        }}
      />
      <div
        className="fixed pointer-events-none z-[5] mix-blend-screen transition-opacity duration-300"
        style={{
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.06), transparent 70%)`,
        }}
      />
    </>
  );
};
