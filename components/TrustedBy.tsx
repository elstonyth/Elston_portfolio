import React from 'react';
import { motion } from 'framer-motion';

const stacks = [
  "React", "Next.js", "TypeScript", "Python", "PostgreSQL", "GCP"
];

export const TrustedBy: React.FC = () => {
  return (
    <section className="py-20 border-t border-white/5 bg-black relative overflow-hidden">
       {/* Animated Background */}
       <motion.div 
         className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-black to-black pointer-events-none"
         animate={{
           opacity: [0.8, 1, 0.8],
         }}
         transition={{
           duration: 8,
           repeat: Infinity,
           ease: "easeInOut"
         }}
       />
       <motion.div 
         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"
         animate={{
           scale: [1, 1.2, 1],
           opacity: [0.3, 0.5, 0.3],
         }}
         transition={{
           duration: 10,
           repeat: Infinity,
           ease: "easeInOut"
         }}
       />
       
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-sm text-text-dim font-mono uppercase tracking-wider whitespace-nowrap">
                Popular frameworks & stacks
            </p>
            
            <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent md:block hidden" />

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center md:justify-end gap-8 md:gap-12 items-center opacity-50 hover:opacity-100 transition-opacity duration-500"
            >
            {stacks.map((stack, index) => (
                <motion.div 
                  key={stack} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-xl md:text-2xl font-bold text-white font-sans tracking-tighter cursor-default hover:text-cyan-400 transition-colors duration-300"
                >
                {stack}
                </motion.div>
            ))}
            </motion.div>
        </div>
      </div>
    </section>
  );
};