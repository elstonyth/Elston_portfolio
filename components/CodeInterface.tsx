import React, { useState, useEffect } from 'react';
import { Copy, Check, MapPin, Briefcase, Star, Mail, Github, Twitter, ExternalLink, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotlightCard } from './SpotlightCard';
import { ResumeDownload } from './ResumeDownload';

type Token = {
  text: string;
  color?: string;
};

const PROFILE_TOKENS: Token[][] = [
  [{ text: "const", color: "text-pink-400" }, { text: " " }, { text: "profile", color: "text-cyan-300" }, { text: " = {" }],
  [{ text: "  " }, { text: "name", color: "text-cyan-300" }, { text: ": " }, { text: "'Elston Yeo'", color: "text-emerald-300" }, { text: "," }],
  [{ text: "  " }, { text: "role", color: "text-cyan-300" }, { text: ": " }, { text: "'Full-Stack AI Developer'", color: "text-emerald-300" }, { text: "," }],
  [{ text: "  " }, { text: "location", color: "text-cyan-300" }, { text: ": " }, { text: "'Malaysia 🇲🇾'", color: "text-emerald-300" }, { text: "," }],
  [{ text: "  " }, { text: "availability", color: "text-cyan-300" }, { text: ": " }, { text: "'Open for opportunities'", color: "text-emerald-300" }, { text: "," }],
  [{ text: "  " }, { text: "skills", color: "text-cyan-300" }, { text: ": [" }],
  [{ text: "    " }, { text: "'React'", color: "text-emerald-300" }, { text: ", " }, { text: "'TypeScript'", color: "text-emerald-300" }, { text: ", " }],
  [{ text: "    " }, { text: "'Node.js'", color: "text-emerald-300" }, { text: ", " }, { text: "'Design Systems'", color: "text-emerald-300" }],
  [{ text: "  ]" }],
  [{ text: "};" }],
  [{ text: "" }],
  [{ text: "export default", color: "text-violet-400" }, { text: " " }, { text: "profile", color: "text-cyan-300" }, { text: ";" }]
];

const CONTACT_TOKENS: Token[][] = [
  [{ text: "import", color: "text-violet-400" }, { text: " { Contact } " }, { text: "from", color: "text-violet-400" }, { text: " " }, { text: "'./components'", color: "text-emerald-300" }, { text: ";" }],
  [{ text: "" }],
  [{ text: "export const", color: "text-violet-400" }, { text: " " }, { text: "Footer", color: "text-yellow-200" }, { text: " = () => {" }],
  [{ text: "  " }, { text: "return", color: "text-violet-400" }, { text: " (" }],
  [{ text: "    <" }, { text: "Contact", color: "text-yellow-200" }],
  [{ text: "      " }, { text: "email", color: "text-cyan-300" }, { text: "=" }, { text: "\"hello@elston.dev\"", color: "text-emerald-300" }],
  [{ text: "      " }, { text: "socials", color: "text-cyan-300" }, { text: "={{" }],
  [{ text: "        " }, { text: "github", color: "text-cyan-300" }, { text: ": " }, { text: "\"@elstonyeo\"", color: "text-emerald-300" }, { text: "," }],
  [{ text: "        " }, { text: "twitter", color: "text-cyan-300" }, { text: ": " }, { text: "\"@elston_builds\"", color: "text-emerald-300" }],
  [{ text: "      }}" }],
  [{ text: "      " }, { text: "status", color: "text-cyan-300" }, { text: "=" }, { text: "\"online\"", color: "text-emerald-300" }],
  [{ text: "    />" }],
  [{ text: "  );" }],
  [{ text: "};" }]
];

const PROFILE_CODE_STRING = PROFILE_TOKENS.map(line => line.map(t => t.text).join('')).join('\n');
const CONTACT_CODE_STRING = CONTACT_TOKENS.map(line => line.map(t => t.text).join('')).join('\n');

const TypewriterCode = ({ tokens, isActive }: { tokens: Token[][], isActive: boolean }) => {
  const [charIndex, setCharIndex] = useState(0);
  
  useEffect(() => {
    if (isActive) {
      setCharIndex(0);
    }
  }, [isActive, tokens]);

  useEffect(() => {
    if (!isActive) return;
    
    const totalChars = tokens.flat().reduce((acc, t) => acc + t.text.length, 0) + (tokens.length - 1);
    
    if (charIndex >= totalChars) return;

    const timeout = setTimeout(() => {
      setCharIndex(prev => prev + 1);
    }, 15);

    return () => clearTimeout(timeout);
  }, [charIndex, isActive, tokens]);

  const renderContent = () => {
    let currentCount = 0;
    const result = [];

    for (let i = 0; i < tokens.length; i++) {
      const line = tokens[i];
      const lineContent = [];
      
      for (let j = 0; j < line.length; j++) {
        const token = line[j];
        const remaining = charIndex - currentCount;
        
        if (remaining <= 0) break;
        
        if (remaining >= token.text.length) {
          lineContent.push(
            <span key={`${i}-${j}`} className={token.color}>{token.text}</span>
          );
          currentCount += token.text.length;
        } else {
          lineContent.push(
            <span key={`${i}-${j}`} className={token.color}>{token.text.slice(0, remaining)}</span>
          );
          currentCount += remaining;
          break; 
        }
      }
      
      if (currentCount < charIndex) {
        currentCount++;
      } else {
        lineContent.push(
          <span key="cursor" className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 animate-cursor-blink align-middle"></span>
        );
        result.push(<div key={i}>{lineContent}</div>);
        break;
      }

      result.push(<div key={i}>{lineContent}</div>);
    }

    return <>{result}</>;
  };

  return <>{renderContent()}</>;
};

