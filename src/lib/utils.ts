import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safe browser API utilities
export const safeBrowserAPI = {
  // Safe matchMedia with fallback
  prefersReducedMotion(): boolean {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (error) {
      return false;
    }
  },

  // Safe hardware concurrency check
  getHardwareConcurrency(): number {
    try {
      return navigator.hardwareConcurrency || 4; // Default to 4 cores
    } catch (error) {
      return 4;
    }
  },

  // Safe touch device detection
  isTouchDevice(): boolean {
    try {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    } catch (error) {
      return false;
    }
  },

  // Safe performance.now with fallback
  now(): number {
    try {
      return typeof performance !== 'undefined' && performance.now 
        ? performance.now() 
        : Date.now();
    } catch (error) {
      return Date.now();
    }
  }
};
