import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress } from '../hooks/useScrollProgress';

export const DynamicVignette: React.FC = () => {
  const { progress, velocity } = useScrollProgress();
  const [vignetteIntensity, setVignetteIntensity] = useState(0.3);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setVignetteIntensity(0.3);
      return;
    }

    // Increase vignette at top and bottom of page
    const topIntensity = Math.max(0, 0.5 - progress * 2);
    const bottomIntensity = Math.max(0, (progress - 0.5) * 2);
    const edgeIntensity = Math.max(topIntensity, bottomIntensity);

    // Add velocity-based intensity
    const velocityBoost = Math.min(velocity * 0.1, 0.3);

    const finalIntensity = Math.min(0.3 + edgeIntensity * 0.4 + velocityBoost, 0.8);
    setVignetteIntensity(finalIntensity);
  }, [progress, velocity]);

  return (
    <motion.div
      className="fixed inset-0 z-[9] pointer-events-none"
      style={{
        background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.8) 100%)',
      }}
      animate={{
        opacity: vignetteIntensity,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    />
  );
};
