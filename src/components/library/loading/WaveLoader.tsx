// @jxui/react v3.0.0 — WaveLoader (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Loader2, Check, Sparkles, UploadCloud } from 'lucide-react';

// 5. WaveLoader
export const WaveLoader: React.FC = () => {
  return (
    <div className="flex items-end gap-1 h-6">
      <div className="w-1.5 h-3 bg-indigo-600 rounded-full animate-pulse" />
      <div className="w-1.5 h-6 bg-indigo-600 rounded-full animate-pulse [animation-delay:0.2s]" />
      <div className="w-1.5 h-4 bg-indigo-600 rounded-full animate-pulse [animation-delay:0.4s]" />
    </div>
  );
};
