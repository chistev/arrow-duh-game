import React, { useEffect, useMemo, useCallback, useState, useRef } from "react";
import HudTile from "./HudTile";
import ModeBadge from "./ModeBadge";
import Overlay from "./Overlay";

const WIN_PHRASES = [
  "Bingo!",
  "Nailed it!",
  "Chef's kiss!",
  "Correctamundo!",
  "You got it!",
  "Boom!",
  "On the money!",
  "Well done!",
  "Spot on!",
  "Fantastic!",
  "Way to go!",
  "Awesome!",
  "Perfect!",
  "Great job!",
  "You're a star!",
];

const FAIL_PHRASES = [
  "Oops, try again!",
  "Not quite!",
  "Missed it!",
  "Better luck next time!",
  "Close, but no cigar!",
  "Oh no!",
  "Swing and a miss!",
  "Try another guess!",
  "Not that one!",
  "Keep trying!",
  "Almost there!",
  "Nope, wrong one!",
  "Give it another shot!",
  "Better luck next round!",
  "That's not it!",
];

export default function Game({
  setCurrentScreen,
  mode,
  setMode,
  stats,
  setStats,
  round,
  setRound,
  showClue,
  setShowClue,
  countdown,
  setCountdown,
}) {
  const [input, setInput] = useState("");
  const [overlay, setOverlay] = useState({ show: false, kind: null, message: "" });
  const [rounds, setRounds] = useState([]); // State to store rounds data
  const [winIndex, setWinIndex] = useState(0);
  const inputRef = useRef(null);
  const current = useMemo(() => rounds[round % rounds.length] || {}, [round, rounds]);

  // Fetch rounds data from JSON file
  useEffect(() => {
    fetch("/rounds.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch rounds data");
        }
        return response.json();
      })
      .then((data) => setRounds(data))
      .catch((error) => {
        console.error("Error fetching rounds:", error);
        // Optionally set fallback rounds if fetch fails
        setRounds([
          {
            id: 1,
            image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200&auto=format&fit=crop",
            answers: ["cat", "kitten", "feline"],
            clue: "House pet that says meow",
          },
          {
            id: 2,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
            answers: ["shoes", "sneakers", "footwear"],
            clue: "You wear them on your feet",
          },
          {
            id: 3,
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop&ixid=1SAnrIxw5OY",
            answers: ["laptop", "notebook", "portable computer"],
            clue: "Portable computer",
          },
        ]);
      });
  }, []);

  // Focus input each round
  useEffect(() => {
    inputRef.current?.focus();
  }, [round]);

  // Timed mode: 5s countdown with requestAnimationFrame
  useEffect(() => {
    if (mode !== "timed" || overlay.show || rounds.length === 0) return;
    setCountdown(5);
    const start = Date.now();
    let rafId;
    const tick = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = Math.max(0, 5 - elapsed);
      setCountdown(remaining);
      if (remaining === 0) {
        handleFail("Time's up!");
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [round, mode, overlay.show, rounds, setCountdown]);

  const normalize = (s) => s.trim().toLowerCase();

  const nextRound = useCallback(
    (advance = true) => {
      setInput("");
      setOverlay({ show: false, kind: null, message: "" });
      if (advance) setRound((r) => r + 1);
    },
    [setRound]
  );

  const updateStats = useCallback(
    (isWin) => {
      setStats((s) => ({
        correct: isWin ? s.correct + 1 : s.correct,
        wrong: isWin ? s.wrong : s.wrong + 1,
        streak: isWin ? s.streak + 1 : 0,
        rounds: s.rounds + 1,
      }));
    },
    [setStats]
  );

  const handleFail = useCallback(
    (msg = FAIL_PHRASES[Math.floor(Math.random() * FAIL_PHRASES.length)]) => {
      setOverlay({ show: true, kind: "fail", message: msg });
      updateStats(false);
      const isTimeout = msg.toLowerCase().includes("time");
      setTimeout(() => nextRound(isTimeout), 1000);
    },
    [nextRound, updateStats]
  );

  const handleWin = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * WIN_PHRASES.length);
    const phrase = WIN_PHRASES[randomIndex];
    setOverlay({ show: true, kind: "win", message: phrase });
    updateStats(true);
    setTimeout(() => nextRound(true), 900);
  }, [nextRound, updateStats]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || rounds.length === 0) return;
    if (current.answers.some((answer) => normalize(input) === normalize(answer))) {
      handleWin();
    } else {
      handleFail();
    }
  };

  // Handle loading or error state
  if (rounds.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <p>Loading rounds...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-rose-600 grid place-items-center font-black">?</div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Guess It!</h1>
              <p className="text-sm text-slate-400 -mt-0.5">Guess the object in the image.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeBadge mode={mode} />
            <button
              onClick={() => setMode((m) => (m === "timed" ? "classic" : "timed"))}
              className="rounded-2xl px-4 py-3 text-sm bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600 transition"
              title="Toggle mode"
            >
              Switch to {mode === "timed" ? "Classic (untimed)" : "Timed"}
            </button>
            <button
              onClick={() => setCurrentScreen("home")}
              className="rounded-2xl px-4 py-3 text-sm bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600 transition"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 pb-20">
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
                srcSet={`
                  ${current.image}&w=600 600w,
                  ${current.image}&w=1200 1200w
                `}
                sizes="(max-width: 768px) 600px, 1200px"
                alt="Round image"
                onError={(e) => (e.target.src = "/fallback-image.jpg")}
                loading="lazy"
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
              <div className="flex-1 text-base text-slate-300">
                {showClue ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-rose-600/20 px-2 text-rose-300 text-sm font-medium border border-rose-500/30">
                      Clue
                    </span>
                    <span className="line-clamp-2">{current.clue}</span>
                  </div>
                ) : (
                  <button
                    className="text-sm text-slate-400 underline underline-offset-4 hover:text-slate-200"
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
                  className="w-full md:w-80 rounded-2xl bg-slate-800 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/60"
                  aria-label="Enter your guess"
                />
                <button
                  type="submit"
                  className="rounded-2xl px-4 py-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium shadow-lg shadow-rose-900/30 transition"
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
            className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700 active:bg-slate-600 transition"
          >
            {showClue ? "Hide Clue" : "Show Clue"}
          </button>
          <button
            onClick={() => nextRound(true)}
            className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700 active:bg-slate-600 transition"
            aria-label="Skip to next round"
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
            className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700 active:bg-slate-600 transition"
            aria-label="Restart game"
          >
            Reset Game
          </button>
          <button
            onClick={() => setCurrentScreen("results")}
            className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700 active:bg-slate-600 transition"
          >
            View Results
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-slate-500">
          <p>
            Default mode is <span className="font-semibold text-slate-300">Timed</span> (5s timer). Switch to{" "}
            <span className="font-semibold text-slate-300">Classic</span> in the header.
          </p>
        </footer>
      </main>
    </div>
  );
}