// @jxui/react v3.0.0 — GradientLoader (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Loader2, Check, Sparkles, UploadCloud } from 'lucide-react';

// 6. GradientLoader
export const GradientLoader: React.FC = () => {
  return (
    <div className="w-7 h-7 rounded-full border-2 border-transparent border-t-indigo-600 border-r-violet-600 animate-spin" />
  );
};
