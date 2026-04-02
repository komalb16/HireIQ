"use client";

import React, { useState, useCallback } from "react";
import { Upload, FileText, Trash2, History, BrainCircuit, Download, Sparkles, AlertCircle, Layout } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAppContext } from "@/context/AppContext";
import { Resume } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

import { TailorResumeModal } from "@/components/TailorResumeModal";

export default function ResumePage() {
  const { state, setResumes, addNotification } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [tailorModalOpen, setTailorModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  const activeResume = state.resumes.find(r => r.isActive);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const text = await file.text(); 
      const newResume: Resume = {
        id: Date.now().toString(),
        name: file.name,
        content: text,
        lastModified: new Date().toISOString(),
        isActive: state.resumes.length === 0,
      };
      setResumes([...state.resumes, newResume]);
      addNotification("Upload Success", `${file.name} added to your library.`);
    } catch (e) {
      addNotification("Upload Failed", "Could not read file content.");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteResume = (id: string) => {
    setResumes(state.resumes.filter((r) => r.id !== id));
    addNotification("Deleted", "Resume removed.");
  };

  const setActive = (id: string) => {
    setResumes(
      state.resumes.map((r) => ({
        ...r,
        isActive: r.id === id,
      }))
    );
    addNotification("Preference Updated", "Active resume changed.");
  };

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="space-y-3 text-center md:text-left">
        <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3 justify-center md:justify-start tracking-tighter">
           <FileText className="w-10 h-10 text-emerald-400" /> Resume Repository
        </h1>
        <p className="text-slate-400 font-medium ml-1">Manage multiple versions and set an active profile for AI features.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Upload Zone */}
        <div className="lg:col-span-1 space-y-6">
          <label
            className={`
              relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-[2.5rem] transition-all cursor-pointer group
              ${dragActive ? "border-emerald-500 bg-emerald-500/5 shadow-2xl shadow-emerald-500/10" : "border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/50"}
            `}
            onDragEnter={onDrag}
            onDragLeave={onDrag}
            onDragOver={onDrag}
            onDrop={onDrop}
          >
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            />
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="w-24 h-24 rounded-3xl bg-[var(--surface2)] text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl border border-slate-700/50">
                <Upload size={40} />
              </div>
              <div className="space-y-2">
                <p className="text-base font-bold text-slate-100">Drop your resume here</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Supports PDF, DOCX, TXT</p>
              </div>
              <Button size="sm" variant="outline" className="pointer-events-none rounded-xl border-slate-700 text-slate-400 h-10 px-6">
                Browse Files
              </Button>
            </div>
          </label>

          <Card className="p-6 bg-emerald-500/5 border-emerald-500/10 flex gap-4 backdrop-blur-md">
             <div className="p-4 bg-emerald-500/10 rounded-2xl h-fit">
                <BrainCircuit className="w-8 h-8 text-emerald-400" />
             </div>
             <div>
                <h4 className="font-bold text-emerald-400 text-sm">AI Active Profile</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                  Your <strong>Active</strong> resume is used to calculate match scores and generate tailored cover letters.
                </p>
             </div>
          </Card>
        </div>

        {/* Resumes List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 flex items-center gap-3">
              <History size={18} className="text-cyan-400" /> Version Control
            </h2>
            <Badge variant="outline" className="text-[10px] font-black border-slate-800 px-3 py-1 bg-slate-900">{state.resumes.length} saved</Badge>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {state.resumes.length === 0 ? (
                 <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-center py-32 border-2 border-dashed border-slate-800/50 rounded-[3rem] opacity-30"
                >
                  <FileText className="mx-auto mb-6" size={64} />
                  <p className="text-sm font-black uppercase tracking-[0.3em]">No resumes found</p>
                </motion.div>
              ) : (
                state.resumes.map((resume, idx) => (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className={`p-8 group transition-all rounded-[2.5rem] overflow-hidden ${resume.isActive ? 'ring-2 ring-emerald-500 border-transparent bg-slate-900/80 shadow-2xl' : 'border-slate-800 hover:border-slate-700 bg-slate-900/30'}`}>
                      <div className="flex items-center gap-6">
                        <div className={`h-16 w-16 rounded-[1.25rem] flex items-center justify-center font-black text-3xl uppercase border shadow-2xl ${resume.isActive ? 'bg-emerald-500 text-white border-none' : 'bg-slate-800 text-slate-600 border-slate-700 group-hover:text-slate-400 transition-colors'}`}>
                          {resume.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-4">
                            <h3 className="font-bold text-xl text-slate-100 truncate">{resume.name}</h3>
                            {resume.isActive && (
                              <Badge variant="success" className="px-3 border-none bg-emerald-500 text-white font-black text-[10px]">Active</Badge>
                            )}
                          </div>
                          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-2 opacity-60">
                            Modified {new Date(resume.lastModified).toLocaleDateString()} · {resume.content.split(/\s+/).length} words
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {!resume.isActive && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-[10px] font-black uppercase h-10 px-5 rounded-2xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20"
                              onClick={() => setActive(resume.id)}
                            >
                              Set Active
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 h-10 w-10 p-0 rounded-2xl"
                            onClick={() => deleteResume(resume.id)}
                          >
                            <Trash2 size={20} />
                          </Button>
                        </div>
                      </div>
                      
                      {resume.isActive && (
                        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row gap-4">
                          <Button variant="outline" size="sm" className="flex-1 h-14 text-sm font-bold rounded-2xl border-slate-800 hover:bg-slate-800 text-slate-300">
                            <Download size={18} className="mr-2" /> Export PDF
                          </Button>
                          <Button 
                            onClick={() => setTailorModalOpen(true)}
                            className="flex-1 h-14 text-sm font-bold rounded-2xl bg-emerald-500 hover:opacity-90 shadow-xl shadow-emerald-500/10 border-none"
                          >
                            <Sparkles size={18} className="mr-2" /> Enhanced AI Tailor
                          </Button>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {activeResume && (
        <TailorResumeModal 
          isOpen={tailorModalOpen}
          onClose={() => setTailorModalOpen(false)}
          resumeContent={activeResume.content}
          resumeName={activeResume.name}
        />
      )}
    </div>
  );
}
