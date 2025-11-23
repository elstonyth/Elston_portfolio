import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { Button } from './Button';
import { SpotlightCard } from './SpotlightCard';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
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
    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=2574&auto=format&fit=crop",
    tech: ["Docker", "VPS", "GenAI"],
    links: { demo: "#", github: "#" },
    color: "from-emerald-500/20 to-teal-500/20"
  }
];

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      className="mb-32 last:mb-0"
    >
      <SpotlightCard className={`p-0 overflow-hidden bg-gradient-to-br ${project.color} border-white/5`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:h-[480px]">
            
          {/* Content Side */}
          <div className="p-8 md:p-12 flex flex-col justify-center order-2 lg:order-1 lg:h-full">
            <div className="flex items-center gap-2 mb-6">
               <div className="h-px w-8 bg-white/30" />
               <span className="text-xs font-mono uppercase tracking-widest text-white/70">{project.category}</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              {project.title}
            </h3>
            
            <p className="text-lg text-text-dim leading-relaxed mb-8 max-w-md">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {project.tech.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 font-mono">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button variant="primary" className="group">
                View Project 
                <ArrowUpRight size={16} className="ml-2 group-hover:rotate-45 transition-transform" />
              </Button>
              <a href={project.links.github} className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Image Side (Parallax) */}
          <div className="relative h-[320px] sm:h-[360px] lg:h-full overflow-hidden order-1 lg:order-2 group cursor-none">
             <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
             <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover"
             />
             
             {/* Hover Overlay */}
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                   <span className="font-mono text-xs uppercase tracking-widest">Explore</span>
                </div>
             </div>
          </div>

        </div>
      </SpotlightCard>
    </motion.div>
  );
};

export const SelectedWork: React.FC = () => {
  return (
    <section className="py-32 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-8">
           <div className="max-w-2xl">
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8">
                Analytics <span 
                  data-darkreader-inline-color=""
                  data-darkreader-inline-bgimage=""
                  data-darkreader-inline-bgcolor=""
                  style={{
                    background: 'linear-gradient(to right, #c084fc, #f472b6, #ffffff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: '#c084fc'
                  }}>Case Studies</span>
              </h2>
              <p className="text-xl text-text-dim leading-relaxed">
                A selection of analytics, automation, and self-hosted projects that improved data quality, efficiency, and reliability.
              </p>
           </div>
           <div className="hidden md:block">
              <Button variant="outline" className="rounded-full px-8">
                View Full Portfolio
              </Button>
           </div>
        </div>

        <div>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};
