# Background System - Quick Reference

## 🚀 Quick Start

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## 📁 File Locations

### Components
```
components/
├── BackgroundOrchestrator.tsx  # Main controller
├── HeroBackground.tsx          # 3D particles
├── GradientMesh.tsx            # Animated gradients
├── CursorGlow.tsx              # Cursor effect
├── ScrollColorTransition.tsx   # Scroll colors
├── ParallaxLayers.tsx          # Depth layers
├── SectionTransitions.tsx      # Section effects
└── AuroraEffect.tsx            # Northern lights
```

### Hooks
```
hooks/
├── usePerformanceMonitor.ts    # FPS tracking
└── useScrollProgress.ts        # Scroll tracking
```

## 🎛️ Configuration

### Adjust Particle Count
**File**: `components/HeroBackground.tsx`
```typescript
// Line 117-127
if (prefersReducedMotion) return 500;
if (isMobile) return 1200;
if (isTablet) return 2000;
if (isLowEnd) return 2000;
return 3000; // ← Change this for desktop
```

### Adjust Performance Threshold
**File**: `hooks/usePerformanceMonitor.ts`
```typescript
// Line 7
export function usePerformanceMonitor(threshold: number = 30)
// Change threshold (default 30 FPS)
```

### Modify Color Palette
**File**: `components/ScrollColorTransition.tsx`
```typescript
// Lines 11-54
const colorStops: ColorStop[] = [
  {
    position: 0,
    colors: {
      primary: 'rgba(59, 130, 246, 0.15)',    // ← Blue
      secondary: 'rgba(168, 85, 247, 0.12)',  // ← Purple
      accent: 'rgba(34, 211, 238, 0.1)',      // ← Cyan
    },
  },
  // Add more stops...
];
```

### Adjust Parallax Speed
**File**: `components/ParallaxLayers.tsx`
```typescript
// Lines 21-48
const layers: Layer[] = [
  { speed: 0.1, ... },  // ← Slowest (background)
  { speed: 0.25, ... },
  { speed: 0.4, ... },
  { speed: 0.6, ... },  // ← Fastest (foreground)
];
```

### Toggle Aurora Effect
**File**: `components/BackgroundOrchestrator.tsx`
```typescript
// Line 19
const shouldRenderAurora = quality === 'high'; // ← Change to 'true' to always show
```

## 🎨 Z-Index Reference

```
z-0:  HeroBackground (3D particles)
z-1:  GradientMesh
z-2:  ScrollColorTransition + AuroraEffect
z-3:  ParallaxLayers
z-4:  SectionTransitions
z-5:  CursorGlow
z-10: Content
```

## 🔧 Common Tasks

### Disable an Effect
**File**: `components/BackgroundOrchestrator.tsx`
```typescript
// Set to false to disable
const shouldRenderParticles = false;      // 3D particles
const shouldRenderGradientMesh = false;   // Gradient mesh
const shouldRenderCursorGlow = false;     // Cursor glow
const shouldRenderScrollEffects = false;  // All scroll effects
const shouldRenderAurora = false;         // Aurora only
```

### Add New Section
**File**: `App.tsx`
```tsx
<motion.div data-section="your-section-name">
  <YourComponent />
</motion.div>
```

**File**: `components/SectionTransitions.tsx`
```typescript
// Add to sections array (line 13)
{ 
  id: 'your-section-name', 
  selector: '[data-section="your-section-name"]', 
  color: 'rgba(59, 130, 246, 0.1)' 
}
```

### Change Animation Speed
**File**: `components/GradientMesh.tsx`
```typescript
// Line 92
time += 0.01; // ← Increase for faster, decrease for slower
```

**File**: `components/AuroraEffect.tsx`
```typescript
// Line 89
time += 0.005; // ← Increase for faster waves
```

### Adjust Blur Levels
**File**: `components/ParallaxLayers.tsx`
```typescript
// Lines 21-48
blur: 150,  // ← Change blur amount (px)
```

**File**: `components/Features.tsx`
```typescript
// Lines 78, 91
blur-[120px]  // ← Change blur in className
```

## 🐛 Troubleshooting

