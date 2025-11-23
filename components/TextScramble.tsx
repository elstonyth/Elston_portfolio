import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface TextScrambleProps {
  text: string;
  className?: string;
  speed?: number;
  scrambleSpeed?: number;
  characters?: string;
  trigger?: boolean;
  onComplete?: () => void;
}

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = '',
  speed = 50,
  scrambleSpeed = 20,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?',
  trigger = true,
  onComplete,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef(0);
  const resolveRef = useRef(0);

  useEffect(() => {
    if (!trigger) return;

    setIsScrambling(true);
    let frame = 0;
    const targetLength = text.length;
    const scrambleChars = characters.split('');

    const scramble = () => {
      let output = '';
      const resolve = Math.floor(frame / speed);

      for (let i = 0; i < targetLength; i++) {
        if (i < resolve) {
          output += text[i];
        } else {
          output += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }

      setDisplayText(output);

      if (resolve < targetLength) {
        frame++;
        frameRef.current = requestAnimationFrame(scramble);
      } else {
        setIsScrambling(false);
        setDisplayText(text);
        if (onComplete) onComplete();
      }
    };

    scramble();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [text, trigger, speed, characters, onComplete]);

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {displayText.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: index * 0.02,
          }}
          style={{
            color: isScrambling && index >= resolveRef.current ? 'rgba(0, 255, 255, 0.5)' : 'inherit',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const TextReveal: React.FC<{
  text: string;
  className?: string;
  delay?: number;
}> = ({ text, className = '', delay = 0 }) => {
  return (
    <motion.span className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
};

export const TextGlitch: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = '' }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      {isGlitching && (
        <>
          <motion.span
            className="absolute top-0 left-0 z-0"
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: [-2, 2, -2], opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.2 }}
            style={{
              color: 'rgba(0, 255, 255, 0.8)',
              textShadow: '2px 0 rgba(0, 255, 255, 0.8)',
            }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute top-0 left-0 z-0"
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: [2, -2, 2], opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.2, delay: 0.05 }}
            style={{
              color: 'rgba(255, 0, 255, 0.8)',
              textShadow: '-2px 0 rgba(255, 0, 255, 0.8)',
            }}
          >
            {text}
          </motion.span>
        </>
      )}
    </span>
  );
};
