"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAppContext } from '@/context/AppContext';
import { groqChat } from '@/lib/api';
import { 
  DollarSign, 
  Send, 
  Copy, 
  Mail, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle,
  BarChart3
} from 'lucide-react';

export default function SalaryNegotiatorPage() {
  const { state, addNotification } = useAppContext();
  const [activeTab, setActiveTab] = useState<'negotiator' | 'estimator'>('negotiator');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [estData, setEstData] = useState<any>(null);

  // Form State (Negotiator)
  const [offered, setOffered] = useState('');
  const [target, setTarget] = useState('');
  const [role, setRole] = useState('');
  const [leverage, setLeverage] = useState('');
  const [equity, setEquity] = useState('');
  const [signing, setSigning] = useState('');

  // Form State (Estimator)
  const [salJD, setSalJD] = useState('');
  const [salLoc, setSalLoc] = useState('United States');
  const [salYoe, setSalYoe] = useState('3-5');
  const [salSize, setSalSize] = useState('midmarket');

  const [options, setOptions] = useState({
    counter: true,
    batna: true,
    email: true,
    equityAsk: false
  });

  const handleRunNegotiation = async () => {
    if (!offered || !role) {
      addNotification("Missing Info", "Please enter at least the offered salary and role.");
      return;
    }

    setLoading(true);
    const sections = [];
    if (options.counter) sections.push('1. COUNTER-OFFER SCRIPT — exact words to say verbally or on a call, 3-5 sentences, confident but collaborative tone');
    if (options.batna)   sections.push('2. BATNA ANALYSIS — their walkaway point, your walkaway point, the real negotiating range, what leverage matters most');
    if (options.email)   sections.push('3. NEGOTIATION EMAIL — complete ready-to-send email with subject line, professional but firm, reference specific offer details');
    if (options.equityAsk) sections.push('4. EQUITY COUNTER-STRATEGY — how to frame an equity ask, what to request, how to compare equity offers');

    const prompt = `You are an expert compensation negotiator who has helped hundreds of engineers and PMs negotiate offers at top tech companies.

OFFER DETAILS:
- Role: ${role}
- Offered salary: ${offered}
- Target salary: ${target || 'not specified — estimate a reasonable target'}
${equity ? `- Equity offered: ${equity}` : ''}
${signing ? `- Signing bonus: ${signing}` : ''}
${leverage ? `- Candidate leverage: ${leverage}` : ''}

Generate the following sections. Be specific, concrete, and use the actual numbers provided.
Do not give generic advice — tailor everything to this specific offer and role.

${sections.join('\n')}

Format with clear section headers. For the email include a subject line starting with "Subject:".
Be direct and confident. Negotiation is expected — frame everything as collaborative problem-solving.`;

    try {
      const res = await groqChat(prompt, state.settings.groqKey);
      setResult(res);
      addNotification("Success", "Your negotiation strategy is ready.");
    } catch (e) {
      addNotification("Error", "Failed to generate strategy. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunEstimator = async () => {
    if (!salJD) {
      addNotification("Missing JD", "Please paste a job description first.");
      return;
    }

    setLoading(true);
    const sizeMap: Record<string, string> = {startup:'startup (<50 people)',scaleup:'scale-up (50–500)',midmarket:'mid-market company (500–5k)',enterprise:'large enterprise (5k+)',faang:'FAANG or top-tier tech company'};
    const sizeLabel = sizeMap[salSize];
    const yoeLabel  = salYoe + ' years experience';

    const prompt = `You are a senior compensation analyst with real-world hiring data across tech companies worldwide. Analyse this job description and return a realistic salary estimate as JSON only.

JOB DESCRIPTION:
${salJD.slice(0, 1500)}

CONTEXT:
- Location: ${salLoc}
- Candidate experience: ${yoeLabel}
- Company type: ${sizeLabel}

Return ONLY this JSON with no markdown:
{
  "role": "<inferred title>",
  "seniority": "<Seniority level>",
  "low": <integer>, "mid": <integer>, "high": <integer>,
  "low_note": "<rationale>", "mid_note": "<rationale>", "high_note": "<rationale>",
  "total_comp_note": "<equity/bonus info>",
  "negotiation_tip": "<specific tip>"
}`;

    try {
      const raw = await groqChat(prompt, state.settings.groqKey);
      const data = JSON.parse(raw.replace(/```json|```/g, '').trim());
      setEstData(data);
      addNotification("Analysis Complete", "Market salary bands have been estimated.");
    } catch (e) {
      addNotification("Error", "Failed to parse estimate. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      addNotification("Copied", "Full strategy copied to clipboard.");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2 justify-center md:justify-start">
            <DollarSign className="w-8 h-8 text-emerald-400" /> Compensation Toolkit
          </h1>
          <p className="text-slate-400 mt-2">Professional tools for salary estimation and offer negotiation.</p>
        </div>
        
        <div className="flex p-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <button 
            onClick={() => { setActiveTab('negotiator'); setResult(null); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'negotiator' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Negotiator
          </button>
          <button 
            onClick={() => { setActiveTab('estimator'); setResult(null); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'estimator' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Market Estimator
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border-slate-800 bg-slate-900/50 backdrop-blur-xl space-y-4">
             {activeTab === 'negotiator' ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role & Company</label>
                    <Input placeholder="Senior Frontend @ Meta" value={role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offered Base</label>
                      <Input placeholder="$160,000" className="border-l-4 border-l-emerald-500" value={offered} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOffered(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Base</label>
                      <Input placeholder="$185,000" value={target} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTarget(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Equity / Bonus</label>
                    <Input placeholder="200k RSU / 10% bonus" value={equity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEquity(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leverage Factors</label>
                    <textarea className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-emerald-500 outline-none min-h-[80px]" placeholder="Alternative offers, niche skills..." value={leverage} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLeverage(e.target.value)} />
                  </div>
                  <Button onClick={handleRunNegotiation} disabled={loading} className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 font-bold">
                      {loading ? 'Analyzing...' : 'Generate Plan'}
                  </Button>
                </div>
             ) : (
                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description</label>
                      <textarea className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-cyan-500 outline-none min-h-[160px]" placeholder="Paste JD here..." value={salJD} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSalJD(e.target.value)} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
                      <Input value={salLoc} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSalLoc(e.target.value)} />
                   </div>
                   <Button onClick={handleRunEstimator} disabled={loading} className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 font-bold">
                      {loading ? 'Estimating...' : 'Get Market Band'}
                  </Button>
                </div>
             )}
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!result && !estData && !loading && (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
               <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  {activeTab === 'negotiator' ? <Target className="w-8 h-8 text-slate-600" /> : <BarChart3 className="w-8 h-8 text-slate-600" />}
               </div>
               <h3 className="text-xl font-bold text-slate-400">Ready to Analyze</h3>
            </div>
          )}

          {activeTab === 'negotiator' && result && !loading && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" /> Strategy Overview
                  </h2>
                  <Button variant="ghost" size="sm" onClick={copyAll} className="text-slate-400 hover:text-white">
                    <Copy className="w-4 h-4 mr-2" /> Copy All
                  </Button>
               </div>
               <div className="space-y-6">
                {result.split(/\d\.\s+(?=[A-Z])/).filter(Boolean).map((section, idx) => {
                  const titleMatch = section.match(/^([^—\n]+)/);
                  const title = titleMatch ? titleMatch[1].trim() : `Section ${idx + 1}`;
                  const body = section.replace(/^[^—\n]+/, '').trim();
                  return (
                    <Card key={idx} className="p-6 border-slate-800 bg-slate-900/40">
                      <h3 className="text-lg font-bold text-slate-200 mb-4">{title}</h3>
                      <div className="text-slate-400 text-sm whitespace-pre-wrap">{body}</div>
                    </Card>
                  );
                })}
               </div>
            </div>
          )}

          {activeTab === 'estimator' && estData && !loading && (
            <Card className="p-8 border-slate-800 bg-slate-900/50 backdrop-blur-xl animate-in slide-in-from-right-4 duration-500">
               <Badge variant="info" className="mb-2">{estData.seniority}</Badge>
               <h2 className="text-2xl font-bold text-slate-100">{estData.role}</h2>
               <div className="mt-8 space-y-6">
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Min: ${estData.low.toLocaleString()}</span>
                    <span>Median: ${estData.mid.toLocaleString()}</span>
                    <span>Max: ${estData.high.toLocaleString()}</span>
                  </div>
                  <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-cyan-500/30" style={{ width: '33%' }} />
                    <div className="h-full bg-cyan-500/60" style={{ width: '33%' }} />
                    <div className="h-full bg-cyan-500" style={{ width: '34%' }} />
                  </div>
                  <p className="text-sm text-slate-400 italic">"{estData.negotiation_tip}"</p>
               </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
