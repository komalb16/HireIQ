import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Plus, Trash2, Save } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useAppContext } from '@/context/AppContext';
import { RubricDimension } from '@/types';

export function RubricConfigModal({ onClose }: { onClose: () => void }) {
  const { state, setSettings, addNotification } = useAppContext();
  const [rubric, setRubric] = useState<RubricDimension[]>(state.settings.rubric || []);

  const addDimension = () => {
    setRubric([...rubric, { id: Math.random().toString(), name: '', weight: 3 }]);
  };

  const updateDimension = (id: string, field: keyof RubricDimension, value: any) => {
    setRubric(rubric.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeDimension = (id: string) => {
    setRubric(rubric.filter(r => r.id !== id));
  };

  const saveRubric = () => {
    setSettings({ ...state.settings, rubric });
    addNotification('Saved', 'Rubric Configuration updated successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/30">
              <SettingsIcon className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-100 tracking-tight">Rubric Configuration</h2>
              <p className="text-xs text-slate-400 font-bold">Define your job priorities for AI Fit Analysis.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {rubric.map((dim, idx) => (
              <div key={dim.id} className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <div className="text-slate-500 font-black text-xs w-6">{idx + 1}.</div>
                <input
                  type="text"
                  value={dim.name}
                  onChange={(e) => updateDimension(dim.id, 'name', e.target.value)}
                  placeholder="e.g., Base Salary > 150k"
                  className="flex-1 bg-transparent border-b border-slate-800 text-sm font-bold text-slate-200 focus:border-[var(--accent)] outline-none py-2 transition-colors"
                />
                <div className="flex flex-col gap-1 w-24">
                  <span className="text-[10px] font-black uppercase text-slate-500">Weight ({dim.weight}x)</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={dim.weight}
                    onChange={(e) => updateDimension(dim.id, 'weight', parseInt(e.target.value))}
                    className="accent-[var(--accent)]"
                  />
                </div>
                <button onClick={() => removeDimension(dim.id)} className="p-2 text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <Button onClick={addDimension} variant="outline" className="w-full border-dashed border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 rounded-2xl h-12 font-bold">
              <Plus className="w-4 h-4 mr-2" /> Add Dimension
            </Button>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 rounded-b-xl">
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-slate-300 font-bold">
            Cancel
          </Button>
          <Button onClick={saveRubric} className="bg-[var(--accent)] hover:opacity-90 text-white font-bold rounded-xl px-6">
            <Save className="w-4 h-4 mr-2" /> Save Protocol
          </Button>
        </div>
      </Card>
    </div>
  );
}
