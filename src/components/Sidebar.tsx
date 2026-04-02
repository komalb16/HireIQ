'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  FileText, 
  CheckSquare, 
  Mic2, 
  LayoutDashboard, 
  BarChart3, 
  DollarSign, 
  Settings,
  Bell,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '@/components/ui/Badge';

export default function Sidebar() {
  const pathname = usePathname();
  const { state, setSettings, logout } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = (state.notifs || []).filter(n => n.unread).length;

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  // Close on navigation (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const links = [
    { href: '/', label: 'Magic Builder', icon: Sparkles, color: 'text-emerald-400' },
    { href: '/jobs', label: 'Job Search', icon: Search, color: 'text-cyan-400' },
    { href: '/resume', label: 'Resume Library', icon: FileText, color: 'text-amber-400' },
    { href: '/ats', label: 'ATS Auditor', icon: CheckSquare, color: 'text-indigo-400' },
    { href: '/mock-interview', label: 'Interview GPT', icon: Mic2, color: 'text-rose-400' },
    { href: '/tracker', label: 'Pipeline Tracker', icon: LayoutDashboard, color: 'text-purple-400' },
    { href: '/analytics', label: 'Analytics', icon: BarChart3, color: 'text-emerald-400' },
    { href: '/salary-negotiator', label: 'Negotiation', icon: DollarSign, color: 'text-cyan-400' },
    { href: '/settings', label: 'Settings', icon: Settings, color: 'text-slate-400' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] lg:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed left-0 top-[65px] bottom-0 w-72 bg-[var(--surface)] border-r border-[var(--border)] 
        flex flex-col z-[160] transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex-1 py-8 px-6 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text2)] opacity-50 mb-6 ml-2">Main Navigation</p>
          
          {links.slice(0, -1).map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  group flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all
                  ${isActive 
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)] shadow-lg shadow-[var(--accent)]/5 border border-[var(--accent)]/20' 
                    : 'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] border border-transparent'}
                `}
              >
                <Icon size={18} className={`${isActive ? 'text-[var(--accent)]' : 'text-[var(--text2)] opacity-50 group-hover:opacity-100'} transition-all`} />
                <span className="flex-1 whitespace-nowrap">{link.label}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]" />}
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-[var(--border)] space-y-6">
          {/* Identity Matrix (Theme Switcher) */}
          <div className="space-y-4 px-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text2)] opacity-40 italic">Identity Matrix</p>
            <div className="grid grid-cols-6 gap-2">
              {[
                { id: 'lavender', color: 'bg-[#a78bfa]' },
                { id: 'violet', color: 'bg-[#8b5cf6]' },
                { id: 'blue', color: 'bg-[#3b82f6]' },
                { id: 'red', color: 'bg-[#ef4444]' },
                { id: 'pink', color: 'bg-[#db2777]' },
                { id: 'black', color: 'bg-[#000000]' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSettings(prev => ({ ...prev, theme: t.id as any }));
                    document.documentElement.setAttribute('data-theme', t.id);
                  }}
                  className={`w-full aspect-square rounded-lg ${t.color} border-2 transition-all hover:scale-110 active:scale-95 ${state.settings.theme === t.id ? 'border-white ring-2 ring-[var(--accent)] shadow-xl' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  title={t.id}
                />
              ))}
            </div>
          </div>

          <InnerCard className="p-4 bg-[var(--surface2)]/30 border-[var(--border)] relative overflow-hidden group cursor-pointer" onClick={logout}>
             <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                      <Zap size={18} />
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-xs font-black text-[var(--text)] uppercase tracking-tighter">Terminate</p>
                      <p className="text-[10px] text-[var(--text2)] opacity-50 font-bold italic">Secure Logout</p>
                   </div>
                </div>
             </div>
          </InnerCard>
        </div>
      </aside>
    </>
  );
}

function InnerCard({ children, className = "", ...props }: { children: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl border transition-all ${className}`} {...props}>
      {children}
    </div>
  );
}

function Card({ children, className = "", ...props }: { children: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl border transition-all ${className}`} {...props}>
      {children}
    </div>
  );
}
