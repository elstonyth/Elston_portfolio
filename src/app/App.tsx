import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Preloader } from '@/components/feedback/Preloader';
import { Hero } from '@/components/home/Hero';
import { Contact } from '@/components/home/Contact';
import { Sparkles } from 'lucide-react';
import { GradientMesh } from '@/components/GradientMesh';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ModernParticleBackground } from '@/components/ModernParticleBackground';
import { DeferredSection } from '@/components/layout/DeferredSection';
import { ProjectCardSkeleton, FeaturesSkeleton, TechStackSkeleton } from '@/components/ui/Skeleton';
// Dark mode only - CollaborationForm moved to Contact component
// BlackHole moved to Hero component

// Lazy load heavy components for better performance
const PreviewSection = lazy(() => import('@/features/preview/PreviewSection').then(m => ({ default: m.PreviewSection })));
const Features = lazy(() => import('@/components/Features').then(m => ({ default: m.Features })));
const SelectedWork = lazy(() => import('@/components/SelectedWork').then(m => ({ default: m.SelectedWork })));
const TrustedBy = lazy(() => import('@/components/TrustedBy').then(m => ({ default: m.TrustedBy })));
const Footer = lazy(() => import('@/components/layout/Footer').then(m => ({ default: m.Footer })));

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLaunchToast, setShowLaunchToast] = useState(false);
  const [enableDynamicBackground, setEnableDynamicBackground] = useState(true);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setIsLoading(false);
    setShowLaunchToast(true);

    toastTimeoutRef.current = window.setTimeout(() => {
      setShowLaunchToast(false);
    }, 4000);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const evaluatePreferences = () => {
      const prefersReducedMotion = motionQuery.matches;
      const isMobileViewport = mobileQuery.matches;
      setEnableDynamicBackground(!(prefersReducedMotion || isMobileViewport));
    };

    const handleChange = () => {
      evaluatePreferences();
    };

    const addListener = (query: MediaQueryList) => {
      if (query.addEventListener) {
        query.addEventListener('change', handleChange);
      } else if (query.addListener) {
        query.addListener(handleChange);
      }
    };

    const removeListener = (query: MediaQueryList) => {
      if (query.removeEventListener) {
        query.removeEventListener('change', handleChange);
      } else if (query.removeListener) {
        query.removeListener(handleChange);
      }
    };

    evaluatePreferences();
    addListener(motionQuery);
    addListener(mobileQuery);

    return () => {
      removeListener(motionQuery);
      removeListener(mobileQuery);
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.8, // Reduced for snappier feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2, // Slightly faster wheel response
      touchMultiplier: 1.5, // Better touch response
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Handle smooth scroll to anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            lenis.scrollTo(element as HTMLElement, {
              offset: -80, // Account for fixed navbar
              duration: 1.5,
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="min-h-screen overflow-x-hidden font-sans transition-colors duration-500 bg-background text-primary selection:bg-cyan-500/30 before:fixed before:inset-0 before:z-0 before:bg-noise before:opacity-20 before:pointer-events-none"
        >
          {/* Background System - Theme Aware */}
          <div 
            className="fixed inset-0 z-0 pointer-events-none transition-colors duration-500 bg-background" 
            style={{ willChange: 'transform', contain: 'strict' }}
          >
            {/* Base tone */}
            <div className="absolute inset-0 transition-colors duration-500 bg-background" />

            {/* Nebula color wash */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),transparent_60%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.2),transparent_65%)]" />

            {enableDynamicBackground ? (
              <>
                {/* Deep nebula layers */}
                <GradientMesh />

                {/* Starfield */}
                <ModernParticleBackground />
              </>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12),transparent_55%)]" />
            )}

            {/* Vignette + depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
          </div>

          {/* Transition veil to bridge preloader + main scene */}
          
          {/* Launch toast */}
          <AnimatePresence>
            {showLaunchToast && (
              <motion.div
                role="status"
                aria-live="polite"
                className="fixed top-24 right-6 z-40 flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-2xl shadow-[0_0_30px_rgba(15,23,42,0.45)]"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-inner">
                  <Sparkles size={16} className="text-cyan-200" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/60">Systems Online</p>
                  <p className="text-sm text-white">Void galaxy warmed up</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </motion.div>
            )}
          </AnimatePresence>
          <ScrollProgress />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Navbar />
          </motion.div>

          {/* Hero Section */}
          <Hero />

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-4xl" />

      <DeferredSection
        id="about"
        minHeight={400}
        placeholder={
          <div className="py-12 px-6">
            <div className="max-w-7xl mx-auto text-white/50 text-xs animate-pulse">
              Preparing interactive preview...
            </div>
          </div>
        }
      >
        <Suspense fallback={
          <div className="py-12 px-6">
            <div className="max-w-7xl mx-auto text-white/50 text-xs animate-pulse">
              Loading preview section...
            </div>
          </div>
        }>
          <motion.div
            data-section="preview"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <PreviewSection />
          </motion.div>
        </Suspense>
      </DeferredSection>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-4xl my-8" />

      <DeferredSection
        id="features"
        minHeight={500}
        placeholder={<FeaturesSkeleton />}
      >
        <Suspense fallback={<FeaturesSkeleton />}>
          <motion.div
            data-section="features"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Features />
          </motion.div>
        </Suspense>
      </DeferredSection>
      
      <DeferredSection
        id="work"
        minHeight={600}
        placeholder={<ProjectCardSkeleton />}
      >
        <Suspense fallback={<ProjectCardSkeleton />}>
          <motion.div
            data-section="work"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <SelectedWork />
          </motion.div>
        </Suspense>
      </DeferredSection>
      
      <DeferredSection
        id="trusted"
        minHeight={320}
        placeholder={<TechStackSkeleton />}
      >
        <Suspense fallback={<TechStackSkeleton />}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <TrustedBy />
          </motion.div>
        </Suspense>
      </DeferredSection>
      
      {/* Contact Section */}
      <Contact />

      <DeferredSection
        id="footer"
        minHeight={240}
        placeholder={
          <div className="h-48 flex items-center justify-center text-white/40 text-sm">
            Loading footer...
          </div>
        }
      >
        <Suspense fallback={
          <div className="h-96 flex items-center justify-center">
            <div className="text-white/50 text-sm animate-pulse">Loading...</div>
          </div>
        }>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Footer />
          </motion.div>
        </Suspense>
      </DeferredSection>
        </motion.div>
      )}
    </>
  );
}

// Dark mode only - apply dark class on mount
function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', '#030305');
    }
  }, []);

  return <AppContent />;
}

export default App;
