// @jxui/react v3.0.0 — AIAttachmentPreview (JXUI v3.0 Unified Component Suite)
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

// 13. AIAttachmentPreview
export const AIAttachmentPreview: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[11px]">
      <span>architecture.png (142 KB)</span>
    </div>
  );
};
