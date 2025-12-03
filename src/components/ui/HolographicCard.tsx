import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'minimal' | 'low' | 'medium' | 'high';
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = '',
  intensity = 'medium',
}) => {
  const { isDark } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const isInView = useInView(cardRef, { margin: '-50px', amount: 0.1 });

  // Pause animations during scroll
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Skip expensive calculations when not needed
  const shouldAnimate = isInView && !isScrolling;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 40 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 40 });
  const springScale = useSpring(scale, { stiffness: 300, damping: 40 });
  const springGlowX = useSpring(glowX, { stiffness: 300, damping: 40 });
  const springGlowY = useSpring(glowY, { stiffness: 300, damping: 40 });

  const transform = useTransform(
    [springRotateX, springRotateY, springScale],
    ([rx, ry, s]) => `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`
  );

  const intensityMap = {
    minimal: { tilt: 2, glow: 0.2, scale: 1.01 },
    low: { tilt: 5, glow: 0.3, scale: 1.02 },
    medium: { tilt: 10, glow: 0.5, scale: 1.05 },
    high: { tilt: 15, glow: 0.8, scale: 1.08 },
  };

  const settings = intensityMap[intensity];

  // Move useTransform to top level (hooks rule)
  const glowBackground = useTransform(
    [springGlowX, springGlowY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(0, 255, 255, ${settings.glow}), transparent 50%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isScrolling) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * settings.tilt;
    const rotY = ((x - centerX) / centerX) * settings.tilt;

    const gX = (x / rect.width) * 100;
    const gY = (y / rect.height) * 100;

    rotateX.set(-rotX);
    rotateY.set(rotY);
    scale.set(settings.scale);
    glowX.set(gX);
    glowY.set(gY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    glowX.set(50);
    glowY.set(50);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        transform,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Holographic Glass Layer */}
      <div className={`absolute inset-0 backdrop-blur-xl border rounded-2xl ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-200/50'
      }`} />

      {/* Animated Gradient Glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: glowBackground,
          mixBlendMode: 'screen',
        }}
      />

      {/* Iridescent Edge Glow - only animate when hovered AND in view */}
      {shouldAnimate && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.5,
            background: [
              'linear-gradient(45deg, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3), rgba(0, 255, 255, 0.3))',
              'linear-gradient(90deg, rgba(255, 0, 255, 0.3), rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3))',
              'linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3), rgba(0, 255, 255, 0.3))',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Scanline Effect - only render when hovered AND in view */}
      {shouldAnimate && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          animate={{
            backgroundPosition: ['0% 0%', '0% 100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
          }}
        />
      )}

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none rounded-2xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Fresnel Edge Highlight */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1), transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              'radial-gradient(circle at 0% 50%, rgba(0, 255, 255, 0.1), transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              'radial-gradient(circle at 100% 50%, rgba(255, 0, 255, 0.1), transparent 50%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>

      {/* Reflection Layer (subtle) */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%, rgba(255, 255, 255, 0.02) 100%)',
          opacity: isHovered ? 1 : 0.5,
          transition: 'opacity 0.3s',
        }}
      />
    </motion.div>
  );
};
