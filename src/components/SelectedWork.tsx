import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HolographicCard } from '@/components/ui/HolographicCard';
import { TextScramble, TextReveal } from '@/components/TextScramble';
import { safeBrowserAPI } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  outcome: string;
  tech: string[];
  links: {
    demo: string;
    github: string;
  };
  color: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Pharmaceutical Data Compliance System",
    category: "Analytics & Data Integrity",
    description: "Built SQL validation rules and automated monitoring dashboards for a pharma ops team struggling with inconsistent data quality and audit prep. Designed reusable checks that flag anomalies before reports go out.",
    outcome: "Reduced validation errors by ~30% and cut audit-prep time significantly.",
    tech: ["SQL", "Data Validation", "Dashboards", "Compliance"],
    links: { demo: "#", github: "#" },
    color: "from-cyan-500/20 to-blue-500/20"
  },
  {
    id: 2,
    title: "Automated Reporting Workflows",
    category: "Python & Automation",
    description: "Replaced error-prone manual spreadsheet processes with Python scripts and Google Sheets integrations. Automated data pulls, transformations, and formatting for recurring weekly/monthly reports.",
    outcome: "Saved 10–15 hours of manual work per month and reduced input errors by 30%.",
    tech: ["Python", "Google Sheets API", "Pandas", "Automation"],
    links: { demo: "#", github: "#" },
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: 3,
    title: "Privacy-First AI & Productivity Lab",
    category: "Self-Hosting & GenAI",
    description: "Deployed a Dockerized, self-hosted stack (Nextcloud, Vaultwarden, local LLM workflows) on a VPS to maintain data ownership while experimenting with GenAI automation for personal and client projects.",
    outcome: "Full control over data with zero reliance on third-party clouds for sensitive workflows.",
    tech: ["Docker", "Linux VPS", "Nextcloud", "GenAI", "LLMs"],
    links: { demo: "#", github: "#" },
    color: "from-emerald-500/20 to-teal-500/20"
  }
];

