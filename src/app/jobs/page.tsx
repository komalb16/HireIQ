"use client";

import React, { useState } from "react";
import { Search, MapPin, Briefcase, Sparkles, ExternalLink, Bookmark, Clock, DollarSign, Layout, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAppContext } from "@/context/AppContext";
import { searchJobs, groqChat } from "@/lib/api";
import { Job } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { AC_TITLES, AC_LOCATIONS, AC_COMPANIES } from "@/data/autocomplete";

export default function JobSearchPage() {
  const { state, setApps, setAlerts, addNotification } = useAppContext();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resultsShown, setResultsShown] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [matchReports, setMatchReports] = useState<Record<string, any>>({});

  // Filters
  const [typeFilter, setTypeFilter] = useState("all");
  const [workFilter, setWorkFilter] = useState("all");

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!state.settings.rapidKey) {
      addNotification("Missing Key", "Please add your RapidAPI key in Settings to search jobs.");
      return;
    }

    setIsSearching(true);
    setResultsShown(true);
    try {
      const data = await searchJobs({
        title: query,
        location: location,
        company: company,
        apiKey: state.settings.rapidKey,
      });
      setJobs(data);
    } catch (error) {
      addNotification("Error", "Search failed. Check your API key.");
    } finally {
      setIsSearching(false);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    // Basic filtering logic (placeholder for more complex logic)
    return true;
  });

  const analyzeJob = async (job: Job) => {
    if (!state.settings.groqKey) {
      addNotification("Auth Required", "Groq AI Node key missing.");
      return;
    }
    const activeResume = state.resumes.find(r => r.isActive) || state.resumes[0];
    if (!activeResume) {
      addNotification("Data Missing", "No active resume detected for analysis.");
      return;
    }

    setAnalyzingId(job.id);
    const prompt = `Perform an institutional-grade fit analysis between this resume and job node.
    
RESUME:
${activeResume.content.slice(0, 3000)}

JOB DESCRIPTION:
${job.title} at ${job.company}. ${job.description.slice(0, 1000)}

Respond ONLY as JSON:
{
  "score": <integer 0-100>,
  "alignment": "<one of: Extreme|High|Moderate|Low>",
  "technicalFit": "<one of: Strong|Adequate|Gap Detected>",
  "cultureFit": "<one of: Elite|Steady|Unknown>",
  "sprintSummary": "<15 words max on why this role matches>",
  "primaryGap": "<key missing skill/experience, 10 words max>"
}`;

    try {
      const raw = await groqChat(prompt, state.settings.groqKey);
      const report = JSON.parse(raw.replace(/```json|```/g, '').trim());
      setMatchReports(prev => ({ ...prev, [job.id]: report }));
      addNotification("Node Analyzed", `${job.company} handshake complete.`);
    } catch (e) {
      addNotification("Error", "Neural analysis failed.");
    } finally {
      setAnalyzingId(null);
    }
  };

  const addToTracker = (job: Job) => {
    if (state.apps.find((a) => a.id === job.id)) {
      addNotification("Duplicate", "Already in tracker!");
      return;
    }
    const newApp = {
      id: job.id,
      title: job.title,
      company: job.company,
      status: "Applied" as const,
      date: new Date().toISOString().split("T")[0],
      addedAt: Date.now()
    };
    setApps([...state.apps, newApp]);
    addNotification("Added", `${job.title} added to your tracker.`);
  };

  const handleSaveAlert = () => {
    if (!query && !location && !company) {
      addNotification("Criteria Missing", "No market parameters detected to save.");
      return;
    }
    
    const newAlert = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${query || 'General'} in ${location || 'Global'}`,
      title: query,
      location: location,
      skills: "",
      workType: workFilter,
      frequency: 24,
      notifyVia: "Dashboard",
      status: 'running' as const,
      lastChecked: new Date().toISOString()
    };

    setAlerts([...state.alerts, newAlert]);
    addNotification("Alert Synchronized", `Market monitor active for "${newAlert.name}".`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 relative z-10">
      <div className="relative overflow-hidden h-12 border-y border-[var(--border)] bg-[var(--surface)] flex items-center group mb-4">
         <div className="flex animate-marquee-slower items-center gap-12 whitespace-nowrap px-8">
            {['GOOGLE','META','AMAZON','APPLE','NETFLIX','STRIPE','UBER','GOLDMAN SACHS','JP MORGAN','SNOWFLAKE','DATABRICKS','OPENAI','META','AWS'].map((co, i) => (
              <div key={i} className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_var(--emerald-500)]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{co} RECRUITMENT ACTIVE</span>
                 <span className="text-emerald-500 font-bold text-[9px]">+{(Math.random() * 5 + 1).toFixed(1)}% VOL</span>
              </div>
            ))}
         </div>
         <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--surface)] to-transparent z-10" />
         <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--surface)] to-transparent z-10" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] border border-[var(--accent)]/20">
            <Sparkles size={12} /> Institutional Market Node
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-[var(--accent)] to-cyan-400 bg-clip-text text-transparent flex items-center gap-4 tracking-tighter uppercase italic">
             HireIQ <span className="text-[var(--text)] not-italic">Terminal</span>
          </h1>
          <div className="text-slate-400 font-medium max-w-xl text-lg italic tracking-tighter uppercase opacity-60 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Real-time Global Execution v2.0
          </div>
        </div>

        <Button 
          onClick={handleSaveAlert}
          variant="outline" 
          className="h-14 px-8 rounded-2xl border-slate-800 bg-slate-900/40 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all font-black uppercase text-xs tracking-widest flex items-center gap-2"
        >
          <Bookmark size={18} className="text-emerald-500" /> Market Monitor
        </Button>
      </div>

      <Card className="p-3 bg-slate-900/60 border-slate-800 backdrop-blur-3xl shadow-2xl rounded-[2.5rem] relative overflow-visible group">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 min-w-[200px]">
            <Autocomplete 
              options={AC_TITLES}
              placeholder="Job Title / Keyword"
              value={query}
              onChange={setQuery}
              icon={<Search size={20} className="text-slate-500" />}
              className="border-none bg-transparent h-16 text-lg font-bold"
            />
          </div>
          <div className="h-10 w-[1px] bg-slate-800 self-center hidden lg:block" />
          <div className="flex-1 min-w-[200px]">
            <Autocomplete 
              options={AC_LOCATIONS}
              placeholder="Location"
              value={location}
              onChange={setLocation}
              icon={<MapPin size={20} className="text-slate-500" />}
              className="border-none bg-transparent h-16 text-lg font-bold"
            />
          </div>
          <div className="h-10 w-[1px] bg-slate-800 self-center hidden lg:block" />
          <div className="flex-1 min-w-[200px]">
             <Autocomplete 
              options={AC_COMPANIES}
              placeholder="Company Tier"
              value={company}
              onChange={setCompany}
              icon={<Briefcase size={20} className="text-slate-500" />}
              className="border-none bg-transparent h-16 text-lg font-bold"
            />
          </div>
          <Button type="submit" className="h-16 px-12 bg-emerald-500 hover:bg-emerald-400 font-black rounded-2xl text-lg shadow-xl shadow-emerald-500/20 active:scale-95 transition-all uppercase" isLoading={isSearching}>
            EXECUTE SEARCH
          </Button>
        </form>
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
      </Card>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-slate-800/50">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 whitespace-nowrap italic mr-2">Quick Options:</span>
          {["Remote Only", "High Pay", "Recently Posted", "Saved Filters"].map((opt) => (
            <button
              key={opt}
              className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-slate-900/40 border border-slate-800 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 whitespace-nowrap"
            >
              {opt}
            </button>
          ))}
        </div>
        
        <div className="flex gap-4">
          <div className="flex bg-slate-900/80 rounded-2xl p-1 border border-slate-800 shadow-inner">
            {["all", "fulltime", "contract"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  typeFilter === t ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-600 hover:text-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredJobs.map((job, idx) => {
            const report = matchReports[job.id];
            const isAnalyzing = analyzingId === job.id;
            
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card className="group flex flex-col lg:flex-row bg-[var(--surface)] border-[var(--border)] hover:border-[var(--accent)] hover:shadow-2xl transition-all rounded-3xl overflow-hidden shadow-sm relative border-2">
                  <div className="p-8 flex-1 flex flex-col lg:flex-row items-center gap-8 border-r border-[var(--border)] bg-gradient-to-br from-white/5 to-transparent">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--surface2)] text-[var(--accent)] font-black text-4xl uppercase border-2 border-[var(--border)] shadow-xl shrink-0">
                      {job.company?.[0]}
                    </div>
                    
                    <div className="flex-1 space-y-3 text-center lg:text-left min-w-0">
                      <div className="space-y-0.5">
                        <h3 className="font-black text-2xl md:text-3xl tracking-tight group-hover:text-[var(--accent)] transition-colors truncate italic italic-none">
                          {job.title}
                        </h3>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.25em] flex items-center justify-center lg:justify-start gap-2 opacity-70">
                          {job.company} <div className="w-1 h-1 rounded-full bg-slate-700" /> {job.location}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                        {job.salary && (
                           <Badge variant="outline" className="px-3 py-1 border-[var(--accent)]/20 text-[var(--accent)] font-black text-[10px] uppercase">
                             <DollarSign size={10} className="mr-1" /> {job.salary}
                           </Badge>
                        )}
                        <Badge variant="outline" className="px-3 py-1 border-slate-700 text-slate-500 font-black text-[10px] uppercase">
                          <Clock size={10} className="mr-1" /> {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'REALTIME'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-96 p-8 bg-slate-900/40 backdrop-blur-md flex flex-col justify-center space-y-6">
                     <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Neural Handshake</p>
                        {report ? (
                          <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase italic ${report.score >= 80 ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : report.score >= 60 ? 'bg-amber-500 border-amber-500 text-white' : 'bg-red-500 border-red-500 text-white'}`}>
                             {report.score}% FIT
                          </div>
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-slate-700 animate-pulse" />
                        )}
                     </div>

                     {!report ? (
                        <Button 
                          onClick={() => analyzeJob(job)}
                          disabled={isAnalyzing}
                          className="h-14 rounded-2xl bg-[var(--surface2)] border-2 border-[var(--border)] hover:border-[var(--accent)] text-[var(--accent)] font-black uppercase text-xs tracking-widest transition-all group/btn"
                        >
                           {isAnalyzing ? <Zap size={18} className="animate-spin" /> : <Sparkles size={18} className="group-hover/btn:scale-110 transition-transform" /> }
                           <span className="ml-3">{isAnalyzing ? 'PROBING NODE...' : 'EXECUTE AI MATCH'}</span>
                        </Button>
                     ) : (
                        <div className="space-y-4 animate-in fade-in duration-500">
                           <div className="flex gap-2">
                             {['technicalFit','cultureFit'].map(key => (
                               <div key={key} className="flex-1 p-2 rounded-xl bg-[var(--surface)]/50 border border-[var(--border)]">
                                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic mb-1">{key === 'technicalFit' ? 'Technical' : 'Identity'}</p>
                                  <p className={`text-[10px] font-black uppercase ${report[key] === 'Strong' || report[key] === 'Elite' ? 'text-emerald-500' : 'text-amber-500'}`}>{report[key]}</p>
                                </div>
                             ))}
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 leading-tight italic uppercase opacity-80">"{report.sprintSummary}"</p>
                        </div>
                     )}

                     <div className="flex gap-4">
                        <Button 
                          className="flex-1 h-16 bg-[var(--accent)] hover:opacity-90 rounded-2xl font-black text-white uppercase italic tracking-tighter text-lg"
                          onClick={() => window.open(job.url, "_blank")}
                        >
                          Execute <ArrowRight size={20} className="ml-2" />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-16 h-16 rounded-2xl border-2 border-slate-800 bg-[var(--surface)] text-slate-500 hover:text-amber-500 hover:border-amber-500/50 transition-all p-0"
                          onClick={() => addToTracker(job)}
                        >
                          <Bookmark size={24} />
                        </Button>
                     </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {!isSearching && resultsShown && filteredJobs.length === 0 && (
        <div className="text-center py-32 animate-in fade-in slide-in-from-bottom-8">
          <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">🔍</div>
          <h3 className="text-2xl font-bold text-slate-200">No results matching your criteria</h3>
          <p className="text-slate-500 mt-2">Try broader keywords or removing specific filters.</p>
        </div>
      )}

      {!resultsShown && !isSearching && (
        <div className="text-center py-32 opacity-20">
          <Briefcase className="mx-auto mb-6" size={80} />
          <p className="text-xl font-bold uppercase tracking-widest">Search over 1M+ active tech roles</p>
        </div>
      )}
    </div>
  );
}
