import React from 'react';
import { ResumeDownload } from './ResumeDownload';
import { useTheme } from '@/context/ThemeContext';

export const Footer: React.FC = () => {
  const { isDark } = useTheme();
  
  return (
    <footer className={`relative overflow-hidden border-t transition-colors duration-500 ${
      isDark ? 'border-white/5' : 'border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className={`flex flex-col md:flex-row items-center justify-between text-sm font-mono uppercase tracking-wider transition-colors duration-500 ${
          isDark ? 'text-white/50' : 'text-slate-500'
        }`}>
          <p>&copy; {new Date().getFullYear()} Elston Yeo. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <ResumeDownload variant="link" showIcon={false} />
            <a href="#work" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Work</a>
            <a href="#contact" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};