import React from "react";

export default React.memo(({ mode }) => {
  const timed = mode === "timed";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium ${
        timed
          ? "border-rose-500/40 bg-rose-500/15 text-rose-200"
          : "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
      {timed ? "Timed" : "Classic"}
    </span>
  );
});