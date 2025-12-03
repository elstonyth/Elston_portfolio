import React, { createContext, useContext, useEffect } from 'react';

// Simplified ThemeContext - dark mode only
interface ThemeContextType {
  theme: 'dark';
  isDark: true;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Apply dark mode class to document on mount
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    
    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', '#030305');
    }
    
    // Clear any stored theme preference
    localStorage.removeItem('portfolio-theme');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', isDark: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
