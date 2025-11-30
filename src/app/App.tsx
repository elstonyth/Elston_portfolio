import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Preloader } from '@/components/feedback/Preloader';
import { ChevronRight, ArrowRight, Sparkles, Briefcase, Users, Calendar, Send, Quote } from 'lucide-react';
import { GradientMesh } from '@/components/GradientMesh';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ModernParticleBackground } from '@/components/ModernParticleBackground';
import { PrestigeFlipCard } from '@/components/ui/PrestigeFlipCard';
import { ResumeDownload } from '@/components/layout/ResumeDownload';
import { DeferredSection } from '@/components/layout/DeferredSection';
import { ProjectCardSkeleton, FeaturesSkeleton, TechStackSkeleton } from '@/components/ui/Skeleton';

// Lazy load heavy components for better performance
const PreviewSection = lazy(() => import('@/features/preview/PreviewSection').then(m => ({ default: m.PreviewSection })));
const Features = lazy(() => import('@/components/Features').then(m => ({ default: m.Features })));
const SelectedWork = lazy(() => import('@/components/SelectedWork').then(m => ({ default: m.SelectedWork })));
const TrustedBy = lazy(() => import('@/components/TrustedBy').then(m => ({ default: m.TrustedBy })));
const Footer = lazy(() => import('@/components/layout/Footer').then(m => ({ default: m.Footer })));

