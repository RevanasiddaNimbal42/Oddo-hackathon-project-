import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ThemeName } from '../types';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  themes: { name: ThemeName; label: string; color: string }[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const themes = [
  { name: 'light' as ThemeName, label: 'Light', color: '#2563eb' },
  { name: 'dark' as ThemeName, label: 'Dark', color: '#60a5fa' },
  { name: 'purple' as ThemeName, label: 'Purple', color: '#8b5cf6' },
  { name: 'emerald' as ThemeName, label: 'Emerald', color: '#10b981' },
  { name: 'ocean' as ThemeName, label: 'Ocean', color: '#0ea5e9' },
  { name: 'sunset' as ThemeName, label: 'Sunset', color: '#ea580c' },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('transitops-theme') as ThemeName | null;
    return saved ?? 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('transitops-theme', theme);
  }, [theme]);

  const setTheme = (t: ThemeName) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
