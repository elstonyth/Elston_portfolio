import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Github, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-lg' : 'bg-transparent py-6 border-b border-transparent'}`}
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
             <div className="relative w-full h-full bg-[#050505] border border-white/10 rounded-xl flex items-center justify-center text-white font-bold text-lg font-mono shadow-inner group-hover:scale-95 transition-transform duration-300">
               EY
             </div>
          </div>
          <span className="font-bold text-sm tracking-wider text-white group-hover:text-cyan-400 transition-colors hidden sm:block">
            ELSTON YEO
          </span>
        </a>

        {/* Desktop Links - Enhanced with sliding pill indicator */}
        <div className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg shadow-black/10" role="navigation" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a 
                key={link.id}
                href={`#${link.id}`}
                aria-label={`Navigate to ${link.label}`}
                aria-current={isActive ? 'page' : undefined}
                className="relative px-5 py-2 text-xs font-medium uppercase tracking-wider rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {/* Animated background pill */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-white/15 to-white/10 border border-white/20 shadow-lg shadow-cyan-500/20"
                    style={{ 
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)' 
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {/* Text */}
                <span className={`relative z-10 transition-colors duration-200 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-white/50 hover:text-white'
                }`}>
                  {link.label}
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
              className="relative p-2 text-white/50 hover:text-white rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="GitHub profile"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 rounded-full bg-white/0 hover:bg-white/10 transition-colors" />
              <Github size={18} className="relative z-10" />
            </motion.a>
            <motion.a 
              href="https://twitter.com/elstonyth" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative p-2 text-white/50 hover:text-white rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Twitter profile"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 rounded-full bg-white/0 hover:bg-white/10 transition-colors" />
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
          className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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
          className="md:hidden absolute top-[calc(100%+1px)] left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top-5 z-40"
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
                    ? 'text-white bg-white/10 border border-white/15'
                    : 'text-text-dim hover:text-white active:text-cyan-400'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <div className="h-px bg-white/10 my-2" role="separator" />
          <div className="flex gap-6 text-text-dim justify-center" role="group" aria-label="Social links">
            <a href="https://github.com/elstonyth" target="_blank" rel="noopener noreferrer" className="hover:text-white active:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded" aria-label="GitHub"><Github size={24} /></a>
            <a href="https://twitter.com/elstonyth" target="_blank" rel="noopener noreferrer" className="hover:text-white active:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded" aria-label="Twitter"><Twitter size={24} /></a>
            <a href="mailto:elstonyth@outlook.com" className="hover:text-white active:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded" aria-label="Email"><Mail size={24} /></a>
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
