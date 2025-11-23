import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionTransition {
  id: string;
  isActive: boolean;
  color: string;
}

export const SectionTransitions: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [transitions, setTransitions] = useState<SectionTransition[]>([]);

  useEffect(() => {
    const sections = [
      { id: 'hero', selector: 'main', color: 'rgba(59, 130, 246, 0.1)' },
      { id: 'preview', selector: '[data-section="preview"]', color: 'rgba(168, 85, 247, 0.1)' },
      { id: 'features', selector: '[data-section="features"]', color: 'rgba(34, 211, 238, 0.1)' },
      { id: 'work', selector: '[data-section="work"]', color: 'rgba(236, 72, 153, 0.1)' },
      { id: 'cta', selector: '[data-section="cta"]', color: 'rgba(59, 130, 246, 0.1)' },
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.1,
    };

    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const element = document.querySelector(section.selector);
      if (!element) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(section.id);
          }
        });
      }, observerOptions);

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const sectionColors: Record<string, string> = {
      hero: 'rgba(59, 130, 246, 0.08)',
      preview: 'rgba(168, 85, 247, 0.08)',
      features: 'rgba(34, 211, 238, 0.08)',
      work: 'rgba(236, 72, 153, 0.08)',
      cta: 'rgba(59, 130, 246, 0.08)',
    };

    setTransitions([
      {
        id: activeSection,
        isActive: true,
        color: sectionColors[activeSection] || sectionColors.hero,
      },
    ]);
  }, [activeSection]);

  return (
    <div className="fixed inset-0 z-[4] pointer-events-none">
      <AnimatePresence mode="wait">
        {transitions.map((transition) => (
          <motion.div
            key={transition.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${transition.color}, transparent 70%)`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
