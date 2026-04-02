"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppContext } from '@/context/AppContext';
import { groqChat } from '@/lib/api';
import { 
  X, 
  Send, 
  Copy, 
  Sparkles, 
  Mail, 
  CheckCircle, 
  AlertTriangle,
  History,
  ShieldCheck
} from 'lucide-react';
import { AppStatus } from '@/types';

interface EmailComposerProps {
  app: AppStatus;
  onClose: () => void;
}

const TEMPLATES = [
  { id: 'thanks', label: 'Thank You', icon: '🙏', prompt: 'Write a concise, professional thank-you email after an interview. Mention the specific role and company. Keep it under 100 words.' },
  { id: 'checkin', label: 'Follow-up', icon: '🕒', prompt: 'Write a polite check-in email 1 week after the interview. Reiterate interest and ask for any updates on the timeline. Under 80 words.' },
  { id: 'negotiate', label: 'Negotiate', icon: '💰', prompt: 'Write a professional email requesting a discussion about the compensation package. Express excitement but mention that the current offer is slightly below market expectations based on my background. Suggest a call. Under 150 words.' },
  { id: 'decline', label: 'Withdraw', icon: '🏃', prompt: 'Write a professional withdrawal email. Mention you received another offer that aligns better with your long-term goals. Thank them for their time. Under 80 words.' },
];

export function EmailComposer({ app, onClose }: EmailComposerProps) {
  const { state, addNotification } = useAppContext();
  const [activeTab, setActiveTab] = useState(TEMPLATES[0].id);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [subject, setSubject] = useState('');

  const generateEmail = async (templateId: string) => {
    setActiveTab(templateId);
    setLoading(true);
    
    const template = TEMPLATES.find(t => t.id === templateId)!;
    const prompt = `${template.prompt}
    
CONTEXT:
- Candidate: ${state.profile.name}
- Role: ${app.title}
- Company: ${app.company}
- Interview Date: ${app.date}

Output format:
Subject: <subject line>
Body: <email body>`;

    try {
      const res = await groqChat(prompt, state.settings.groqKey);
      const parts = res.split(/Body:/i);
      const subj = parts[0].replace(/Subject:/i, '').trim();
      const body = parts[1] || parts[0];
      setSubject(subj);
      setOutput(body.trim());
    } catch (e) {
      addNotification("Error", "Failed to generate email.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateEmail(TEMPLATES[0].id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${output}`);
    addNotification("Copied", "Email copied to clipboard.");
  };

  const openMail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(output)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border-slate-800 bg-slate-900 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white rounded-full hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">AI Email Composer</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Generating professional outreach for <span className="text-cyan-400 font-bold">{app.title} @ {app.company}</span>
          </p>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 p-4 space-y-2 bg-slate-900/50">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => generateEmail(t.id)}
                className={`w-full p-4 rounded-xl text-left transition-all border ${
                  activeTab === t.id 
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/5' 
                    : 'border-transparent text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-xs font-black uppercase tracking-widest">{t.label}</div>
              </button>
            ))}
          </div>

          {/* Editor Area */}
          <div className="flex-1 p-8 overflow-y-auto space-y-6">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                <Mail className="w-12 h-12 text-cyan-500 animate-bounce" />
                <p className="text-sm font-bold text-slate-400 animate-pulse">AI is drafting your response...</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject Line</label>
                  <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm font-bold text-slate-200">
                    {subject}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Body</label>
                  <pre className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-serif min-h-[250px] shadow-inner select-text">
                    {output}
                  </pre>
                </div>
                
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-[11px] text-amber-500/80 leading-relaxed italic">
                    "AI generation can be generic. Always double-check names, dates, and specific conversational hooks mentioned during your actual interview before sending."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
             <ShieldCheck className="w-4 h-4 text-emerald-500" /> Professional Tone Applied
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose} className="text-slate-400">Cancel</Button>
            <Button variant="outline" onClick={copyEmail} className="border-slate-700 text-slate-300">
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
            <Button onClick={openMail} className="bg-cyan-500 hover:bg-cyan-600 font-bold px-8 shadow-lg shadow-cyan-500/10">
              <Send className="w-4 h-4 mr-2" /> Open in Mail
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
