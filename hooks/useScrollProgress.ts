import { useEffect, useState } from 'react';

interface ScrollProgress {
  progress: number;
  scrollY: number;
  direction: 'up' | 'down' | 'idle';
  velocity: number;
}

export function useScrollProgress(): ScrollProgress {
  const [scrollData, setScrollData] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
    direction: 'idle',
    velocity: 0,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();
    let ticking = false;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaY = currentScrollY - lastScrollY;
      const deltaTime = currentTime - lastTime;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

      const velocity = deltaTime > 0 ? Math.abs(deltaY / deltaTime) : 0;

      const direction: 'up' | 'down' | 'idle' = 
        deltaY > 0 ? 'down' : 
        deltaY < 0 ? 'up' : 
        'idle';

      setScrollData({
        progress: Math.min(Math.max(progress, 0), 1),
        scrollY: currentScrollY,
        direction,
        velocity: Math.min(velocity, 5),
      });

      lastScrollY = currentScrollY;
      lastTime = currentTime;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollData;
}
