// LOGIC FILE: do not change when restyling

import { useState, useEffect } from 'react';
import type { AppTheme } from './supabase';

const THEME_STORAGE_KEY = 'rocash.theme';

export function getSavedTheme(): AppTheme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'system';
}

export function resolveEffectiveTheme(theme: AppTheme): 'light' | 'dark' {
  if (theme === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
  return theme;
}

export function applyTheme(theme: AppTheme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.warn('Could not save theme to localStorage', e);
  }

  const effective = resolveEffectiveTheme(theme);
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', effective);
    document.documentElement.classList.toggle('dark', effective === 'dark');
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<AppTheme>(getSavedTheme);

  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  return { theme, setTheme, effectiveTheme: resolveEffectiveTheme(theme) };
}
