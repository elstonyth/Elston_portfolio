import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Preloader } from '@/components/feedback/Preloader';
import { ChevronRight, ArrowRight, Sparkles, Briefcase, Users } from 'lucide-react';
import { GradientMesh } from '@/components/GradientMesh';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ModernParticleBackground } from '@/components/ModernParticleBackground';
import { PrestigeFlipCard } from '@/components/ui/PrestigeFlipCard';
import { PremiumPhoneCard } from '@/components/ui/PremiumPhoneCard';
import { ResumeDownload } from '@/components/layout/ResumeDownload';
import { DeferredSection } from '@/components/layout/DeferredSection';
import { ProjectCardSkeleton, FeaturesSkeleton, TechStackSkeleton } from '@/components/ui/Skeleton';
import { CollaborationForm } from '@/components/ui/CollaborationForm';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// Lazy load heavy components for better performance
const PreviewSection = lazy(() => import('@/features/preview/PreviewSection').then(m => ({ default: m.PreviewSection })));
const Features = lazy(() => import('@/components/Features').then(m => ({ default: m.Features })));
const SelectedWork = lazy(() => import('@/components/SelectedWork').then(m => ({ default: m.SelectedWork })));
const TrustedBy = lazy(() => import('@/components/TrustedBy').then(m => ({ default: m.TrustedBy })));
const Footer = lazy(() => import('@/components/layout/Footer').then(m => ({ default: m.Footer })));

