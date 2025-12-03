import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useTheme } from '@/context/ThemeContext';

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 1500, isInView: boolean = false) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView, hasAnimated]);

  return count;
};

export const HeroDesignShowcase = () => {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const engagementCount = useAnimatedCounter(142, 1200, isInView);
  const usersCount = useAnimatedCounter(124, 1000, isInView);
  const uptimeCount = useAnimatedCounter(999, 1100, isInView);
  
  return (
    <div className="w-full" ref={ref}>
      <SpotlightCard className={isDark ? 'bg-background/80 border-white/10' : 'bg-white/60 border-gray-300/30'}>
        <div className="p-8 space-y-6">
          {/* Header */}
          <motion.div 
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div>
              <p className={`text-xs uppercase tracking-ultra ${isDark ? 'text-white/40' : 'text-gray-500'}`}>UI Snapshot</p>
              <h3 className={`text-2xl md:text-3xl font-semibold tracking-tight mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Realtime Analytics Dashboard
              </h3>
            </div>
            <motion.span 
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                isDark ? 'text-white/70 bg-white/5 border-white/10' : 'text-gray-600 bg-gray-100 border-gray-200'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Case Study View
            </motion.span>
          </motion.div>

          {/* Dashboard Preview */}
          <div className={`relative h-[360px] rounded-2xl overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-br from-blue-500/30 via-purple-500/10 to-transparent' 
              : 'bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-transparent'
          }`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_60%)]" />
            
            <div className="absolute left-6 right-6 top-8 flex flex-col gap-4">
              {/* Engagement Card */}
              <motion.div 
                className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-sm ${
                  isDark ? 'bg-black/40 border-white/10' : 'bg-white/70 border-gray-200/50'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className={`flex items-center justify-between text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  <span>Engagement Lift</span>
                  <motion.span 
                    className="text-emerald-400 font-semibold"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    +{engagementCount}%
                  </motion.span>
                </div>
                <div className={`mt-3 h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <motion.div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: '75%' } : {}}
                    transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Active users', value: `${(usersCount / 10).toFixed(1)}k`, delay: 0.2 },
                  { label: 'Uptime', value: `${(uptimeCount / 10).toFixed(1)}%`, delay: 0.3 },
                  { label: 'Delivery', value: '0.3s', delay: 0.4 },
                ].map((card, index) => (
                  <motion.div 
                    key={card.label} 
                    className={`rounded-2xl border p-4 backdrop-blur-sm ${
                      isDark ? 'bg-black/50 border-white/5' : 'bg-white/60 border-gray-200/40'
                    }`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: card.delay }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <p className={`text-[11px] uppercase tracking-super mb-2 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                      {card.label}
                    </p>
                    <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {card.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Status Bar */}
            <motion.div 
              className={`absolute bottom-6 left-6 right-6 rounded-2xl border p-4 backdrop-blur ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200/50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className={`flex items-center justify-between text-sm ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                <div>
                  <p className={`text-xs uppercase tracking-ultra ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                    Experience Layer
                  </p>
                  <p className="font-medium">Live collaboration & design systems</p>
                </div>
                <motion.span 
                  className="px-3 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 flex items-center gap-2"
                  animate={{ 
                    boxShadow: ['0 0 0px rgba(16,185,129,0)', '0 0 10px rgba(16,185,129,0.3)', '0 0 0px rgba(16,185,129,0)']
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live
                </motion.span>
              </div>
            </motion.div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};
