import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
        super: "0.2em",
        ultra: "0.3em",
        mega: "0.4em",
      },
      colors: {
        // Semantic background colors (auto-switch with theme)
        background: "var(--bg-primary)",
        surface: "var(--bg-secondary)",
        "surface-tertiary": "var(--bg-tertiary)",
        card: "var(--bg-card)",
        input: "var(--bg-input)",
        
        // Semantic text colors
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)",
        muted: "var(--text-muted)",
        
        // Border colors
        border: {
          DEFAULT: "var(--border-primary)",
          hover: "var(--border-hover)",
        },
        
        // Accent colors (mapped to CSS vars)
        accent: {
          cyan: "var(--accent-cyan)",
          purple: "var(--accent-purple)",
          pink: "var(--accent-pink)",
        },
        
        // Glass effects
        glass: {
          bg: "var(--glass-bg)",
          border: "var(--glass-border)",
        },
      },
      textColor: {
        dim: "var(--text-muted)",
      },
      backgroundImage: {
        "glow-gradient":
          "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 50%)",
        noise:
          "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E')",
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        "cursor-blink": "blink 1s step-end infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "border-rotate": "border-rotate 4s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "tilt": "tilt 10s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in-down": "fade-in-down 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-in-left": "slide-in-left 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-in-right": "slide-in-right 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "scale-in": "scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "bounce-soft": "bounce-soft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "marquee": "marquee 30s linear infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "border-rotate": {
          "0%": { "--border-angle": "0deg" },
          "100%": { "--border-angle": "360deg" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.02)", opacity: "1" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        tilt: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "bounce-soft": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(34, 211, 238, 0.6)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "smooth-out": "cubic-bezier(0.22, 1, 0.36, 1)",
        "snap": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
