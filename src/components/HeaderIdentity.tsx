"use client";

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { LogOut } from 'lucide-react';

export function HeaderIdentity() {
  const { state, logout } = useAppContext();

  return (
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex flex-col items-end mr-2">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text3)] leading-none mb-1">Authenticated</p>
        <p className="text-xs font-bold text-[var(--text)] whitespace-nowrap">
          Welcome, {state?.profile?.name || 'User'}
        </p>
      </div>

      <button 
        onClick={logout}
        className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 group"
        title="Logout Session"
      >
        <LogOut size={16} className="group-active:scale-90 transition-transform" />
      </button>
    </div>
  );
}
