import React from 'react';
import { ResumeDownload } from './ResumeDownload';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm font-mono uppercase tracking-wider text-white/50">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Elston Yeo</p>
          <div className="flex gap-6 md:gap-8">
            <ResumeDownload variant="link" showIcon={false} />
            <a href="#work" className="transition-colors duration-200 hover:text-white">Work</a>
            <a href="#contact" className="transition-colors duration-200 hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};