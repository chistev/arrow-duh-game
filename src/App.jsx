import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Game from "./components/Game";
import Settings from "./components/Settings";
import Results from "./components/Results";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [mode, setMode] = useState("timed");
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem("gameStats");
    return savedStats
      ? JSON.parse(savedStats)
      : { correct: 0, wrong: 0, streak: 0, rounds: 0 };
  });
  const [round, setRound] = useState(0);
  const [showClue, setShowClue] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [soundVolume, setSoundVolume] = useState(0);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    localStorage.setItem("gameStats", JSON.stringify(stats));
  }, [stats]);

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <Home setCurrentScreen={setCurrentScreen} />;
      case "game":
        return (
          <Game
            setCurrentScreen={setCurrentScreen}
            mode={mode}
            setMode={setMode}
            stats={stats}
            setStats={setStats}
            round={round}
            setRound={setRound}
            showClue={showClue}
            setShowClue={setShowClue}
            countdown={countdown}
            setCountdown={setCountdown}
            soundVolume={soundVolume}
            lives={lives}
            setLives={setLives}
          />
        );
      case "settings":
        return (
          <Settings
            mode={mode}
            setMode={setMode}
            showClue={showClue}
            setShowClue={setShowClue}
            setCurrentScreen={setCurrentScreen}
            soundVolume={soundVolume}
            setSoundVolume={setSoundVolume}
            setLives={setLives}
          />
        );
      case "results":
        return (
          <Results
            stats={stats}
            setStats={setStats}
            setRound={setRound}
            setCurrentScreen={setCurrentScreen}
            mode={mode}
            lives={lives}
            setLives={setLives}
          />
        );
      default:
        return <Home setCurrentScreen={setCurrentScreen} />;
    }
  };

  return <div className="min-h-screen bg-slate-900">{renderScreen()}</div>;
}