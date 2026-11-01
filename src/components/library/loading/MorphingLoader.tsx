// @jxui/react v3.0.0 — MorphingLoader (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Loader2, Check, Sparkles, UploadCloud } from 'lucide-react';

// 2. MorphingLoader
export const MorphingLoader: React.FC = () => {
  return (
    <div className="w-6 h-6 bg-indigo-600 rounded-sm animate-spin" />
  );
};
