import React, { useState } from 'react';
import { X, Target, Layout, Bot, Loader2, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useAppContext } from '@/context/AppContext';
import { AppStatus } from '@/types';
import { groqChat } from '@/lib/api';

export function AddJobModal({ onClose }: { onClose: () => void }) {
  const { state, setApps, addNotification } = useAppContext();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jdUrl, setJdUrl] = useState('');
  const [jdText, setJdText] = useState('');
  const [scraping, setScraping] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Scrape JD
  const scrapeLinkedIn = async () => {
    if (!jdUrl) return;
    setScraping(true);
    addNotification("Scraping", "Initializing Playwright to fetch JD...");
    try {
      const res = await fetch('/api/scrape-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jdUrl })
      });
      const data = await res.json();
      if (res.ok && data.description) {
        setJdText(data.description);
        // Also try to extract company/title loosely from URL or data if possible, but keep simple for now
        addNotification("Success", "Job description imported successfully.");
      } else {
        addNotification("Error", data.error || "Failed to fetch JD.");
      }
    } catch (e) {
      addNotification("Error", "Network error while scraping.");
    } finally {
      setScraping(false);
    }
  };

  const handleAddJob = async () => {
    if (!title || !company) {
      addNotification("Error", "Title and Company are required.");
      return;
    }

    let newApp: AppStatus = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      company,
      status: 'Wishlist',
      date: new Date().toISOString(),
      addedAt: Date.now(),
      notes: jdText ? `JD URL: ${jdUrl}\n\n${jdText}` : undefined
    };

    if (jdText && state.settings.groqKey) {
      setAnalyzing(true);
      addNotification("Fit Analysis", "Running job scoring rubric against your profile...");
      try {
        const prompt = `Analyze this job description against the user's profile and rubric.

JOB DESCRIPTION:
${jdText.substring(0, 3000)}

USER PROFILE:
Strengths: ${state.profile.strengths || 'None specified'}
Ideal Role: ${state.profile.idealRole || 'None specified'}

RUBRIC (Priorities and weights):
${state.settings.rubric.map(r => `- ${r.name} (Weight: ${r.weight}/5)`).join('\n')}

Based on this, return ONLY a JSON object (no markdown) with the following structure:
{
  "fitScore": <number 0-100 based on how well it matches the profile and rubric>,
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2"]
}`;

        const response = await groqChat(prompt, state.settings.groqKey);
        const result = JSON.parse(response.replace(/```json|```/g, '').trim());
        
        newApp.fitScore = result.fitScore;
        newApp.fitPros = result.pros;
        newApp.fitCons = result.cons;

        addNotification("Analysis Complete", `Fit Score: ${result.fitScore}/100`);
      } catch (err) {
        console.error("Analysis failed:", err);
        addNotification("Warning", "Failed to generate fit score. Added job without analysis.");
      } finally {
        setAnalyzing(false);
      }
    }

    setApps([...state.apps, newApp]);
    addNotification("Added", `${company} added to Pipeline.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-100 tracking-tight">New Application</h2>
              <p className="text-xs text-slate-400 font-bold">Add to tracker and analyze fit.</p>
            </div>
          </div>
          <button onClick={onClose} disabled={analyzing} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Job Title</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Company</label>
              <input 
                type="text" 
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Stripe"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50 font-bold"
              />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800/50">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <LinkIcon className="w-3 h-3" /> Auto-Import JD
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Paste LinkedIn Job URL..." 
                value={jdUrl}
                onChange={e => setJdUrl(e.target.value)}
                className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/50 font-bold"
              />
              <Button onClick={scrapeLinkedIn} disabled={scraping} className="bg-cyan-600 hover:bg-cyan-500 font-bold rounded-xl px-6">
                {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Job Description (Required for Fit Analysis)</label>
            <textarea 
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              placeholder="Paste the job description here, or use the auto-importer above..."
              className="w-full h-32 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-[var(--accent)]/50 font-bold resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 shrink-0 rounded-b-xl">
          <Button variant="ghost" onClick={onClose} disabled={analyzing} className="text-slate-400 hover:text-slate-300 font-bold">
            Cancel
          </Button>
          <Button 
            onClick={handleAddJob} 
            disabled={analyzing || !title || !company} 
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl px-6"
          >
            {analyzing ? (
              <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Fit...</span>
            ) : (
              <span className="flex items-center gap-2"><Bot className="w-4 h-4" /> Add & Analyze</span>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
