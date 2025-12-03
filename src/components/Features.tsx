import React, { useRef, useState, useEffect } from 'react';
import { Server, Palette, Code, Cpu, Zap } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { motion, useInView, type Variants } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const skills = [
  {
    icon: Code,
    title: 'Analytics & Reporting',
    description: 'Python (Pandas, NumPy) and SQL for data validation, exploratory analysis, and building dashboards that teams rely on.',
    colSpan: "md:col-span-2",
    bg: ""
  },
  {
    icon: Zap,
    title: 'Workflow Automation',
    description: 'Python scripts and Google Sheets integrations that eliminate repetitive tasks and reduce input errors.',
    colSpan: "md:col-span-1",
    bg: ""
  },
  {
    icon: Palette,
    title: 'Cloud & Data Pipelines',
    description: 'Data pipelines and queries on GCP and SQL databases, built for reliability and easy maintenance.',
    colSpan: "md:col-span-1",
    bg: ""
  },
  {
    icon: Server,
    title: 'Data Reliability & Privacy',
    description: 'Backup, recovery, and privacy-first practices—including self-hosted infra—to keep data accurate and secure.',
    colSpan: "md:col-span-2",
    bg: ""
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
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
        initial={{ scale: 0.5, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      >
        <span className="gradient-text-animated">{yearsCount}+</span>
      </motion.div>
      <motion.div 
        className="text-sm text-text-dim uppercase tracking-widest font-medium group-hover:text-white/70 transition-colors duration-300"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        Years Experience
      </motion.div>
      
      {/* Decorative ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-white/5"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <motion.div
        className="absolute inset-8 rounded-full border border-dashed border-white/10"
        initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
        animate={isInView ? { scale: 1, opacity: 1, rotate: 360 } : {}}
        transition={{ 
          scale: { duration: 0.6, delay: 0.3 },
          opacity: { duration: 0.6, delay: 0.3 },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
      />
    </div>
  );
};

export const Features: React.FC = () => {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: '-100px', amount: 0.1 });

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 relative overflow-hidden">
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-left mb-16 max-w-2xl"
        >
           <div className={`flex items-center gap-2 mb-4 text-sm font-mono uppercase tracking-wider ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
             <Cpu size={14} />
             <span>Core Skills</span>
           </div>
           <h2 className={`text-4xl md:text-6xl font-bold tracking-tight mb-6 transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
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
           <p className={`text-lg leading-relaxed transition-colors duration-500 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
             I help teams turn complex operational data into reliable dashboards, automations, and insights they can act on.
           </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {skills.map((skill, index) => (
            <motion.div key={index} variants={itemVariants} className={`${skill.colSpan} h-full`}>
              <SpotlightCard className={`p-8 h-full group ${skill.bg}`}>
                <div className="relative z-10 flex flex-col h-full">
                  <motion.div 
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center mb-6 group-hover:border-cyan-400/30 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                    whileHover={{ 
                      scale: 1.15, 
                      rotate: [0, -10, 10, 0],
                      transition: { rotate: { duration: 0.5 } }
                    }}
                  >
                    <skill.icon size={24} strokeWidth={1.5} className="group-hover:text-cyan-500 transition-colors duration-300" />
                  </motion.div>
                  <h3 className={`text-2xl font-bold mb-3 tracking-tight group-hover:text-glow-hover transition-all duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>{skill.title}</h3>
                  <p className={`leading-relaxed text-base mt-auto transition-colors duration-300 ${
                    isDark ? 'text-white/60 group-hover:text-white/70' : 'text-slate-600 group-hover:text-slate-700'
                  }`}>
                    {skill.description}
                  </p>
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