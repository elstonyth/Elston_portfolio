# Elston Yeo — Portfolio

Interactive portfolio for a full-stack AI developer, showcasing analytics, automation, and UI engineering work. Built with Vite + React + Tailwind, with motion powered by Framer Motion and custom GLSL backgrounds.

## Quickstart

**Prerequisite:** Node 18+

```bash
npm install
npm run dev       # start at http://localhost:5173
```

To build the production bundle:

```bash
npm run build
```

If Rollup reports a missing native binary, clear dependencies then reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Stack
- Vite + React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion for animations
- Lenis for smooth scrolling (disabled for reduced-motion users)
- Three.js helpers for background effects

## Key Features
- Hero with immediate proof points and clear CTAs (view work, book a call, download resume)
- Scroll-spy navigation with accessible focus states
- Lazy-loaded sections (preview, features, work, testimonials) for faster first paint
- Toggle-friendly background: respects reduced-motion and mobile constraints

## Project Structure
- `src/app` — App shell, entry, and global styles
- `src/components` — UI primitives, sections, layout
- `src/features` — Preview/interactive showcases
- `public` — Static assets (resume PDF, card images)

## Common Scripts
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview built assets

## Contact / Resume
Resume PDF lives at `public/ElstonYeo_FullStack_AI_Resume_2025.pdf`. Contact links in the hero and navbar route to `#contact` or mailto for quick outreach.***
