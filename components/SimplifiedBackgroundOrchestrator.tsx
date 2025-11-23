import React, { lazy, Suspense, useState, useEffect } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

// Critical components - load immediately
import { GradientMesh } from './GradientMesh';
import { ModernParticleBackground } from './ModernParticleBackground';

// Stage 1 - Essential effects (load after 100ms)
const CursorGlow = lazy(() => import('./CursorGlow').then(m => ({ default: m.CursorGlow })));
const AnimatedGrain = lazy(() => import('./AnimatedGrain').then(m => ({ default: m.AnimatedGrain })));

// Stage 2 - Enhanced effects (load after 300ms)
const ScrollColorTransition = lazy(() => import('./ScrollColorTransition').then(m => ({ default: m.ScrollColorTransition })));
const LightLeaks = lazy(() => import('./LightLeaks').then(m => ({ default: m.LightLeaks })));

// Stage 3 - Polish effects (load after 500ms, high quality only)
const DynamicVignette = lazy(() => import('./DynamicVignette').then(m => ({ default: m.DynamicVignette })));
const ColorGrading = lazy(() => import('./ColorGrading').then(m => ({ default: m.ColorGrading })));

export const SimplifiedBackgroundOrchestrator: React.FC = () => {
  const { quality, isLowPerformance } = usePerformanceMonitor(30);
  
  const [stage1Ready, setStage1Ready] = useState(false);
  const [stage2Ready, setStage2Ready] = useState(false);
  const [stage3Ready, setStage3Ready] = useState(false);

  // Staged loading for optimal performance
  useEffect(() => {
    // Stage 1: Essential effects
    const stage1Timer = setTimeout(() => {
      if (quality !== 'low') {
        setStage1Ready(true);
      }
    }, 100);

    // Stage 2: Enhanced effects
    const stage2Timer = setTimeout(() => {
      if (quality !== 'low') {
        setStage2Ready(true);
      }
    }, 300);

    // Stage 3: Polish effects (high quality only)
    const stage3Timer = setTimeout(() => {
      if (quality === 'high') {
        setStage3Ready(true);
      }
    }, 500);

    return () => {
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(stage3Timer);
    };
  }, [quality]);

  // Performance-based rendering flags
  const shouldRenderParticles = quality !== 'low';
  const shouldRenderCursorGlow = !isLowPerformance && stage1Ready;
  const shouldRenderGrain = quality === 'high' && stage1Ready;
  const shouldRenderScrollEffects = quality !== 'low' && stage2Ready;
  const shouldRenderPolishEffects = quality === 'high' && stage3Ready;

  return (
    <>
      {/* Layer 0: Base gradient (always render, z-0) */}
      <GradientMesh />
      
      {/* Layer 1: Particle system (z-0) */}
      {shouldRenderParticles ? (
        <Suspense fallback={
          <div className="fixed inset-0 bg-[#030305] z-0" />
        }>
          <ModernParticleBackground />
        </Suspense>
      ) : (
        <div className="fixed inset-0 bg-[#030305] z-0" />
      )}
      
      {/* Layer 2: Cursor glow (z-1) */}
      {shouldRenderCursorGlow && (
        <Suspense fallback={null}>
          <CursorGlow />
        </Suspense>
      )}
      
      {/* Layer 3: Scroll color transition (z-2) */}
      {shouldRenderScrollEffects && (
        <Suspense fallback={null}>
          <ScrollColorTransition />
        </Suspense>
      )}
      
      {/* Layer 4: Light leaks (z-3) */}
      {shouldRenderScrollEffects && (
        <Suspense fallback={null}>
          <LightLeaks />
        </Suspense>
      )}
      
      {/* Layer 5: Polish effects (z-8 to z-10) */}
      {shouldRenderPolishEffects && (
        <Suspense fallback={null}>
          <DynamicVignette />
          <ColorGrading />
        </Suspense>
      )}
      
      {/* Layer 6: Film grain (z-9, highest quality only) */}
      {shouldRenderGrain && (
        <Suspense fallback={null}>
          <AnimatedGrain />
        </Suspense>
      )}
    </>
  );
};
