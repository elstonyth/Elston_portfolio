import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// Preload critical components during loading
const preloadComponents = () => {
  return Promise.all([
    import('@/components/layout/Navbar'),
    import('@/features/preview/PreviewSection'),
    import('@/components/Features'),
    import('@/components/SelectedWork'),
    import('@/components/TrustedBy'),
    import('@/components/layout/Footer'),
  ]).catch(() => {
    // Silently handle preload failures
  });
};

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);

  const launch = useCallback(() => {
    if (!isReady || hasLaunched) return;
    setHasLaunched(true);
    onComplete();
  }, [hasLaunched, isReady, onComplete]);

  const handleClick = useCallback(() => {
    launch();
  }, [launch]);

  // Keyboard Enter support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        launch();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [launch]);

  // Detect touch / coarse pointer for dynamic wording
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia && window.matchMedia('(pointer: coarse)');
    const hasCoarsePointer = !!mql && mql.matches;
    const touchCapable = 'ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0);
    setIsTouch(hasCoarsePointer || touchCapable);
  }, []);

  // Auto-launch with a safety timeout on desktop; touch devices require explicit interaction
  useEffect(() => {
    if (!isReady) return;

    if (isTouch) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      launch();
    }, 6000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isReady, isTouch, launch]);

  // Loading logic
  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();
    const minDisplayTime = 1200;

    const loadAssets = async () => {
      try {
        const tasks = [
          { name: 'System initialization', weight: 5, duration: 150 },
          { name: 'Loading fonts', weight: 20, duration: 400 },
          { name: 'Preloading images', weight: 15, duration: 300 },
          { name: 'Initializing 3D engine', weight: 25, duration: 400 },
          { name: 'Loading components', weight: 20, duration: 300 },
          { name: 'Preparing animations', weight: 10, duration: 200 },
          { name: 'Finalizing', weight: 5, duration: 150 }
        ];

        let currentProgress = 0;

        // Task 1: System initialization
        if (!isMounted) return;
        await new Promise(resolve => setTimeout(resolve, tasks[0].duration));
        currentProgress += tasks[0].weight;
        setProgress(Math.min(Math.round(currentProgress), 100));

        // Task 2: Load fonts first (critical)
        if (!isMounted) return;
        
        const fontPromises = [
          document.fonts.load('1em "Plus Jakarta Sans"'),
          document.fonts.load('700 1em "Plus Jakarta Sans"'),
          document.fonts.load('1em "JetBrains Mono"')
        ];

        await Promise.allSettled(fontPromises);
        await document.fonts.ready;
        
        currentProgress += tasks[1].weight;
        setProgress(Math.min(Math.round(currentProgress), 100));

        // Task 3: Preload images and start component preloading
        if (!isMounted) return;
        
        // Start preloading components in parallel
        const componentPreloadPromise = preloadComponents();
        
        const steps = 8;
        let stepProgress = tasks[2].weight / steps;
        let stepDuration = tasks[2].duration / steps;

        for (let j = 0; j < steps; j++) {
          if (!isMounted) break;
          await new Promise(resolve => setTimeout(resolve, stepDuration));
          currentProgress += stepProgress;
          setProgress(Math.min(Math.round(currentProgress), 100));
        }

        // Task 4-7: Continue with remaining tasks
        for (let i = 3; i < tasks.length; i++) {
          if (!isMounted) break;
          
          const task = tasks[i];
          
          stepProgress = task.weight / steps;
          stepDuration = task.duration / steps;

          for (let j = 0; j < steps; j++) {
            if (!isMounted) break;
            
            await new Promise(resolve => setTimeout(resolve, stepDuration));
            currentProgress += stepProgress;
            setProgress(Math.min(Math.round(currentProgress), 100));
          }
        }

        // Ensure components are preloaded before continuing
        await componentPreloadPromise;

        // Ensure minimum display time
        const elapsed = Date.now() - startTime;
        if (elapsed < minDisplayTime) {
          await new Promise(resolve => setTimeout(resolve, minDisplayTime - elapsed));
        }

        if (!isMounted) return;

        // Wait for DOM to be ready
        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            window.addEventListener('load', resolve, { once: true });
          });
        }

        if (!isMounted) return;

        setProgress(100);
        
        // Set ready state instead of auto-launching
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (isMounted) {
          setIsReady(true);
        }
      } catch (error) {
        // Even on error, complete the loading after minimum time
        const elapsed = Date.now() - startTime;
        if (elapsed < minDisplayTime) {
          await new Promise(resolve => setTimeout(resolve, minDisplayTime - elapsed));
        }
        if (isMounted) {
          setProgress(100);
          setTimeout(() => setIsReady(true), 300);
        }
      }
    };

    loadAssets();

    return () => {
      isMounted = false;
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.6, delay: 0.2, ease: "easeInOut" }
      }}
      onClick={handleClick}
      style={{ cursor: isReady ? 'pointer' : 'default' }}
      className="preloader-container fixed inset-0 z-[100] bg-[#030305] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6,182,212,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139,92,246,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Ambient Glow */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] hidden md:block"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] hidden md:block"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16">
        <div className="w-full max-w-sm md:max-w-md mx-auto px-4 md:px-6 space-y-8">
        
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30, transition: { duration: 0.4, delay: 0.6 } }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <h1 
            className="text-xs md:text-sm font-semibold tracking-[0.35em] uppercase text-white/70"
          >
            ELSTON YEO · Full-Stack AI Developer
          </h1>
        </motion.div>

        {/* Spinning Gradient Loader */}
        {/* Loading UI */}
        <motion.div 
          className="w-full max-w-sm mx-auto space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.3, delay: 0 } }}
          transition={{ delay: 0.16, duration: 0.6 }}
          style={{ opacity: isReady ? 0.85 : 1 }}
        >
          {/* Progress Bar */}
          <div 
            className="relative w-full max-w-[500px] mx-auto h-3 rounded-[30px] overflow-hidden"
            style={{
              background: 'radial-gradient(circle, #1b2735, #090a0f)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
              border: '1px solid #313131'
            }}
          >
            {/* Progress Bar */}
            <motion.div 
              className="absolute top-0 left-0 h-full rounded-[30px]"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00f260, #0575e6)',
                boxShadow: '0 0 15px #00f260, 0 0 30px #0575e6'
              }}
              transition={{ duration: 0.1, ease: "linear" }}
            >
              {/* Ripple Effect */}
              <div 
                className="absolute top-1/2 left-1/2 w-[200%] h-[200%] opacity-50"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15), transparent)',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </motion.div>
            
            {/* Progress Text */}
            <div 
              className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-wider text-white z-10"
              style={{
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)'
              }}
            >
              {progress}%
            </div>
          </div>

          {/* Dynamic Status Text */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.24, duration: 0.5 }}
          >
            <motion.p
              className="text-white/55 text-xs font-mono tracking-wide"
              animate={
                progress < 100
                  ? { opacity: 1 }
                  : { opacity: [0.4, 1, 0.4] }
              }
              transition={
                progress < 100
                  ? { duration: 0.4 }
                  : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              }
            >
              {progress < 100
                ? 'Preparing experience...'
                : `Press Enter or ${isTouch ? 'tap' : 'click'} anywhere to launch.`}
            </motion.p>
          </motion.div>

        </motion.div>
        </div>
      </div>

      {/* Corner Decorations */}
    </motion.div>
  );
};
