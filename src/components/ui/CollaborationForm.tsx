import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const CollaborationForm: React.FC = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open mailto with form data
    const subject = encodeURIComponent(`Project Inquiry from ${formData.name}`);
    const body = encodeURIComponent(`Hi Elston,\n\n${formData.message}\n\nBest regards,\n${formData.name}\n${formData.email}`);
    window.location.href = `mailto:elstonyth@outlook.com?subject=${subject}&body=${body}`;
  };

  const isActive = isHovered || isFocused;

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: [0.45, 0, 0.55, 1],
          repeatType: "mirror"
        }}
      >
        {/* Outer glow effect - always visible, stronger on hover */}
        <motion.div 
          className="absolute -inset-[3px] rounded-[24px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl"
          animate={{ 
            opacity: isActive ? 0.6 : 0.25,
            scale: isActive ? 1.02 : 1,
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.1, 0.25, 1] 
          }}
        />
        
        {/* Animated gradient border */}
        <motion.div 
          className="relative p-[2px] rounded-[22px] overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
            backgroundSize: '300% 100%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {/* Main card */}
          <form 
          onSubmit={handleSubmit}
          className={`relative rounded-[20px] p-8 overflow-hidden transition-colors duration-500 ${
            isDark ? 'bg-[#212121]' : 'bg-[#f5f6f8]'
          }`}
        >
          {/* Inner glow effects */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-purple-500/20 to-transparent blur-2xl pointer-events-none ${isDark ? 'opacity-100' : 'opacity-50'}`} />
          <div className={`absolute bottom-0 left-0 w-1/2 h-32 bg-gradient-to-tr from-cyan-500/10 to-transparent blur-2xl pointer-events-none ${isDark ? 'opacity-100' : 'opacity-50'}`} />
          <div className={`absolute bottom-0 right-0 w-1/2 h-32 bg-gradient-to-tl from-pink-500/10 to-transparent blur-2xl pointer-events-none ${isDark ? 'opacity-100' : 'opacity-50'}`} />

          {/* Header */}
          <div className="relative text-center mb-8">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border mb-4 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <Sparkles className={`w-7 h-7 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Let's Collaborate</h3>
            <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Share your project idea and let's create something amazing together</p>
          </div>

          {/* Form fields */}
          <div className="relative space-y-4">
            {/* Name field */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500 ease-out" />
              <div className="relative flex items-center">
                <div className={`absolute left-4 group-focus-within:text-cyan-500 transition-colors duration-300 ease-out ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-cyan-500/50 transition-all duration-500 ease-out ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/[0.07]' 
                      : 'bg-white/60 border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:bg-white/80 focus:border-cyan-500'
                  }`}
                />
              </div>
            </div>

            {/* Email field */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500 ease-out" />
              <div className="relative flex items-center">
                <div className={`absolute left-4 group-focus-within:text-cyan-500 transition-colors duration-300 ease-out ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-cyan-500/50 transition-all duration-500 ease-out ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/[0.07]' 
                      : 'bg-white/60 border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:bg-white/80 focus:border-cyan-500'
                  }`}
                />
              </div>
            </div>

            {/* Message field */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500 ease-out" />
              <div className="relative">
                <div className={`absolute left-4 top-4 group-focus-within:text-cyan-500 transition-colors duration-300 ease-out ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                  <MessageSquare size={18} />
                </div>
                <textarea
                  name="message"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                  rows={4}
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-cyan-500/50 transition-all duration-500 ease-out resize-none ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/[0.07]' 
                      : 'bg-white/60 border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:bg-white/80 focus:border-cyan-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            className="relative w-full mt-6 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25 
            }}
          >
            {/* Button glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-500 ease-out" />
            
            {/* Button content */}
            <div className="relative flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow duration-500 ease-out">
              <span>Send Message</span>
              <Send size={18} className="group-hover:translate-x-1 transition-transform duration-300 ease-out" />
            </div>
          </motion.button>

          {/* Decorative corner accents */}
          <div className="absolute top-3 left-3 w-3 h-3 border-l-2 border-t-2 border-cyan-500/30 rounded-tl" />
          <div className="absolute top-3 right-3 w-3 h-3 border-r-2 border-t-2 border-purple-500/30 rounded-tr" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-l-2 border-b-2 border-purple-500/30 rounded-bl" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 border-pink-500/30 rounded-br" />
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CollaborationForm;
