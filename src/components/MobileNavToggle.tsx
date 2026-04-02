"use client";

import React from 'react';

export default function MobileNavToggle() {
  return (
    <button 
      onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
      className="p-2 rounded-xl bg-[var(--surface2)] text-[var(--text2)] hover:bg-[var(--surface3)] transition-colors"
      aria-label="Toggle Navigation"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  );
}