function App() {
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
          className="min-h-screen bg-background text-white selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden font-sans before:fixed before:inset-0 before:z-0 before:bg-noise before:opacity-20 before:pointer-events-none"
        >
          {/* Void Galaxy Background System */}
          <div className="fixed inset-0 z-0 bg-[#030305] pointer-events-none" style={{ willChange: 'transform', contain: 'strict' }}>
            {/* Base void tone */}
            <div className="absolute inset-0 bg-[#030305]" />

            {/* Static nebula color wash (cheap, works even when animations are disabled) */}
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
      <main id="home" className="relative pt-32 pb-16 px-6 md:pt-48 md:pb-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Layout */}
          <div className="flex flex-col lg:flex-row gap-12 items-start z-10 mb-24 relative">
            <div className="flex-1 max-w-3xl xl:max-w-4xl">
              
            {/* Status Badge - AI Style */}
            <motion.a 
              href="#contact" 
              className="group inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 hover:border-cyan-400/30 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 mb-6 backdrop-blur-md shimmer-effect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium tracking-wide text-xs uppercase">Open for analytics + AI mandates</span>
              <ChevronRight size={12} className="text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </motion.a>

            {/* Credential Strip */}
            <motion.div 
              className="flex flex-wrap gap-3 mb-10 text-sm text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {[{
                icon: <Sparkles size={14} />, label: 'Role', value: 'Full-Stack AI Developer', showOnMobile: true, delay: 0
              }, {
                icon: <Briefcase size={14} />, label: 'Reliability', value: '30% fewer data issues', showOnMobile: true, delay: 0.1
              }, {
                icon: <Users size={14} />, label: 'Time saved', value: '10–15 hrs/month', showOnMobile: false, delay: 0.2
              }].map(({ icon, label, value, showOnMobile, delay }) => (
                <motion.div 
                  key={label} 
                  className={`flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] transition-all duration-300 cursor-default ${!showOnMobile ? 'hidden sm:flex' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + delay }}
                  whileHover={{ y: -2 }}
                >
                  <span className="text-cyan-400/80">{icon}</span>
                  <div>
                    <p className="text-[11px] uppercase tracking-ultra text-white/50">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9] drop-shadow-2xl text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Reliable analytics, automation, and AI delivery
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-base md:text-2xl text-white/70 max-w-2xl mb-8 md:mb-10 leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              I help teams ship dashboards, automations, and AI copilots that reduce manual work without sacrificing reliability. Recent wins: pharma validation errors down ~30% and 10–15 hours of reporting saved every month.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 w-full sm:w-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <a href="#work" className="w-full sm:w-auto">
                <div className="relative w-full sm:w-auto group/cta">
                  <div className="absolute inset-0 rounded-full bg-white/40 blur-2xl opacity-0 group-hover/cta:opacity-100 transition duration-500"></div>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    View Work
                    <ArrowRight size={16} className="ml-2 opacity-70 transition-transform group-hover/cta:translate-x-1" />
                  </Button>
                </div>
              </a>
              <ResumeDownload variant="secondary" className="w-full sm:w-auto px-6" />
              <p className="text-xs text-white/60 pl-1 sm:pl-0 sm:basis-full">Replies within one business day.</p>
            </motion.div>
            </div>
            {/* Hero Visual - Desktop: fixed on right, Mobile: centered below hero */}
            {/* Desktop (lg+): original right-side positioning */}
            <motion.div 
              className="hidden lg:block absolute right-0 top-[250px]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/10 blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 opacity-0 group-hover:opacity-100 group-hover:from-cyan-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 blur-md transition-all duration-500" />
                <PrestigeFlipCard frontImageUrl="card-front.png" backImageUrl="card-back.jpg" />
                <motion.div 
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center text-xs uppercase tracking-[0.4em] text-white/40"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Elite Access
                </motion.div>
              </div>
            </motion.div>

            {/* Mobile / tablet: centered card below hero content */}
            <motion.div 
              className="mt-10 w-full flex justify-center lg:hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/10 blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 opacity-0 group-hover:opacity-100 group-hover:from-cyan-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 blur-md transition-all duration-500" />
                <PrestigeFlipCard frontImageUrl="card-front.png" backImageUrl="card-back.jpg" />
                <motion.div 
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center text-xs uppercase tracking-[0.4em] text-white/40"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Elite Access
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <TrustedBy />
          </motion.div>
        </Suspense>
      </DeferredSection>
      
      {/* Bottom CTA */}
      <motion.section 
        id="contact"
        data-section="cta"
        className="py-24 md:py-32 px-6 text-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Spotlight Effect from Top */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305] via-transparent to-transparent"></div>
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(34, 211, 238, 0.15), transparent 70%)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <div className="relative max-w-5xl mx-auto z-10 space-y-10">
          <div>
            <p className="text-xs uppercase tracking-mega text-white/50 mb-4">Collaboration</p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 drop-shadow-2xl">
              Have a project in mind?
            </h2>
            <p className="text-text-dim text-base md:text-xl max-w-3xl mx-auto">
              I collaborate with teams to design analytics, dashboards, and automation that make work more reliable and less manual. Share a brief or reach out if you're exploring how data can better support your decisions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Button 
               as="a" 
               href="mailto:elstonyth@outlook.com?subject=Project%20Brief&body=Hi%20Elston%2C%0A%0AI%27d%20like%20to%20discuss%20a%20project%20with%20you.%0A%0AProject%20details%3A%0A" 
               variant="primary" 
               size="lg" 
               className="min-w-[200px]"
             >
               Share Project Brief
               <Send size={16} className="ml-2 opacity-70" />
             </Button>
             <Button 
               as="a" 
               href="mailto:elstonyth@outlook.com?subject=Discovery%20Call%20Request&body=Hi%20Elston%2C%0A%0AI%27d%20like%20to%20schedule%20a%20discovery%20call.%0A%0APreferred%20times%3A%0A" 
               variant="secondary" 
               size="lg" 
               className="min-w-[200px]"
             >
               Book Discovery Call
               <Calendar size={16} className="ml-2" />
             </Button>
          </div>

          <div className="space-y-6">
            <blockquote className="text-white/80 text-lg italic leading-relaxed">
              <Quote className="mx-auto mb-4 opacity-50" />
              “Elston transformed our prototype into a refined product experience in under four weeks. His systems thinking and polish level rival top-tier studios.”
              <div className="mt-4 text-sm uppercase tracking-ultra text-white/50">Avery Tan · Product Lead, Nova Labs</div>
            </blockquote>
            <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-mega text-white/50">
              {['Nova Labs', 'OrbitX', 'Pixelcraft', 'Studio Apex'].map((logo) => (
                <span key={logo} className="text-white/50">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

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
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
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

export default App;
