import React from "react";

export default function Home({ setCurrentScreen }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-rose-600 grid place-items-center font-black text-2xl">?</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Guess It!</h1>
          <p className="text-slate-400 mt-1 text-lg">Guess the object in the image!</p>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => setCurrentScreen("game")}
          className="rounded-2xl px-6 py-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium shadow-lg shadow-rose-900/30 transition"
        >
          Start Game
        </button>
        <button
          onClick={() => setCurrentScreen("settings")}
          className="rounded-2xl px-6 py-3 bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600 transition"
        >
          Settings
        </button>
        <button
          onClick={() => setCurrentScreen("results")}
          className="rounded-2xl px-6 py-3 bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600 transition"
        >
          View Results
        </button>
      </div>
      <footer className="mt-10 text-center text-sm text-slate-500">
        <p>Challenge your observation skills in Timed or Classic mode!</p>
      </footer>
    </div>
  );
}