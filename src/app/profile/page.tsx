"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppContext } from '@/context/AppContext';
import { User, Shield, Briefcase, Sparkles, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { state, setProfile, addNotification } = useAppContext();

  const handleSave = () => {
    addNotification("Profile Updated", "Your 'About You' hub has been synchronized.");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-1000 relative z-10 p-4">
      <div className="flex flex-col items-center justify-center gap-3 text-center pb-6 border-b border-slate-800">
        <div className="w-16 h-16 rounded-3xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shadow-lg border border-[var(--accent)]/20 mb-4">
          <User size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[var(--accent)] to-cyan-400 bg-clip-text text-transparent uppercase tracking-tight italic">
          Profile Vault
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">
          Core Identity & Experience Databank
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="p-8 border-2 border-slate-800 bg-slate-900/60 rounded-[3rem] shadow-xl relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <Shield className="w-6 h-6 text-[var(--accent)]" />
            <h2 className="text-2xl font-black uppercase text-slate-200">Demonstrated Strengths</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4 font-medium relative z-10">
            List your core strengths and the evidence (projects/outcomes) that prove them. Used by AI to tailor your positioning.
          </p>
          <textarea
            className="relative z-10 w-full bg-slate-950/50 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 outline-none focus:border-[var(--accent)]/50 min-h-[150px] resize-y font-mono leading-relaxed"
            placeholder="1. Strategic Leadership - Led a team of 15 to deliver Project X, increasing revenue by 20%..."
            value={state.profile.strengths}
            onChange={(e) => setProfile({ ...state.profile, strengths: e.target.value })}
          />
        </Card>

        <Card className="p-8 border-2 border-slate-800 bg-slate-900/60 rounded-[3rem] shadow-xl relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-black uppercase text-slate-200">Story Bank (STAR)</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4 font-medium relative z-10">
            Store 5-8 raw STAR stories (Situation, Task, Action, Result). The AI will adapt these naturally for cover letters and interviews.
          </p>
          <textarea
            className="relative z-10 w-full bg-slate-950/50 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 outline-none focus:border-cyan-500/50 min-h-[250px] resize-y font-mono leading-relaxed"
            placeholder="Story 1: Resolving the Q3 Server Outage...&#10;Situation: ...&#10;Task: ...&#10;Action: ...&#10;Result: ..."
            value={state.profile.storyBank}
            onChange={(e) => setProfile({ ...state.profile, storyBank: e.target.value })}
          />
        </Card>

        <Card className="p-8 border-2 border-slate-800 bg-slate-900/60 rounded-[3rem] shadow-xl relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <Briefcase className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-black uppercase text-slate-200">Ideal Role & Logistics</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4 font-medium relative z-10">
            Define your target titles, locations, compensation baselines, and dealbreakers. Used for automated job rubric scoring.
          </p>
          <textarea
            className="relative z-10 w-full bg-slate-950/50 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 outline-none focus:border-emerald-500/50 min-h-[150px] resize-y font-mono leading-relaxed"
            placeholder="Target: Senior Frontend Engineer / Tech Lead&#10;Location: Remote or NYC Hybrid&#10;Dealbreakers: Legacy tech stacks (jQuery), mandatory 5 days in office..."
            value={state.profile.idealRole}
            onChange={(e) => setProfile({ ...state.profile, idealRole: e.target.value })}
          />
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSave}
          className="h-16 px-12 rounded-[2rem] bg-[var(--accent)] hover:opacity-90 font-black text-lg text-white shadow-xl shadow-[var(--accent-glow)] uppercase italic tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <CheckCircle className="w-6 h-6" /> Save Databank
        </Button>
      </div>
    </div>
  );
}
