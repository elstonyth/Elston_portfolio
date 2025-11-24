# Background System Architecture

## Layer Stack Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                     CONTENT LAYER (z-10+)                    │
│  Navbar, Sections, Text, Images, Interactive Elements       │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│                   CURSOR GLOW (z-5)                          │
│  • Dual radial gradients (cyan + purple)                    │
│  • Follows cursor with smooth lerp                          │
│  • Mix-blend-mode: screen                                   │
│  • Disabled on touch devices                                │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│               SECTION TRANSITIONS (z-4)                      │
│  • Intersection Observer based                              │
│  • Radial gradient per section                              │
│  • 1.5s fade transitions                                    │
│  • Hero → Preview → Features → Work → CTA                   │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│                 PARALLAX LAYERS (z-3)                        │
│  Layer 4: 0.6x speed, 500px, pink (foreground)              │
│  Layer 3: 0.4x speed, 600px, cyan                           │
│  Layer 2: 0.25x speed, 700px, purple                        │
│  Layer 1: 0.1x speed, 900px, blue (background)              │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│         SCROLL COLOR TRANSITION + AURORA (z-2)               │
│  • 3 large gradient blobs                                   │
│  • Color interpolation based on scroll                      │
│  • Aurora waves at top (high-quality only)                  │
│  • Screen blend mode                                        │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│                  GRADIENT MESH (z-1)                         │
│  • Canvas-based animated gradients                          │
│  • 3 radial gradients with organic movement                 │
│  • Color cycling through palette                            │
│  • Screen blend mode, 40% opacity                           │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│              HERO BACKGROUND - 3D PARTICLES (z-0)            │
│  • WebGL shader-based particle system                       │
│  • 500-3000 particles (adaptive)                            │
│  • 3 depth layers with parallax                             │
│  • Mouse interaction & bloom effects                        │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│                    BASE BACKGROUND                           │
│  • Solid color: #030305                                     │
│  • Noise texture overlay (20% opacity)                      │
│  • Fallback for unsupported browsers                        │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx
  └── BackgroundOrchestrator
       ├── HeroBackground (3D Particles)
       │    └── NeuralParticles
       │         ├── Vertex Shader (flow field, parallax)
       │         ├── Fragment Shader (color, alpha)
       │         └── Bloom Post-Processing
       │
       ├── GradientMesh (Canvas Animation)
       │    └── 3 Radial Gradients
       │         ├── Gradient 1: Animated position
       │         ├── Gradient 2: Animated position
       │         └── Gradient 3: Animated position
       │
       ├── ScrollColorTransition
       │    └── useScrollProgress Hook
       │         ├── Scroll position tracking
       │         ├── Direction detection
       │         └── Velocity calculation
       │
       ├── ParallaxLayers
       │    └── 4 Independent Layers
       │         ├── Layer 1: 0.1x speed
       │         ├── Layer 2: 0.25x speed
       │         ├── Layer 3: 0.4x speed
       │         └── Layer 4: 0.6x speed
       │
       ├── SectionTransitions
       │    └── Intersection Observer
       │         ├── Hero section detection
       │         ├── Preview section detection
       │         ├── Features section detection
       │         ├── Work section detection
       │         └── CTA section detection
       │
       ├── AuroraEffect (High Quality Only)
       │    └── Canvas Wave Animation
       │         ├── Wave 1: 300px length
       │         ├── Wave 2: 250px length
       │         ├── Wave 3: 350px length
       │         └── Wave 4: 280px length
       │
       └── CursorGlow
            └── Dual Gradient System
                 ├── Cyan glow (600px radius)
                 └── Purple glow (400px radius)
