'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-11 h-11 bg-white/50 backdrop-blur-md rounded-2xl border border-black/5 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm group border border-black/5 dark:border-white/5 hover:scale-110 active:scale-95 ${
        theme === 'dark' 
          ? 'bg-slate-900 text-primary border-white/10' 
          : 'bg-white text-secondary-text hover:bg-black/5 hover:text-foreground'
      }`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'light' ? (
          <Moon className="w-5 h-5 transition-all duration-500 transform group-hover:-rotate-12" />
        ) : (
          <Sun className="w-5 h-5 transition-all duration-500 transform group-hover:rotate-45" />
        )}
      </div>
    </button>
  );
}
