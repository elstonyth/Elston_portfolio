import React, { useState, useRef, useEffect } from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { Code2, LayoutDashboard } from 'lucide-react';
import { CodeInterface } from '@/components/CodeInterface';
import { HeroDesignShowcase } from '@/components/HeroDesignShowcase';

const previewToggleConfig = [
  {
    mode: 'code' as const,
    label: 'Code Preview',
    caption: 'Type-safe animations',
    icon: Code2,
  },
  {
    mode: 'ui' as const,
    label: 'UI Snapshot',
    caption: 'Visual system tour',
    icon: LayoutDashboard,
  },
];

export const PreviewSection = () => {
  const [previewMode, setPreviewMode] = useState<'code' | 'ui'>('code');
  const previewSectionRef = useRef<HTMLElement | null>(null);
  const scrollProgress = useMotionValue(0);
  const previewParallax = useTransform(scrollProgress, [0, 1], [40, -20]);
  const previewGlowOpacity = useTransform(scrollProgress, [0, 1], [0.25, 0.8]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      if (!previewSectionRef.current) return;
      const rect = previewSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || 1;
      const totalRange = rect.height + windowHeight;
      const progress = 1 - Math.min(Math.max(rect.bottom / totalRange, 0), 1);
      scrollProgress.set(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [scrollProgress, isMobile]);

  return (
    <section ref={previewSectionRef} className="relative px-6 pb-24">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/10 blur-3xl" 
        style={{ opacity: isMobile ? 0.35 : previewGlowOpacity }}
      />
      <div className="relative max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-mega text-white/40">Interactive sandbox</p>
            <h2 className="text-3xl md:text-4xl font-semibold mt-3 mb-3">Recent build preview</h2>
            <p className="text-white/70 max-w-2xl">
              Dive into the live playground I use to prototype animations, system design, and engineering handoffs. Switch modes to see how I translate complex briefs into polished experiences.
            </p>
          </div>
          <div className="inline-flex items-stretch rounded-full border border-white/10 bg-white/5 p-1">
            {previewToggleConfig.map(({ mode, label, caption, icon: Icon }) => {
              const isActive = previewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`flex items-center gap-3 px-4 py-2 text-left rounded-full transition-all ${
                    isActive
                      ? 'bg-white text-black shadow-lg shadow-white/10'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-black' : 'text-white/60'} />
                  <div>
                    <p className="text-xs font-semibold leading-tight">{label}</p>
                    <p className={`text-[10px] uppercase tracking-ultra ${isActive ? 'text-black/60' : 'text-white/40'}`}>
                      {caption}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div 
          className="relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200"
          style={{ y: isMobile ? 0 : previewParallax }}
        >
          {previewMode === 'code' ? <CodeInterface /> : <HeroDesignShowcase />}
        </motion.div>
      </div>
    </section>
  );
};
