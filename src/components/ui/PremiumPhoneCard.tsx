import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface PremiumPhoneCardProps {
  className?: string;
}

export const PremiumPhoneCard: React.FC<PremiumPhoneCardProps> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`premium-phone-wrapper ${className}`} style={{ willChange: 'transform' }}>
      {/* Main background glow - simplified for performance */}
      <div 
        className="absolute -inset-8 rounded-[60px] opacity-40 blur-3xl pointer-events-none"
        style={{
          background: isDark 
            ? 'linear-gradient(40deg, #8983F7, #A3DAFB 70%)' 
            : 'linear-gradient(40deg, #FF0080, #FF8C00 70%)',
          willChange: 'opacity'
        }}
      />

      {/* Phone container */}
      <motion.div 
        className={`premium-phone relative z-10 w-72 h-[17rem] rounded-[40px] flex flex-col overflow-hidden transition-colors duration-500 ${
          isDark ? 'bg-[#26242E]' : 'bg-white/95'
        }`}
        style={{
          boxShadow: isDark 
            ? '0 25px 80px rgba(137, 131, 247, 0.25), 0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
            : '0 25px 80px rgba(255, 0, 128, 0.15), 0 10px 30px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)'
        }}
        whileHover={{ 
          y: -5,
          boxShadow: isDark 
            ? '0 35px 100px rgba(137, 131, 247, 0.35), 0 15px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' 
            : '0 35px 100px rgba(255, 0, 128, 0.25), 0 15px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9)'
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Status bar */}
        <div className={`flex justify-between items-center px-6 py-3 text-xs transition-colors duration-500 ${
          isDark ? 'text-white/40' : 'text-black/40'
        }`}>
          <span className="font-medium tracking-wide">4:20</span>
          <div className="flex items-center gap-2">
            {/* Network icon */}
            <div 
              className={`w-0 h-0 border-solid transition-colors duration-500`}
              style={{
                borderWidth: '0 5px 6px 5px',
                borderColor: `transparent transparent ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'} transparent`,
                transform: 'rotate(135deg)'
              }}
            />
            {/* Battery icon */}
            <div className={`w-4 h-2 rounded-sm transition-colors duration-500 ${
              isDark ? 'bg-white/40' : 'bg-black/40'
            }`} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Sun/Moon circle */}
          <motion.div 
            className="relative w-24 h-24 rounded-full mb-6"
            style={{
              background: isDark 
                ? 'linear-gradient(40deg, #8983F7, #A3DAFB 70%)' 
                : 'linear-gradient(40deg, #FF0080, #FF8C00 70%)',
              willChange: 'transform'
            }}
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Crescent overlay for moon effect */}
            <motion.div 
              className="absolute top-0 right-0 w-[4.5rem] h-[4.5rem] rounded-full"
              style={{
                background: isDark ? '#26242E' : 'transparent',
                transformOrigin: 'top right',
                willChange: 'transform, opacity'
              }}
              animate={{
                scale: isDark ? 1 : 0,
                opacity: isDark ? 1 : 0
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />
            
            {/* Glow effect */}
            <div 
              className="absolute inset-0 rounded-full blur-xl opacity-50"
              style={{
                background: isDark 
                  ? 'linear-gradient(40deg, #8983F7, #A3DAFB 70%)' 
                  : 'linear-gradient(40deg, #FF0080, #FF8C00 70%)'
              }}
            />
          </motion.div>

          {/* Toggle switch */}
          <button
            onClick={toggleTheme}
            className={`relative w-full h-11 rounded-full cursor-pointer transition-colors duration-200 ${
              isDark ? 'bg-white/10' : 'bg-black/10'
            }`}
            aria-label="Toggle theme"
          >
            {/* Toggle knob */}
            <motion.div 
              className="absolute top-0 h-11 w-1/2 rounded-full"
              style={{
                boxShadow: '0 2px 15px rgba(0,0,0,0.15)',
                willChange: 'transform'
              }}
              animate={{
                x: isDark ? '100%' : '0%',
                backgroundColor: isDark ? '#34323D' : '#ffffff'
              }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            />
            
            {/* Labels */}
            <div className="absolute inset-0 flex items-center justify-around px-4 text-sm font-semibold select-none">
              <motion.span 
                animate={{ 
                  opacity: isDark ? 0.5 : 1,
                  color: isDark ? '#ffffff' : '#000000'
                }}
                transition={{ duration: 0.3 }}
              >
                Light
              </motion.span>
              <motion.span 
                animate={{ 
                  opacity: isDark ? 1 : 0.5,
                  color: isDark ? '#ffffff' : '#000000'
                }}
                transition={{ duration: 0.3 }}
              >
                Dark
              </motion.span>
            </div>
          </button>
        </div>

        {/* Bottom notch indicator */}
        <div className="flex justify-center pb-2">
          <div className={`w-32 h-1 rounded-full transition-colors duration-500 ${
            isDark ? 'bg-white/20' : 'bg-black/10'
          }`} />
        </div>
      </motion.div>

      {/* Static decorative dots - no animation for performance */}
      <div 
        className="absolute w-1.5 h-1.5 rounded-full pointer-events-none opacity-40"
        style={{
          background: isDark ? '#A3DAFB' : '#FF8C00',
          left: '20%',
          top: '15%',
        }}
      />
      <div 
        className="absolute w-1 h-1 rounded-full pointer-events-none opacity-30"
        style={{
          background: isDark ? '#A3DAFB' : '#FF8C00',
          left: '75%',
          top: '25%',
        }}
      />
    </div>
  );
};

export default PremiumPhoneCard;
