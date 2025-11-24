import React, { useEffect, useState } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';

interface ColorStop {
  position: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const colorStops: ColorStop[] = [
  {
    position: 0,
    colors: {
      primary: 'rgba(59, 130, 246, 0.15)',
      secondary: 'rgba(168, 85, 247, 0.12)',
      accent: 'rgba(34, 211, 238, 0.1)',
    },
  },
  {
    position: 0.25,
    colors: {
      primary: 'rgba(168, 85, 247, 0.15)',
      secondary: 'rgba(236, 72, 153, 0.12)',
      accent: 'rgba(59, 130, 246, 0.1)',
    },
  },
  {
    position: 0.5,
    colors: {
      primary: 'rgba(34, 211, 238, 0.15)',
      secondary: 'rgba(59, 130, 246, 0.12)',
      accent: 'rgba(168, 85, 247, 0.1)',
    },
  },
  {
    position: 0.75,
    colors: {
      primary: 'rgba(236, 72, 153, 0.15)',
      secondary: 'rgba(34, 211, 238, 0.12)',
      accent: 'rgba(168, 85, 247, 0.1)',
    },
  },
  {
    position: 1,
    colors: {
      primary: 'rgba(59, 130, 246, 0.15)',
      secondary: 'rgba(168, 85, 247, 0.12)',
      accent: 'rgba(34, 211, 238, 0.1)',
    },
  },
];

function interpolateColor(color1: string, color2: string, factor: number): string {
  const rgba1 = color1.match(/[\d.]+/g)?.map(Number) || [0, 0, 0, 0];
  const rgba2 = color2.match(/[\d.]+/g)?.map(Number) || [0, 0, 0, 0];

  const r = Math.round(rgba1[0] + (rgba2[0] - rgba1[0]) * factor);
  const g = Math.round(rgba1[1] + (rgba2[1] - rgba1[1]) * factor);
  const b = Math.round(rgba1[2] + (rgba2[2] - rgba1[2]) * factor);
  const a = rgba1[3] + (rgba2[3] - rgba1[3]) * factor;

  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
}

export const ScrollColorTransition: React.FC = () => {
  const { progress } = useScrollProgress();
  const [colors, setColors] = useState(colorStops[0].colors);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let currentStopIndex = 0;
    for (let i = 0; i < colorStops.length - 1; i++) {
      if (progress >= colorStops[i].position && progress < colorStops[i + 1].position) {
        currentStopIndex = i;
        break;
      }
    }

    const currentStop = colorStops[currentStopIndex];
    const nextStop = colorStops[currentStopIndex + 1] || colorStops[currentStopIndex];

    const localProgress = 
      (progress - currentStop.position) / 
      (nextStop.position - currentStop.position || 1);

    const interpolatedColors = {
      primary: interpolateColor(currentStop.colors.primary, nextStop.colors.primary, localProgress),
      secondary: interpolateColor(currentStop.colors.secondary, nextStop.colors.secondary, localProgress),
      accent: interpolateColor(currentStop.colors.accent, nextStop.colors.accent, localProgress),
    };

    setColors(interpolatedColors);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-[2] pointer-events-none transition-opacity duration-1000">
      <div
        className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full blur-[150px]"
        style={{ background: colors.primary }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-[700px] h-[700px] rounded-full blur-[130px]"
        style={{ background: colors.secondary }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{ background: colors.accent }}
      />
    </div>
  );
};
