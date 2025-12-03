import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface PrestigeFlipCardProps {
  frontImageUrl?: string;
  backImageUrl?: string;
}

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${path.startsWith('/') ? path.slice(1) : path}`;
};

export const PrestigeFlipCard: React.FC<PrestigeFlipCardProps> = ({
  frontImageUrl = 'card-front.png',
  backImageUrl = 'card-back.jpg',
}) => {
  const frontUrl = getAssetUrl(frontImageUrl);
  const backUrl = getAssetUrl(backImageUrl);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  // Floating animation values
  const floatY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsFlipped((prev) => !prev);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`prestige-flip-card${isFlipped ? ' is-flipped' : ''}`}
      aria-label="American Express Black Card"
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isFlipped ? 0 : rotateX,
        rotateY: isFlipped ? 180 : rotateY,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      <div className="prestige-flip-card-inner">
        <div 
          className="prestige-flip-card-face prestige-flip-card-front"
          style={{ 
            backgroundImage: `url(${frontUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          role="img"
          aria-label="American Express Card Front"
        >
          {/* Shine effect overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 pointer-events-none"
            style={{
              opacity: useTransform(mouseX, [-0.5, 0, 0.5], [0, 0.3, 0]),
            }}
          />
        </div>
        <div 
          className="prestige-flip-card-face prestige-flip-card-back"
          style={{ 
            backgroundImage: `url(${backUrl})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#000'
          }}
          role="img"
          aria-label="Card back with custom artwork"
        />
      </div>
    </motion.div>
  );
};
