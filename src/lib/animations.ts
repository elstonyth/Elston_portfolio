import type { Variants, Transition } from 'framer-motion';

// ============================================================================
// EASING CURVES
// ============================================================================
// Named easing curves for consistent motion feel across the app

export const easings = {
  // Smooth deceleration - best for entrances
  smooth: [0.22, 1, 0.36, 1] as const,
  
  // Expo out - fast start, gradual stop (premium feel)
  expo: [0.16, 1, 0.3, 1] as const,
  
  // Bounce snap - playful with overshoot
  snap: [0.34, 1.56, 0.64, 1] as const,
  
  // Circ out - quick initial movement
  circ: [0, 0.55, 0.45, 1] as const,
  
  // Back out - slight overshoot for attention
  back: [0.34, 1.3, 0.64, 1] as const,
  
  // Linear - for continuous animations (loading, rotation)
  linear: [0, 0, 1, 1] as const,
  
  // Anticipation - slight pull back before moving
  anticipate: [0.68, -0.6, 0.32, 1.6] as const,
} as const;

// ============================================================================
// SPRING CONFIGURATIONS
// ============================================================================
// Physics-based springs for natural, organic motion

export const springs = {
  // Snappy interactions (buttons, toggles)
  snappy: { type: 'spring' as const, stiffness: 400, damping: 30 },
  
  // Bouncy feedback (success states, attention)
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 20 },
  
  // Smooth transitions (page elements, modals)
  smooth: { type: 'spring' as const, stiffness: 200, damping: 25 },
  
  // Gentle float (cards, subtle hover)
  gentle: { type: 'spring' as const, stiffness: 120, damping: 20 },
  
  // Slow & elegant (hero elements, large movements)
  elegant: { type: 'spring' as const, stiffness: 80, damping: 20 },
  
  // Wobbly (playful, attention-grabbing)
  wobbly: { type: 'spring' as const, stiffness: 350, damping: 15 },
} as const;

// ============================================================================
// DURATION PRESETS
// ============================================================================

export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  slower: 0.8,
  slowest: 1.2,
} as const;

// ============================================================================
// TRANSITION PRESETS
// ============================================================================
// Pre-configured transitions for common use cases

export const transitions: Record<string, Transition> = {
  // Fast micro-interactions
  fast: { 
    duration: durations.fast, 
    ease: easings.smooth 
  },
  
  // Standard transitions
  normal: { 
    duration: durations.normal, 
    ease: easings.smooth 
  },
  
  // Slower, more deliberate
  slow: { 
    duration: durations.slow, 
    ease: easings.expo 
  },
  
  // Premium feel transitions
  premium: { 
    duration: durations.slower, 
    ease: easings.expo 
  },
  
  // Snappy spring for buttons
  button: springs.snappy,
  
  // Smooth spring for cards
  card: springs.smooth,
  
  // Elegant spring for hero elements
  hero: springs.elegant,
} as const;

// ============================================================================
// STAGGER CONFIGURATIONS
// ============================================================================

export const stagger = {
  fast: 0.03,
  normal: 0.06,
  slow: 0.1,
  slower: 0.15,
} as const;

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================
// Reusable Framer Motion variants for common patterns

export const variants = {
  // Fade up reveal (most common)
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  } satisfies Variants,

  // Fade down reveal
  fadeDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  } satisfies Variants,

  // Fade in from left
  fadeLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  } satisfies Variants,

  // Fade in from right
  fadeRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  } satisfies Variants,

  // Simple fade
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } satisfies Variants,

  // Scale up reveal
  scaleUp: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  } satisfies Variants,

  // Scale down (for overlays/modals appearing)
  scaleDown: {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { opacity: 1, scale: 1 },
  } satisfies Variants,

  // Blur fade (premium effect)
  blurFade: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  } satisfies Variants,

  // Stagger container (use with children)
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger.normal,
        delayChildren: 0.1,
      },
    },
  } satisfies Variants,

  // Fast stagger container
  staggerContainerFast: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger.fast,
        delayChildren: 0.05,
      },
    },
  } satisfies Variants,

  // Slow stagger container
  staggerContainerSlow: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger.slow,
        delayChildren: 0.15,
      },
    },
  } satisfies Variants,

  // Card hover effect
  cardHover: {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -4 },
  } satisfies Variants,

  // Button hover effect
  buttonHover: {
    rest: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  } satisfies Variants,

  // Icon hover (subtle rotation + scale)
  iconHover: {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5 },
  } satisfies Variants,

  // Magnetic pull effect
  magneticPull: {
    rest: { x: 0, y: 0 },
    hover: { x: 0, y: 0 }, // Actual values set dynamically
  } satisfies Variants,
} as const;

