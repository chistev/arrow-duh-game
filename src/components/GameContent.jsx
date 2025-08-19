import React from "react";
import HudTile from "./HudTile";
import ModeBadge from "./ModeBadge";
import Overlay from "./Overlay";
import { playClickSound } from "../utils/sound";

export default function GameContent({
  mode,
  setMode,
  stats,
  setStats,
  round,
  setRound,
  showClue,
  setShowClue,
  countdown,
  lives,
  setCurrentScreen,
  soundVolume,
  current,
  overlay,
  nextRound,
  onSubmit,
  input,
  setInput,
  inputRef,
  isImageLoaded,
  setIsImageLoaded,
  multipleChoiceOptions,
  handleMultipleChoice,
  rounds,
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
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
              onClick={() => {
                if (soundVolume > 0) playClickSound(soundVolume);
                setMode((m) =>
                  m === "timed"
                    ? "classic"
                    : m === "classic"
                    ? "multiple-choice"
                    : m === "multiple-choice"
                    ? "survival"
                    : "timed"
                );
              }}
              className="rounded-2xl px-4 py-3 text-sm bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600 transition"
              title="Toggle mode"
            >
              Switch to{" "}
              {mode === "timed"
                ? "Classic"
                : mode === "classic"
                ? "Multiple Choice"
                : mode === "multiple-choice"
                ? "Survival"
                : "Timed"}
            </button>
            <button
              onClick={() => {
                if (soundVolume > 0) playClickSound(soundVolume);
                setCurrentScreen("home");
              }}
              className="rounded-2xl px-4 py-3 text-sm bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600 transition"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20">
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <HudTile label="Round" value={`${stats.rounds + 1}/${rounds.length}`} />
          <HudTile label="Streak" value={stats.streak} />
          <HudTile label="Correct" value={stats.correct} />
          <HudTile
            label={mode === "classic" ? "Mode" : mode === "survival" ? "Lives" : "Timer"}
            value={mode === "classic" ? "∞" : mode === "survival" ? lives : `${countdown}s`}
            pulse={mode === "timed" || mode === "multiple-choice"}
          />
        </div>
        <div className="mt-4 w-full bg-slate-800 rounded-full h-2.5">
          <div
            className="bg-rose-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((stats.rounds + 1) / rounds.length) * 100}%` }}
          ></div>
        </div>

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
                onLoad={() => setIsImageLoaded(true)}
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              <Overlay
                show={overlay.show}
                kind={overlay.kind}
                message={overlay.message}
                onClick={() => {
                  if (soundVolume > 0) playClickSound(soundVolume);
                  nextRound(overlay.kind === "win");
                }}
              />
            </div>

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
                    onClick={() => {
                      if (soundVolume > 0) playClickSound(soundVolume);
                      setShowClue(true);
                    }}
                  >
                    Show clue
                  </button>
                )}
              </div>

              {mode === "multiple-choice" ? (
                <div className="grid grid-cols-2 gap-2 w-full md:w-80">
                  {multipleChoiceOptions.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleMultipleChoice(choice)}
                      className="rounded-2xl px-4 py-3 bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600 transition text-sm"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={onSubmit} aria-label="guess-form" className="flex gap-2 w-full md:w-auto">
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
              )}
            </div>
          </div>
        </section>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (soundVolume > 0) playClickSound(soundVolume);
              setShowClue((v) => !v);
            }}
            className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700 active:bg-slate-600 transition"
          >
            {showClue ? "Hide Clue" : "Show Clue"}
          </button>
          <button
            onClick={() => {
              if (soundVolume > 0) playClickSound(soundVolume);
              nextRound(true);
            }}
            className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700 active:bg-slate-600 transition"
            aria-label="Skip to next round"
          >
            Skip ↦
          </button>
          <button
            onClick={() => {
              if (soundVolume > 0) playClickSound(soundVolume);
              setStats({ correct: 0, wrong: 0, streak: 0, rounds: 0 });
              setRound(0);
              setInput("");
              setCountdown(5);
              setLives(3);
              setOverlay({ show: false, kind: null, message: "" });
            }}
            className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700 active:bg-slate-600 transition"
            aria-label="Restart game"
          >
            Reset Game
          </button>
          <button
            onClick={() => {
              if (soundVolume > 0) playClickSound(soundVolume);
              setCurrentScreen("results");
            }}
            className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700 active:bg-slate-600 transition"
          >
            View Results
          </button>
        </div>

        <footer className="mt-10 text-center text-sm text-slate-500">
          <p>
            Default mode is <span className="font-semibold text-slate-300">Timed</span> (5s timer). Switch to{" "}
            <span className="font-semibold text-slate-300">Classic</span>,{" "}
            <span className="font-semibold text-slate-300">Multiple Choice</span>, or{" "}
            <span className="font-semibold text-slate-300">Survival</span> in the header.
          </p>
        </footer>
      </main>
    </div>
  );
}