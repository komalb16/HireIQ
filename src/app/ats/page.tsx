"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, Sparkles, LayoutList, Layout, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAppContext } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const ATS_SKILL_PATTERNS = [
  'react', 'typescript', 'javascript', 'python', 'java', 'golang', 'rust', 'swift', 'kotlin',
  'graphql', 'rest', 'api', 'aws', 'gcp', 'azure', 'kubernetes', 'docker', 'terraform', 'ci/cd',
  'postgresql', 'mongodb', 'redis', 'kafka', 'elasticsearch', 'spark', 'hadoop',
  'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'llm', 'nlp',
  'accessibility', 'wcag', 'performance', 'system design', 'agile', 'scrum',
  'mentoring', 'leadership', 'cross-functional', 'communication', 'next.js',
  'node', 'angular', 'vue', 'css', 'html', 'sql', 'nosql', 'microservices', 'distributed',
];

interface KeywordResult {
  kw: string;
  status: 'found' | 'partial' | 'missing';
}

export default function ATSPage() {
  const { state, addNotification } = useAppContext();
  const [jd, setJd] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ keywords: KeywordResult[], score: number } | null>(null);

  const activeResume = state.resumes.find(r => r.isActive) || state.resumes[0];

  const runAnalysis = () => {
    if (!activeResume) {
      addNotification("Required", "Please upload and set an active resume first!");
      return;
    }
    if (!jd.trim()) {
      addNotification("Required", "Please paste a job description!");
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const text = jd.toLowerCase();
      const resumeText = activeResume.content.toLowerCase();
      
      const keywords: KeywordResult[] = ATS_SKILL_PATTERNS
        .filter(kw => text.includes(kw))
        .map(kw => {
          if (resumeText.includes(kw)) return { kw, status: 'found' };
          if (kw.split(' ').some(word => word.length > 3 && resumeText.includes(word))) return { kw, status: 'partial' };
          return { kw, status: 'missing' };
        });

      const foundCount = keywords.filter(k => k.status === 'found').length;
      const partialCount = keywords.filter(k => k.status === 'partial').length;
      const score = Math.round(((foundCount + partialCount * 0.5) / (keywords.length || 1)) * 100);

      setResults({ keywords, score });
      setIsAnalyzing(false);
      addNotification("Analysis Complete", `Match score: ${score}%`);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <Search className="w-8 h-8 text-emerald-400" /> ATS Match Scanner
          </h1>
          <p className="text-slate-400 mt-1">Audit your resume for applicant tracking systems and optimize your keywords.</p>
        </div>
        {activeResume && (
          <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 px-5 py-3 rounded-2xl shadow-xl">
             <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black uppercase shadow-lg">
                {activeResume.name[0]}
              </div>
              <div className="text-xs">
                <p className="font-black text-emerald-400 uppercase tracking-widest">Active Resume</p>
                <p className="text-slate-400 font-bold truncate max-w-[140px] mt-0.5">{activeResume.name}</p>
              </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Input Side */}
        <div className="space-y-6">
          <Card className="p-8 bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <LayoutList size={16} className="text-emerald-500" /> Target Job Description
              </h2>
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase h-8 px-4 rounded-xl text-slate-600 hover:text-white" onClick={() => setJd("")}>
                Clear
              </Button>
            </div>
            <textarea 
              placeholder="Paste the target requirements here to see how you match up..."
              className="w-full min-h-[450px] bg-slate-950/30 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300 leading-relaxed outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none shadow-inner scroll-smooth"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
            <div className="pt-6">
              <Button 
                className="w-full h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold text-lg rounded-2xl shadow-xl shadow-emerald-500/10" 
                onClick={runAnalysis}
                isLoading={isAnalyzing}
              >
                Scan Job Match
              </Button>
            </div>
          </Card>
        </div>

        {/* Results Side */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {!results && !isAnalyzing ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center opacity-30 border-2 border-dashed border-slate-800 rounded-[2.5rem]"
              >
                <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-8">
                  <Layout size={48} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-300">Ready to Analyze</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-xs">Paste a target JD to reveal key requirement gaps and your match percentage.</p>
              </motion.div>
            ) : isAnalyzing ? (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-6">
                 <Zap className="w-16 h-16 text-emerald-500 animate-pulse" />
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Checking Compliance...</p>
              </div>
            ) : results ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Score Header */}
                <Card className="p-10 bg-slate-900 shadow-2xl border-slate-800 rounded-[2.5rem] relative overflow-hidden">
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resume Match Score</p>
                      <h2 className={`text-7xl font-black ${results.score >= 70 ? 'text-emerald-400' : results.score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                        {results.score}%
                      </h2>
                      <p className="text-sm font-bold text-slate-300 mt-4 max-w-[200px] leading-relaxed">
                        {results.score >= 70 ? 'Strong alignment found. You are likely to pass initial screens!' : results.score >= 40 ? 'Partial alignment. Some critical skill gaps detected.' : 'Major gaps found. You need significant optimization.'}
                      </p>
                    </div>
                    <div className={`p-8 rounded-[3rem] ${results.score >= 70 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} border border-current opacity-20`}>
                       <Sparkles size={64} />
                    </div>
                  </div>
                  <div className={`absolute -right-10 -bottom-10 w-64 h-64 blur-[100px] rounded-full opacity-10 ${results.score >= 70 ? 'bg-emerald-500' : results.score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} />
                </Card>

                {/* Keyword Feedback */}
                <div className="space-y-6">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-2">
                    Requirement Gaps & Matches
                  </h3>
                  
                  <div className="grid gap-4">
                    <Card className="p-6 bg-slate-900 shadow-xl border-slate-800 rounded-[2rem]">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CheckCircle size={14} /> Confirmed Competencies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {results.keywords.filter(k => k.status === 'found').map(k => (
                          <Badge key={k.kw} variant="success" className="px-3">
                            {k.kw}
                          </Badge>
                        ))}
                        {results.keywords.filter(k => k.status === 'found').length === 0 && (
                          <p className="text-xs text-slate-600 font-bold">No exact matches detected.</p>
                        )}
                      </div>
                    </Card>

                    <Card className="p-6 bg-slate-900 shadow-xl border-slate-800 rounded-[2rem]">
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <XCircle size={14} /> Missing Critical Keywords
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {results.keywords.filter(k => k.status === 'missing').map(k => (
                          <Badge key={k.kw} variant="error" className="px-3">
                            {k.kw}
                          </Badge>
                        ))}
                         {results.keywords.filter(k => k.status === 'missing').length === 0 && (
                          <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Perfect match! No gaps found.</p>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>

                <Button className="w-full h-14 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 group transition-all">
                  <Sparkles size={18} className="mr-2 text-cyan-400 group-hover:animate-pulse" />
                  Apply ATS-Friendly Optimization
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
