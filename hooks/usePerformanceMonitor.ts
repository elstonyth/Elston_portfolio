import { useEffect, useRef, useState } from 'react';
import { safeBrowserAPI } from '../lib/utils';

interface PerformanceMetrics {
  fps: number;
  isLowPerformance: boolean;
  quality: 'high' | 'medium' | 'low';
}

export function usePerformanceMonitor(threshold: number = 30, isScrolling: boolean = false): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    isLowPerformance: false,
    quality: 'high' as 'high' | 'medium' | 'low',
  });

  const frameCount = useRef(0);
  const lastTime = useRef(safeBrowserAPI.now());
  const fpsHistory = useRef<number[]>([]);
  const rafId = useRef<number>();

  useEffect(() => {
    let lastSampleTime = safeBrowserAPI.now();
    let lastFrameCount = 0;
    
    const measureFPS = () => {
      try {
        // Skip performance monitoring entirely during scroll to reduce main thread contention
        if (isScrolling) {
          rafId.current = requestAnimationFrame(measureFPS);
          return;
        }
        
        frameCount.current++;
        const currentTime = safeBrowserAPI.now();
        const elapsed = currentTime - lastSampleTime;

        // Sample every 100ms instead of every frame
        if (elapsed >= 100) {
          const currentFPS = Math.round(((frameCount.current - lastFrameCount) * 1000) / elapsed);
          
          fpsHistory.current.push(currentFPS);
          if (fpsHistory.current.length > 10) {
            fpsHistory.current.shift();
          }

          const avgFPS = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
          
          const isLowPerformance = avgFPS < threshold;
          const quality: 'high' | 'medium' | 'low' = 
            avgFPS >= 50 ? 'high' : 
            avgFPS >= 30 ? 'medium' : 
            'low';

          setMetrics({
            fps: Math.round(avgFPS),
            isLowPerformance,
            quality,
          });

          lastSampleTime = currentTime;
          lastFrameCount = frameCount.current;
        }

        rafId.current = requestAnimationFrame(measureFPS);
      } catch (error) {
        // Silently handle FPS measurement errors
      }
    };

    rafId.current = requestAnimationFrame(measureFPS);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [threshold, isScrolling]);

  return metrics;
}
