import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Preload critical components during loading
const preloadComponents = () => {
  return Promise.all([
    import('../components/Navbar'),
    import('../components/PreviewSection'),
    import('../components/Features'),
    import('../components/SelectedWork'),
    import('../components/TrustedBy'),
    import('../components/Footer'),
  ]).catch(() => {
    // Silently handle preload failures
  });
};

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Initializing...');
  const [isReady, setIsReady] = useState(false);

  // Auto-launch fallback so the experience proceeds even without user input
  useEffect(() => {
    if (!isReady) return;

    const timeoutId = window.setTimeout(() => {
      onComplete();
    }, 900);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isReady, onComplete]);

  // Keyboard Enter support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isReady && e.key === 'Enter') {
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isReady, onComplete]);

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
        setCurrentTask(tasks[0].name);
        await new Promise(resolve => setTimeout(resolve, tasks[0].duration));
        currentProgress += tasks[0].weight;
        setProgress(Math.min(Math.round(currentProgress), 100));

        // Task 2: Load fonts first (critical)
        if (!isMounted) return;
        setCurrentTask(tasks[1].name);
        
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
        setCurrentTask(tasks[2].name);
        
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
          setCurrentTask(task.name);
          
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
        setCurrentTask('Complete');
        
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
          setCurrentTask('Complete');
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
      className="preloader-container fixed inset-0 z-[100] bg-[#030305] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 opacity-[0.15]">
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]"
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px]"
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-20">
        
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30, transition: { duration: 0.4, delay: 0.6 } }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 
            className="text-5xl md:text-7xl font-bold tracking-tight mb-3"
            style={{
              background: 'linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'white',
              textShadow: '0 0 40px rgba(255,255,255,0.2)',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
            data-darkreader-inline-color=""
            data-darkreader-inline-bgimage=""
            data-darkreader-inline-bgcolor=""
          >
            ELSTON YEO
          </h1>
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase">
            Full-Stack AI Developer
          </p>
        </motion.div>

        {/* Spinning Gradient Loader */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.5, delay: 0.3 } }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative flex items-center justify-center mb-12"
        >
          <div 
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: 'linear-gradient(to bottom, rgb(139, 92, 246), rgb(6, 182, 212))',
              filter: 'blur(1px)',
              boxShadow: '0 -5px 20px 0 rgb(139, 92, 246), 0 5px 20px 0 rgb(6, 182, 212)',
              animation: 'spinning 1.7s linear infinite',
              willChange: 'transform'
            }}
          />
          <div 
            className="absolute w-32 h-32 rounded-full bg-[#030305]"
            style={{
              filter: 'blur(10px)'
            }}
          />
          <div className="relative w-28 h-28 rounded-full bg-[#030305]" />
        </motion.div>

        {/* Loading UI */}
        <motion.div 
          className="w-96 max-w-[90vw] space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.3, delay: 0 } }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Progress Bar */}
          <div 
            className="relative w-full max-w-[500px] mx-auto h-5 rounded-[30px] overflow-hidden"
            style={{
              background: 'radial-gradient(circle, #1b2735, #090a0f)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
              border: '1px solid #313131'
            }}
          >
            {/* Particles */}
            <div className="absolute w-full h-full overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                  style={{
                    top: `${[10, 30, 50, 80, 90][i]}%`,
                    left: `${[20, 70, 50, 40, 60][i]}%`,
                    animation: `float 5s infinite ease-in-out ${[0, 1, 2, 1.5, 2.5][i]}s`
                  }}
                />
              ))}
            </div>
            
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
                  animation: 'ripple 3s infinite',
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
            transition={{ delay: 0.5 }}
          >
            <p className="text-white/50 text-xs font-mono tracking-wide">
              {progress < 20 && '⚡ Booting systems...'}
              {progress >= 20 && progress < 40 && '📦 Loading assets...'}
              {progress >= 40 && progress < 60 && '🎨 Initializing interface...'}
              {progress >= 60 && progress < 80 && '🔧 Configuring components...'}
              {progress >= 80 && progress < 100 && '✨ Finalizing...'}
              {progress === 100 && '✓ Ready to launch'}
            </p>
          </motion.div>

          {/* Launch Button - Appears when ready */}
          {isReady && (
            <div className="space-y-3">
              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onClick={onComplete}
                className="relative flex justify-center items-center w-52 h-12 overflow-hidden mx-auto
                           backdrop-blur-[1rem] rounded-[5rem] transition-all duration-500
                           border-4 border-double border-transparent hover:scale-110 active:border-[#fe53bb]
                           focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/50 focus-visible:scale-105"
                style={{
                  backgroundSize: '300% 300%',
                  animation: 'gradient_301 5s ease infinite',
                  backgroundImage: 'linear-gradient(#212121, #212121), linear-gradient(137.48deg, #ffdb3b 10%, #fe53bb 45%, #8f51ea 67%, #0044ff 87%)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'content-box, border-box'
                }}
                aria-label="Launch website experience"
              >
              {/* Stars Container */}
              <div 
                className="absolute -z-10 w-full h-full overflow-hidden transition-all duration-500 backdrop-blur-[1rem] rounded-[5rem] hover:z-10 hover:bg-[#212121]"
              >
                <div 
                  className="relative bg-transparent w-[200rem] h-[200rem]"
                  style={{
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1%)',
                    backgroundSize: '50px 50px'
                  }}
                >
                  <div 
                    className="absolute top-0 -left-1/2 w-[170%] h-[500%] opacity-50"
                    style={{
                      animation: 'animStar 60s linear infinite',
                      backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1%)',
                      backgroundSize: '50px 50px'
                    }}
                  />
                  <div 
                    className="absolute -top-40 -left-[100rem] w-full h-full"
                    style={{
                      animation: 'animStarRotate 90s linear infinite',
                      backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1%)',
                      backgroundSize: '50px 50px'
                    }}
                  />
                </div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute flex w-48">
                <div 
                  className="w-full h-[30px] blur-[2rem] -z-10"
                  style={{
                    background: 'rgba(254, 83, 186, 0.636)',
                    animation: 'pulse_3011 4s infinite'
                  }}
                />
                <div 
                  className="w-full h-[30px] blur-[2rem] -z-10"
                  style={{
                    background: 'rgba(142, 81, 234, 0.704)',
                    animation: 'pulse_3011 4s infinite'
                  }}
                />
              </div>
              
              {/* Button Text */}
              <strong 
                className="z-20 text-xs tracking-[5px] text-white"
                style={{
                  textShadow: '0 0 4px white'
                }}
              >
                LAUNCH
              </strong>
              </motion.button>
              
              {/* Keyboard Hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-center text-white/40 text-xs font-mono"
              >
                Press <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 text-white/60">Enter</kbd> or click
              </motion.p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Corner Decorations */}
      <motion.div 
        className="absolute top-8 left-8 w-24 h-24 border-t border-l border-white/10 rounded-tl-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      />
      <motion.div 
        className="absolute top-8 right-8 w-24 h-24 border-t border-r border-white/10 rounded-tr-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      />
      <motion.div 
        className="absolute bottom-8 left-8 w-24 h-24 border-b border-l border-white/10 rounded-bl-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />
      <motion.div 
        className="absolute bottom-8 right-8 w-24 h-24 border-b border-r border-white/10 rounded-br-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      />
    </motion.div>
  );
};
