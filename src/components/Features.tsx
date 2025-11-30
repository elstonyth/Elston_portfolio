import React from 'react';
import { Server, Palette, Code, Cpu, Zap } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { motion, useInView, type Variants } from 'framer-motion';
import { useRef } from 'react';

const skills = [
  {
    icon: Code,
    title: 'Programming & Analytics',
    description: 'Python (Pandas, NumPy) and SQL for exploratory analysis, data validation, and reporting.',
    colSpan: "md:col-span-2",
    bg: ""
  },
  {
    icon: Zap,
    title: 'Automation & Workflows',
    description: 'Python and Google Sheets automations that reduce manual effort and input errors.',
    colSpan: "md:col-span-1",
    bg: ""
  },
  {
    icon: Palette,
    title: 'Cloud & Databases',
    description: 'Designing data pipelines and queries on Google Cloud Platform and SQL databases.',
    colSpan: "md:col-span-1",
    bg: ""
  },
  {
    icon: Server,
    title: 'Data Management & Reliability',
    description: 'Backup, recovery, and privacy-conscious practices to keep data accurate and available.',
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

export const Features: React.FC = () => {
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
           <div className="flex items-center gap-2 mb-4 text-cyan-400 text-sm font-mono uppercase tracking-wider">
             <Cpu size={14} />
             <span>Core Skills</span>
           </div>
           <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
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
           <p className="text-lg text-text-dim leading-relaxed">
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
                  <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:border-cyan-400/30 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    <skill.icon size={24} strokeWidth={1.5} className="group-hover:text-cyan-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-glow-hover transition-all duration-300">{skill.title}</h3>
                  <p className="text-text-dim leading-relaxed text-base mt-auto group-hover:text-white/70 transition-colors duration-300">
                    {skill.description}
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
          
          {/* Stats / Extra Card for Bento Grid balance */}
          <motion.div variants={itemVariants} className="md:col-span-1 h-full">
            <SpotlightCard className="p-8 h-full group">
              <div className="relative z-10 flex flex-col h-full justify-center items-center text-center">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  <span className="gradient-text-animated">3+</span>
                </div>
                <div className="text-sm text-text-dim uppercase tracking-widest font-medium group-hover:text-white/70 transition-colors duration-300">Years Experience</div>
              </div>
            </SpotlightCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};