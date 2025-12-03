import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Github, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';

export const Navbar: React.FC = () => {
  const { isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ['home', 'about', 'work', 'contact'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Find all currently intersecting sections
        const visible = entries
          .filter((entry) => entry.isIntersecting && entry.target.id)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5], // Lower thresholds for earlier detection
        rootMargin: '-10% 0px -30% 0px', // Reduced margins
      }
    );

    // Function to observe sections (called initially and after delay for lazy-loaded content)
    const observeSections = () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };

    // Observe immediately
    observeSections();
    
    // Re-observe after lazy content loads
    const timeoutId = setTimeout(observeSections, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Work' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? isDark 
            ? 'bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-lg' 
            : 'bg-[#b8bfc9]/90 backdrop-blur-xl border-b border-gray-400/40 shadow-lg shadow-gray-500/20'
          : isDark 
            ? 'bg-transparent py-6 border-b border-transparent'
            : 'bg-[#b8bfc9]/50 backdrop-blur-sm py-6 border-b border-gray-400/20'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#home" 
          className="flex items-center gap-3 group cursor-pointer"
          aria-label="Elston Yeo - Home"
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-violet-500 rounded-xl blur opacity-20 group-hover:opacity-100 transition-opacity duration-500"></div>
             <div className={`relative w-full h-full border rounded-xl flex items-center justify-center font-bold text-lg font-mono shadow-inner group-hover:scale-95 transition-all duration-300 ${
               isDark 
                 ? 'bg-[#050505] border-white/10 text-white' 
                 : 'bg-white border-slate-200 text-slate-900'
             }`}>
               EY
             </div>
          </div>
          <span className={`font-bold text-sm tracking-wider group-hover:text-cyan-500 transition-colors hidden sm:block ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            ELSTON YEO
          </span>
        </a>

        {/* Desktop Links - Enhanced with sliding pill indicator */}
        <div className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-xl shadow-lg transition-colors duration-500 ${
          isDark 
            ? 'bg-white/5 border-white/10 shadow-black/10' 
            : 'bg-white/40 border-gray-400/30 shadow-gray-400/20'
        }`} role="navigation" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a 
                key={link.id}
                href={`#${link.id}`}
                aria-label={`Navigate to ${link.label}`}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-5 py-2 text-xs font-medium uppercase tracking-wider rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 ${
                  isDark ? 'focus-visible:ring-offset-black' : 'focus-visible:ring-offset-white'
                }`}
              >
                {/* Animated background pill */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill"
                    className={`absolute inset-0 rounded-full border shadow-lg ${
                      isDark 
                        ? 'bg-gradient-to-r from-white/15 to-white/10 border-white/20 shadow-cyan-500/20' 
                        : 'bg-white border-slate-200 shadow-slate-300/30'
                    }`}
                    style={{ 
                      boxShadow: isDark 
                        ? '0 0 20px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.08)'
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {/* Text with animated underline for non-active links */}
                <span className={`relative z-10 transition-colors duration-200 ${
                  isActive 
                    ? isDark ? 'text-white' : 'text-slate-900'
                    : isDark ? 'text-white/50 hover:text-white group' : 'text-slate-500 hover:text-slate-900 group'
                }`}>
                  {link.label}
                  {!isActive && (
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                  )}
                </span>
              </a>
            );
          })}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex gap-2" role="group" aria-label="Social links">
            <motion.a 
              href="https://github.com/elstonyth" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`relative p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isDark ? 'text-white/50 hover:text-white' : 'text-slate-400 hover:text-slate-900'
              }`}
              aria-label="GitHub profile"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={`absolute inset-0 rounded-full transition-colors ${
                isDark ? 'bg-white/0 hover:bg-white/10' : 'bg-slate-900/0 hover:bg-slate-100'
              }`} />
              <Github size={18} className="relative z-10" />
            </motion.a>
            <motion.a 
              href="https://twitter.com/elstonyth" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`relative p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isDark ? 'text-white/50 hover:text-white' : 'text-slate-400 hover:text-slate-900'
              }`}
              aria-label="Twitter profile"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={`absolute inset-0 rounded-full transition-colors ${
                isDark ? 'bg-white/0 hover:bg-white/10' : 'bg-slate-900/0 hover:bg-slate-100'
              }`} />
              <Twitter size={18} className="relative z-10" />
            </motion.a>
          </div>
          <Button
            as="a"
            href="#contact"
            variant="primary"
            size="sm"
            className="ml-2 rounded-full px-6"
          >
            Contact Me
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`md:hidden p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
            isDark ? 'text-white hover:bg-white/5' : 'text-slate-900 hover:bg-slate-100'
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className={`md:hidden absolute top-[calc(100%+1px)] left-0 right-0 backdrop-blur-xl border-b p-6 flex flex-col gap-4 animate-in slide-in-from-top-5 z-40 ${
            isDark 
              ? 'bg-[#030305]/95 border-white/10' 
              : 'bg-[#b8bfc9]/95 border-gray-400/40'
          }`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium rounded px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isActive 
                    ? isDark 
                      ? 'text-white bg-white/10 border border-white/15'
                      : 'text-slate-900 bg-slate-100 border border-slate-200'
                    : isDark 
                      ? 'text-white/60 hover:text-white active:text-cyan-400'
                      : 'text-slate-500 hover:text-slate-900 active:text-cyan-600'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <div className={`h-px my-2 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} role="separator" />
          <div className={`flex gap-6 justify-center ${isDark ? 'text-white/60' : 'text-slate-400'}`} role="group" aria-label="Social links">
            <a href="https://github.com/elstonyth" target="_blank" rel="noopener noreferrer" className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`} aria-label="GitHub"><Github size={24} /></a>
            <a href="https://twitter.com/elstonyth" target="_blank" rel="noopener noreferrer" className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`} aria-label="Twitter"><Twitter size={24} /></a>
            <a href="mailto:elstonyth@outlook.com" className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`} aria-label="Email"><Mail size={24} /></a>
          </div>
          <Button
            as="a"
            href="#contact"
            className="w-full mt-2"
            aria-label="Contact Me"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact Me
          </Button>
        </div>
      )}
    </nav>
  );
};
