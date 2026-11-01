// @jxui/react v3.0.0 — ExpandableTable (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// 3. ExpandableTable
export const ExpandableTable: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border rounded-xl p-2 text-xs">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between cursor-pointer font-bold"
      >
        <span>Design Token Palette</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && <div className="pt-2 text-slate-500">5 dynamic accents: Indigo, Violet, Emerald, Rose, Ocean.</div>}
    </div>
  );
};
