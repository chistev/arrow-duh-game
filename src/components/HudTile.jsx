import React from "react";

export default React.memo(({ label, value, pulse = false }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-slate-800/60 p-4 shadow ${
      pulse ? "animate-pulse" : ""
    }`}
  >
    <div className="text-sm uppercase tracking-wider text-slate-400">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
));