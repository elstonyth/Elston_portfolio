import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress } from '../hooks/useScrollProgress';

interface ColorGrade {
  shadows: string;
  midtones: string;
  highlights: string;
}

const colorGrades: Record<string, ColorGrade> = {
  hero: {
    shadows: 'rgba(15, 23, 42, 0.3)',
    midtones: 'rgba(30, 41, 59, 0.15)',
    highlights: 'rgba(59, 130, 246, 0.08)',
  },
  preview: {
    shadows: 'rgba(23, 15, 42, 0.3)',
    midtones: 'rgba(41, 30, 59, 0.15)',
    highlights: 'rgba(168, 85, 247, 0.08)',
  },
  features: {
    shadows: 'rgba(15, 42, 42, 0.3)',
    midtones: 'rgba(30, 59, 59, 0.15)',
    highlights: 'rgba(34, 211, 238, 0.08)',
  },
  work: {
    shadows: 'rgba(42, 15, 35, 0.3)',
    midtones: 'rgba(59, 30, 50, 0.15)',
    highlights: 'rgba(236, 72, 153, 0.08)',
  },
  cta: {
    shadows: 'rgba(15, 23, 42, 0.3)',
    midtones: 'rgba(30, 41, 59, 0.15)',
    highlights: 'rgba(59, 130, 246, 0.08)',
  },
};

export const ColorGrading: React.FC = () => {
  const { progress } = useScrollProgress();
  const [activeGrade, setActiveGrade] = useState<ColorGrade>(colorGrades.hero);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Determine active section based on scroll progress
    let section = 'hero';
    if (progress > 0.8) section = 'cta';
    else if (progress > 0.6) section = 'work';
    else if (progress > 0.4) section = 'features';
    else if (progress > 0.2) section = 'preview';

    setActiveGrade(colorGrades[section]);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-[10] pointer-events-none">
      {/* Shadows layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${activeGrade.shadows}, transparent 60%)`,
          mixBlendMode: 'multiply',
        }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Midtones layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeGrade.midtones}, transparent 70%)`,
          mixBlendMode: 'overlay',
        }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Highlights layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${activeGrade.highlights}, transparent 60%)`,
          mixBlendMode: 'screen',
        }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
    </div>
  );
};
