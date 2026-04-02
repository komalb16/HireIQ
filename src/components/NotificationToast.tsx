"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { Notification } from "@/types";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

export function NotificationToast() {
  const { state, setNotifs } = useAppContext();
  const [activeNotif, setActiveNotif] = useState<Notification | null>(null);

  useEffect(() => {
    // Look for the latest unread notification
    const latest = state.notifs.find((n) => n.unread);
    if (latest) {
      setActiveNotif(latest);
      // Mark as read after showing
      const timer = setTimeout(() => {
        setNotifs((prev) => 
          prev.map((n) => n.id === latest.id ? { ...n, unread: false } : n)
        );
        setActiveNotif(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.notifs, setNotifs]);

  const dismiss = () => {
    if (activeNotif) {
      setNotifs((prev) => 
        prev.map((n) => n.id === activeNotif.id ? { ...n, unread: false } : n)
      );
      setActiveNotif(null);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000] pointer-events-none w-full max-w-sm">
      <AnimatePresence mode="wait">
        {activeNotif && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)", transition: { duration: 0.3 } }}
            className={`
              pointer-events-auto p-6 rounded-[2rem] border-2 shadow-2xl backdrop-blur-2xl flex items-start gap-4 
              ${activeNotif.msg.includes("Failure") || activeNotif.msg.includes("Error") 
                ? "bg-red-500/10 border-red-500/30 text-red-200" 
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"}
            `}
          >
             <div className="mt-1">
                {activeNotif.msg.includes("Failure") || activeNotif.msg.includes("Error") 
                  ? <AlertCircle size={24} className="text-red-500" /> 
                  : <CheckCircle size={24} className="text-emerald-500" />
                }
             </div>
             
             <div className="flex-1 space-y-1">
                <p className="text-sm font-black uppercase tracking-widest italic">{activeNotif.msg.split(':')[0]}</p>
                <p className="text-xs font-bold opacity-70 leading-relaxed uppercase italic">{activeNotif.msg.split(':')[1] || activeNotif.msg}</p>
             </div>

             <button onClick={dismiss} className="p-1 hover:bg-white/10 rounded-full transition-colors self-center">
                <X size={16} className="opacity-40" />
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
