import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HolographicCard } from '@/components/ui/HolographicCard';
import { TextScramble, TextReveal } from '@/components/TextScramble';
import { safeBrowserAPI } from '@/lib/utils';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  outcome: string;
  image: string;
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
    description: "SQL-driven data validation and monitoring to reduce errors and support regulatory compliance for large pharmaceutical datasets.",
    outcome: "Cut validation errors by ~30% and improved audit readiness.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2564&auto=format&fit=crop",
    tech: ["SQL", "Data Integrity", "Reporting"],
    links: { demo: "#", github: "#" },
    color: "from-cyan-500/20 to-blue-500/20"
  },
  {
    id: 2,
    title: "Automated Data Workflows",
    category: "Python & Automation",
    description: "Python and Google Sheets workflows that cut manual data entry errors by 30% and save hours of repetitive work each week.",
    outcome: "Saved 10–15 hours of manual spreadsheet work per month.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2832&auto=format&fit=crop",
    tech: ["Python", "Google Sheets", "Automation"],
    links: { demo: "#", github: "#" },
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: 3,
    title: "Learning & Privacy Lab",
    category: "Self-hosting & AI",
    description: "Dockerized, privacy-first stack (Nextcloud, Vaultwarden, AI workflows) to improve data ownership and experiment with GenAI automation.",
    outcome: "Centralised self-hosted tools for experimenting without sending data to third-party clouds.",
    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=2574&auto=format&fit=crop",
    tech: ["Docker", "VPS", "GenAI"],
    links: { demo: "#", github: "#" },
    color: "from-emerald-500/20 to-teal-500/20"
  }
];

const ProjectCard: React.FC<{ project: Project; index: number; reducedMotion: boolean }> = ({ project, index, reducedMotion }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: reducedMotion ? 0.5 : 0.7, delay: reducedMotion ? 0 : index * 0.2 }}
      className="mb-24 md:mb-32 last:mb-0"
    >
      <HolographicCard intensity="minimal" className={`p-0 bg-gradient-to-br ${project.color}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:h-[420px] lg:h-[480px]">
            
          {/* Content Side */}
          <div className="p-8 md:p-12 flex flex-col justify-between order-2 lg:order-1 lg:h-full relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <div className="h-px w-8 bg-white/30" />
                 <span className="text-xs font-mono uppercase tracking-widest text-white/70">{project.category}</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
                {project.title}
              </h3>
              
              <div className="mb-6">
                <div className="text-base md:text-lg text-text-dim leading-relaxed max-w-md min-h-[3rem]">
                  {reducedMotion ? (
                    <p>{project.description}</p>
                  ) : (
                    <TextReveal text={project.description} delay={0.2} />
                  )}
                </div>
                <p className="text-sm text-emerald-300 font-medium mt-3">
                  Outcome: {project.outcome}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 font-mono pill-hover cursor-default">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-6">
              {project.links.demo !== '#' ? (
                <Button as="a" href={project.links.demo} variant="primary" className="group">
                  View Project 
                  <ArrowUpRight size={16} className="ml-2 group-hover:rotate-45 transition-transform" />
                </Button>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
                  Case Study Coming
                </span>
              )}
              {project.links.github !== '#' && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all">
                  <Github size={20} />
                </a>
              )}
            </div>
            </div>
          </div>

          {/* Image Side (Parallax) */}
          <div className="relative h-[320px] sm:h-[360px] lg:h-full overflow-hidden order-1 lg:order-2 group rounded-r-2xl">
             <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/0 transition-colors duration-500" />
             <div className="relative h-full w-full overflow-hidden">
               <motion.img 
                  whileHover={reducedMotion ? undefined : { scale: 1.08 }}
                  transition={reducedMotion ? undefined : { duration: 0.7, ease: "easeOut" }}
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
               />
             </div>
             
             {/* Gradient overlay on hover */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-15" />
             
             {/* Hover Overlay */}
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white breathing-glow">
                   <span className="font-mono text-xs uppercase tracking-widest">Explore</span>
                </div>
             </div>
          </div>
        </div>
      </HolographicCard>
    </motion.div>
  );
};

export const SelectedWork: React.FC = () => {
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
              <p className="text-xs uppercase tracking-mega text-white/50 mb-3">
                Selected Work · Analytics
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-6xl font-bold tracking-tighter text-white mb-4 md:mb-6 flex flex-wrap gap-x-3">
                Analytics 
                <span 
                  className="relative inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-white bg-clip-text text-transparent"
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
              <p className="text-base md:text-xl text-text-dim leading-relaxed">
                A selection of analytics, automation, and self-hosted projects that improved data quality, efficiency, and reliability.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white/60">
                <div>
                  <p className="font-mono text-white/50">Error Reduction</p>
                  <p className="text-white/80">Up to 30% fewer data issues</p>
                </div>
                <div>
                  <p className="font-mono text-white/50">Time Saved</p>
                  <p className="text-white/80">Hours of manual work automated</p>
                </div>
                <div>
                  <p className="font-mono text-white/50">Stack</p>
                  <p className="text-white/80">SQL · Python · Docker</p>
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
