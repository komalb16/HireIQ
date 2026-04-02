"use client";

import React from 'react';
import { Sun, Moon, Sparkles, Cloud } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export function ThemeToggle() {
  const { state, toggleTheme, seedDemoData } = useAppContext();
  const theme = state.settings.theme;

  const getIcon = () => {
    if (theme === 'light') return <Sun size={18} className="text-amber-500" />;
    if (theme === 'medium') return <Cloud size={18} className="text-slate-400" />;
    return <Moon size={18} className="text-cyan-400" />;
  };

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-xl bg-[var(--surface2)] text-[var(--text2)] hover:bg-[var(--surface3)] hover:text-[var(--text)] transition-all border border-[var(--border)] shadow-sm"
        aria-label="Toggle Theme"
      >
        {getIcon()}
      </button>
    </div>
  );
}
