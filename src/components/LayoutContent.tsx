"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import PageTransition from "@/components/PageTransition";
import MobileNavToggle from "@/components/MobileNavToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AIGridBackground } from "@/components/AIGridBackground";
import { HeaderClock } from "@/components/HeaderClock";
import { HeaderIdentity } from "@/components/HeaderIdentity";
import { NotificationToast } from "@/components/NotificationToast";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { state } = useAppContext();
  const isIdentified = state.profile.name && state.profile.name !== "";

  return (
    <body className="antialiased font-[family-name:var(--font-dm-sans)] bg-[var(--bg)] text-[var(--text)] min-h-screen transition-colors duration-300 font-medium overflow-x-hidden">
      <AIGridBackground />
      <NotificationToast />
      
      {/* Header Block — Grid-based true centering */}
      <header className="sticky top-0 z-[200] bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] h-[65px] grid grid-cols-[1fr_auto_1fr] items-center px-6 shadow-sm">
         {/* Left: Mobile nav toggle (only when authenticated) */}
         <div className="flex items-center gap-3">
            {isIdentified && (
              <div className="lg:hidden">
                 <MobileNavToggle />
              </div>
            )}
         </div>

         {/* Center: Logo + Nav — always truly centered */}
         <div className="flex items-center gap-8">
            <Link href="/" className="font-[family-name:var(--font-inter)] font-black text-xl tracking-tighter flex items-center gap-2 group transition-all shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white text-sm font-black shadow-lg shadow-[var(--accent-glow)] group-hover:scale-105 transition-transform">H</div>
              <span>HireIQ <span className="text-[var(--accent)] italic">Hub</span></span>
            </Link>

            {isIdentified && (
              <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text2)]">
                <Link href="/jobs" className="hover:text-[var(--accent)] transition-colors">Market</Link>
                <Link href="/ats" className="hover:text-[var(--accent)] transition-colors">AI Tools</Link>
                <Link href="/resume" className="hover:text-[var(--accent)] transition-colors">Resume</Link>
              </div>
            )}
         </div>
         
         {/* Right: Clock, Theme, Identity */}
         <div className="flex items-center justify-end gap-3">
            <div className="hidden md:block">
               <HeaderClock />
            </div>
            <div className="h-5 w-px bg-[var(--border)] mx-1 hidden sm:block" />
            <ThemeToggle />
            {isIdentified && <HeaderIdentity />}
         </div>
      </header>

      <div className="flex">
        {/* Global Navigation - Only show if user is identified */}
        {isIdentified && <Sidebar />}

        {/* Main Content Render */}
        <main className={`flex-1 w-full relative z-10 transition-all duration-500 ${!isIdentified ? 'flex items-center justify-center min-h-[calc(100vh-65px)]' : ''}`}>
           <div className={`${!isIdentified ? 'w-full max-w-6xl' : 'w-full'} py-6 px-4 md:px-6`}>
              <PageTransition>
                {children}
              </PageTransition>
           </div>
        </main>
      </div>
    </body>
  );
}
