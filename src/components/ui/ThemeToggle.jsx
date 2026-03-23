import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hta_theme') || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      localStorage.removeItem('hta_theme');
      // No explicit class needed, media query handles it, but we respect the OS
    } else {
      root.classList.add(theme);
      localStorage.setItem('hta_theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  };

  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-inherit transition-colors flex items-center justify-center shrink-0"
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun size={20} className={`absolute transition-all duration-300 transform ${isDarkMode ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
        <Moon size={20} className={`absolute transition-all duration-300 transform ${isDarkMode ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`} />
      </div>
    </button>
  );
}
