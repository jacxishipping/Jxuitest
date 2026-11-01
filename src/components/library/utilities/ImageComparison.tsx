// @jxui/react v3.0.0 — ImageComparison (JXUI v3.0 Unified Component Suite)
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

// 6. ImageComparison
export const ImageComparison: React.FC = () => {
  const [slider, setSlider] = useState(50);
  return (
    <div className="w-44 h-20 border rounded-xl overflow-hidden relative select-none">
      <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-950 flex items-center justify-start pl-2 text-[10px] font-bold">MUI</div>
      <div
        style={{ width: `${slider}%` }}
        className="absolute inset-y-0 left-0 bg-indigo-600 text-white overflow-hidden flex items-center justify-start pl-2 text-[10px] font-bold"
      >
        JXUI
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={slider}
        onChange={(e) => setSlider(Number(e.target.value))}
        className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
      />
    </div>
  );
};
