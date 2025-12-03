import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const techStack = [
  { name: "React", color: "from-cyan-400 to-blue-500" },
  { name: "Next.js", color: "from-white to-gray-400" },
  { name: "TypeScript", color: "from-blue-400 to-blue-600" },
  { name: "Tailwind", color: "from-cyan-400 to-teal-500" },
  { name: "Vue.js", color: "from-emerald-400 to-green-500" },
  { name: "Python", color: "from-yellow-400 to-blue-500" },
  { name: "Node.js", color: "from-green-400 to-emerald-500" },
  { name: "Express", color: "from-gray-300 to-gray-500" },
  { name: "Django", color: "from-green-500 to-emerald-600" },
  { name: "PostgreSQL", color: "from-blue-400 to-indigo-500" },
  { name: "MongoDB", color: "from-green-400 to-lime-500" },
  { name: "Redis", color: "from-red-400 to-rose-500" },
  { name: "GCP", color: "from-blue-400 to-red-400" },
  { name: "AWS", color: "from-orange-400 to-yellow-500" },
  { name: "Docker", color: "from-blue-400 to-cyan-500" },
  { name: "Kubernetes", color: "from-blue-500 to-indigo-500" },
  { name: "Git", color: "from-orange-400 to-red-500" },
  { name: "Figma", color: "from-purple-400 to-pink-500" },
  { name: "VS Code", color: "from-blue-400 to-cyan-400" }
];

export const TrustedBy: React.FC = () => {
  const { isDark } = useTheme();
  
  return (
    <section className="py-32 bg-transparent overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 tracking-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Tech Stack & Tools
            </h2>
            <p className={`text-base md:text-lg font-mono uppercase tracking-wider transition-colors duration-500 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              Technologies I work with
            </p>
          </motion.div>
          
          <div className="relative w-full overflow-hidden py-8">
            {/* Fade edges - theme aware */}
            <div className={`absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none transition-colors duration-500 ${
              isDark 
                ? 'bg-gradient-to-r from-[#030305] via-[#030305]/80 to-transparent' 
                : 'bg-gradient-to-r from-[#e8eaef] via-[#e8eaef]/80 to-transparent'
            }`} />
            <div className={`absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none transition-colors duration-500 ${
              isDark 
                ? 'bg-gradient-to-l from-[#030305] via-[#030305]/80 to-transparent' 
                : 'bg-gradient-to-l from-[#e8eaef] via-[#e8eaef]/80 to-transparent'
            }`} />
            <div className="flex animate-marquee gap-8 md:gap-12" style={{ willChange: 'transform', contain: 'content' }}>
              {/* First set */}
              <div className="flex gap-8 md:gap-12 items-center whitespace-nowrap">
                {techStack.map((tech) => (
                  <motion.span 
                    key={tech.name + '-1'} 
                    className={`text-xl md:text-2xl font-medium transition-all duration-300 cursor-pointer flex items-center gap-3 px-4 py-2 rounded-xl tech-item-glow border border-transparent group ${
                      isDark 
                        ? 'text-white/90 hover:text-white hover:border-white/10' 
                        : 'text-slate-700 hover:text-slate-900 hover:border-slate-200 hover:bg-white'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <motion.span 
                      className={`w-3 h-3 rounded-full bg-gradient-to-r ${tech.color} shadow-lg`}
                      whileHover={{ scale: 1.3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    />
                    <span className="group-hover:text-gradient-hover">{tech.name}</span>
                  </motion.span>
                ))}
              </div>
              
              {/* Duplicate set for seamless loop */}
              <div className="flex gap-8 md:gap-12 items-center whitespace-nowrap">
                {techStack.map((tech) => (
                  <motion.span 
                    key={tech.name + '-2'} 
                    className={`text-xl md:text-2xl font-medium transition-all duration-300 cursor-pointer flex items-center gap-3 px-4 py-2 rounded-xl tech-item-glow border border-transparent group ${
                      isDark 
                        ? 'text-white/90 hover:text-white hover:border-white/10' 
                        : 'text-slate-700 hover:text-slate-900 hover:border-slate-200 hover:bg-white'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <motion.span 
                      className={`w-3 h-3 rounded-full bg-gradient-to-r ${tech.color} shadow-lg`}
                      whileHover={{ scale: 1.3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    />
                    <span className="group-hover:text-gradient-hover">{tech.name}</span>
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};