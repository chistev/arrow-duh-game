import React from "react";
import HudTile from "./HudTile";

export default function Results({ stats, setStats, setRound, setCurrentScreen }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl md:text-3xl font-black tracking-tight">Results</h2>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl text-center">
        <HudTile label="Rounds Played" value={stats.rounds} />
        <HudTile label="Correct" value={stats.correct} />
        <HudTile label="Wrong" value={stats.wrong} />
        <HudTile label="Longest Streak" value={stats.streak} />
      </div>
      <div className="mt-8 flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => {
            setStats({ correct: 0, wrong: 0, streak: 0, rounds: 0 });
            setRound(0);
            setCurrentScreen("game");
          }}
          className="rounded-2xl px-6 py-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium shadow-lg shadow-rose-900/30 transition"
        >
          Play Again
        </button>
        <button
          onClick={() => setCurrentScreen("home")}
          className="rounded-2xl px-6 py-3 bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}