import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md" role="navigation" aria-label="Primary">
          <a 
            href="#home" 
            className="px-5 py-2 text-xs font-medium uppercase tracking-wider text-text-dim hover:text-white hover:bg-white/10 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Navigate to Home"
          >
            Home
          </a>
          <a 
            href="#about" 
            className="px-5 py-2 text-xs font-medium uppercase tracking-wider text-text-dim hover:text-white hover:bg-white/10 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Navigate to About"
          >
            About
          </a>
          <a 
            href="#work" 
            className="px-5 py-2 text-xs font-medium uppercase tracking-wider text-text-dim hover:text-white hover:bg-white/10 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Navigate to Work"
          >
            Work
          </a>
          <a 
            href="#contact" 
            className="px-5 py-2 text-xs font-medium uppercase tracking-wider text-text-dim hover:text-white hover:bg-white/10 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Navigate to Contact"
          >
            Contact
          </a>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex gap-3" role="group" aria-label="Social links">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-text-dim hover:text-white hover:scale-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
              aria-label="GitHub profile"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-text-dim hover:text-white hover:scale-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
              aria-label="Twitter profile"
            >
              <Twitter size={20} />
            </a>
          </div>
          <a href="#contact">
            <Button variant="primary" size="sm" className="ml-2 rounded-full px-6">
              Contact Me
            </Button>
          </a>
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
          <a
            href="#home"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-text-dim hover:text-white active:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-2 py-1"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-text-dim hover:text-white active:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-2 py-1"
          >
            About
          </a>
          <a
            href="#work"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-text-dim hover:text-white active:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-2 py-1"
          >
            Work
          </a>
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-text-dim hover:text-white active:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-2 py-1"
          >
            Contact
          </a>
          <div className="h-px bg-white/10 my-2" role="separator" />
          <div className="flex gap-6 text-text-dim justify-center" role="group" aria-label="Social links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white active:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded" aria-label="GitHub"><Github size={24} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white active:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded" aria-label="Twitter"><Twitter size={24} /></a>
            <a href="mailto:contact@example.com" className="hover:text-white active:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded" aria-label="Email"><Mail size={24} /></a>
          </div>
          <a
            href="#contact"
            className="w-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Button className="w-full mt-2" aria-label="Contact Me">Contact Me</Button>
          </a>
        </div>
      )}
    </nav>
  );
};