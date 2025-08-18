import React from "react";

export default React.memo(({ mode }) => {
  const getStyles = () => {
    switch (mode) {
      case "timed":
        return "border-rose-500/40 bg-rose-500/15 text-rose-200";
      case "classic":
        return "border-emerald-500/40 bg-emerald-500/15 text-emerald-200";
      case "multiple-choice":
        return "border-blue-500/40 bg-blue-500/15 text-blue-200";
      case "survival":
        return "border-purple-500/40 bg-purple-500/15 text-purple-200";
      default:
        return "";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium ${getStyles()}`}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
      {mode === "timed"
        ? "Timed"
        : mode === "classic"
        ? "Classic"
        : mode === "multiple-choice"
        ? "Multiple Choice"
        : "Survival"}
    </span>
  );
});