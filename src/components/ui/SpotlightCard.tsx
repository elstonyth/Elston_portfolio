import React, { useCallback, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
// Dark mode only - no theme switching needed
import { springs } from '@/lib/animations';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  /** Enable 3D tilt effect on hover */
  tilt?: boolean;
  /** Maximum tilt angle in degrees */
  tiltAmount?: number;
}

export function SpotlightCard({ 
  children, 
  className, 
  tilt = true,
  tiltAmount = 8 
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const lastUpdate = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Spring-based smooth values for tilt
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  // Throttled mouse move handler for better scroll performance
  const handleMouseMove = useCallback(({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastUpdate.current < 16) return; // ~60fps throttle
    lastUpdate.current = now;
    
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    
    mouseX.set(x);
    mouseY.set(y);

    // Calculate tilt based on mouse position
    if (tilt) {
      const centerX = width / 2;
      const centerY = height / 2;
      const tiltX = ((y - centerY) / centerY) * -tiltAmount;
      const tiltY = ((x - centerX) / centerX) * tiltAmount;
      rotateX.set(tiltX);
      rotateY.set(tiltY);
    }
  }, [mouseX, mouseY, tilt, tiltAmount, rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    if (tilt) {
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [tilt, rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-all duration-300 ease-smooth-out group",
        // Glass background (dark mode)
        "bg-white/[0.06] backdrop-blur-xl backdrop-saturate-150",
        // Layered shadow system
        "shadow-[0_2px_4px_rgba(0,0,0,0.2),0_8px_16px_rgba(0,0,0,0.15),0_16px_32px_rgba(0,0,0,0.1)]",
        // Border (dark mode)
        "border-white/[0.1] hover:border-white/[0.2]",
        // Hover shadow with glow (dark mode)
        "hover:shadow-[0_2px_4px_rgba(0,0,0,0.2),0_8px_16px_rgba(0,0,0,0.15),0_24px_48px_rgba(0,0,0,0.12),0_0_60px_rgba(34,211,238,0.1)]",
        className
      )}
      whileHover={{ y: -3, transition: springs.gentle }}
    >
      {/* Animated border glow on hover - inside card to avoid overflow clipping */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 opacity-0 group-hover:opacity-100 group-hover:from-cyan-500/30 group-hover:via-purple-500/30 group-hover:to-pink-500/30 transition-all duration-500 pointer-events-none z-[1]" />
      
      {/* Top Edge Highlight (lit from above effect) */}
      <div 
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10"
      />
      
      {/* Inner top gradient (frosted glass effect) */}
      <div 
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none rounded-t-2xl z-0"
      />
      
      {/* Noise Texture - reduced opacity for subtlety */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-soft-light z-0 rounded-2xl" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      {/* Spotlight Effect - enhanced gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl transition duration-300 opacity-0 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              500px circle at ${mouseX}px ${mouseY}px,
              rgba(34, 211, 238, 0.12),
              rgba(167, 139, 250, 0.08),
              transparent 45%
            )
          `,
        }}
      />

      {/* Inner Border Ring */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04] group-hover:ring-white/[0.08] pointer-events-none z-20 transition-all duration-300" />
      
      {/* Bottom edge shadow (grounded effect) */}
      <div 
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none z-10"
      />

      <div className="relative h-full z-30">
        {children}
      </div>
    </motion.div>
  );
}
