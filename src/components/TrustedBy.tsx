import React from 'react';
import { motion } from 'framer-motion';

const techStack = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "🔷" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "Vue.js", icon: "💚" },
  { name: "Python", icon: "🐍" },
  { name: "Node.js", icon: "🟢" },
  { name: "Express", icon: "🚂" },
  { name: "Django", icon: "🎸" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Redis", icon: "🔴" },
  { name: "GCP", icon: "☁️" },
  { name: "AWS", icon: "🟠" },
  { name: "Docker", icon: "🐳" },
  { name: "Kubernetes", icon: "☸️" },
  { name: "Git", icon: "📦" },
  { name: "Figma", icon: "🎯" },
  { name: "VS Code", icon: "💻" }
];

export const TrustedBy: React.FC = () => {
  return (
    <section className="py-32 border-t border-white/10 bg-transparent overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Tech Stack & Tools
            </h2>
            <p className="text-base md:text-lg text-white/60 font-mono uppercase tracking-wider">
              Technologies I work with
            </p>
          </motion.div>
          
          <div className="relative w-full overflow-hidden py-8">
            {/* Fade edges for polished look */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black via-black/50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black via-black/50 to-transparent z-10 pointer-events-none" />
            <div className="flex animate-marquee gap-8 md:gap-12">
              {/* First set */}
              <div className="flex gap-8 md:gap-12 items-center whitespace-nowrap">
                {techStack.map((tech, index) => (
                  <span 
                    key={tech.name + '-1'} 
                    className="text-xl md:text-2xl text-white/90 font-medium hover:text-white transition-all duration-300 cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5"
                  >
                    <span className="text-2xl md:text-3xl">{tech.icon}</span>
                    {tech.name}
                  </span>
                ))}
              </div>
              
              {/* Duplicate set for seamless loop */}
              <div className="flex gap-8 md:gap-12 items-center whitespace-nowrap">
                {techStack.map((tech, index) => (
                  <span 
                    key={tech.name + '-2'} 
                    className="text-xl md:text-2xl text-white/90 font-medium hover:text-white transition-all duration-300 cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5"
                  >
                    <span className="text-2xl md:text-3xl">{tech.icon}</span>
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};