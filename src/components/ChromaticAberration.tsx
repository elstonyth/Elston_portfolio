import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';

export const ChromaticAberration: React.FC = () => {
  const { velocity } = useScrollProgress();
  const [aberrationStrength, setAberrationStrength] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Map velocity (0-5) to aberration strength (0-8px)
    const strength = Math.min(velocity * 1.6, 8);
    setAberrationStrength(strength);
  }, [velocity]);

  if (aberrationStrength < 0.5) return null;

  return (
    <>
      {/* Red channel shift */}
      <motion.div
        className="fixed inset-0 z-[8] pointer-events-none mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.03), transparent 70%)',
          transform: `translate(${aberrationStrength}px, 0)`,
        }}
        animate={{
          opacity: aberrationStrength / 8,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Cyan channel shift */}
      <motion.div
        className="fixed inset-0 z-[8] pointer-events-none mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.03), transparent 70%)',
          transform: `translate(-${aberrationStrength}px, 0)`,
        }}
        animate={{
          opacity: aberrationStrength / 8,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Blue channel shift (vertical) */}
      <motion.div
        className="fixed inset-0 z-[8] pointer-events-none mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 255, 0.02), transparent 70%)',
          transform: `translate(0, ${aberrationStrength * 0.5}px)`,
        }}
        animate={{
          opacity: aberrationStrength / 10,
        }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
};
