"use client";

import React, { createContext, useContext, ReactNode, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserProfile, Settings, AppStatus, JobAlert, Resume, Notification, AppContextType, AppContextState, Theme } from "@/types";

const AppContext = createContext<AppContextType | undefined>(undefined);

import { MOCK_RESUMES, MOCK_APPS } from "@/lib/mockData";

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<UserProfile>("hiq_profile", {
    name: "", // Empty name triggers strict entry choice
    email: "",
    linkedin: "",
  });

  const [settings, setSettings] = useLocalStorage<Settings>("hiq_settings", {
    theme: "dark",
    groqKey: "",
    rapidKey: "",
  });

  const [apps, setApps] = useLocalStorage<AppStatus[]>("hiq_apps", []);
  const [alerts, setAlerts] = useLocalStorage<JobAlert[]>("hiq_alerts", []);
  const [resumes, setResumes] = useLocalStorage<Resume[]>("hiq_resumes", []);
  const [notifs, setNotifs] = useLocalStorage<Notification[]>("hiq_notifs", []);

  const addNotification = useCallback((title: string, msg: string) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      msg: `${title}: ${msg}`,
      date: new Date().toLocaleDateString(),
      ts: Date.now(),
      unread: true,
    };
    setNotifs((prev: Notification[]) => [newNotif, ...prev].slice(0, 50));
  }, [setNotifs]);

  const toggleTheme = useCallback(() => {
    setSettings((prev: Settings) => {
      const themes: Theme[] = ["light", "lavender", "violet", "blue", "red", "pink", "black"];
      const currentIndex = themes.indexOf(prev.theme as Theme);
      const nextTheme = themes[(currentIndex + 1) % themes.length];

      document.documentElement.setAttribute("data-theme", nextTheme);
      
      return { ...prev, theme: nextTheme };
    });
  }, [setSettings]);

  const seedDemoData = useCallback(() => {
    setProfile({ name: "Demo User", email: "demo@hireiq.ai", linkedin: "linkedin.com/in/demouser" });
    setSettings((prev: Settings) => ({
      ...prev,
      groqKey: "gsk_demo_access_node_777",
      rapidKey: "rapid_demo_market_node_888_institutional_access"
    }));
    setResumes(MOCK_RESUMES);
    setApps(MOCK_APPS);
    addNotification("Demo Mode Activated", "Sample data & Node keys loaded. Experience HireIQ Hub!");
  }, [setProfile, setSettings, setResumes, setApps, addNotification]);

  const logout = useCallback(() => {
    setProfile({ name: "", email: "", linkedin: "" });
    setResumes([]);
    setApps([]);
    setAlerts([]);
    setSettings(prev => ({ 
      ...prev, 
      theme: "lavender",
      groqKey: "",
      rapidKey: ""
    }));
    addNotification("Protocol Terminated", "Session & Node data cleared. Returning to secure entry.");
    window.location.reload();
  }, [setProfile, setResumes, setApps, setAlerts, setSettings, addNotification]);

  const state: AppContextState = {
    profile,
    settings,
    apps,
    alerts,
    resumes,
    notifs,
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setProfile,
        setSettings,
        setApps,
        setAlerts,
        setResumes,
        addNotification,
        setNotifs,
        toggleTheme,
        seedDemoData,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
