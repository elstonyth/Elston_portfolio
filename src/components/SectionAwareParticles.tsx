import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

const sectionColors: Record<string, string[]> = {
  hero: ['rgba(59, 130, 246, 0.6)', 'rgba(34, 211, 238, 0.5)'],
  preview: ['rgba(168, 85, 247, 0.6)', 'rgba(236, 72, 153, 0.5)'],
  features: ['rgba(34, 211, 238, 0.6)', 'rgba(59, 130, 246, 0.5)'],
  work: ['rgba(236, 72, 153, 0.6)', 'rgba(168, 85, 247, 0.5)'],
  cta: ['rgba(59, 130, 246, 0.6)', 'rgba(34, 211, 238, 0.5)'],
};

export const SectionAwareParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const isVisibleRef = useRef(true);
  const lastFrameTimeRef = useRef(0);
  const TARGET_FPS = 30; // Cap at 30fps for performance
  const FRAME_INTERVAL = 1000 / TARGET_FPS;

  useEffect(() => {
    const sections = [
      { id: 'hero', selector: 'main' },
      { id: 'preview', selector: '[data-section="preview"]' },
      { id: 'features', selector: '[data-section="features"]' },
      { id: 'work', selector: '[data-section="work"]' },
      { id: 'cta', selector: '[data-section="cta"]' },
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };

    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const element = document.querySelector(section.selector);
      if (!element) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(section.id);
          }
        });
      }, observerOptions);

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const colors = sectionColors[activeSection] || sectionColors.hero;

      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: 2 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.3 + Math.random() * 0.4,
        });
      }
    };

    initParticles();

    const animate = (timestamp: number) => {
      // Skip frames if not visible or if not enough time has passed
      if (!isVisibleRef.current) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const elapsed = timestamp - lastFrameTimeRef.current;
      if (elapsed < FRAME_INTERVAL) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = timestamp - (elapsed % FRAME_INTERVAL);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradually transition particle colors
      const targetColors = sectionColors[activeSection] || sectionColors.hero;

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Gradually change color to match section
        const targetColor = targetColors[index % targetColors.length];
        if (particle.color !== targetColor) {
          // Smooth color transition would go here
          // For simplicity, we'll just update it
          particle.color = targetColor;
        }

        // Draw particle
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 2
        );

        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    // Visibility change handler - pause when tab is hidden
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationId);
    };
  }, [activeSection]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[4] pointer-events-none opacity-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
