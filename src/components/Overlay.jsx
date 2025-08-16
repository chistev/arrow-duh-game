import React from "react";

export default React.memo(({ show, kind, message, onClick }) => {
  if (!show) return null;
  const isWin = kind === "win";
  return (
    <button
      onClick={onClick}
      className={`absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm transition ${
        isWin ? "bg-emerald-600/75" : "bg-rose-600/75"
      }`}
      aria-label={isWin ? "Continue to next round" : "Try again"}
    >
      <div
        className={`text-white text-4xl md:text-6xl font-black tracking-tight drop-shadow-xl select-none ${
          isWin ? "animate-bounce" : "animate-pulse"
        }`}
        aria-live="assertive"
      >
        {message}
      </div>
    </button>
  );
});