const AnalyticsIllustration: React.FC<{ id: number; color: string }> = ({ id, color }) => {
  const { isDark } = useTheme();
  // Extract base color for borders/accents
  const isBlue = color.includes('blue');
  const isPurple = color.includes('purple');
  
  // Use full class names for Tailwind JIT compatibility
  const glowBgClass = isBlue ? "bg-cyan-500/10" : isPurple ? "bg-purple-500/10" : "bg-emerald-500/10";

  return (
    <div className={`w-full h-full flex items-center justify-center backdrop-blur-sm border-l relative overflow-hidden ${
      isDark ? 'bg-black/40 border-white/5' : 'bg-white/30 border-gray-200/50'
    }`}>
      
      {/* Ambient Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 ${glowBgClass} blur-[80px] rounded-full`} />

      {/* ID 1: Line Chart (Error Reduction) */}
      {id === 1 && (
        <div className={`relative w-72 h-48 p-6 rounded-xl border shadow-2xl flex flex-col justify-between group overflow-hidden backdrop-blur-md ${
          isDark ? 'border-white/10 bg-white/5' : 'border-gray-200/60 bg-white/70'
        }`}>
          <div className="absolute inset-0 bg-grid-white/[0.02]" /> {/* Grid Texture */}
          
          <div className="relative flex justify-between items-start mb-4 z-10">
             <div className="space-y-2">
               <motion.div 
                 initial={{ width: 0 }} whileInView={{ width: 48 }} transition={{ duration: 0.8 }}
                 className={`h-1.5 rounded-full ${isDark ? 'bg-white/20' : 'bg-gray-300'}`}
               />
               <motion.div 
                 initial={{ width: 0 }} whileInView={{ width: 32 }} transition={{ duration: 0.8, delay: 0.1 }}
                 className={`h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
               />
             </div>
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ delay: 1, type: "spring" }}
               className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]`}
             >
               -30% ERR
             </motion.div>
          </div>
          
          <div className="relative flex-1 flex items-end z-10">
            <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-30">
              <div className={`w-full h-px dashed-line ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />
              <div className={`w-full h-px dashed-line ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />
              <div className={`w-full h-px dashed-line ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />
            </div>
            
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
              {/* Glow Path */}
              <motion.path
                d="M0,15 Q30,10 50,30 T100,45"
                fill="none"
                stroke="url(#gradientGlow)"
                strokeWidth="6"
                strokeLinecap="round"
                className="opacity-40 blur-sm"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              {/* Main Path */}
              <motion.path
                d="M0,15 Q30,10 50,30 T100,45"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#67e8f9" /> {/* Cyan-300 */}
                  <stop offset="100%" stopColor="#3b82f6" /> {/* Blue-500 */}
                </linearGradient>
                <linearGradient id="gradientGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
                   <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              
              {/* Animated Dot */}
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
              >
                 <circle cx="100" cy="45" r="5" fill="#3b82f6" fillOpacity="0.3" />
                 <circle cx="100" cy="45" r="3" fill="#3b82f6" />
              </motion.g>
            </svg>
          </div>
        </div>
      )}

      {/* ID 2: Bar Chart (Automation vs Manual) */}
      {id === 2 && (
        <div className={`relative w-72 h-48 p-6 rounded-xl border shadow-2xl flex flex-col items-center justify-center group overflow-hidden backdrop-blur-md ${
          isDark ? 'border-white/10 bg-white/5' : 'border-gray-200/60 bg-white/70'
        }`}>
           <div className="absolute inset-0 bg-grid-white/[0.02]" />
           
           <div className="flex items-end gap-8 h-28 w-full justify-center px-4 z-10">
              {/* Bar 1: Manual */}
              <div className="flex flex-col items-center gap-3 h-full">
                 <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   whileInView={{ height: 80, opacity: 1 }}
                   transition={{ duration: 0.8, delay: 0.2 }}
                   className={`w-10 rounded-t-lg border relative overflow-hidden ${
                     isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
                   }`}
                 >
                   <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" /> {/* Texture hint */}
                 </motion.div>
                 <span className={`text-[10px] font-mono tracking-widest ${isDark ? 'text-white/40' : 'text-gray-500'}`}>MANUAL</span>
              </div>

              {/* Arrow Icon */}
              <div className={`mb-10 ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
                 <ArrowUpRight className="rotate-90" size={20} />
              </div>

              {/* Bar 2: Auto */}
              <div className="flex flex-col items-center gap-3 h-full justify-end">
                 <div className="relative group-hover:-translate-y-1 transition-transform duration-500">
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: 35 }}
                      transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                      className="w-10 rounded-t-lg bg-gradient-to-t from-purple-600 to-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.4)]"
                    />
                    {/* Floating Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, type: "spring" }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                       <span className="text-[11px] font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 rounded-full shadow-lg border border-white/20">
                         -15h
                       </span>
                    </motion.div>
                 </div>
                 <span className="text-[10px] text-pink-200/70 font-mono font-bold tracking-widest shadow-[0_0_10px_rgba(236,72,153,0.2)]">AUTO</span>
              </div>
           </div>
        </div>
      )}

      {/* ID 3: Privacy Shield (Security) */}
      {id === 3 && (
        <div className={`relative w-72 h-48 p-6 rounded-xl border shadow-2xl flex items-center justify-center group overflow-hidden backdrop-blur-md ${
          isDark ? 'border-white/10 bg-white/5' : 'border-gray-200/60 bg-white/70'
        }`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />

          {/* Radar / Scan Effect */}
          <div className="relative flex items-center justify-center z-10">
             {/* Rotating Scanner */}
             <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-transparent via-emerald-500/20 to-transparent"
             />

             {[80, 55, 30].map((size, i) => (
               <motion.div
                 key={i}
                 initial={{ scale: 0.8, opacity: 0 }}
                 whileInView={{ scale: 1, opacity: [0.2, 0.5, 0.2] }}
                 transition={{ 
                   delay: i * 0.15, 
                   duration: 3, 
                   repeat: Infinity, 
                   ease: "easeInOut"
                 }}
                 style={{ width: size * 2, height: size * 2 }}
                 className={`absolute rounded-full border ${i === 0 ? 'border-emerald-500/20' : 'border-emerald-400/30'}`}
               />
             ))}
             
             {/* Center Shield Icon */}
             <motion.div 
               initial={{ scale: 0 }}
               whileInView={{ scale: 1 }}
               whileHover={{ scale: 1.1 }}
               transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
               className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-300/30 to-transparent opacity-50" />
                <div className="w-6 h-6 rounded-full border-[3px] border-emerald-100 flex items-center justify-center shadow-inner">
                  <div className="w-2 h-2 bg-emerald-200 rounded-full animate-pulse" />
                </div>
             </motion.div>
          </div>

          <div className="absolute bottom-5 left-0 right-0 text-center z-10">
             <motion.span 
               initial={{ opacity: 0, y: 5 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8 }}
               className={`text-[10px] font-mono tracking-[0.2em] uppercase px-3 py-1 rounded-full border ${
                 isDark 
                   ? 'text-emerald-400/80 bg-emerald-900/30 border-emerald-500/20' 
                   : 'text-emerald-600 bg-emerald-100/80 border-emerald-300/50'
               }`}
             >
                100% Private
             </motion.span>
          </div>
        </div>
      )}

    </div>
  );
};

const ProjectCard: React.FC<{ project: Project; index: number; reducedMotion: boolean }> = ({ project, index, reducedMotion }) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: reducedMotion ? 0.5 : 0.7, delay: reducedMotion ? 0 : index * 0.2 }}
      className="mb-24 md:mb-32 last:mb-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HolographicCard intensity="minimal" className={`p-0 bg-gradient-to-br ${project.color}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:h-[420px] lg:h-[480px]">
            
          {/* Content Side */}
          <div className={`p-8 md:p-12 flex flex-col justify-between order-2 lg:order-1 lg:h-full relative z-10 ${
            isDark ? '' : 'bg-white/40'
          }`}>
            <div>
              {/* Project Number Indicator */}
              <motion.div
                className="absolute -left-2 md:left-4 top-6 md:top-8 font-mono text-6xl md:text-8xl font-bold text-white/[0.03] select-none pointer-events-none"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {String(index + 1).padStart(2, '0')}
              </motion.div>

              <div className="flex items-center gap-2 mb-4">
                 <motion.div 
                   className={`h-px ${isDark ? 'bg-white/30' : 'bg-gray-400/50'}`}
                   initial={{ width: 0 }}
                   animate={isInView ? { width: 32 } : {}}
                   transition={{ duration: 0.6, delay: 0.2 }}
                 />
                 <motion.span 
                   className={`text-xs font-mono uppercase tracking-widest ${isDark ? 'text-white/70' : 'text-gray-600'}`}
                   initial={{ opacity: 0 }}
                   animate={isInView ? { opacity: 1 } : {}}
                   transition={{ duration: 0.4, delay: 0.4 }}
                 >
                   {project.category}
                 </motion.span>
              </div>
              
              <h3 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {project.title}
              </h3>
              
              <div className="mb-6">
                <div className={`text-base md:text-lg leading-relaxed max-w-md min-h-[3rem] ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  {reducedMotion ? (
                    <p>{project.description}</p>
                  ) : (
                    <TextReveal text={project.description} delay={0.2} />
                  )}
                </div>
                <p className="text-sm text-emerald-500 font-medium mt-3">
                  Outcome: {project.outcome}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
              {project.tech.map((t, techIndex) => (
                <motion.span 
                  key={t} 
                  className={`px-3 py-1 rounded-full border text-xs font-mono pill-hover cursor-default ${
                    isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-gray-100/80 border-gray-300/50 text-gray-600'
                  }`}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={isHovered || isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 0.3, 
                    delay: reducedMotion ? 0 : 0.5 + techIndex * 0.08,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    borderColor: 'rgba(34,211,238,0.3)'
                  }}
                >
                  {t}
                </motion.span>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-6">
              {project.links.demo !== '#' ? (
                <Button as="a" href={project.links.demo} variant="primary" className="group">
                  View Project 
                  <ArrowUpRight size={16} className="ml-2 group-hover:rotate-45 transition-transform" />
                </Button>
              ) : (
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${
                  isDark ? 'bg-white/5 border-white/10 text-white/50' : 'bg-gray-100/80 border-gray-300/50 text-gray-500'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
                  Case Study Coming
                </span>
              )}
              {project.links.github !== '#' && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-full border transition-all ${
                  isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white hover:text-black' : 'bg-gray-100 border-gray-300/50 text-gray-700 hover:bg-gray-900 hover:text-white'
                }`}>
                  <Github size={20} />
                </a>
              )}
            </div>
            </div>
          </div>

          {/* Visual Side (Code-based Illustration) */}
          <div className="relative h-[320px] sm:h-[360px] lg:h-full overflow-hidden order-1 lg:order-2 group rounded-r-2xl">
             <AnalyticsIllustration id={project.id} color={project.color} />
             
             {/* Hover Effect Overlay */}
             <div className="absolute inset-0 bg-black/0 group-hover:bg-white/5 transition-colors duration-500 pointer-events-none" />
          </div>
        </div>
      </HolographicCard>
    </motion.div>
  );
};

