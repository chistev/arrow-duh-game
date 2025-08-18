import React from "react";
import HudTile from "./HudTile";
import { loadAchievements, ACHIEVEMENTS } from "./achievements";

export default function Results({ stats, setStats, setRound, setCurrentScreen, mode, lives, setLives }) {
  const achievements = loadAchievements();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl md:text-3xl font-black tracking-tight">Results</h2>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl text-center">
        <HudTile label="Rounds Played" value={stats.rounds} />
        <HudTile label="Correct" value={stats.correct} />
        <HudTile label="Wrong" value={stats.wrong} />
        <HudTile
          label={mode === "survival" ? "Lives Remaining" : "Longest Streak"}
          value={mode === "survival" ? lives : stats.streak}
        />
      </div>
      <div className="mt-8 w-full max-w-5xl">
        <h3 className="text-xl font-bold tracking-tight">Achievements</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-2xl border ${
                achievements[achievement.id]
                  ? "bg-emerald-600/20 border-emerald-500/40"
                  : "bg-slate-800/60 border-white/10"
              }`}
            >
              <h4 className="font-medium">{achievement.name}</h4>
              <p className="text-sm text-slate-400">{achievement.description}</p>
              {achievements[achievement.id] ? (
                <p className="text-sm text-emerald-300">
                  Unlocked on {new Date(achievements[achievement.id].unlocked).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-sm text-slate-500">Not unlocked yet</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => {
            setStats({ correct: 0, wrong: 0, streak: 0, rounds: 0 });
            setRound(0);
            setLives(3); // Reset lives
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