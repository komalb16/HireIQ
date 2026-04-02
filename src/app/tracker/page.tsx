"use client";

import React, { useState } from "react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragOverlay,
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { Plus, Calendar, Mail, Trash2, Layout, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAppContext } from "@/context/AppContext";
import { AppStatus } from "@/types";
import { EmailComposer } from "@/components/EmailComposer";

const COLUMNS = [
  { id: "Wishlist", label: "Wishlist", color: "bg-slate-500" },
  { id: "Applied", label: "Applied", color: "bg-blue-500" },
  { id: "Interviewing", label: "Interviewing", color: "bg-amber-500" },
  { id: "Offer Received", label: "Offer Received", color: "bg-emerald-500" },
  { id: "Rejected", label: "Rejected", color: "bg-red-500" },
];

export default function TrackerPage() {
  const { state, setApps, addNotification } = useAppContext();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [composingApp, setComposingApp] = useState<AppStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeApp = state.apps.find(a => a.id === active.id);
    if (!activeApp) return;

    const overId = over.id.toString();
    const isColumn = COLUMNS.some(col => col.id === overId);

    if (isColumn && activeApp.status !== overId) {
      setApps(state.apps.map(a => a.id === active.id ? { ...a, status: overId as any } : a));
      addNotification("Status Updated", `Moved ${activeApp.title} to ${overId}`);
    }

    setActiveId(null);
  };

  const deleteApp = (id: string) => {
    setApps(state.apps.filter(a => a.id !== id));
    addNotification("Deleted", "Application removed from tracker.");
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <Layout className="w-8 h-8 text-emerald-400" /> Pipeline Tracker
          </h1>
          <p className="text-slate-400 mt-1">Organize your interview stages with a professional Kanban board.</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 font-bold h-11 px-6 shadow-lg shadow-emerald-500/10">
          <Plus className="w-5 h-5 mr-2" /> New Application
        </Button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex flex-col h-full bg-slate-900/40 rounded-[2rem] border border-slate-800/50 backdrop-blur-xl overflow-hidden group/col">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${col.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">{col.label}</h3>
                </div>
                <Badge variant="outline" className="text-[10px] bg-slate-800/50 border-slate-700 text-slate-500">
                  {state.apps.filter(a => a.status === col.id).length}
                </Badge>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                {state.apps.filter(a => a.status === col.id).map((app) => (
                  <TrackerCard 
                    key={app.id} 
                    app={app} 
                    onDelete={() => deleteApp(app.id)} 
                    onCompose={() => setComposingApp(app)}
                  />
                ))}
                {state.apps.filter(a => a.status === col.id).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-800/50 rounded-2xl flex items-center justify-center opacity-20 text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover/col:opacity-40 transition-opacity">
                    Drop Here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DndContext>

      {composingApp && (
        <EmailComposer 
          app={composingApp} 
          onClose={() => setComposingApp(null)} 
        />
      )}
    </div>
  );
}

interface TrackerCardProps {
  app: AppStatus;
  onDelete: () => void;
  onCompose: () => void;
}

function TrackerCard({ app, onDelete, onCompose }: TrackerCardProps) {
  return (
    <Card className="p-5 bg-slate-800/40 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:translate-y-[-2px] transition-all cursor-grab active:cursor-grabbing group">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <h4 className="font-bold text-sm leading-tight text-slate-200 group-hover:text-emerald-400 transition-colors">{app.title}</h4>
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                <div className="w-4 h-4 rounded bg-slate-700 flex items-center justify-center text-slate-400 text-[8px]">
                  {app.company[0]}
                </div>
                {app.company}
             </div>
          </div>
          <div className="flex flex-col gap-1">
            <button className="p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              <Trash2 size={14} />
            </button>
            <button className="p-1.5 text-slate-600 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all" onClick={(e) => { e.stopPropagation(); onCompose(); }}>
              <Mail size={14} />
            </button>
          </div>
        </div>
        
        <div className="pt-3 border-t border-slate-800/50 flex items-center justify-between text-[10px] font-bold text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-emerald-500" /> 
            {new Date(app.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
          <Badge variant={app.priority === 'high' ? 'error' : app.priority === 'medium' ? 'warning' : 'info'} className="text-[8px] py-0 px-1.5 h-4">
            {app.priority || 'Normal'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