export const SelectedWork: React.FC = () => {
  const { isDark } = useTheme();
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluate = () => {
      const lowPower = safeBrowserAPI.getHardwareConcurrency() <= 4;
      const isTablet = window.innerWidth < 1024;
      setShouldReduceMotion(motionQuery.matches || lowPower || isTablet);
    };

    evaluate();
    const handleResize = () => evaluate();

    motionQuery.addEventListener?.('change', evaluate);
    window.addEventListener('resize', handleResize);

    return () => {
      motionQuery.removeEventListener?.('change', evaluate);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="py-24 md:py-32 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        <div ref={headerRef} className="mb-16 md:mb-24 flex flex-col md:flex-row items-end justify-between gap-8">
           <div className="max-w-2xl">
              <p className={`text-xs uppercase tracking-mega mb-3 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                Selected Work · Analytics
              </p>
              <h2 className={`text-2xl sm:text-3xl md:text-6xl font-bold tracking-tighter mb-4 md:mb-6 flex flex-wrap gap-x-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Analytics 
                <span 
                  className="relative inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
                >
                  {shouldReduceMotion ? (
                    <span>Case Studies</span>
                  ) : (
                    <TextScramble 
                      text="Case Studies" 
                      trigger={isHeaderInView}
                    />
                  )}
                </span>
              </h2>
              <p className={`text-base md:text-xl leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                A selection of analytics, automation, and self-hosted projects that improved data quality, efficiency, and reliability.
              </p>
              <div className={`mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                <div>
                  <p className={`font-mono ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Error Reduction</p>
                  <p className={isDark ? 'text-white/80' : 'text-slate-700'}>Up to 30% fewer data issues</p>
                </div>
                <div>
                  <p className={`font-mono ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Time Saved</p>
                  <p className={isDark ? 'text-white/80' : 'text-slate-700'}>Hours of manual work automated</p>
                </div>
                <div>
                  <p className={`font-mono ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Stack</p>
                  <p className={isDark ? 'text-white/80' : 'text-slate-700'}>SQL · Python · Docker</p>
                </div>
              </div>
           </div>
           <div className="mt-8 md:mt-0">
              <Button variant="outline" className="rounded-full px-8">
                View Full Portfolio
              </Button>
           </div>
        </div>

        <div>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} reducedMotion={shouldReduceMotion} />
          ))}
        </div>

      </div>
    </section>
  );
};
