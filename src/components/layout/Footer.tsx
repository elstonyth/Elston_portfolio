import React from 'react';
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { ResumeDownload } from './ResumeDownload';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 relative overflow-hidden">
        {/* Decorative gradient at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-20 md:pt-24 pb-10 md:pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-24">
          <div>
             <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8">
               Let's talk <br/>
               <span 
                 data-darkreader-inline-color=""
                 data-darkreader-inline-bgimage=""
                 data-darkreader-inline-bgcolor=""
                 style={{
                   background: 'linear-gradient(to right, #ffffff, rgba(255,255,255,0.8), rgba(255,255,255,0.4))',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   backgroundClip: 'text',
                   color: 'white'
                 }}>data & impact.</span>
             </h2>
             <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:elstonyth@outlook.com" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors">
                    Start a Conversation
                </a>
                <a href="mailto:elstonyth@outlook.com" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors backdrop-blur-sm">
                    elstonyth@outlook.com
                </a>
             </div>
          </div>

          <div className="flex flex-col justify-between">
            <p className="text-base md:text-lg text-text-dim leading-relaxed mb-12 max-w-md">
               I work across analytics, automation, and IT operations to help teams make better decisions and reduce manual work. Open to data roles, collaborations, and interesting problems.
            </p>
            
            <div className="flex gap-4">
                {[
                    { icon: Github, href: "https://github.com/elstonyth" },
                    { icon: Twitter, href: "#" },
                    { icon: Linkedin, href: "https://www.linkedin.com/in/elstonyth" },
                    { icon: Mail, href: "mailto:elstonyth@outlook.com" }
                ].map((social, i) => (
                    <a key={i} href={social.href} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 group">
                        <social.icon size={20} className="group-hover:rotate-12 transition-transform" />
                    </a>
                ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-text-dim font-mono uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} Elston Yeo. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <ResumeDownload variant="link" showIcon={false} />
            <a href="#" className="hover:text-white transition-colors">Process</a>
            <a href="mailto:elstonyth@outlook.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};