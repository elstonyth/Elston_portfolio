import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const MagneticCursor: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const interactiveSelectors = 'a, button, [role="button"], input, textarea, select';

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        currentX = targetX;
        currentY = targetY;
      }

      // Check if hovering over interactive element
      const target = e.target as HTMLElement;
      const isInteractive = target.matches(interactiveSelectors) || target.closest(interactiveSelectors);
      setIsHovering(!!isInteractive);

      // Magnetic effect for interactive elements
      if (isInteractive) {
        const element = (target.matches(interactiveSelectors) ? target : target.closest(interactiveSelectors)) as HTMLElement;
        if (element) {
          const rect = element.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const dx = centerX - e.clientX;
          const dy = centerY - e.clientY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Apply magnetic pull within 100px radius
          if (distance < 100) {
            const strength = (100 - distance) / 100;
            targetX = e.clientX + dx * strength * 0.3;
            targetY = e.clientY + dy * strength * 0.3;
          }
        }
      }
    };

    const animate = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * 0.15;
      currentY += dy * 0.15;

      setCursorPosition({ x: currentX, y: currentY });
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
      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[50] rounded-full border-2 mix-blend-difference"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          x: '-50%',
          y: '-50%',
          borderColor: 'white',
        }}
        animate={{
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          opacity: isHovering ? 0.5 : 0.3,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[50] rounded-full bg-white mix-blend-difference"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          width: isHovering ? 8 : 6,
          height: isHovering ? 8 : 6,
          opacity: isHovering ? 1 : 0.8,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
    </>
  );
};
