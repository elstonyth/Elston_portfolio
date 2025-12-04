import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Sparkles, Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ResumeDownload } from '@/components/layout/ResumeDownload';
import { BlackHole } from '@/components/BlackHole';

const credentials = [
  { icon: <Sparkles size={14} />, label: 'Focus', value: 'Analytics · Automation · AI', showOnMobile: true, delay: 0 },
  { icon: <Briefcase size={14} />, label: 'Impact', value: '~30% fewer data errors', showOnMobile: true, delay: 0.1 },
  { icon: <Users size={14} />, label: 'Efficiency', value: '10–15 hrs/month saved', showOnMobile: false, delay: 0.2 },
];

export const Hero: React.FC = () => {
  return (
    <main id="home" className="relative pt-24 pb-8 px-4 md:pt-48 md:pb-24 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start z-10 mb-8 lg:mb-24 relative">
          <div className="flex-1 max-w-3xl xl:max-w-4xl">
            {/* Status Badge */}
            <motion.a 
              href="#contact" 
              className="group inline-flex items-center gap-3 px-4 py-2 rounded-full border text-sm transition-all duration-300 mb-6 backdrop-blur-md shimmer-effect premium-badge bg-white/5 border-white/10 text-white/80 hover:border-cyan-400/30 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-medium tracking-wide text-xs uppercase">Open for Data & AI Engineering Roles</span>
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-all text-white/50 group-hover:text-white" />
            </motion.a>

            {/* Credential Strip */}
            <motion.div 
              className="flex flex-wrap gap-3 mb-10 text-sm text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {credentials.map(({ icon, label, value, showOnMobile, delay }) => (
                <motion.div 
                  key={label} 
                  className={`flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-sm transition-all duration-300 cursor-default ${!showOnMobile ? 'hidden sm:flex' : ''} bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)]`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + delay }}
                  whileHover={{ y: -2 }}
                >
                  <span className="text-cyan-400/80">{icon}</span>
                  <div>
                    <p className="text-[11px] uppercase tracking-ultra text-white/50">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5 md:mb-6 leading-[1.05] text-white hero-title-premium"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Full-stack <br className="hidden sm:block" />
              <span className="text-gradient-hero">AI & data engineer.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-base md:text-lg max-w-xl mb-8 md:mb-10 leading-relaxed text-white/60"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Designing analytics, automations, and interfaces that are as polished as they are reliable.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 w-full sm:w-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <a href="#work" className="w-full sm:w-auto">
                <div className="relative w-full sm:w-auto group/cta cta-glow rounded-full">
                  <div className="absolute inset-0 rounded-full bg-white/40 blur-2xl opacity-0 group-hover/cta:opacity-100 transition duration-500" />
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    View Work
                    <ArrowRight size={16} className="ml-2 opacity-70 transition-transform group-hover/cta:translate-x-1" />
                  </Button>
                </div>
              </a>
              <ResumeDownload variant="secondary" className="w-full sm:w-auto px-6" />
              <p className="text-xs pl-1 sm:pl-0 sm:basis-full text-white/60">Replies within one business day.</p>
            </motion.div>
          </div>
          
          {/* Black Hole Visual - Desktop */}
          <div className="hidden lg:block absolute right-0 top-[120px]">
            <BlackHole size={420} />
          </div>
          
          {/* Black Hole Visual - Mobile - Smaller and less spacing */}
          <div className="lg:hidden mt-6 flex justify-center">
            <BlackHole size={220} />
          </div>
        </div>
      </div>
    </main>
  );
};
