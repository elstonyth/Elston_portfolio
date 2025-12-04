import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { easings, durations, createFadeVariant } from '@/lib/animations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  /** Distance in pixels for the initial offset */
  offset?: number;
  /** Use blur effect for premium feel */
  blur?: boolean;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  offset = 30,
  blur = false,
}) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true
  });

  // Build variants using shared config
  const baseVariant = createFadeVariant(direction === 'fade' ? 'none' : direction, offset);
  
  const variants: Variants = {
    hidden: {
      ...baseVariant.hidden,
      ...(blur && { filter: 'blur(8px)' }),
    },
    visible: {
      ...baseVariant.visible,
      ...(blur && { filter: 'blur(0px)' }),
    },
  };

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      variants={variants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{
        duration: durations.slow,
        delay,
        ease: easings.smooth,
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};
