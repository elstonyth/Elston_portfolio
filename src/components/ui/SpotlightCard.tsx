import React, { useCallback, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const { isDark } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const lastUpdate = useRef(0);

  // Throttled mouse move handler for better scroll performance
  const handleMouseMove = useCallback(({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastUpdate.current < 16) return; // ~60fps throttle
    lastUpdate.current = now;
    
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }, [mouseX, mouseY]);

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden rounded-xl border backdrop-blur-xl shadow-2xl group transition-all duration-300 ease-smooth-out hover:-translate-y-1",
        isDark 
          ? "border-white/10 bg-black/40 hover:border-white/20 hover:shadow-[0_8px_40px_rgba(34,211,238,0.15)]"
          : "border-slate-200/60 bg-white/50 hover:border-slate-300/80 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:bg-white/70",
        className
      )}
    >
      {/* Animated border glow on hover */}
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 opacity-0 group-hover:opacity-100 group-hover:from-cyan-500/30 group-hover:via-purple-500/30 group-hover:to-pink-500/30 transition-all duration-500 blur-sm -z-10" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-soft-light z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(56, 189, 248, 0.18),
              rgba(139, 92, 246, 0.18),
              transparent 40%
            )
          `,
        }}
      />

      {/* Inner Border Highlight */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 group-hover:ring-white/10 pointer-events-none z-20 transition-all duration-300" />

      <div className="relative h-full z-30">
        {children}
      </div>
    </div>
  );
}
