// @jxui/react v3.0.0 — AIThinkingIndicator (JXUI v3.0 Unified Component Suite)
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

// 4. AIThinkingIndicator
export const AIThinkingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-2 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs text-indigo-700 dark:text-indigo-300">
      <Sparkles className="w-3.5 h-3.5 animate-spin" />
      <span>Reasoning across codebase...</span>
    </div>
  );
};
