// @jxui/react v3.0.0 — ExpandableCard (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';

// 2. ExpandableCard
export const ExpandableCard: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="p-3 border rounded-xl bg-white dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full text-left font-bold cursor-pointer"
      >
        Module Details
      </button>
      {expanded && <div className="pt-2 text-xs text-slate-500">Provides deep integration with JXUI styling engine.</div>}
    </div>
  );
};
