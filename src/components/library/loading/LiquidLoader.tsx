// @jxui/react v3.0.0 — LiquidLoader (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Loader2, Check, Sparkles, UploadCloud } from 'lucide-react';

// 1. LiquidLoader
export const LiquidLoader: React.FC = () => {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 animate-spin-slow blur-xs shadow-md" />
  );
};
