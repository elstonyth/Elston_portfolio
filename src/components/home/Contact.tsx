import React from 'react';
import { motion } from 'framer-motion';
import { CollaborationForm } from '@/components/ui/CollaborationForm';

const socials = [
  { 
    href: "https://github.com/elstonyth", 
    label: "GitHub", 
    icon: <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/> 
  },
  { 
    href: "https://twitter.com/elstonyth", 
    label: "Twitter", 
    icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> 
  },
  { 
    href: "https://linkedin.com/in/elstonyth", 
    label: "LinkedIn", 
    icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> 
  },
];

export const Contact: React.FC = () => {
  return (
    <motion.section 
      id="contact"
      data-section="cta"
      className="py-16 md:py-40 px-4 md:px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <motion.div 
          className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.45, 0.3],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: [0.45, 0, 0.55, 1],
            repeatType: "mirror"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.35, 0.5, 0.35],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: [0.45, 0, 0.55, 1],
            repeatType: "mirror"
          }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[80px]"
          animate={{ 
            x: [0, 30, 0],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ 
            duration: 14, 
            repeat: Infinity, 
            ease: [0.45, 0, 0.55, 1],
            repeatType: "mirror"
          }}
        />
      </div>

      {/* Top Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative max-w-5xl mx-auto z-10">
        {/* Two Column CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: 0.1,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 leading-[1.1] text-primary">
              Let's talk<br />
              data &{' '}
              <span className="bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
                impact.
              </span>
            </h2>

            <p className="text-base md:text-lg mb-8 max-w-md text-secondary">
              Open to data/analytics engineering roles and interesting collaborations. Let's build something meaningful together.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <a 
                href="mailto:elstonyth@outlook.com?subject=Let's%20Collaborate"
                className="group inline-flex items-center px-6 py-3 rounded-full font-medium text-sm transition-all duration-500 ease-out bg-primary text-background hover:opacity-90 hover:shadow-lg"
              >
                <span>Start a Conversation</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a 
                href="mailto:elstonyth@outlook.com"
                className="inline-flex items-center px-6 py-3 rounded-full border font-medium text-sm transition-all duration-500 ease-out border-border text-secondary hover:bg-glass-bg hover:border-border-hover hover:shadow-lg"
              >
                elstonyth@outlook.com
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socials.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border flex items-center justify-center hover:scale-105 transition-all duration-500 ease-out border-border bg-glass-bg text-muted hover:text-primary hover:border-border-hover hover:bg-card"
                  aria-label={social.label}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">{social.icon}</svg>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <CollaborationForm />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
