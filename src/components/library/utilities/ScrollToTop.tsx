// @jxui/react v3.0.0 — ScrollToTop (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { 
  ArrowUp, 
  Maximize2, 
  Play, 
  Volume2, 
  QrCode, 
  Compass, 
  Sliders, 
  Eye 
} from 'lucide-react';

// 4. ScrollToTop
export const ScrollToTop: React.FC = () => {
  return (
    <button className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};
