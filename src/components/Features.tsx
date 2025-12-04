import React, { useRef, useState, useEffect } from 'react';
import { Server, Palette, Code, Cpu, Zap } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { motion, useInView, type Variants } from 'framer-motion';
// Dark mode only - no theme switching needed
import { easings, durations, stagger, springs } from '@/lib/animations';

const skills = [
  {
    icon: Code,
    title: 'Analytics & Reporting',
    description: 'Python (Pandas, NumPy) and SQL for data validation, exploratory analysis, and building dashboards that teams rely on.',
    colSpan: "md:col-span-2",
    gradient: "from-blue-500 to-cyan-400",
    iconBg: "bg-gradient-to-br from-blue-500/20 to-cyan-400/10",
    accentColor: "cyan",
    bg: ""
  },
  {
    icon: Zap,
    title: 'Workflow Automation',
    description: 'Python scripts and Google Sheets integrations that eliminate repetitive tasks and reduce input errors.',
    colSpan: "md:col-span-1",
    gradient: "from-amber-500 to-orange-400",
    iconBg: "bg-gradient-to-br from-amber-500/20 to-orange-400/10",
    accentColor: "amber",
    bg: ""
  },
  {
    icon: Palette,
    title: 'Cloud & Data Pipelines',
    description: 'Data pipelines and queries on GCP and SQL databases, built for reliability and easy maintenance.',
    colSpan: "md:col-span-1",
    gradient: "from-emerald-500 to-teal-400",
    iconBg: "bg-gradient-to-br from-emerald-500/20 to-teal-400/10",
    accentColor: "emerald",
    bg: ""
  },
  {
    icon: Server,
    title: 'Data Reliability & Privacy',
    description: 'Backup, recovery, and privacy-first practices—including self-hosted infra—to keep data accurate and secure.',
    colSpan: "md:col-span-2",
    gradient: "from-purple-500 to-pink-400",
    iconBg: "bg-gradient-to-br from-purple-500/20 to-pink-400/10",
    accentColor: "purple",
    bg: ""
  }
];

// Premium staggered entrance animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }
  }
};

// Icon entrance animation
const iconVariants: Variants = {
  hidden: { scale: 0, opacity: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    }
  }
};

// Text reveal animation
const textVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.3,
    }
  }
};

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 2000, startOnView: boolean = false, isInView: boolean = false) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasAnimated) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth deceleration
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
  }, [end, duration, startOnView, isInView, hasAnimated]);

  return count;
};

// Animated Stats Card Component
const AnimatedStatsCard: React.FC<{ isInView: boolean }> = ({ isInView }) => {
  const yearsCount = useAnimatedCounter(3, 1500, true, isInView);
  
  return (
    <div className="relative z-10 flex flex-col h-full justify-center items-center text-center">
      <motion.div 
        className="text-5xl font-bold text-white mb-2"
        initial={{ scale: 0.5, opacity: 0, filter: 'blur(8px)' }}
        animate={isInView ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : {}}
        transition={springs.bouncy}
      >
        <span className="gradient-text-animated">{yearsCount}+</span>
      </motion.div>
      <motion.div 
        className="text-sm text-text-dim uppercase tracking-widest font-medium group-hover:text-white/70 transition-colors duration-300"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: durations.normal, delay: 0.3, ease: easings.smooth }}
      >
        Years Experience
      </motion.div>
      
      {/* Decorative ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-white/5"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: durations.normal, delay: 0.2, ease: easings.expo }}
      />
      <motion.div
        className="absolute inset-8 rounded-full border border-dashed border-white/10"
        initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
        animate={isInView ? { scale: 1, opacity: 1, rotate: 360 } : {}}
        transition={{ 
          scale: { duration: durations.normal, delay: 0.3, ease: easings.expo },
          opacity: { duration: durations.normal, delay: 0.3, ease: easings.expo },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
      />
    </div>
  );
};

export const Features: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: '-100px', amount: 0.1 });

  return (
    <section ref={sectionRef} className="py-16 md:py-32 px-4 md:px-6 relative overflow-hidden">
      {/* Animated Background Layers */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Static Gradient Blobs - CSS only for better scroll performance */}
        <div 
          className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] hidden md:block"
          style={{ willChange: 'auto' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] hidden md:block"
          style={{ willChange: 'auto' }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: durations.slow, ease: easings.expo }}
          className="text-left mb-10 md:mb-16 max-w-2xl"
        >
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5, delay: 0.1 }}
             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-xs font-mono uppercase tracking-[0.15em] border-cyan-500/20 bg-cyan-500/5 text-cyan-400"
           >
             <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
             <Cpu size={12} />
             <span>Core Skills</span>
           </motion.div>
           <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6 text-white">
             Data & analytics <br/>
             <span 
               style={{
                 background: 'linear-gradient(to right, #c084fc, #22d3ee)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 backgroundClip: 'text',
                 color: '#c084fc'
               }}>that drive decisions.</span>
           </h2>
           <p className="text-lg leading-relaxed text-white/60">
             I help teams turn complex operational data into reliable dashboards, automations, and insights they can act on.
           </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          style={{ perspective: 1000 }}
        >
          {skills.map((skill, index) => (
            <motion.div key={index} variants={itemVariants} className={`${skill.colSpan} h-full`}>
              <SpotlightCard className="p-8 h-full group relative overflow-hidden">
                {/* Gradient accent in corner */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${skill.gradient} opacity-[0.08] rounded-full blur-3xl group-hover:opacity-[0.15] transition-opacity duration-500`} />
                
                {/* Top border accent */}
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Enhanced icon container */}
                  <motion.div 
                    className={`w-14 h-14 rounded-xl border flex items-center justify-center mb-6 transition-all duration-500 ${skill.iconBg} border-white/10 text-white group-hover:border-white/20`}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={springs.bouncy}
                    style={{
                      boxShadow: '0 0 20px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                  >
                    <skill.icon size={26} strokeWidth={1.5} className={`transition-all duration-300 ${
                      skill.accentColor === 'cyan' ? 'group-hover:text-cyan-400' :
                      skill.accentColor === 'amber' ? 'group-hover:text-amber-400' :
                      skill.accentColor === 'emerald' ? 'group-hover:text-emerald-400' :
                      'group-hover:text-purple-400'
                    }`} />
                  </motion.div>
                  
                  {/* Title with gradient on hover */}
                  <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight text-white">
                    {skill.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="leading-relaxed text-sm md:text-base mt-auto text-white/55 group-hover:text-white/70 transition-colors duration-300">
                    {skill.description}
                  </p>
                  
                  {/* Bottom accent line */}
                  <div className={`mt-6 h-0.5 w-12 rounded-full bg-gradient-to-r ${skill.gradient} opacity-40 group-hover:opacity-80 group-hover:w-20 transition-all duration-500`} />
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
          
          {/* Stats / Extra Card for Bento Grid balance */}
          <motion.div variants={itemVariants} className="md:col-span-1 h-full">
            <SpotlightCard className="p-8 h-full group">
              <AnimatedStatsCard isInView={isInView} />
            </SpotlightCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};