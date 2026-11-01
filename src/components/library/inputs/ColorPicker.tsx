// @jxui/react v3.0.0 — ColorPicker (JXUI v3.0 Unified Component Suite)
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

// 17. ColorPicker
export const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#4f46e5');
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
      <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{color}</span>
    </div>
  );
};
