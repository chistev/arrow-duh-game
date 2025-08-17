import React from "react";

export default function Settings({ mode, setMode, showClue, setShowClue, setCurrentScreen }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl md:text-3xl font-black tracking-tight">Settings</h2>
      <div className="mt-8 flex flex-col gap-4 w-full max-w-md">
        <div className="flex flex-col gap-2">
          <label className="text-slate-400 text-sm font-medium">Game Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="rounded-2xl bg-slate-800 border border-white/10 px-4 py-3 text-slate-100 focus:ring-2 focus:ring-rose-500/60"
          >
            <option value="timed">Timed (5s)</option>
            <option value="classic">Classic (Untimed)</option>
            <option value="multiple-choice">Multiple Choice (5s)</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-slate-400 text-sm font-medium">Clues</label>
          <button
            onClick={() => setShowClue((v) => !v)}
            className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
              showClue
                ? "bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white"
                : "bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600"
            }`}
          >
            {showClue ? "Clues Enabled" : "Clues Disabled"}
          </button>
        </div>
        <button
          onClick={() => setCurrentScreen("home")}
          className="rounded-2xl px-6 py-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium shadow-lg shadow-rose-900/30 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}