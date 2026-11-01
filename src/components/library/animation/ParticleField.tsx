// @jxui/react v3.0.0 — ParticleField (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles, Eye, Zap } from 'lucide-react';

// 12. ParticleField
export const ParticleField: React.FC = () => {
  return (
    <div className="relative w-36 h-12 border rounded-lg overflow-hidden flex items-center justify-around">
      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
      <span className="w-1 h-1 bg-violet-400 rounded-full animate-ping [animation-delay:0.2s]" />
      <span className="w-2 h-2 bg-pink-400 rounded-full animate-ping [animation-delay:0.4s]" />
    </div>
  );
};
