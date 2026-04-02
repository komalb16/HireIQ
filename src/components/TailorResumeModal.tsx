"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Check, Copy, FileText, AlertCircle, Loader2, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { groqChat } from '@/lib/api';
import { useAppContext } from '@/context/AppContext';

interface TailorResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeContent: string;
  resumeName: string;
}

export function TailorResumeModal({ isOpen, onClose, resumeContent, resumeName }: TailorResumeModalProps) {
  const { state, addNotification } = useAppContext();
  const [jd, setJd] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const { setResumes } = useAppContext();

  const handleTailor = async () => {
    if (!jd.trim()) {
      addNotification("Input Required", "Please paste a job description first.");
      return;
    }
    if (!state.settings.groqKey) {
      addNotification("Missing Key", "Please add your Groq API key in Settings.");
      return;
    }

    setIsProcessing(true);
    const prompt = `Perform an institutional-grade neural refactor of this resume for the target job node.
    
JOB DESCRIPTION:
${jd}

ORIGINAL RESUME:
${resumeContent}

Provide the refactor in three specific segments as JSON:
{
  "summary": "<A 3-sentence high-impact professional summary tailored to the JD.>",
  "achievements": ["<Impact bullet 1 with metrics>", "<Impact bullet 2 with metrics>", "<Impact bullet 3 with metrics>"],
  "skills": ["<Top 5 technical skills from JD mapping to user>"],
  "fullText": "<The complete, reconstructed resume text including these improvements.>"
}`;

    try {
      const raw = await groqChat(prompt, state.settings.groqKey);
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      setResult(parsed);
      
      // Auto-Synthesis Logic
      setIsSaving(true);
      const newResume = {
        id: `refined-${Date.now()}`,
        name: `${resumeName} (Neural Refined)`,
        content: parsed.fullText,
        lastModified: new Date().toISOString(),
        isActive: true
      };

      // Set current resumes to inactive and add new refined one
      setResumes(prev => [
        ...prev.map(r => ({ ...r, isActive: false })),
        newResume
      ]);

      addNotification("Synthesis Complete", "New optimized node added and activated.");
      setTimeout(() => setIsSaving(false), 2000);
    } catch (e) {
      addNotification("Error", "AI Tailoring failed. Check your connection/key.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const textToCopy = result.fullText;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addNotification("Copied", "Full refined text captured.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface2)]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-lg">AI Resume Tailor</h2>
                  <p className="text-xs text-[var(--text3)] font-bold uppercase tracking-wider">Targeting: {resumeName}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[var(--surface3)] text-[var(--text3)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {!result ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-amber-500 text-sm">
                    <AlertCircle size={18} className="shrink-0" />
                    <p className="font-medium">For best results, paste the full Job Description including requirements and responsibilities.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--text2)] uppercase tracking-widest ml-2">Job Description</label>
                    <textarea
                      className="w-full h-80 bg-[var(--surface2)] border border-[var(--border)] rounded-3xl p-6 outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all text-sm leading-relaxed text-[var(--text2)] resize-none"
                      placeholder="Paste the target Job Description here..."
                      value={jd}
                      onChange={(e) => setJd(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleTailor}
                    disabled={isProcessing || !jd.trim()}
                    className="w-full py-6 text-lg font-bold bg-[var(--accent)] hover:opacity-90 rounded-2xl shadow-xl shadow-[var(--accent)]/10"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 
                        AI Analyzing & Refactoring...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" /> Tailor My Resume
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1">
                       <h3 className="font-black text-[var(--accent)] flex items-center gap-2 uppercase tracking-tighter text-xl">
                          <Check size={20} /> Synthesis Operational
                       </h3>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic opacity-60">Auto-saved as active node in library</p>
                    </div>
                    <div className="flex gap-3">
                       <Button variant="outline" size="sm" onClick={() => setResult(null)} className="h-10 rounded-2xl border-[var(--border)] text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100">
                          Reset Node
                       </Button>
                       <Button size="sm" onClick={copyToClipboard} className={`h-10 rounded-2xl px-6 text-xs font-black uppercase tracking-widest shadow-xl transition-all ${copied ? 'bg-emerald-500' : 'bg-[var(--accent)]'}`}>
                          {copied ? 'Captured' : 'Copy Full Node'}
                       </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-[var(--surface2)]/50 border-[var(--border)] rounded-3xl p-8 space-y-6">
                       <div className="space-y-2">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Neural Summary</p>
                         <p className="text-sm font-bold text-slate-200 leading-relaxed italic border-l-2 border-[var(--accent)] pl-4">
                           {result.summary}
                         </p>
                       </div>
                       <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] italic">Tailored Achievements</p>
                         <div className="space-y-3">
                            {result.achievements.map((a: string, i: number) => (
                              <div key={i} className="flex gap-3 text-xs text-slate-300 font-medium">
                                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                                 <p>{a}</p>
                              </div>
                            ))}
                         </div>
                       </div>
                    </Card>

                    <Card className="bg-slate-900/60 border-[var(--border)] rounded-3xl p-8 space-y-6 relative overflow-hidden">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic relative z-10">Neural Skill Matrix</p>
                       <div className="flex flex-wrap gap-2 relative z-10">
                          {result.skills.map((s: string, i: number) => (
                            <Badge key={i} className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-black text-[10px] py-1 px-3 rounded-full uppercase tracking-widest">
                               {s}
                            </Badge>
                          ))}
                       </div>
                       <div className="pt-6 border-t border-slate-800 space-y-2">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">Full Refactor Preview</p>
                          <div className="text-[10px] text-slate-600 line-clamp-6 italic font-medium">
                             {result.fullText}
                          </div>
                       </div>
                       <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
                    </Card>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!result && (
              <div className="p-6 border-t border-[var(--border)] bg-[var(--surface2)]/30 flex items-center justify-between">
                <p className="text-xs text-[var(--text3)] font-medium">✨ Powered by Llama 3.3 (70B) via Groq</p>
                <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text3)]">
                   <div className="px-2 py-1 rounded bg-[var(--surface3)]">Accuracy High</div>
                   <div className="px-2 py-1 rounded bg-[var(--surface3)] text-[var(--accent)]">Tokens Optimized</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
