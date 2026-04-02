"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppContext } from '@/context/AppContext';
import { 
  User, 
  Key, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Trash2, 
  Save, 
  ShieldCheck, 
  ExternalLink
} from 'lucide-react';
import { UserProfile, Settings } from '@/types';

export default function SettingsPage() {
  const { state, setProfile, setSettings, addNotification } = useAppContext();
  
  const [profileForm, setProfileForm] = useState<UserProfile>({
    name: state.profile.name,
    email: state.profile.email,
    linkedin: state.profile.linkedin || ''
  });

  const [keysForm, setKeysForm] = useState<Settings>({
    theme: state.settings.theme,
    groqKey: state.settings.groqKey,
    rapidKey: state.settings.rapidKey,
    phKey: state.settings.phKey || ''
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(profileForm);
    addNotification("Profile Updated", "Your information has been saved locally.");
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(keysForm);
    addNotification("Keys Updated", "API keys have been updated and encrypted in local storage.");
  };

  const toggleTheme = () => {
    const newTheme = state.settings.theme === 'dark' ? 'light' : 'dark';
    setSettings({ ...state.settings, theme: newTheme });
    document.documentElement.classList.toggle('light');
  };

  const handleReset = () => {
    if (confirm("CRITICAL: This will delete ALL your saved data. This cannot be undone. Are you absolutely sure?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-emerald-400" /> Account Settings
        </h1>
        <p className="text-slate-400 mt-1">Manage your identity, API integrations, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
            <User className="w-5 h-5 text-emerald-400" /> Personal Identity
          </h2>
          <Card className="p-8 border-slate-800 bg-slate-900/50 backdrop-blur-xl">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Full Name</label>
                  <Input 
                    value={profileForm.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, name: e.target.value})}
                    placeholder="Enter your name" 
                    className="bg-slate-800/50 border-slate-700 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Email Address</label>
                  <Input 
                    value={profileForm.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, email: e.target.value})}
                    placeholder="you@example.com" 
                    className="bg-slate-800/50 border-slate-700 h-11"
                  />
                </div>
              </div>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 px-8 h-11 font-bold">
                <Save className="w-4 h-4 mr-2" /> Save Profile
              </Button>
            </form>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
            <Key className="w-5 h-5 text-cyan-400" /> API Integrations
          </h2>
          <Card className="p-8 border-slate-800 bg-slate-900/50 backdrop-blur-xl">
            <form onSubmit={handleSaveKeys} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-400">Groq API Key</label>
                    <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                      Get free key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <Input 
                    type="password"
                    value={keysForm.groqKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeysForm({...keysForm, groqKey: e.target.value})}
                    placeholder="gsk_..." 
                    className="bg-slate-800/50 border-slate-700 h-11 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-400">RapidAPI Key</label>
                    <a href="https://rapidapi.com" target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                      Get key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <Input 
                    type="password"
                    value={keysForm.rapidKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeysForm({...keysForm, rapidKey: e.target.value})}
                    placeholder="rapid_..." 
                    className="bg-slate-800/50 border-slate-700 h-11 font-mono"
                  />
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <ShieldCheck className="w-4 h-4" /> 
                  <span className="font-medium">Stored Locally and Encrypted</span>
                </div>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 px-8 h-11 font-bold">
                  Update Keys
                </Button>
              </div>
            </form>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
             <Sun className="w-5 h-5 text-amber-400" /> App Preferences
          </h2>
          <Card className="p-8 border-slate-800 bg-slate-900/50 backdrop-blur-xl">
             <div className="space-y-8">
               <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50">
                  <div>
                    <h3 className="font-bold text-slate-200">Color Theme</h3>
                    <p className="text-sm text-slate-400">Switch between dark and light modes.</p>
                  </div>
                  <Button variant="outline" onClick={toggleTheme} className="h-12 w-12 rounded-full border-slate-700">
                    {state.settings.theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                  </Button>
               </div>

               <div className="flex items-center justify-between p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                  <div>
                    <h3 className="font-bold text-red-400">Danger Zone</h3>
                    <p className="text-sm text-slate-400">Permanently delete all data.</p>
                  </div>
                  <Button variant="ghost" onClick={handleReset} className="text-red-500 hover:bg-red-500/10 h-12 px-6 rounded-xl font-bold">
                    <Trash2 className="w-5 h-5 mr-2" /> Reset Data
                  </Button>
               </div>
             </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
