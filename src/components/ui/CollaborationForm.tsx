import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Mail, MessageSquare, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
// Dark mode only - no theme switching needed
import { easings, durations, springs } from '@/lib/animations';

export const CollaborationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '97f2b2b2-8d84-466b-87d8-e21cd1b5e1e8',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Portfolio Inquiry from ${formData.name}`,
        })
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isActive = isHovered || isFocused;

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: durations.slow, ease: easings.expo }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: easings.smooth as [number, number, number, number]
        }}
      >
        {/* Outer glow effect - always visible, stronger on hover */}
        <motion.div 
          className="absolute -inset-[3px] rounded-[24px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl"
          animate={{ 
            opacity: isActive ? 0.6 : 0.25,
            scale: isActive ? 1.02 : 1,
          }}
          transition={springs.smooth}
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
          className="relative rounded-[20px] p-8 overflow-hidden bg-[#212121]"
        >
          {/* Inner glow effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-purple-500/20 to-transparent blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/2 h-32 bg-gradient-to-tr from-cyan-500/10 to-transparent blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-1/2 h-32 bg-gradient-to-tl from-pink-500/10 to-transparent blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="relative text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 mb-4">
              <Sparkles className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Let's Collaborate</h3>
            <p className="text-sm text-white/50">Share your project idea and let's create something amazing together</p>
          </div>

          {/* Form fields */}
          <div className="relative space-y-4">
            {/* Name field */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500 ease-out" />
              <div className="relative flex items-center">
                <div className="absolute left-4 text-white/30 group-focus-within:text-cyan-500 transition-colors duration-300 ease-out">
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
                  className="w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-cyan-500/50 transition-all duration-500 ease-out bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/[0.07]"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500 ease-out" />
              <div className="relative flex items-center">
                <div className="absolute left-4 text-white/30 group-focus-within:text-cyan-500 transition-colors duration-300 ease-out">
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
                  className="w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-cyan-500/50 transition-all duration-500 ease-out bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/[0.07]"
                />
              </div>
            </div>

            {/* Message field */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500 ease-out" />
              <div className="relative">
                <div className="absolute left-4 top-4 text-white/30 group-focus-within:text-cyan-500 transition-colors duration-300 ease-out">
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
                  className="w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-cyan-500/50 transition-all duration-500 ease-out resize-none bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/[0.07]"
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`relative w-full mt-6 group ${isSubmitting ? 'cursor-not-allowed' : ''}`}
            whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            transition={springs.snappy}
          >
            {/* Button glow */}
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${
              submitStatus === 'success' 
                ? 'from-green-500 to-emerald-500' 
                : submitStatus === 'error'
                ? 'from-red-500 to-rose-500'
                : 'from-cyan-500 to-purple-500'
            } opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-500 ease-out`} />
            
            {/* Button content */}
            <div className={`relative flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r ${
              submitStatus === 'success' 
                ? 'from-green-500 to-emerald-500' 
                : submitStatus === 'error'
                ? 'from-red-500 to-rose-500'
                : 'from-cyan-500 to-purple-500'
            } text-white font-semibold shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-500 ease-out`}>
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="submitting"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: durations.fast, ease: easings.smooth }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 size={18} className="animate-spin" />
                    <span>Sending...</span>
                  </motion.div>
                ) : submitStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={springs.bouncy}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    <span>Message Sent!</span>
                  </motion.div>
                ) : submitStatus === 'error' ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: [0, -4, 4, -4, 4, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: durations.normal, ease: easings.smooth }}
                    className="flex items-center gap-2"
                  >
                    <AlertCircle size={18} />
                    <span>Failed - Try Again</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: durations.fast }}
                    className="flex items-center gap-2"
                  >
                    <span>Send Message</span>
                    <Send size={18} className="group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                  </motion.div>
                )}
              </AnimatePresence>
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
