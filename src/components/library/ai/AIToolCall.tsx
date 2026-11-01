// @jxui/react v3.0.0 — AIToolCall (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { 
  Bot, 
  Sparkles, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  RefreshCw, 
  Paperclip, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

// 6. AIToolCall
export const AIToolCall: React.FC<{ toolName?: string }> = ({ toolName = 'run_command' }) => {
  return (
    <div className="p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-mono">
      <div className="text-indigo-600 font-bold flex items-center gap-1">⚡ call_tool: {toolName}</div>
      <div className="text-slate-500 text-[10px] mt-1">{`{ "command": "npm test" }`}</div>
    </div>
  );
};
