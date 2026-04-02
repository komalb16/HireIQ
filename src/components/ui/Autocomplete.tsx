"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Input } from './Input';

interface AutocompleteProps {
  options: string[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
}

export function Autocomplete({ options, placeholder, value, onChange, icon, className }: AutocompleteProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim() === '') {
      setFiltered([]);
      return;
    }
    const matches = options.filter(opt => 
      opt.toLowerCase().includes(value.toLowerCase()) && 
      opt.toLowerCase() !== value.toLowerCase()
    ).slice(0, 8);
    setFiltered(matches);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)] group-focus-within:text-[var(--accent)] transition-colors">
            {icon}
          </div>
        )}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className={`${icon ? 'pl-11' : ''} bg-[var(--surface2)] border-[var(--border)] h-14 rounded-2xl focus:ring-2 focus:ring-[var(--accent)]/20 transition-all font-medium`}
        />
        {value && (
          <button 
            onClick={() => { onChange(''); setShowDropdown(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text)] transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute left-0 right-0 z-[100] bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="py-2">
              {filtered.map((opt, i) => (
                <button
                  key={i}
                  className="w-full text-left px-5 py-3 hover:bg-[var(--surface2)] transition-colors text-sm font-bold text-[var(--text2)] flex items-center gap-3"
                  onClick={() => {
                    onChange(opt);
                    setShowDropdown(false);
                  }}
                >
                  <Search size={12} className="text-[var(--text3)]" />
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
