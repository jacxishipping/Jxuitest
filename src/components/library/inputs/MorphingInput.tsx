// @jxui/react v3.0.0 — MorphingInput (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { 
  Search, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  Lock, 
  Terminal, 
  Palette, 
  Sliders, 
  PenTool, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

// 5. MorphingInput
export const MorphingInput: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const { getRadiusClass } = useJXTheme();
  return (
    <div className="w-full">
      {expanded ? (
        <textarea
          autoFocus
          onBlur={() => setExpanded(false)}
          placeholder="Morphing into multi-line markdown..."
          rows={3}
          className={`w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-indigo-500 rounded-lg text-slate-900 dark:text-white focus:outline-none ${getRadiusClass('control')}`}
        />
      ) : (
        <input
          onFocus={() => setExpanded(true)}
          placeholder="Click to morph into multi-line textarea..."
          className={`w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white cursor-pointer ${getRadiusClass('control')}`}
        />
      )}
    </div>
  );
};
