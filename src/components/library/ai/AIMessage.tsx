// @jxui/react v3.0.0 — AIMessage (JXUI v3.0 Unified Component Suite)
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

// 2. AIMessage
export const AIMessage: React.FC<{ content?: string }> = ({ content = 'I analyzed the 18 design categories and synthesized all 290 zero-shift components.' }) => {
  return (
    <div className="flex gap-2.5 text-xs">
      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
        <Bot className="w-3.5 h-3.5" />
      </div>
      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200">
        {content}
      </div>
    </div>
  );
};
