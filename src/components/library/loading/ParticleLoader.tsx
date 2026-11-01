// @jxui/react v3.0.0 — ParticleLoader (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Loader2, Check, Sparkles, UploadCloud } from 'lucide-react';

// 4. ParticleLoader
export const ParticleLoader: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
      <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.15s]" />
      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]" />
    </div>
  );
};
