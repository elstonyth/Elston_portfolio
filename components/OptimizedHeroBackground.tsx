import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { safeBrowserAPI } from '../lib/utils';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

// Import shaders as raw strings
import vertexShader from '../shaders/particleVertex.glsl?raw';
import fragmentShader from '../shaders/particleFragment.glsl?raw';

interface Particle {
  position: Float32Array;
  initialPosition: Float32Array;
  randoms: Float32Array;
  layers: Float32Array;
}

function NeuralParticles() {
  const points = useRef<THREE.Points>(null!);
  const geometryRef = useRef<THREE.BufferGeometry>(null!);
  const hoverStrength = useRef(0);
  const [particleCount, setParticleCount] = useState(1000);
  const [isScrolling, setIsScrolling] = useState(false);
  const { quality } = usePerformanceMonitor(30, isScrolling);

  // Adaptive particle count
  useEffect(() => {
    const getParticleCount = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;
      const isLowEnd = safeBrowserAPI.getHardwareConcurrency() < 4;
      const prefersReducedMotion = safeBrowserAPI.prefersReducedMotion();

      if (prefersReducedMotion) return 300;
      if (isMobile) return quality === 'low' ? 300 : 500;
      if (isTablet) return quality === 'low' ? 500 : 800;
      if (isLowEnd) return 600;

      switch (quality) {
        case 'low': return 600;
        case 'medium': return 1000;
        case 'high': return 1500;
        default: return 1000;
      }
    };

    setParticleCount(getParticleCount());
  }, [quality]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (geometryRef.current) geometryRef.current.dispose();
      if (points.current?.material) {
        if (points.current.material instanceof THREE.Material) {
          points.current.material.dispose();
        }
      }
    };
  }, []);

  const { positions, initialPositions, randoms, layers } = useMemo(() => {
    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const initialPositions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const layers = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const layer = Math.floor(Math.random() * 3);
      layers[i] = layer;
      
      const zRange = [
        [1.5, 3.0],   // Background
        [0, 1.5],     // Midground
        [-1.5, 0]     // Foreground
      ][layer];
      
      const r = Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      const z = zRange[0] + Math.random() * (zRange[1] - zRange[0]);

      positions[i3] = x * 3.0;
      positions[i3 + 1] = y * 1.8;
      positions[i3 + 2] = z;

      initialPositions[i3] = positions[i3];
      initialPositions[i3 + 1] = positions[i3 + 1];
      initialPositions[i3 + 2] = positions[i3 + 2];
      
      randoms[i] = Math.random();
    }
    return { positions, initialPositions, randoms, layers };
  }, [particleCount]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uHover: { value: 0 }
  }), []);

  useFrame((state) => {
    if (isScrolling || !points.current) return;
    
    const { clock, pointer } = state;
    
    if (points.current.material?.uniforms) {
      points.current.material.uniforms.uTime.value = clock.getElapsedTime();
      points.current.material.uniforms.uMouse.value.copy(pointer);
      
      const targetHover = (Math.abs(pointer.x) + Math.abs(pointer.y)) > 0 ? 1 : 0;
      hoverStrength.current = targetHover;
      points.current.material.uniforms.uHover.value = hoverStrength.current;

      points.current.rotation.y = clock.getElapsedTime() * 0.03;
      points.current.rotation.x = pointer.y * 0.02;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-initialPosition"
          count={initialPositions.length / 3}
          array={initialPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aLayer"
          count={layers.length}
          array={layers}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
      />
    </points>
  );
}

export function OptimizedHeroBackground() {
  const [canvasReady, setCanvasReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      if (!gl) {
        setHasError(true);
        return;
      }

      const timer = setTimeout(() => {
        setCanvasReady(true);
        setTimeout(() => setFadeIn(true), 50);
      }, 200);

      return () => clearTimeout(timer);
    } catch (error) {
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    if (!canvasReady) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    const targetElement = document.querySelector('#hero') || document.body;
    observer.observe(targetElement);

    return () => {
      observer.unobserve(targetElement);
    };
  }, [canvasReady]);

  if (hasError || !canvasReady) {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#030305]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[#030305]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,20,40,0.3),rgba(0,0,0,1))]" />
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none bg-[#030305]" 
      role="presentation" 
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[#030305] z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,20,40,0.3),rgba(0,0,0,1))] z-0" />
      
      <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 60 }}
          gl={{ 
            antialias: false, 
            alpha: true, 
            powerPreference: "high-performance",
            stencil: false,
            depth: false
          }}
          dpr={[1, 2]} 
          eventSource={document.body}
          eventPrefix="client"
          onCreated={() => {}}
          frameloop={isVisible ? 'always' : 'never'}
          aria-label="Animated particle background"
        >
          <NeuralParticles />
        </Canvas>
      </div>
    </div>
  );
}