```

## Performance Decision Tree

```
                    [Page Load]
                         |
                         v
              [usePerformanceMonitor]
                         |
         ┌───────────────┼───────────────┐
         v               v               v
    [High 60+]      [Medium 30-60]   [Low <30]
         |               |               |
         v               v               v
    All Effects    Reduced Effects  Minimal Effects
         |               |               |
    ✅ Particles    ✅ Particles      ❌ Particles
    ✅ Mesh         ✅ Mesh           ✅ Mesh
    ✅ Scroll FX    ✅ Scroll FX      ❌ Scroll FX
    ✅ Parallax     ✅ Parallax       ❌ Parallax
    ✅ Sections     ✅ Sections       ❌ Sections
    ✅ Aurora       ❌ Aurora         ❌ Aurora
    ✅ Cursor       ✅ Cursor         ❌ Cursor
```

## Data Flow

### Scroll-Based Effects

```
User Scrolls
     ↓
window.scrollY event
     ↓
useScrollProgress Hook
     ↓
RAF optimization
     ↓
Calculate:
  - progress (0-1)
  - scrollY (pixels)
  - direction (up/down/idle)
  - velocity (px/ms)
     ↓
Distribute to Components:
     ├→ ScrollColorTransition (progress)
     ├→ ParallaxLayers (scrollY)
     └→ SectionTransitions (via Intersection Observer)
```

### Performance Monitoring

```
requestAnimationFrame loop
     ↓
Count frames per second
     ↓
10-frame rolling average
     ↓
Calculate quality level:
  - fps >= 50 → High
  - fps >= 30 → Medium
  - fps < 30  → Low
     ↓
Update BackgroundOrchestrator
     ↓
Conditionally render components
```

### Color Interpolation

```
Scroll Progress (0-1)
     ↓
Find current color stop
     ↓
Find next color stop
     ↓
Calculate local progress
     ↓
Interpolate RGBA values:
  R = R1 + (R2 - R1) × progress
  G = G1 + (G2 - G1) × progress
  B = B1 + (B2 - B1) × progress
  A = A1 + (A2 - A1) × progress
     ↓
Apply to gradient blobs
```

## Optimization Strategies

### 1. **Lazy Loading**
```typescript
const HeroBackground = lazy(() => 
  import('./HeroBackground').then(m => ({ default: m.HeroBackground }))
);
```

### 2. **RAF Throttling**
```typescript
const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(updateScroll);
    ticking = true;
  }
};
```

### 3. **GPU Acceleration**
```typescript
transform: 'translate3d(0, 0, 0)',
willChange: 'transform',
```

### 4. **Conditional Rendering**
```typescript
{quality === 'high' && <AuroraEffect />}
{quality !== 'low' && <ScrollEffects />}
```

### 5. **Reduced Motion**
```typescript
const prefersReducedMotion = 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| WebGL Particles | ✅ | ✅ | ✅ | ✅ |
| Canvas Animation | ✅ | ✅ | ✅ | ✅ |
| CSS Transforms | ✅ | ✅ | ✅ | ✅ |
| Intersection Observer | ✅ | ✅ | ✅ | ✅ |
| Screen Blend Mode | ✅ | ✅ | ✅ | ✅ |
| Backdrop Filter | ✅ | ✅ | ⚠️ 16.4+ | ✅ |

## Memory Management

### Component Lifecycle

```
Mount:
  - Initialize RAF loops
  - Set up event listeners
  - Create canvas contexts
  - Allocate buffers

Active:
  - Update animations
  - Track scroll position
  - Monitor performance
  - Render frames

Unmount:
  - Cancel RAF loops
  - Remove event listeners
  - Destroy canvas contexts
  - Free buffers
```

### Cleanup Pattern

```typescript
useEffect(() => {
  // Setup
  const animationId = requestAnimationFrame(animate);
  window.addEventListener('scroll', handleScroll);
  
  // Cleanup
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

## Future Enhancements (Phase 3-4)

### Phase 3: Interactivity
- Scroll velocity affects particle speed
- Click creates ripple effects
- Mouse position influences all layers
- Section-aware particle behaviors

### Phase 4: Polish
- Chromatic aberration on fast scroll
- Animated grain texture overlay
- Dynamic vignette based on scroll
- Light leak effects at edges
- Advanced color grading

---

**Last Updated**: Phase 2 Complete
**Status**: Production Ready
**Performance**: Optimized for all devices
