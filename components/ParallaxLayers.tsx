import React, { useEffect, useRef } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

interface Layer {
  id: string;
  speed: number;
  opacity: number;
  blur: number;
  size: number;
  color: string;
  position: { x: number; y: number };
}

const layers: Layer[] = [
  {
    id: 'layer-1',
    speed: 0.1,
    opacity: 0.08,
    blur: 150,
    size: 900,
    color: 'rgba(59, 130, 246, 0.3)',
    position: { x: 20, y: 10 },
  },
  {
    id: 'layer-2',
    speed: 0.25,
    opacity: 0.1,
    blur: 120,
    size: 700,
    color: 'rgba(168, 85, 247, 0.3)',
    position: { x: 70, y: 30 },
  },
  {
    id: 'layer-3',
    speed: 0.4,
    opacity: 0.12,
    blur: 100,
    size: 600,
    color: 'rgba(34, 211, 238, 0.3)',
    position: { x: 40, y: 60 },
  },
  {
    id: 'layer-4',
    speed: 0.6,
    opacity: 0.15,
    blur: 80,
    size: 500,
    color: 'rgba(236, 72, 153, 0.3)',
    position: { x: 80, y: 80 },
  },
];

export const ParallaxLayers: React.FC = () => {
  const { scrollY } = useScrollProgress();
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    layerRefs.current.forEach((layer, index) => {
      if (layer) {
        const layerData = layers[index];
        const translateY = scrollY * layerData.speed;
        layer.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }
    });
  }, [scrollY]);

  return (
    <div className="fixed inset-0 z-[3] pointer-events-none overflow-hidden">
      {layers.map((layer, index) => (
        <div
          key={layer.id}
          ref={(el) => (layerRefs.current[index] = el)}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${layer.position.x}%`,
            top: `${layer.position.y}%`,
            width: `${layer.size}px`,
            height: `${layer.size}px`,
            background: layer.color,
            opacity: layer.opacity,
            filter: `blur(${layer.blur}px)`,
            transform: 'translate3d(0, 0, 0)',
          }}
        />
      ))}
    </div>
  );
};
