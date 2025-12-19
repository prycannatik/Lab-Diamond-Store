// src/App.jsx
import React, { useState, useEffect } from "react";
import LabDiamondStore from "./LabDiamondStore";
import { Lock, Construction, ArrowRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- 🛠 CONFIGURATION: TOGGLE LOCK HERE 🛠 ---
// Change this to 'false' when you are ready to launch the site.
const IS_CONSTRUCTION_MODE = true; 
const ACCESS_PASSWORD = "admin";
// --------------------------------------------

function UnderConstruction({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate a network check delay
    setTimeout(() => {
      if (password === ACCESS_PASSWORD) {
        onUnlock();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950 px-4 text-white">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute top-1/2 -right-40 h-80 w-80 rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-blue-500/10 p-4 ring-1 ring-blue-500/20">
            <Construction className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Under Construction</h1>
          <p className="mt-2 text-sm text-slate-400">
            We are currently crafting something exceptional. <br />
            Please enter your access key to view the preview.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="group relative mb-4">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter Access Key"
              className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500/50 focus:bg-black/40 focus:ring-1 focus:ring-blue-500/50"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 flex items-center gap-2 text-xs text-red-400"
              >
                <AlertCircle className="h-3 w-3" />
                <span>Incorrect password provided.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Unlock Access"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
        
        <div className="mt-8 text-center">
           <p className="text-[10px] font-medium uppercase tracking-widest text-slate-600">Restricted Access</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 1. Check if Construction Mode is disabled globally
    if (!IS_CONSTRUCTION_MODE) {
      setIsLocked(false);
      setChecking(false);
      return;
    }

    // 2. If enabled, check if user has already unlocked it this session
    const unlocked = sessionStorage.getItem("site_unlocked");
    if (unlocked === "true") {
      setIsLocked(false);
    }
    setChecking(false);
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem("site_unlocked", "true");
    setIsLocked(false);
  };

  // Prevent flickering while checking session storage
  if (checking) return null;

  // If locked, show the gatekeeper component
  if (isLocked) {
    return <UnderConstruction onUnlock={handleUnlock} />;
  }

  // Otherwise, render the main store
  return <LabDiamondStore />;
}
