"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BANK, CAT_ICO, CAT_ORDER, COMPANIES } from '@/data/interviewBank';
import { Question, InterviewScore } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAppContext } from '@/context/AppContext';
import { groqChat } from '@/lib/api';
import {
  Mic,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle,
  Timer,
  ChevronRight,
  Lightbulb,
  SkipForward,
  Download,
  Zap,
  Lock
} from 'lucide-react';

// --- Types ---
type InterviewState = 'setup' | 'dossier' | 'room' | 'results';

interface ChatMessage {
  role: 'interviewer' | 'user';
  content: string;
  avatarChar: string;
}

// --- Helpers ---
const speakText = (text: string, enabled: boolean) => {
  if (!enabled || typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};

export default function MockInterviewPage() {
  const { state, addNotification } = useAppContext();
  const [view, setView] = useState<InterviewState>('setup');
  
  // Setup State
  const [qCount, setQCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'all'>('all');
  const [category, setCategory] = useState<string>('all');
  const [company, setCompany] = useState<string>('');
  const [hardMode, setHardMode] = useState(false);
  const [timePressure, setTimePressure] = useState(false);
  const [limit, setLimit] = useState(60); // seconds

  // Interview State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<InterviewScore[]>([]);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [isLate, setIsLate] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isProbing, setIsProbing] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  
  // Dossier state
  const [dossierSearch, setDossierSearch] = useState('');
  const [dossierTab, setDossierTab] = useState('all');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [lastView, setLastView] = useState<'setup' | 'dossier'>('setup');

  // STT / TTS State
  const [sttActive, setSttActive] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Global Timer & Countdown Effect
  useEffect(() => {
    let interval: any;
    if (view === 'room' && startTime) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
        if (timePressure && !isThinking && !isProbing) {
           setCountdown(prev => {
             if (prev <= 1) {
               setIsLate(true);
               return 0;
             }
             return prev - 1;
           });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, startTime, timePressure, isThinking, isProbing]);

  // STT Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window))) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setUserAnswer(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognition.onerror = () => setSttActive(false);
      recognition.onend = () => {
        if (sttActive) recognition.start();
      };
      
      recognitionRef.current = recognition;
    }
  }, [sttActive]);

  const toggleStt = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (sttActive) {
      recognitionRef.current.stop();
      setSttActive(false);
    } else {
      recognitionRef.current.start();
      setSttActive(true);
    }
  };

  // --- Core Logic ---
  const startInterview = () => {
    let pool = BANK.filter(q => {
      const matchCat = category === 'all' || q.cat === category;
      const matchDiff = difficulty === 'all' || q.diff === difficulty;
      // UNVERSAL FILTERING: Company is now optional
      const matchCo = !company || q.company.toLowerCase().includes(company.toLowerCase());
      return matchCat && matchDiff && matchCo;
    });

    if (pool.length === 0) {
      addNotification("Global Pool Activated", "No specific company nodes found. Loading representative simulations.");
      pool = BANK.filter(q => (category === 'all' || q.cat === category) && (difficulty === 'all' || q.diff === difficulty));
    }
    
    // In Dossier mode, we show the entire filtered pool
    setQuestions(pool.sort((a,b) => a.cat.localeCompare(b.cat)));
    setView('dossier');
  };

  const launchSim = (selectedQ: Question) => {
    setQuestions([selectedQ]);
    setCurrentIndex(0);
    setScores([]);
    setHistory([]);
    setStartTime(Date.now());
    setTimer(0);
    setCountdown(limit);
    setIsLate(false);
    setIsProbing(false);
    setLastView('dossier');
    setView('room');
    
    const initialText = `Matrix Initialized. Node: ${selectedQ.cat}. Begin:`;
    const initialHistory: ChatMessage[] = [
      { role: 'interviewer', content: initialText, avatarChar: selectedQ.company ? selectedQ.company[0] : 'I' },
      { role: 'interviewer', content: selectedQ.q, avatarChar: selectedQ.company ? selectedQ.company[0] : 'I' }
    ];
    setHistory(initialHistory);
    speakText(initialText + " " + selectedQ.q, ttsEnabled);
  };

  const currentQuestion = questions[currentIndex];

  const handleNext = async () => {
    if (!userAnswer.trim()) return;
    
    setIsThinking(true);
    const currentQ = currentQuestion.q;
    const answer = userAnswer.trim();
    
    setHistory(prev => [...prev, { role: 'user', content: answer, avatarChar: state.profile.name[0] || 'Y' }]);
    setUserAnswer('');

    // Scoring & Analysis Protocol
    const scoringPrompt = `Score this interview answer. Be honest, specific, and concise.
QUESTION: ${currentQ}
ANSWER: ${answer}
Respond ONLY with this exact JSON:
{
  "score": <integer 1-10>,
  "verdict": "<one of: Excellent|Strong|Good|Needs Work|Weak>",
  "strengths": "<1-2 specific things done well, max 20 words>",
  "improvements": "<1-2 specific things to improve, max 20 words>",
  "tip": "<one concrete actionable tip, max 15 words>"
}`;

    let feedback: any;
    try {
      const raw = await groqChat(scoringPrompt, state.settings.groqKey);
      feedback = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch (e) {
      feedback = { score: 7, verdict: 'Good', strengths: 'Solid answer.', improvements: 'Could be more detailed.', tip: 'Use STAR method.' };
    }

    const newScore: InterviewScore = {
      q: currentQ,
      a: answer,
      score: feedback.score,
      feedback: feedback
    };
    
    const updatedScores = [...scores, newScore];
    setScores(updatedScores);
    setIsThinking(false);

    // Hard Mode Check: Adaptive Probing
    if (hardMode && !isProbing) {
      setIsProbing(true);
      setIsThinking(true);
      const probePrompt = `The user just answered: "${answer}" to the question: "${currentQ}".
      Provide a brief (max 30 words), challenging follow-up question to probe for deeper technical or behavioral depth.
      Directly output the follow-up question.`;
      
      try {
        const probeQ = await groqChat(probePrompt, state.settings.groqKey);
        setHistory(prev => [...prev, { role: 'interviewer', content: `🔍 Probing Depth: ${probeQ}`, avatarChar: '🔍' }]);
        speakText(probeQ, ttsEnabled);
      } catch (e) {
        setIsProbing(false);
      }
      setIsThinking(false);
      return; // Wait for user answer to probing question
    }

    setIsProbing(false);

    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setCountdown(limit);
      setIsLate(false);
      const transitionText = "Transmission received. Accessing next node...";
      const nextQ = questions[nextIdx].q;
      
      setHistory(prev => [
        ...prev,
        { role: 'interviewer', content: transitionText, avatarChar: company ? company[0] : 'I' },
        { role: 'interviewer', content: nextQ, avatarChar: company ? company[0] : 'I' }
      ]);
      speakText(transitionText + " " + nextQ, ttsEnabled);
    } else {
      setView('results');
      addNotification("Matrix Complete", "Session analysis finalized. Reviewing performance metrics.");
    }
  };

  const getHint = async () => {
    setIsThinking(true);
    const hintPrompt = `Give a brief framework hint (2-3 sentences max) for answering this question without giving away the answer: "${currentQuestion.q}"`;
    
    try {
      const hint = await groqChat(hintPrompt, state.settings.groqKey);
      setHistory(prev => [...prev, { role: 'interviewer', content: `💡 Hint: ${hint}`, avatarChar: '💡' }]);
      speakText(`Hint: ${hint}`, ttsEnabled);
    } catch (e) {
      addNotification("Error", "Could not fetch hint.");
    }
    setIsThinking(false);
  };

  const renderSetup = () => (
    <div className="max-w-4xl mx-auto space-y-10 py-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-[var(--text)] to-[var(--text2)] bg-clip-text text-transparent uppercase tracking-tight italic p-4 leading-normal">
          Interview <span className="text-[var(--accent)] not-italic">Authority</span>
        </h1>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em] italic opacity-60">
           Institutional Preparation Hub · {BANK.length}+ Simulation Nodes Active
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 border-[var(--border)] bg-[var(--card)] rounded-3xl shadow-2xl relative overflow-hidden">
           <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Complexity Layer</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Easy', 'Medium', 'Hard', 'all'].map(d => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d as any)}
                          className={`py-3 rounded-xl border-2 transition-all text-xs font-black uppercase tracking-widest ${
                            difficulty === d 
                              ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-xl shadow-[var(--accent-glow)]' 
                              : 'bg-transparent border-[var(--border)] text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          {d === 'all' ? 'Mixed Node' : d}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Suite Size � per session</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[5, 10, 15, 20].map(n => (
                        <button
                          key={n}
                          onClick={() => setQCount(n)}
                          className={`py-3 rounded-xl border-2 transition-all font-black text-sm italic ${
                            qCount === n 
                              ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-xl shadow-[var(--accent-glow)]' 
                              : 'bg-transparent border-[var(--border)] text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="md:col-span-2 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Protocol Category</p>
                    <div className="flex flex-wrap gap-2">
                       {CAT_ORDER.map(cat => (
                         <button
                           key={cat}
                           onClick={() => setCategory(cat === 'All' ? 'all' : cat)}
                           className={`px-5 py-2.5 rounded-full border-2 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest italic ${
                             (cat === 'All' ? 'all' : cat) === category 
                               ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' 
                               : 'bg-transparent border-[var(--border)] text-slate-400 hover:border-slate-300'
                           }`}
                         >
                           <span className="opacity-70">{CAT_ICO[cat]}</span> {cat}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Institutional Recognition (50+ Companies)</p>
                    {company && <button onClick={() => setCompany('')} className="text-[9px] font-black uppercase text-red-500 underline underline-offset-4">Clear Selection</button>}
                 </div>
                 <Input 
                   placeholder="Search Company Nodes (Google, Goldman, Blind 75...)" 
                   value={company}
                   onChange={(e) => setCompany(e.target.value)}
                   className="h-14 bg-[var(--bg2)]/50 border-[var(--border)] pl-6 text-sm font-black italic rounded-2xl"
                 />
                 <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                    {COMPANIES.filter(co => co.toLowerCase().includes(company.toLowerCase())).map(co => (
                      <button
                        key={co}
                        onClick={() => setCompany(co)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border-2 transition-all ${
                          company === co 
                            ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg' 
                            : 'bg-[var(--bg2)]/30 border-[var(--border)] text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {co}
                      </button>
                    ))}
                    {COMPANIES.filter(co => co.toLowerCase().includes(company.toLowerCase())).length === 0 && (
                      <p className="text-[10px] font-bold text-slate-500 uppercase italic p-2">No corporate nodes found matching criteria.</p>
                    )}
                 </div>
              </div>
           </div>
        </Card>

        <Card className="p-8 border-[var(--border)] bg-[var(--card)] rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden relative">
           <div className="space-y-6 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Advanced Protocols</p>
              
              <div className="space-y-4">
                 <button 
                  onClick={() => setHardMode(!hardMode)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all flex flex-col gap-2 text-left group ${
                    hardMode ? 'bg-red-500/10 border-red-500 text-red-600' : 'bg-transparent border-[var(--border)] text-slate-400'
                  }`}
                 >
                    <div className="flex items-center justify-between w-full">
                       <span className="text-xs font-black uppercase tracking-widest italic">Hard Mode</span>
                       <Zap size={18} className={hardMode ? 'fill-current' : ''} />
                    </div>
                    <p className="text-[10px] font-bold opacity-60 uppercase italic">Enables AI Adaptive Probing. Interrogator will follow up on your responses.</p>
                 </button>

                 <button 
                  onClick={() => setTimePressure(!timePressure)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all flex flex-col gap-2 text-left group ${
                    timePressure ? 'bg-amber-500/10 border-amber-500 text-amber-600' : 'bg-transparent border-[var(--border)] text-slate-400'
                  }`}
                 >
                    <div className="flex items-center justify-between w-full">
                       <span className="text-xs font-black uppercase tracking-widest italic">Time Pressure</span>
                       <Timer size={18} />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                       {[30, 60, 90].map(s => (
                         <div 
                           key={s} 
                           onClick={(e) => { e.stopPropagation(); setLimit(s); setTimePressure(true); }}
                           className={`px-3 py-1 rounded-lg text-[9px] font-black border ${limit === s && timePressure ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-300'}`}
                         >
                            {s}s
                         </div>
                       ))}
                    </div>
                 </button>
              </div>
           </div>

           <Button 
            onClick={startInterview}
            className="w-full h-20 mt-8 py-6 text-xl font-black italic bg-[var(--accent)] hover:opacity-90 text-white rounded-2xl shadow-xl uppercase tracking-tighter"
          >
            Execute Matrix
          </Button>
        </Card>
      </div>
    </div>
  );

  const renderRoom = () => (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)] animate-in fade-in duration-500">
      <div className="flex items-center justify-between p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl mb-4 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
             <div className="flex items-center gap-2 text-slate-400">
               <Timer className={`w-4 h-4 ${timePressure ? (isLate ? 'text-red-500' : 'text-amber-500') : 'text-cyan-400'}`} />
               <span className={`font-black text-lg italic ${isLate ? 'text-red-500 animate-pulse' : 'text-[var(--text)]'}`}>
                 {timePressure ? `${countdown}s` : `${Math.floor(timer/60)}:${String(timer%60).padStart(2,'0')}`}
               </span>
             </div>
             {isLate && <span className="text-[8px] font-black uppercase text-red-500 tracking-tighter italic">! Node Deadline Exceeded</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i < currentIndex ? 'bg-emerald-500' : 
                    i === currentIndex ? 'bg-[var(--accent)] ring-4 ring-[var(--accent)]/20' : 
                    'bg-slate-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-500 font-black uppercase ml-2 tracking-widest italic">{currentIndex+1} / {questions.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={ttsEnabled ? 'text-emerald-400' : 'text-slate-500'}
          >
            {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
             if(confirm("Exit interview? Your progress will be lost.")) setView(lastView);
          }} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300">
            <RotateCcw className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-widest">Back</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2 scroll-smooth">
        {history.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                msg.role === 'interviewer' ? 'bg-gradient-to-br from-emerald-500 to-cyan-500' : 'bg-slate-700'
              }`}>
                {msg.avatarChar}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'interviewer' 
                  ? 'bg-slate-800/80 text-slate-200 rounded-tl-none' 
                  : 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-50 rounded-tr-none'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 shrink-0">AI</div>
              <div className="p-4 rounded-2xl bg-slate-800/80 text-slate-500 rounded-tl-none italic">Evaluating response...</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl">
        <textarea
          className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 resize-none min-h-[100px] outline-none"
          placeholder="Speak or type your answer here..."
          value={userAnswer}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserAnswer(e.target.value)}
          disabled={isThinking}
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleStt}
              className={`rounded-full px-4 h-10 border-slate-700 transition-all ${
                sttActive ? 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'text-slate-400'
              }`}
            >
              <Mic className={`w-4 h-4 mr-2 ${sttActive ? 'animate-pulse' : ''}`} />
              {sttActive ? 'Recording...' : 'Voice Answer'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={getHint}
              disabled={isThinking}
              className="rounded-full px-4 h-10 border-slate-700 text-slate-400"
            >
              <Lightbulb className="w-4 h-4 mr-2 text-amber-400" /> Hint
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if(currentIndex < questions.length - 1) {
                   setCurrentIndex(prev => prev + 1);
                   setHistory(prev => [...prev, { role: 'interviewer', content: questions[currentIndex+1].q, avatarChar: 'I' }]);
                } else {
                   setView('results');
                }
              }}
              className="rounded-full px-4 h-10 border-slate-700 text-slate-400"
            >
              <SkipForward className="w-4 h-4 mr-2" /> Skip
            </Button>
          </div>
          <Button 
            onClick={handleNext}
            disabled={!userAnswer.trim() || isThinking}
            className="rounded-full px-8 h-10 bg-emerald-500 hover:bg-emerald-600 font-bold"
          >
            Submit <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    const avgScore = scores.length ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length * 10) / 10 : 0;
    const grade = avgScore >= 8.5 ? 'A+' : avgScore >= 7.5 ? 'A' : avgScore >= 6 ? 'B' : 'C';
    
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in zoom-in-95 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-8 border-emerald-500/20 bg-slate-900/50 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center text-4xl font-black text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              {grade}
            </div>
            <h3 className="mt-4 font-bold text-lg text-emerald-500">Your Grade</h3>
            <p className="text-slate-400 text-sm text-center mt-1">Excellent performance!</p>
          </Card>

          <Card className="p-8 border-slate-800 bg-slate-900/50 md:col-span-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" /> Performance Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/50">
                <div className="text-2xl font-bold text-cyan-400">{avgScore}/10</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Avg Score</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/50">
                <div className="text-2xl font-bold text-emerald-400">{scores.length}/{questions.length}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Answered</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/50">
                <div className="text-2xl font-bold text-purple-400">{Math.floor(timer/60)}m {timer%60}s</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Duration</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/50">
                <div className="text-2xl font-bold text-amber-400">Behavioral</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Top Strength</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-black px-1 text-[var(--text)] uppercase italic tracking-tighter">Institutional Transcript & Feedback Architecture</h2>
          {scores.map((s, i) => (
            <Card key={i} className="p-8 border-[var(--border)] bg-[var(--card)] rounded-3xl shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-[var(--accent)] uppercase italic tracking-[0.2em]">Simulation Node {i+1}</div>
                  <h3 className="text-lg font-black text-[var(--text)] tracking-tight">{s.q}</h3>
                </div>
                <Badge className={`text-xl font-black py-2 px-5 rounded-2xl ${s.score >= 8 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : s.score >= 6 ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30' : 'bg-red-500/10 text-red-600 border-red-500/30'}`}>
                   {s.score}.0
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase italic">Your Transmission</p>
                       <div className="p-5 rounded-2xl bg-[var(--bg2)]/50 border border-[var(--border)] text-sm text-[var(--text)] font-medium leading-relaxed italic">
                         "{s.a}"
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase italic">
                          <CheckCircle size={14} /> Strengths
                        </div>
                        <p className="text-xs text-slate-600 font-bold">{s.feedback.strengths}</p>
                      </div>
                      <div className="space-y-2 p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <div className="flex items-center gap-2 text-[10px] font-black text-red-600 uppercase italic">
                          <RotateCcw size={14} /> Improvements
                        </div>
                        <p className="text-xs text-slate-600 font-bold">{s.feedback.improvements}</p>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-[var(--accent)] uppercase italic">Reference Architecture (Ideal Node)</p>
                    <div className="p-6 rounded-2xl bg-[var(--accent)]/5 border-2 border-[var(--accent)]/10 text-sm text-slate-700 font-bold leading-relaxed relative group overflow-hidden">
                       <Lightbulb size={120} className="absolute -bottom-8 -right-8 text-[var(--accent)] opacity-5 rotate-12 group-hover:rotate-0 transition-transform" />
                       <div className="relative z-10">
                          {questions[i]?.refAnswer || "Reference data not available for this node simulation."}
                       </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-[var(--accent)] uppercase italic">
                       <Zap size={14} /> Pro Tip: <span className="text-slate-500 lowercase not-italic italic-none">{s.feedback.tip}</span>
                    </div>
                 </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-4">
          <Button 
            className="flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold"
            onClick={() => setView('setup')}
          >
            <RotateCcw className="w-5 h-5 mr-2" /> Start New Session
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 h-14 rounded-2xl border-slate-700 font-bold text-slate-300 hover:bg-slate-800"
          >
            <Download className="w-5 h-5 mr-2" /> Save Transcript
          </Button>
        </div>
      </div>
    );
  };

  const renderDossier = () => {
    const allCats = ['all', ...CAT_ORDER.filter(c => c !== 'All')];
    
    const filtered = questions.filter(q => {
      const matchSearch = !dossierSearch || q.q.toLowerCase().includes(dossierSearch.toLowerCase()) || (q.company || '').toLowerCase().includes(dossierSearch.toLowerCase());
      const matchTab = dossierTab === 'all' || q.cat === dossierTab;
      return matchSearch && matchTab;
    });

    // Group by category for 'all' tab
    const displayList = dossierTab === 'all'
      ? [...filtered].sort((a, b) => a.cat.localeCompare(b.cat))
      : filtered;

    const runFullSuite = () => {
      if (filtered.length === 0) return;
      const selected = filtered.sort(() => 0.5 - Math.random()).slice(0, Math.min(10, filtered.length));
      setQuestions(selected);
      setCurrentIndex(0);
      setScores([]);
      setHistory([]);
      setStartTime(Date.now());
      setTimer(0);
      setCountdown(limit);
      setIsLate(false);
      setIsProbing(false);
      setView('room');
      const firstQ = selected[0].q;
      const initialHistory: ChatMessage[] = [
        { role: 'interviewer', content: `Suite initialized. ${selected.length} nodes loaded. Begin protocol:`, avatarChar: 'I' },
        { role: 'interviewer', content: firstQ, avatarChar: 'I' }
      ];
      setHistory(initialHistory);
      speakText(initialHistory[0].content + ' ' + firstQ, ttsEnabled);
    };

    return (
      <div className="max-w-6xl mx-auto space-y-8 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
            <div className="space-y-1">
               <h2 className="text-3xl font-black italic uppercase tracking-tight text-[var(--text)]">Interview <span className="text-[var(--accent)]">Library</span></h2>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">{filtered.length} nodes · Source: {company || 'Global Aggregate'}</p>
            </div>
            <div className="flex gap-3">
               <Button
                 onClick={runFullSuite}
                 disabled={filtered.length === 0}
                 className="h-11 px-6 rounded-2xl bg-[var(--accent)] hover:opacity-90 text-white text-xs font-black uppercase tracking-widest"
               >
                 <Play size={14} className="mr-2" /> Run Suite ({Math.min(10, filtered.length)} nodes)
               </Button>
               <Button variant="outline" onClick={() => setView('setup')} className="h-11 px-5 rounded-2xl border-slate-700 text-xs font-black uppercase tracking-widest">
                  Reset
               </Button>
            </div>
         </div>

         {/* Search */}
         <div className="relative">
            <input
              type="text"
              placeholder="Search questions or companies..."
              value={dossierSearch}
              onChange={e => setDossierSearch(e.target.value)}
              className="w-full h-12 bg-slate-900/50 border border-[var(--border)] rounded-2xl pl-5 pr-12 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/10 font-bold transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] font-black uppercase tracking-widest">{filtered.length}</div>
         </div>

         {/* Category Tabs */}
         <div className="flex items-center gap-2 flex-wrap">
            {allCats.map(cat => {
              const count = cat === 'all'
                ? questions.filter(q => !dossierSearch || q.q.toLowerCase().includes(dossierSearch.toLowerCase())).length
                : questions.filter(q => q.cat === cat && (!dossierSearch || q.q.toLowerCase().includes(dossierSearch.toLowerCase()))).length;
              return (
                <button
                  key={cat}
                  onClick={() => setDossierTab(cat)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center gap-2 ${
                    dossierTab === cat
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg'
                      : 'border-[var(--border)] text-slate-500 hover:border-slate-500'
                  }`}
                >
                  {cat === 'all' ? '🌐 All' : `${CAT_ICO[cat] || ''} ${cat}`}
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black ${
                    dossierTab === cat ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>{count}</span>
                </button>
              );
            })}
         </div>

         {/* Question Grid */}
         {displayList.length === 0 ? (
           <div className="text-center py-20 opacity-40">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No nodes match the current filter.</p>
              <button onClick={() => { setDossierSearch(''); setDossierTab('all'); }} className="mt-4 text-[var(--accent)] text-xs font-black uppercase tracking-widest underline">
                Clear Filters
              </button>
           </div>
         ) : (
           <div className="space-y-3">
              {displayList.map((q, i) => (
                <div key={i}>
                  {/* Compact Row */}
                  <div
                    onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                    className={`group flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${
                      expandedIdx === i
                        ? 'border-[var(--accent)]/40 bg-[var(--accent)]/5'
                        : 'border-[var(--border)] bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-600'
                    }`}
                  >
                     <div className="flex-none mt-0.5">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                          q.cat === 'DSA' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' :
                          q.cat === 'System Design' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                          q.cat === 'Behavioral' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          q.cat === 'Technical' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {CAT_ICO[q.cat]} {q.cat}
                        </span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold leading-snug transition-colors ${
                          expandedIdx === i ? 'text-[var(--accent)]' : 'text-slate-200 group-hover:text-[var(--accent)]'
                        }`}>{q.q}</p>
                        {q.company && <p className="text-[9px] text-slate-600 mt-1 uppercase tracking-widest">{q.company}</p>}
                     </div>
                     <div className="flex-none flex items-center gap-3">
                        <span className={`text-[9px] font-black uppercase ${
                          q.diff === 'Hard' ? 'text-red-500' : q.diff === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                        }`}>{q.diff}</span>
                        <span className={`text-slate-500 transition-transform ${expandedIdx === i ? 'rotate-90' : ''}`}>›</span>
                     </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {expandedIdx === i && (
                    <div className="mt-1 mb-2 p-6 border border-[var(--accent)]/20 bg-[var(--accent)]/3 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 space-y-5">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <p className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest">📖 Reference Architecture</p>
                             <p className="text-sm text-slate-300 leading-relaxed font-medium">{q.refAnswer}</p>
                          </div>
                          <div className="space-y-2">
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">✍️ Practice Your Answer</p>
                             <textarea
                               className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-[var(--accent)]/50 resize-none min-h-[120px] font-medium"
                               placeholder="Type your answer here for self-review..."
                             />
                             <Button
                               onClick={() => launchSim(q)}
                               className="w-full h-10 bg-[var(--accent)] hover:opacity-90 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                             >
                               🚀 Launch AI Simulation for this Node
                             </Button>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              ))}
           </div>
         )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      {view === 'setup' && renderSetup()}
      {view === 'dossier' && renderDossier()}
      {view === 'room' && renderRoom()}
      {view === 'results' && renderResults()}
    </div>
  );
}
