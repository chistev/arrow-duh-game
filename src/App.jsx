import React, { useEffect, useMemo, useState, useRef } from "react";

// Tailwind classes are used throughout. No external UI libs required.

const WIN_PHRASES = [
  "Bingo!",
  "Nailed it!",
  "Chef's kiss!",
  "Correctamundo!",
  "You got it!",
  "Boom!",
  "On the money!",
];

const ROUNDS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200&auto=format&fit=crop",
    answer: "cat",
    clue: "House pet that says meow",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    answer: "shoes",
    clue: "You wear them on your feet",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop&ixid=1SAnrIxw5OY",
    answer: "laptop",
    clue: "Portable computer",
  },
];

const Overlay = ({ show, kind, message, onClick }) => {
  if (!show) return null;
  const isWin = kind === "win";
  return (
    <button
      onClick={onClick}
      className={`absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm transition ${
        isWin ? "bg-emerald-600/75" : "bg-rose-600/75"
      }`}
    >
      <div
        className={`text-white text-4xl md:text-6xl font-black tracking-tight drop-shadow-xl select-none ${
          isWin ? "animate-bounce" : "animate-pulse"
        }`}
      >
        {message}
      </div>
    </button>
  );
};

export default function App() {
  const [mode, setMode] = useState("timed"); // "timed" or "classic"
  const [round, setRound] = useState(0);
  const [input, setInput] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [showClue, setShowClue] = useState(true);
  const [overlay, setOverlay] = useState({ show: false, kind: null, message: "" });
  const [stats, setStats] = useState({ correct: 0, wrong: 0, streak: 0, rounds: 0 });
  const [winIndex, setWinIndex] = useState(0);
  const inputRef = useRef(null);
  const current = useMemo(() => ROUNDS[round % ROUNDS.length], [round]);

  // Focus input each round
  useEffect(() => {
    inputRef.current?.focus();
  }, [round]);

  // Timed mode: 5s countdown
  useEffect(() => {
    if (mode !== "timed") return; // Classic: no timer
    if (overlay.show) return; // Pause timer while overlay visible
    setCountdown(5);
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = Math.max(0, 5 - elapsed);
      setCountdown(remaining);
      if (remaining === 0) {
        clearInterval(id);
        handleFail("Time's up!");
      }
    }, 200);
    return () => clearInterval(id);
  }, [round, mode, overlay.show]);

  const normalize = (s) => s.trim().toLowerCase();

  const nextRound = (advance = true) => {
    setInput("");
    setOverlay({ show: false, kind: null, message: "" });
    if (advance) setRound((r) => r + 1);
  };

  const handleFail = (msg = "Wrong!") => {
    setOverlay({ show: true, kind: "fail", message: msg });
    setStats((s) => ({ ...s, wrong: s.wrong + 1, streak: 0, rounds: s.rounds + 1 }));
    const isTimeout = msg.toLowerCase().includes("time");
    setTimeout(() => nextRound(isTimeout), 1000);
  };

  const handleWin = () => {
    const phrase = WIN_PHRASES[winIndex % WIN_PHRASES.length];
    setOverlay({ show: true, kind: "win", message: phrase });
    setWinIndex((i) => i + 1);
    setStats((s) => ({
      correct: s.correct + 1,
      wrong: s.wrong,
      streak: s.streak + 1,
      rounds: s.rounds + 1,
    }));
    setTimeout(() => nextRound(true), 900);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (normalize(input) === normalize(current.answer)) {
      handleWin();
    } else {
      handleFail("Wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-rose-600 grid place-items-center font-black">?</div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Guess It!</h1>
              <p className="text-xs text-slate-400 -mt-0.5">Guess the object in the image.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ModeBadge mode={mode} />
            <button
              onClick={() => setMode((m) => (m === "timed" ? "classic" : "timed"))}
              className="rounded-2xl px-3 py-2 text-sm bg-slate-800 border border-white/10 hover:bg-slate-700 transition"
              title="Toggle mode"
            >
              Switch to {mode === "timed" ? "Classic (untimed)" : "Timed"}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 pb-24">
        {/* HUD */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <HudTile label="Round" value={stats.rounds + 1} />
          <HudTile label="Streak" value={stats.streak} />
          <HudTile label="Correct" value={stats.correct} />
          <HudTile
            label={mode === "timed" ? "Timer" : "Mode"}
            value={mode === "timed" ? `${countdown}s` : "∞"}
            pulse={mode === "timed"}
          />
        </div>

        {/* Image Card */}
        <section className="relative mt-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <div className="relative aspect-[16/9] bg-slate-800">
              <img
                src={current.image}
                alt="Round"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              <Overlay
                show={overlay.show}
                kind={overlay.kind}
                message={overlay.message}
                onClick={() => nextRound(overlay.kind === "win")}
              />
            </div>

            {/* Bottom bar (clue + input) */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 bg-slate-900/70">
              <div className="flex-1 text-sm text-slate-300">
                {showClue ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-rose-600/20 px-2 text-rose-300 text-xs font-medium border border-rose-500/30">
                      Clue
                    </span>
                    <span className="truncate">{current.clue}</span>
                  </div>
                ) : (
                  <button
                    className="text-xs text-slate-400 underline underline-offset-4 hover:text-slate-200"
                    onClick={() => setShowClue(true)}
                  >
                    Show clue
                  </button>
                )}
              </div>

              <form onSubmit={onSubmit} className="flex gap-2 w-full md:w-auto">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your guess…"
                  className="flex-1 md:w-80 rounded-2xl bg-slate-800 border border-white/10 px-4 py-2.5 outline-none focus:ring-2 focus:ring-rose-500/60"
                />
                <button
                  type="submit"
                  className="rounded-2xl px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-900/30 transition"
                >
                  Guess
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowClue((v) => !v)}
            className="rounded-2xl border border-white/10 bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
          >
            {showClue ? "Hide Clue" : "Show Clue"}
          </button>
          <button
            onClick={() => nextRound(true)}
            className="rounded-2xl border border-white/10 bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
            title="Skip to next image"
          >
            Skip ↦
          </button>
          <button
            onClick={() => {
              setStats({ correct: 0, wrong: 0, streak: 0, rounds: 0 });
              setRound(0);
              setInput("");
              setCountdown(5);
              setOverlay({ show: false, kind: null, message: "" });
            }}
            className="rounded-2xl border border-white/10 bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
            title="Restart"
          >
            Reset Game
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-slate-500">
          <p>
            Default mode is <span className="font-semibold text-slate-300">Timed</span> (5s timer). Switch to{" "}
            <span className="font-semibold text-slate-300">Classic</span> in the header.
          </p>
        </footer>
      </main>
    </div>
  );
}

function HudTile({ label, value, pulse = false }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-slate-800/60 p-4 shadow ${
        pulse ? "animate-pulse" : ""
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function ModeBadge({ mode }) {
  const timed = mode === "timed";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
        timed
          ? "border-rose-500/40 bg-rose-500/15 text-rose-200"
          : "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
      }`}
      title={timed ? "Timed (5s)" : "Classic (untimed)"}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
      {timed ? "Timed" : "Classic"}
    </span>
  );
}