### Performance Issues
1. Check FPS in console (usePerformanceMonitor)
2. Reduce particle count in HeroBackground
3. Disable aurora effect
4. Lower parallax layer count

### Effects Not Showing
1. Check z-index conflicts
2. Verify data-section attributes
3. Check browser console for errors
4. Ensure components are imported

### Scroll Effects Not Working
1. Verify useScrollProgress is tracking
2. Check data-section attributes exist
3. Ensure scroll container is correct
4. Check for CSS overflow issues

### Colors Not Transitioning
1. Verify scroll progress is updating
2. Check color stop positions (0-1)
3. Ensure RGBA format is correct
4. Check for reduced motion preference

## 📊 Performance Targets

| Device | Target FPS | Particle Count | Effects |
|--------|-----------|----------------|---------|
| Desktop High | 60 | 3000 | All |
| Desktop Low | 45-60 | 2000 | No Aurora |
| Tablet | 30-45 | 2000 | No Aurora |
| Mobile | 30-45 | 1200 | Reduced |
| Reduced Motion | 60 | 500 | Minimal |

## 🎯 Quality Levels

### High (60+ FPS)
- ✅ All effects enabled
- ✅ Aurora effect
- ✅ Full particle count
- ✅ All scroll effects

### Medium (30-60 FPS)
- ✅ Most effects enabled
- ❌ Aurora disabled
- ⚠️ Reduced particles
- ✅ Scroll effects

### Low (<30 FPS)
- ⚠️ Minimal effects
- ❌ Particles disabled
- ❌ Scroll effects disabled
- ✅ Static fallback

## 🔍 Debug Mode

### Enable Performance Logging
```typescript
// In usePerformanceMonitor.ts, add:
console.log('FPS:', avgFPS, 'Quality:', quality);
```

### Enable Scroll Logging
```typescript
// In useScrollProgress.ts, add:
console.log('Scroll:', progress, 'Velocity:', velocity);
```

### Show Z-Index Layers
```css
/* Add to index.css temporarily */
[class*="z-"] {
  outline: 1px solid red !important;
}
```

## 📱 Mobile Optimization

### Reduce Effects on Mobile
```typescript
// In BackgroundOrchestrator.tsx
const isMobile = window.innerWidth < 768;
const shouldRenderAurora = !isMobile && quality === 'high';
```

### Disable Cursor Glow on Touch
Already implemented in `CursorGlow.tsx`:
```typescript
const isTouchDevice = 'ontouchstart' in window;
if (isTouchDevice) return;
```

## 🌐 Browser Support

### Check WebGL Support
```typescript
const canvas = document.createElement('canvas');
const hasWebGL = !!(
  canvas.getContext('webgl') || 
  canvas.getContext('experimental-webgl')
);
```

### Fallback for No WebGL
Already implemented in `BackgroundOrchestrator.tsx` - shows static background.

## 📝 Best Practices

1. **Always test on real devices** - Emulators don't show true performance
2. **Monitor FPS** - Use usePerformanceMonitor to track
3. **Respect user preferences** - Check prefers-reduced-motion
4. **Optimize images** - Keep background images small
5. **Test scroll performance** - Ensure smooth scrolling
6. **Check memory usage** - Watch for leaks in DevTools
7. **Test on slow networks** - Lazy loading should work
8. **Validate accessibility** - Ensure effects don't interfere

## 🚨 Common Mistakes

❌ **Don't** hardcode particle counts
✅ **Do** use adaptive counts based on device

❌ **Don't** animate on every scroll event
✅ **Do** use RAF throttling

❌ **Don't** forget cleanup in useEffect
✅ **Do** cancel RAF and remove listeners

❌ **Don't** ignore reduced motion
✅ **Do** check and respect preference

❌ **Don't** use inline styles for animations
✅ **Do** use CSS transforms and GPU acceleration

## 📚 Further Reading

- [BACKGROUND_IMPROVEMENTS.md](./BACKGROUND_IMPROVEMENTS.md) - Full implementation details
- [PHASE_2_SUMMARY.md](./PHASE_2_SUMMARY.md) - Phase 2 overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [OPTIMIZATIONS.md](./OPTIMIZATIONS.md) - Performance optimizations

---

**Need help?** Check the documentation files above or review the component source code.
