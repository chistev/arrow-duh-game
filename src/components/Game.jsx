import React, { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { playWinSound, playFailSound, playClickSound, playRoundTransitionSound } from "../utils/sound";
import { checkAchievements, loadAchievements } from "./achievements";
import { WIN_PHRASES, FAIL_PHRASES } from "../utils/phrases";
import { useRounds } from "../hooks/useRounds";
import GameContent from "./GameContent";

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
  soundVolume,
  lives,
  setLives,
}) {
  const [input, setInput] = useState("");
  const [overlay, setOverlay] = useState({ show: false, kind: null, message: "" });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([]);
  const [achievements, setAchievements] = useState(loadAchievements());
  const inputRef = useRef(null);
  const rounds = useRounds();
  const current = useMemo(() => rounds[round % rounds.length] || {}, [round, rounds]);

  // Define helper functions before useEffect to avoid ReferenceError
  const nextRound = useCallback(
    (advance = true) => {
      if (advance && (mode === "survival" ? lives <= 0 : round + 1 >= rounds.length)) {
        setCurrentScreen("results");
      } else {
        setInput("");
        setOverlay({ show: false, kind: null, message: "" });
        if (advance) setRound((r) => r + 1);
      }
    },
    [setRound, setCurrentScreen, round, rounds.length, mode, lives]
  );

  const updateStats = useCallback(
    (isWin) => {
      setStats((s) => {
        const newStats = {
          correct: isWin ? s.correct + 1 : s.correct,
          wrong: isWin ? s.wrong : s.wrong + 1,
          streak: isWin ? s.streak + 1 : 0,
          rounds: s.rounds + 1,
        };
        const newAchievements = checkAchievements(newStats, mode, achievements);
        setAchievements(newAchievements);
        return newStats;
      });
      if (!isWin && mode === "survival") {
        setLives((l) => l - 1);
      }
    },
    [setStats, mode, achievements, setLives]
  );

  const handleFail = useCallback(
    (msg = FAIL_PHRASES[Math.floor(Math.random() * FAIL_PHRASES.length)]) => {
      setOverlay({ show: true, kind: "fail", message: msg });
      updateStats(false);
      if (soundVolume > 0) {
        playFailSound(soundVolume);
      }
      const isTimeout = msg.toLowerCase().includes("time");
      if (mode === "survival" && lives - 1 <= 0) {
        setTimeout(() => setCurrentScreen("results"), 1000);
      } else {
        setTimeout(() => nextRound(isTimeout), 1000);
      }
    },
    [nextRound, updateStats, soundVolume, mode, lives, setCurrentScreen]
  );

  const handleWin = useCallback(
    () => {
      const randomIndex = Math.floor(Math.random() * WIN_PHRASES.length);
      const phrase = WIN_PHRASES[randomIndex];
      setOverlay({ show: true, kind: "win", message: phrase });
      updateStats(true);
      if (soundVolume > 0) {
        playWinSound(soundVolume);
      }
      setTimeout(() => nextRound(true), 900);
    },
    [nextRound, updateStats, soundVolume]
  );

  // Focus input and reset image loading state and options each round
  useEffect(() => {
    if (mode !== "multiple-choice") {
      inputRef.current?.focus();
    }
    setIsImageLoaded(false);
    if (mode === "multiple-choice" && rounds.length > 0) {
      setMultipleChoiceOptions(getMultipleChoiceOptions());
    }
    if (soundVolume > 0) {
      playRoundTransitionSound(soundVolume);
    }
  }, [round, mode, rounds, soundVolume]);

  useEffect(() => {
    if (mode !== "timed" || overlay.show || rounds.length === 0 || !isImageLoaded) return;

    setCountdown(5);
    let remaining = 5;

    const intervalId = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(intervalId);
        handleFail("Time's up!");
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [round, isImageLoaded, mode, overlay.show, rounds.length, setCountdown, handleFail]);

  const getMultipleChoiceOptions = useCallback(() => {
    const correctAnswers = current.answers || [];
    const correct = correctAnswers[Math.floor(Math.random() * correctAnswers.length)];
    const allAnswers = rounds
      .flatMap((r) => r.answers)
      .filter((a) => !correctAnswers.includes(a));
    const incorrect = [];
    while (incorrect.length < 3 && allAnswers.length > 0) {
      const randomIndex = Math.floor(Math.random() * allAnswers.length);
      incorrect.push(allAnswers.splice(randomIndex, 1)[0]);
    }
    const options = [correct, ...incorrect].sort(() => Math.random() - 0.5);
    return options;
  }, [current, rounds]);

  const normalize = (s) => s.trim().toLowerCase();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || rounds.length === 0) return;
    if (soundVolume > 0) {
      playClickSound(soundVolume);
    }
    if (current.answers.some((answer) => normalize(input) === normalize(answer))) {
      handleWin();
    } else {
      handleFail();
    }
  };

  const handleMultipleChoice = (choice) => {
    if (soundVolume > 0) {
      playClickSound(soundVolume);
    }
    if (current.answers.some((answer) => normalize(choice) === normalize(answer))) {
      handleWin();
    } else {
      handleFail();
    }
  };

  if (rounds.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <p>Loading rounds...</p>
      </div>
    );
  }

  return (
    <GameContent
      mode={mode}
      setMode={setMode}
      stats={stats}
      setStats={setStats}
      round={round}
      setRound={setRound}
      showClue={showClue}
      setShowClue={setShowClue}
      countdown={countdown}
      lives={lives}
      setCurrentScreen={setCurrentScreen}
      soundVolume={soundVolume}
      current={current}
      overlay={overlay}
      nextRound={nextRound}
      onSubmit={onSubmit}
      input={input}
      setInput={setInput}
      inputRef={inputRef}
      isImageLoaded={isImageLoaded}
      setIsImageLoaded={setIsImageLoaded}
      multipleChoiceOptions={multipleChoiceOptions}
      handleMultipleChoice={handleMultipleChoice}
      rounds={rounds}
    />
  );
}