"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppContext } from '@/context/AppContext';
import { groqChat } from '@/lib/api';
import { motion } from 'framer-motion';
import { validateGroqKey, validateRapidKey, playDenialSound } from '@/lib/validation';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Layout, 
  CheckCircle, 
  Zap,
  Briefcase,
  History,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

const TONES = [
  { id: 'professional', label: 'Professional', icon: '💼', desc: 'Formal, precise, and industry-standard.' },
  { id: 'enthusiastic', label: 'Enthusiastic', icon: '🚀', desc: 'High-energy, passionate, and bold.' },
  { id: 'balanced', label: 'Balanced', icon: '⚖️', desc: 'Mix of professional and approachable.' },
  { id: 'creative', label: 'Creative', icon: '🎨', desc: 'Unique, story-driven, and memorable.' },
];

export default function CoverLetterPage() {
  const { state, addNotification, setProfile, setSettings, seedDemoData } = useAppContext();
  const [jd, setJd] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  
  const [loginData, setLoginData] = useState({ name: '', email: '', groqKey: '', rapidKey: '' });
  const [showGroq, setShowGroq] = useState(false);
  const [showRapid, setShowRapid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [recalibrate, setRecalibrate] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const triggerErrors = (allErrors: Record<string, string>) => {
    playDenialSound();
    setErrors(allErrors);
    setRecalibrate(Object.keys(allErrors));
    // Clear invalid fields
    setLoginData(prev => {
      const updated = { ...prev };
      Object.keys(allErrors).forEach(key => (updated as any)[key] = "");
      return updated;
    });
    // Errors persist for 30 seconds as requested
    setTimeout(() => {
      setErrors({});
      setRecalibrate([]);
    }, 30000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidating) return;
    setErrors({});
    setRecalibrate([]);

    const newErrors: Record<string, string> = {};

    // 1. Synchronous Bulk Scan
    // Name Validation
    const nameParts = loginData.name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      newErrors.name = "Full legal name (First & Last) required.";
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      newErrors.email = "Invalid or missing email node.";
    }

    // Key Presence
    if (!loginData.groqKey) {
      newErrors.groqKey = "Groq Node key required.";
    } else if (!loginData.groqKey.startsWith('gsk_')) {
      newErrors.groqKey = "Invalid prefix. Expected 'gsk_'.";
    }

    if (!loginData.rapidKey) {
      newErrors.rapidKey = "Rapid Node key required.";
    }

    if (Object.keys(newErrors).length > 0) {
      triggerErrors(newErrors);
      return;
    }

    setIsValidating(true);

    // 2. Asynchronous Node Handshake
    const groqRes = await validateGroqKey(loginData.groqKey);
    if (!groqRes.valid) {
      setIsValidating(false);
      triggerErrors({ groqKey: groqRes.error || "Groq Node unauthorized." });
      return;
    }

    const rapidRes = await validateRapidKey(loginData.rapidKey);
    if (!rapidRes.valid) {
      setIsValidating(false);
      triggerErrors({ rapidKey: rapidRes.error || "Rapid Node unauthorized." });
      return;
    }

    // Success - Identity & Node Synchronization
    setProfile({ name: loginData.name, email: loginData.email, linkedin: "" });
    setSettings({ 
      ...state.settings, 
      groqKey: loginData.groqKey, 
      rapidKey: loginData.rapidKey 
    });
    
    addNotification("Auth Success", `Node ${loginData.name} initialized. AI & Market protocols active.`);
    setIsValidating(false);
  };

  const handleDemo = () => {
    seedDemoData();
    window.location.reload();
  };

  // Strict First-Screen Entry Choice
  if (!state.profile.name || state.profile.name === "" || state.profile.name === "User") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 md:p-12 space-y-16 animate-in fade-in zoom-in-95 duration-1000">
        <div className="text-center space-y-6 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.4em] border border-[var(--accent)]/20 mb-2"
          >
             Institutional Hub Entrance
          </motion.div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-[var(--text)] leading-[0.8] italic uppercase">
            HireIQ <span className="text-[var(--accent)] not-italic">Hub</span>
          </h1>
          <div className="flex flex-col items-center gap-2 pt-4">
             <div className="flex items-center gap-3">
               <Badge className="px-4 py-1 border-[var(--accent)]/30 text-[var(--accent)] font-black uppercase text-[10px] tracking-[0.3em] rounded-full bg-transparent">
                 Neural refraction active
               </Badge>
               <span className="text-slate-600 font-black text-[10px] uppercase tracking-widest italic opacity-60">Stable Node v4.0.5</span>
             </div>
             <p className="text-slate-500 text-sm font-black uppercase tracking-[0.2em] italic max-w-xl mx-auto pt-2">
               Enterprise-grade career intelligence terminal.
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Institutional Entry */}
          <Card className="p-10 border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/50 transition-all group rounded-[3rem] relative overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col border-2">
             <div className="relative z-10 space-y-8 flex-1">
                <div className="flex items-center justify-between">
                  <div className="p-4 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center shadow-2xl shadow-[var(--accent-glow)] group-hover:scale-110 transition-transform">
                     <Lock size={28} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Node</p>
                    <p className="text-xs font-black text-[var(--accent)] uppercase italic">Protocol Secure</p>
                  </div>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className={`relative transition-all ${recalibrate.includes('name') ? 'animate-shake' : ''}`}>
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="Full Name (First & Last)" 
                          className={`w-full bg-[var(--bg)] border-2 border-[var(--border)] rounded-2xl pl-12 pr-6 py-4 text-sm outline-none focus:border-[var(--accent)] transition-all font-black ${recalibrate.includes('name') ? 'animate-recalibrate' : ''}`}
                          value={loginData.name}
                          onChange={(e) => setLoginData({...loginData, name: e.target.value})}
                        />
                      </div>
                      {errors.name && <p className="text-[10px] text-red-500 font-black uppercase mt-1.5 px-4 italic animate-in fade-in slide-in-from-top-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <div className={`relative transition-all ${recalibrate.includes('email') ? 'animate-shake' : ''}`}>
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="email" 
                          placeholder="Email" 
                          className={`w-full bg-[var(--bg)] border-2 border-[var(--border)] rounded-2xl pl-12 pr-6 py-4 text-sm outline-none focus:border-[var(--accent)] transition-all font-black ${recalibrate.includes('email') ? 'animate-recalibrate' : ''}`}
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        />
                      </div>
                      {errors.email && <p className="text-[10px] text-red-500 font-black uppercase mt-1.5 px-4 italic animate-in fade-in slide-in-from-top-1">{errors.email}</p>}
                    </div>

                    <div>
                      <div className={`relative transition-all ${recalibrate.includes('groqKey') ? 'animate-shake' : ''}`}>
                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--accent)]" />
                        <input 
                          type={showGroq ? "text" : "password"} 
                          placeholder="Groq API Node Key (gsk_...)" 
                          className={`w-full bg-[var(--bg)] border-2 border-[var(--border)] rounded-2xl pl-12 pr-14 py-4 text-sm outline-none focus:border-[var(--accent)] transition-all font-black ${recalibrate.includes('groqKey') ? 'animate-recalibrate' : ''}`}
                          value={loginData.groqKey}
                          onChange={(e) => setLoginData({...loginData, groqKey: e.target.value})}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowGroq(!showGroq)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[var(--accent)]"
                        >
                          {showGroq ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.groqKey && <p className="text-[10px] text-red-500 font-black uppercase mt-1.5 px-4 italic animate-in fade-in slide-in-from-top-1">{errors.groqKey}</p>}
                    </div>

                    <div>
                      <div className={`relative transition-all ${recalibrate.includes('rapidKey') ? 'animate-shake' : ''}`}>
                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                        <input 
                          type={showRapid ? "text" : "password"} 
                          placeholder="Rapid API Market Key" 
                          className={`w-full bg-[var(--bg)] border-2 border-[var(--border)] rounded-2xl pl-12 pr-14 py-4 text-sm outline-none focus:border-[var(--accent)] transition-all font-black ${recalibrate.includes('rapidKey') ? 'animate-recalibrate' : ''}`}
                          value={loginData.rapidKey}
                          onChange={(e) => setLoginData({...loginData, rapidKey: e.target.value})}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowRapid(!showRapid)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-500"
                        >
                          {showRapid ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.rapidKey && <p className="text-[10px] text-red-500 font-black uppercase mt-1.5 px-4 italic animate-in fade-in slide-in-from-top-1">{errors.rapidKey}</p>}
                    </div>
                  </div>
                  <Button 
                    type="submit"
                    disabled={isValidating}
                    className="w-full h-16 rounded-2xl bg-[var(--accent)] hover:opacity-90 text-white font-black text-lg shadow-xl shadow-[var(--accent-glow)] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase italic disabled:opacity-50"
                  >
                    <span>{isValidating ? "Probing Node..." : "Execute Initialization"}</span>
                    {!isValidating && <ArrowRight size={20} />}
                    {isValidating && <Zap size={20} className="animate-spin" />}
                  </Button>
                </form>
             </div>
             <div className="absolute -right-20 -top-20 w-80 h-80 bg-[var(--accent)]/5 blur-[100px] rounded-full pointer-events-none" />
          </Card>

          {/* Public Demo Node */}
          <Card 
            onClick={handleDemo}
            className="p-10 border-[var(--border)] bg-[var(--bg)]/40 hover:border-cyan-500/50 transition-all group rounded-[3rem] relative overflow-hidden backdrop-blur-2xl cursor-pointer shadow-xl flex flex-col border-2"
          >
             <div className="relative z-10 space-y-8 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="p-4 rounded-2xl bg-slate-800 text-white flex items-center justify-center group-hover:bg-cyan-600 transition-colors">
                     <Zap size={28} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Public Access</p>
                    <p className="text-xs font-black text-cyan-500 uppercase italic">Demo Hub</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-5xl font-black tracking-tighter leading-none italic uppercase">
                    Sandbox <br/> <span className="text-cyan-500">Explorer</span>
                  </h3>
                  <p className="text-slate-500 text-sm font-black leading-tight uppercase italic opacity-70">
                    Instantly deploy markets and mock datasets across 50+ global companies.
                  </p>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                   <div className="flex items-center gap-3 text-cyan-500 font-black text-[10px] uppercase tracking-[0.3em] group-hover:gap-6 transition-all">
                      Access Demo Hub <ArrowRight size={16} />
                   </div>
                </div>
             </div>
             <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
          </Card>
        </div>
      </div>
    );
  }

  const generateLetter = async () => {
    if (!jd.trim()) {
      addNotification("Empty Input", "Please paste a job description first.");
      return;
    }

    if (!state.settings.groqKey) {
      addNotification("Missing API Key", "Please add your Groq API key in Settings.");
      return;
    }

    setLoading(true);
    const activeResume = state.resumes.find(r => r.isActive) || state.resumes[0];
    
    const prompt = `Write a high-converting cover letter based on the following:
    
TONE: ${tone}
TARGET JOB: ${jd.slice(0, 1500)}
MY BACKGROUND: ${activeResume ? activeResume.content.slice(0, 2000) : 'I am a highly motivated professional (resume not provided).'}

REQUIREMENTS:
- Use ${tone} tone specifically.
- Keep it under 250 words.
- Start with a strong hook based on the job requirements.
- Reference 2-3 specific skills/results from my background that map directy to the JD.
- End with a call to action.
- Do NOT use generic placeholders like [Your Name] if you can avoid them (use ${state.profile.name || 'Candidate'}).
- Use modern, clean language (no "I am writing to express my interest").

Output ONLY the cover letter text:`;

    try {
      const res = await groqChat(prompt, state.settings.groqKey);
      setOutput(res);
      addNotification("Success", "AI Cover Letter generated!");
    } catch (e) {
      addNotification("Error", "Failed to generate cover letter. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      addNotification("Copied", "Cover letter copied to clipboard.");
    }
  };

  return (
    <div className="px-4 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-1000 relative z-10">
      <div className="flex flex-col items-center justify-center gap-3 text-center pb-2">
        <div className="space-y-2 flex flex-col items-center">
           <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow)] animate-pulse border border-[var(--accent)]/20">
              <Sparkles size={24} />
           </div>
           
           <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-[var(--accent)] to-cyan-400 bg-clip-text text-transparent tracking-tight uppercase leading-tight">
            HireIQ <span className="italic">Hub</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <Card className="p-12 border-slate-800 bg-slate-900/60 backdrop-blur-3xl space-y-10 rounded-[4rem] shadow-2xl relative overflow-hidden group border-2">
            <div className="space-y-4 relative z-10">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 px-3 italic">
                <Layout className="w-4 h-4 text-[var(--accent)]" /> System Input: Target JD
              </label>
              <textarea 
                className="w-full bg-slate-950/50 border-2 border-slate-800 rounded-[2.5rem] p-10 text-base text-slate-200 outline-none focus:ring-4 focus:ring-[var(--accent)]/10 focus:border-[var(--accent)]/40 min-h-[400px] resize-none transition-all leading-relaxed shadow-inner font-bold"
                placeholder="Paste the target job description node here..."
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />
            </div>

            <div className="space-y-6 relative z-10">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-3 mb-2 italic">Refraction Tone</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`p-4 rounded-[2rem] border-2 transition-all text-left relative group/tone flex flex-col gap-3 min-h-[7rem] ${
                      tone === t.id 
                        ? 'bg-[var(--accent)]/10 border-[var(--accent)] shadow-2xl shadow-[var(--accent-glow)]' 
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-2xl">{t.icon}</div>
                    <div className={`text-[10px] font-black uppercase tracking-wider leading-tight ${tone === t.id ? 'text-[var(--accent)]' : 'text-slate-600'}`}>{t.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={generateLetter} 
              disabled={loading}
              className="w-full h-20 bg-[var(--accent)] hover:opacity-90 font-black text-xl shadow-2xl shadow-[var(--accent-glow)] rounded-3xl transition-all relative overflow-hidden group/btn uppercase italic"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <Zap className="w-6 h-6 animate-spin" /> SYNTHESIZING...
                </span>
              ) : (
                <span className="flex items-center gap-3 group-hover/btn:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6" /> EXECUTE REFRACTION
                </span>
              )}
            </Button>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent)]/5 blur-[100px] rounded-full pointer-events-none" />
          </Card>
        </div>

        <div className="space-y-12">
          {!output && !loading ? (
            <div className="h-full min-h-[600px] border-4 border-dashed border-slate-800/50 rounded-[4rem] flex flex-col items-center justify-center p-20 text-center opacity-30 bg-slate-900/10 backdrop-blur-sm group hover:opacity-50 transition-all">
               <div className="w-32 h-32 bg-slate-800 rounded-[3rem] flex items-center justify-center mb-10 shadow-2xl shadow-black/80 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-16 h-16 text-slate-500" />
               </div>
               <h3 className="text-3xl font-black text-slate-300 uppercase tracking-[0.4em] italic mb-6">IDLE</h3>
               <p className="text-sm text-slate-500 max-w-sm font-black leading-relaxed uppercase tracking-widest italic opacity-60">
                 Awaiting Job Description for neural refraction process.
               </p>
            </div>
          ) : loading ? (
             <Card className="p-12 border-2 border-slate-800 bg-slate-900/60 h-full min-h-[600px] animate-pulse rounded-[4rem] shadow-2xl">
                <div className="space-y-12">
                   <div className="h-14 w-1/2 bg-slate-800 rounded-full" />
                   <div className="p-16 border-2 border-slate-800 rounded-[3rem] space-y-8 bg-slate-800/20">
                      <div className="h-6 w-full bg-slate-800 rounded-full" />
                      <div className="h-6 w-full bg-slate-800 rounded-full" />
                      <div className="h-6 w-3/4 bg-slate-800 rounded-full" />
                      <div className="pt-12 space-y-6">
                        <div className="h-6 w-full bg-slate-800 rounded-full" />
                        <div className="h-6 w-full bg-slate-800 rounded-full" />
                        <div className="h-6 w-1/2 bg-slate-800 rounded-full" />
                      </div>
                   </div>
                </div>
             </Card>
          ) : (
            <Card className="p-16 border-2 border-slate-800 bg-slate-900/80 relative group h-fit animate-in slide-in-from-right-12 duration-1000 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
               <div className="flex items-center justify-between mb-12 pb-10 border-b-2 border-slate-800/50">
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-[var(--accent)] rounded-3xl text-white shadow-2xl shadow-[var(--accent-glow)]">
                       <CheckCircle size={32} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black tracking-tighter text-slate-100 italic uppercase italic">Refracted Output</h2>
                      <p className="text-[12px] font-black uppercase text-slate-500 tracking-[0.3em] leading-none opacity-60">Success: Protocol Complete</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-16 rounded-[2rem] border-2 border-slate-800 bg-slate-800/50 hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] px-8 font-black text-slate-300 transition-all active:scale-95 uppercase tracking-widest text-xs">
                      <Copy className="w-5 h-5 mr-3" /> COPY DATA
                    </Button>
                  </div>
               </div>
               <div className="whitespace-pre-wrap text-lg text-slate-200 leading-relaxed font-medium select-text bg-slate-950/60 p-12 rounded-[3rem] border-2 border-slate-800/50 shadow-inner italic">
                  {output}
               </div>
               <div className="mt-12 flex items-center justify-between opacity-40">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">Core: Refraction Engine v9.0-Final</p>
               </div>
               <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
