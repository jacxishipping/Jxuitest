// @jxui/react v3.0.0 — OrbitalLoader (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Loader2, Check, Sparkles, UploadCloud } from 'lucide-react';

// 3. OrbitalLoader
export const OrbitalLoader: React.FC = () => {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center animate-spin">
      <div className="absolute top-0 w-2 h-2 rounded-full bg-indigo-600" />
      <div className="absolute bottom-0 w-2 h-2 rounded-full bg-violet-400" />
    </div>
  );
};
