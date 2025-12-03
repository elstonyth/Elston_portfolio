import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

type ButtonVariants = 'primary' | 'secondary' | 'outline' | 'ghost' | 'galaxy';
type ButtonSizes = 'sm' | 'md' | 'lg';

type BaseProps = {
  variant?: ButtonVariants;
  size?: ButtonSizes;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
  };

type ButtonAsLink = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  as = 'button',
  ...props
}) => {
  const { isDark } = useTheme();
  
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-300 ease-smooth-out rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0';

  const variants: Record<ButtonVariants, string> = {
    primary: isDark
      ? 'bg-white text-black hover:bg-gray-100 relative overflow-hidden group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-shadow duration-300'
      : 'bg-gray-900 text-white hover:bg-gray-800 relative overflow-hidden group shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-shadow duration-300',
    secondary: isDark
      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-sm hover:border-white/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300'
      : 'bg-gray-900/10 text-gray-900 hover:bg-gray-900/20 border border-gray-400/30 backdrop-blur-sm hover:border-gray-500/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-all duration-300',
    outline: isDark
      ? 'bg-transparent border border-white/20 text-white hover:border-cyan-400/50 hover:bg-white/5 backdrop-blur-sm hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all duration-300'
      : 'bg-transparent border border-gray-500/40 text-gray-900 hover:border-cyan-600/50 hover:bg-gray-900/5 backdrop-blur-sm hover:shadow-[0_0_25px_rgba(8,145,178,0.15)] transition-all duration-300',
    ghost: isDark 
      ? 'bg-transparent text-text-dim hover:text-white hover:bg-white/5 transition-colors duration-200'
      : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-900/5 transition-colors duration-200',
    galaxy:
      'relative overflow-hidden border border-transparent text-white bg-transparent before:absolute before:inset-[1px] before:rounded-full before:bg-black/70 before:backdrop-blur before:border before:border-white/10 after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-[#0ea5e9] after:via-[#8b5cf6] after:to-[#ec4899] after:opacity-70 after:blur-[18px] after:-z-10 shadow-[0_0_25px_rgba(14,165,233,0.35)] hover:shadow-[0_0_40px_rgba(14,165,233,0.5)] transition-shadow duration-300',
  };

  const sizes: Record<ButtonSizes, string> = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-8 py-3',
  };

  const commonClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    'active:scale-95',
    className
  );

  if (as === 'a') {
    const anchorProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={commonClasses} {...anchorProps}>
        {variant === 'primary' && (
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        )}
        {variant === 'galaxy' && (
          <div className="absolute inset-[2px] rounded-full bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/15 animate-pulse" />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </a>
    );
  }

  const { type, ...buttonProps } = props as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type ?? 'button'} className={commonClasses} {...buttonProps}>
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
      )}
      {variant === 'galaxy' && (
        <div className="absolute inset-[2px] rounded-full bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/15 animate-pulse" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