// ============================================================================
// VIEWPORT OPTIONS
// ============================================================================
// Consistent IntersectionObserver options for scroll-triggered animations

export const viewportOptions = {
  // Standard - triggers when 10% visible
  standard: { once: true, margin: '-50px' },
  
  // Eager - triggers earlier
  eager: { once: true, margin: '0px' },
  
  // Delayed - triggers when more visible
  delayed: { once: true, margin: '-100px' },
  
  // Repeat - re-animates on every scroll
  repeat: { once: false, margin: '-50px' },
} as const;

// ============================================================================
// ANIMATION BUILDERS
// ============================================================================
// Helper functions to create consistent animations

/**
 * Creates a staggered children animation config
 */
export function createStaggerConfig(
  staggerDelay: number = stagger.normal,
  initialDelay: number = 0
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };
}

/**
 * Creates a custom fade variant with configurable offset
 */
export function createFadeVariant(
  direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'up',
  offset: number = 30
): Variants {
  const transforms: Record<string, { x?: number; y?: number }> = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: -offset },
    right: { x: offset },
    none: {},
  };

  return {
    hidden: { opacity: 0, ...transforms[direction] },
    visible: { opacity: 1, x: 0, y: 0 },
  };
}

/**
 * Creates transition with delay
 */
export function withDelay(
  transition: Transition,
  delay: number
): Transition {
  return { ...transition, delay };
}

/**
 * Creates viewport-triggered animation props
 */
export function createScrollAnimation(
  variant: keyof typeof variants = 'fadeUp',
  transition: Transition = transitions.normal,
  viewport: keyof typeof viewportOptions = 'standard'
) {
  return {
    variants: variants[variant],
    initial: 'hidden',
    whileInView: 'visible',
    viewport: viewportOptions[viewport],
    transition,
  };
}

// ============================================================================
// HOVER ANIMATION HELPERS
// ============================================================================

export const hoverAnimations = {
  lift: {
    whileHover: { y: -4, transition: transitions.fast },
  },
  
  scale: {
    whileHover: { scale: 1.02, transition: springs.snappy },
    whileTap: { scale: 0.98, transition: springs.snappy },
  },
  
  glow: {
    whileHover: { 
      boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)',
      transition: transitions.normal,
    },
  },
  
  tilt: {
    whileHover: { 
      rotateX: 2, 
      rotateY: -2,
      transition: springs.gentle,
    },
  },
} as const;

// ============================================================================
// LOADING & STATE ANIMATIONS
// ============================================================================

export const loadingVariants = {
  // Pulse animation
  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: easings.smooth,
      },
    },
  },
  
  // Skeleton shimmer
  shimmer: {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: easings.linear,
      },
    },
  },
  
  // Spin
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: easings.linear,
      },
    },
  },
  
  // Bounce
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: easings.smooth,
      },
    },
  },
} as const;

// ============================================================================
// EXIT ANIMATIONS
// ============================================================================

export const exitVariants = {
  fadeOut: {
    exit: { opacity: 0, transition: transitions.fast },
  },
  
  fadeOutUp: {
    exit: { opacity: 0, y: -20, transition: transitions.fast },
  },
  
  fadeOutDown: {
    exit: { opacity: 0, y: 20, transition: transitions.fast },
  },
  
  scaleOut: {
    exit: { opacity: 0, scale: 0.95, transition: transitions.fast },
  },
  
  blurOut: {
    exit: { opacity: 0, filter: 'blur(10px)', transition: transitions.normal },
  },
} as const;

// ============================================================================
// FLOATING ANIMATIONS (for decorative elements)
// ============================================================================

export const floatingAnimations = {
  float: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: easings.smooth,
      },
    },
  },
  
  floatSlow: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: easings.smooth,
      },
    },
  },
  
  floatRotate: {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: easings.smooth,
      },
    },
  },
  
  breathe: {
    animate: {
      scale: [1, 1.02, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: easings.smooth,
      },
    },
  },
} as const;