function AppContent() {
  const { isDark } = useTheme();
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
          className={`min-h-screen overflow-x-hidden font-sans transition-colors duration-500 ${
            isDark 
              ? 'bg-[#030305] text-white selection:bg-cyan-500/30 selection:text-cyan-100' 
              : 'bg-[#e8eaef] text-slate-900 selection:bg-cyan-500/30 selection:text-cyan-900'
          } before:fixed before:inset-0 before:z-0 before:bg-noise before:opacity-20 before:pointer-events-none`}
        >
          {/* Background System - Theme Aware */}
          <div 
            className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-500 ${
              isDark ? 'bg-[#030305]' : 'bg-[#e8eaef]'
            }`} 
            style={{ willChange: 'transform', contain: 'strict' }}
          >
            {/* Base tone */}
            <div className={`absolute inset-0 transition-colors duration-500 ${
              isDark ? 'bg-[#030305]' : 'bg-[#e8eaef]'
            }`} />

            {/* Nebula color wash - enhanced for light mode */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${
              isDark 
                ? 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),transparent_60%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.2),transparent_65%)]' 
                : 'bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,_rgba(8,145,178,0.15),transparent_50%),radial-gradient(ellipse_100%_60%_at_100%_100%,_rgba(124,58,237,0.12),transparent_50%),radial-gradient(ellipse_80%_50%_at_0%_80%,_rgba(236,72,153,0.08),transparent_50%)]'
            }`} />

            {enableDynamicBackground && isDark ? (
              <>
                {/* Deep nebula layers - only in dark mode */}
                <GradientMesh />

                {/* Starfield - only in dark mode */}
                <ModernParticleBackground />
              </>
            ) : !isDark ? (
              <>
                {/* Light mode atmospheric layers - Soft gradient orbs */}
                <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-gradient-to-br from-cyan-400/10 via-transparent to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-gradient-to-tl from-purple-400/10 via-transparent to-transparent rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-pink-300/5 via-transparent to-cyan-300/5 rounded-full blur-3xl" />
              </>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12),transparent_55%)]" />
            )}

            {/* Vignette + depth */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${
              isDark 
                ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]' 
                : 'bg-[radial-gradient(circle_at_center,transparent_20%,rgba(200,205,215,0.4)_100%)]'
            }`} />
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
              className={`group inline-flex items-center gap-3 px-4 py-2 rounded-full border text-sm transition-all duration-300 mb-6 backdrop-blur-md shimmer-effect premium-badge ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white/80 hover:border-cyan-400/30 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
                  : 'bg-white/80 border-slate-200 text-slate-700 hover:border-cyan-500/40 hover:bg-white hover:shadow-[0_0_20px_rgba(8,145,178,0.15)]'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium tracking-wide text-xs uppercase">Open for Data & AI Engineering Roles</span>
              <ChevronRight size={12} className={`group-hover:translate-x-0.5 transition-all ${isDark ? 'text-white/50 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
            </motion.a>

            {/* Credential Strip */}
            <motion.div 
              className={`flex flex-wrap gap-3 mb-10 text-sm transition-colors duration-500 ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {[{
                icon: <Sparkles size={14} />, label: 'Focus', value: 'Analytics · Automation · AI', showOnMobile: true, delay: 0
              }, {
                icon: <Briefcase size={14} />, label: 'Impact', value: '~30% fewer data errors', showOnMobile: true, delay: 0.1
              }, {
                icon: <Users size={14} />, label: 'Efficiency', value: '10–15 hrs/month saved', showOnMobile: false, delay: 0.2
              }].map(({ icon, label, value, showOnMobile, delay }) => (
                <motion.div 
                  key={label} 
                  className={`flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-sm transition-all duration-300 cursor-default ${!showOnMobile ? 'hidden sm:flex' : ''} ${
                    isDark 
                      ? 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)]'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + delay }}
                  whileHover={{ y: -2 }}
                >
                  <span className={isDark ? 'text-cyan-400/80' : 'text-cyan-600'}>{icon}</span>
                  <div>
                    <p className={`text-[11px] uppercase tracking-ultra ${isDark ? 'text-white/50' : 'text-slate-400'}`}>{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className={`text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9] hero-title-premium transition-colors duration-500 ${
                isDark ? 'text-white drop-shadow-2xl' : 'text-slate-900'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Data systems that cut errors and manual work
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className={`text-base md:text-2xl max-w-2xl mb-8 md:mb-10 leading-relaxed font-light transition-colors duration-500 ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              I build dashboards, automations, and AI-powered workflows that help teams make better decisions faster. Recent wins include reducing pharma validation errors by ~30% and automating reporting that saves 10–15 hours every month.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 w-full sm:w-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <a href="#work" className="w-full sm:w-auto">
                <div className="relative w-full sm:w-auto group/cta cta-glow rounded-full">
                  <div className="absolute inset-0 rounded-full bg-white/40 blur-2xl opacity-0 group-hover/cta:opacity-100 transition duration-500"></div>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    View Work
                    <ArrowRight size={16} className="ml-2 opacity-70 transition-transform group-hover/cta:translate-x-1" />
                  </Button>
                </div>
              </a>
              <ResumeDownload variant="secondary" className="w-full sm:w-auto px-6" />
              <p className={`text-xs pl-1 sm:pl-0 sm:basis-full ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Replies within one business day.</p>
            </motion.div>
            </div>
            {/* Hero Visual - Desktop: Premium Phone Card on right */}
            <motion.div 
              className="hidden lg:block absolute right-0 top-[200px]"
              initial={{ opacity: 0, x: 30, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative group premium-float">
                <PremiumPhoneCard />
                <motion.div 
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <span className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-medium">Interactive Demo</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Mobile / tablet: Premium Phone Card centered below hero */}
            <motion.div 
              className="mt-16 w-full flex justify-center lg:hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              <div className="relative">
                <PremiumPhoneCard />
                <motion.div 
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <span className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-medium">Tap to toggle</span>
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
      
      {/* Collaboration Section */}
      <motion.section 
        id="contact"
        data-section="cta"
        className="py-32 md:py-40 px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient orbs */}
          <motion.div 
            className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.45, 0.3],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: [0.45, 0, 0.55, 1],
              repeatType: "mirror"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.35, 0.5, 0.35],
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: [0.45, 0, 0.55, 1],
              repeatType: "mirror"
            }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[80px]"
            animate={{ 
              x: [0, 30, 0],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{ 
              duration: 14, 
              repeat: Infinity, 
              ease: [0.45, 0, 0.55, 1],
              repeatType: "mirror"
            }}
          />
        </div>

        {/* Top Divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative max-w-5xl mx-auto z-10">
          {/* Two Column CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Let's talk<br />
                data &{' '}
                <span 
                  className="bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                  style={{
                    background: 'linear-gradient(to right, #ffffff, rgba(255,255,255,0.6), rgba(255,255,255,0.3))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                >
                  impact.
                </span>
              </h2>

              <p className="text-white/50 text-base md:text-lg mb-8 max-w-md">
                Open to data/analytics engineering roles and interesting collaborations. Let's build something meaningful together.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <a 
                  href="mailto:elstonyth@outlook.com?subject=Let's%20Collaborate"
                  className="group inline-flex items-center px-6 py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-500 ease-out"
                >
                  <span>Start a Conversation</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
                <a 
                  href="mailto:elstonyth@outlook.com"
                  className="inline-flex items-center px-6 py-3 rounded-full border border-white/20 text-white/80 font-medium text-sm hover:bg-white/5 hover:border-white/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-500 ease-out"
                >
                  elstonyth@outlook.com
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex gap-3">
                {[
                  { href: "https://github.com/elstonyth", label: "GitHub", icon: <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/> },
                  { href: "https://twitter.com/elstonyth", label: "Twitter", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> },
                  { href: "https://linkedin.com/in/elstonyth", label: "LinkedIn", icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> },
                ].map((social) => (
                  <a 
                    key={social.label}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10 hover:scale-105 transition-all duration-500 ease-out"
                    aria-label={social.label}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">{social.icon}</svg>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right Column - UIverse-inspired Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <CollaborationForm />
            </motion.div>
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

// Wrap with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
