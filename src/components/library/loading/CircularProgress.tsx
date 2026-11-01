// @jxui/react v3.0.0 — CircularProgress (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Loader2, Check, Sparkles, UploadCloud } from 'lucide-react';

// 11. CircularProgress
export const CircularProgress: React.FC = () => {
  return <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />;
};
