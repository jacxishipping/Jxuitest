// @jxui/react v3.0.0 — AnimatedGradient (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles, Eye, Zap } from 'lucide-react';

// 10. AnimatedGradient
export const AnimatedGradient: React.FC = () => {
  return (
    <div className="w-full h-10 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x" />
  );
};
