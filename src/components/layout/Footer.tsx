import React from 'react';
import { ResumeDownload } from './ResumeDownload';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm font-mono uppercase tracking-wider text-white/50">
          <p>&copy; {new Date().getFullYear()} Elston Yeo. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <ResumeDownload variant="link" showIcon={false} />
            <a href="#work" className="transition-colors duration-200 hover:text-white">Work</a>
            <a href="#contact" className="transition-colors duration-200 hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};