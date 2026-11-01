// @jxui/react v3.0.0 — SlashCommandMenu (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { 
  Bold, 
  Italic, 
  Link, 
  Code, 
  Eye, 
  Layers, 
  Palette, 
  Smile, 
  Check, 
  Plus, 
  Sliders 
} from 'lucide-react';

// 3. SlashCommandMenu
export const SlashCommandMenu: React.FC = () => {
  return (
    <div className="w-48 p-1 border rounded-xl shadow-xl bg-white dark:bg-slate-900 text-xs flex flex-col gap-0.5">
      <div className="px-2 py-1 font-bold text-slate-400 text-[10px]">BASIC BLOCKS</div>
      <div className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">/heading 1</div>
      <div className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">/bullet list</div>
      <div className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">/code snippet</div>
    </div>
  );
};
