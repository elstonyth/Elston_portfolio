import React from 'react';
import { motion } from 'framer-motion';

export const LightLeaks: React.FC = () => {
  const leaks = [
    {
      id: 1,
      position: 'top-0 left-0',
      gradient: 'linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, transparent 50%)',
      width: '40%',
      height: '30%',
    },
    {
      id: 2,
      position: 'top-0 right-0',
      gradient: 'linear-gradient(225deg, rgba(168, 85, 247, 0.12) 0%, transparent 50%)',
      width: '35%',
      height: '25%',
    },
    {
      id: 3,
      position: 'bottom-0 left-0',
      gradient: 'linear-gradient(45deg, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
      width: '30%',
      height: '35%',
    },
    {
      id: 4,
      position: 'bottom-0 right-0',
      gradient: 'linear-gradient(315deg, rgba(59, 130, 246, 0.13) 0%, transparent 50%)',
      width: '38%',
      height: '28%',
    },
  ];

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {leaks.map((leak) => (
        <motion.div
          key={leak.id}
          className={`absolute ${leak.position}`}
          style={{
            width: leak.width,
            height: leak.height,
            background: leak.gradient,
            mixBlendMode: 'screen',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + leak.id * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: leak.id * 0.5,
          }}
        />
      ))}
    </div>
  );
};