const ProfileView = () => (
  <motion.div 
    key="profile"
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="relative z-10 h-full flex flex-col justify-center"
  >
    <div className="flex items-start justify-between mb-8">
       <div className="relative">
         <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
         <div className="w-20 h-20 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center relative z-10 shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
           <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">EY</span>
         </div>
         <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0B0C0E] rounded-full flex items-center justify-center z-20 border border-white/5">
           <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
         </div>
       </div>

       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-medium backdrop-blur-md">
         <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
         Available
       </span>
    </div>
    
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-white tracking-tight mb-1">Elston Yeo</h2>
      <p className="text-white/50 font-medium text-sm">Full-Stack AI Developer</p>
    </div>

    <div className="grid grid-cols-2 gap-3 mb-8">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/stat">
        <div className="flex items-center gap-2 text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">
          <MapPin size={12} className="text-blue-400" /> Location
        </div>
        <div className="text-sm text-white/90 font-medium">Malaysia 🇲🇾</div>
      </div>
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/stat">
        <div className="flex items-center gap-2 text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">
          <Briefcase size={12} className="text-purple-400" /> Experience
        </div>
        <div className="text-sm text-white/90 font-medium">3+ Years</div>
      </div>
    </div>
    
    <div className="mb-8">
      <div className="text-xs text-white/40 mb-3 font-medium uppercase tracking-wider">Tech Stack</div>
      <div className="flex flex-wrap gap-2">
        {['React', 'TypeScript', 'Node.js', 'WebGL'].map(skill => (
          <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white/70 transition-all cursor-default">
            {skill}
          </span>
        ))}
      </div>
    </div>

    <div className="flex gap-3">
      <ResumeDownload variant="primary" />
      <button className="px-4 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/5 transition-colors">
        <Star size={18} />
      </button>
    </div>
  </motion.div>
);

const ContactView = () => (
  <motion.div 
    key="contact"
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="relative z-10 h-full flex flex-col justify-center"
  >
    <div className="mb-8">
       <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-lg">
         <Mail className="text-white w-8 h-8" />
       </div>
       <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Let's Talk</h2>
       <p className="text-white/50 font-medium text-sm leading-relaxed">
         Interested in building something together? I'm currently open for new opportunities and collaborations.
       </p>
    </div>

    <div className="space-y-4 mb-8">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
               <Mail size={18} />
             </div>
             <div>
               <div className="text-xs text-white/40 uppercase tracking-wider font-semibold">Email</div>
               <div className="text-white/90 font-medium">hello@elston.dev</div>
             </div>
           </div>
           <Copy size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <a href="#" className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group flex flex-col justify-between h-24">
           <Github size={24} className="text-white/60 group-hover:text-white transition-colors" />
           <div className="flex items-center justify-between">
             <span className="text-sm text-white/80 font-medium">GitHub</span>
             <ExternalLink size={14} className="text-white/20 group-hover:text-white/60" />
           </div>
        </a>
        <a href="#" className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group flex flex-col justify-between h-24">
           <Twitter size={24} className="text-blue-400/60 group-hover:text-blue-400 transition-colors" />
           <div className="flex items-center justify-between">
             <span className="text-sm text-white/80 font-medium">Twitter</span>
             <ExternalLink size={14} className="text-white/20 group-hover:text-white/60" />
           </div>
        </a>
      </div>
    </div>

    <button className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors shadow-lg shadow-white/5 flex items-center justify-center gap-2">
      <Send size={16} />
      Send Message
    </button>
  </motion.div>
);

export const CodeInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'contact'>('profile');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab === 'profile' ? PROFILE_CODE_STRING : CONTACT_CODE_STRING);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center mt-20">
      
      {/* Left: Code Editor */}
      <div className="relative group">
        {/* Glowing backdrop */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-50 transition duration-500 group-hover:opacity-75"></div>
        
        <SpotlightCard className="bg-surface/80">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <div className="flex items-center space-x-4">
               <button 
                onClick={() => setActiveTab('profile')}
                className={`text-xs font-medium transition-colors ${activeTab === 'profile' ? 'text-white' : 'text-text-dim hover:text-white'}`}
              >
                profile.ts
              </button>
              <button 
                onClick={() => setActiveTab('contact')}
                className={`text-xs font-medium transition-colors ${activeTab === 'contact' ? 'text-white' : 'text-text-dim hover:text-white'}`}
              >
                contact.tsx
              </button>
            </div>
            <button onClick={handleCopy} className="text-text-dim hover:text-white transition-colors">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          {/* Editor Body */}
          <div className="p-6 overflow-x-auto h-[300px] custom-scrollbar">
            <pre className="font-mono text-sm leading-relaxed">
              <code className="language-typescript font-mono">
                <TypewriterCode 
                  tokens={activeTab === 'profile' ? PROFILE_TOKENS : CONTACT_TOKENS} 
                  isActive={true}
                />
              </code>
            </pre>
          </div>
        </SpotlightCard>
      </div>

      {/* Right: Visual Preview */}
      <div className="relative h-full min-h-[500px] flex items-center justify-center perspective-1000">
        {/* Ambient Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/5 to-transparent blur-3xl -z-10"></div>

        <SpotlightCard className="w-full max-w-sm bg-black/20 border-white/10 backdrop-blur-md shadow-2xl overflow-hidden group rounded-3xl">
           {/* Glass Gradient Header */}
           <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
           
           <div className="p-8">
             <AnimatePresence mode="wait">
               {activeTab === 'profile' ? (
                 <ProfileView key="profile" />
               ) : (
                 <ContactView key="contact" />
               )}
             </AnimatePresence>
           </div>
        </SpotlightCard>
      </div>
    </div>
  );
};
