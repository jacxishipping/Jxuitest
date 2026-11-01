// @jxui/react v3.0.0 — FormWizard (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { 
  Search, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  Lock, 
  Terminal, 
  Palette, 
  Sliders, 
  PenTool, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

// 24. FormWizard
export const FormWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>1</span>
        <span className="text-slate-500">Account</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>2</span>
        <span className="text-slate-500">Billing</span>
      </div>
      <button onClick={() => setStep(step === 1 ? 2 : 1)} className="text-xs text-indigo-600 hover:underline text-left">
        {step === 1 ? 'Next: Billing →' : '← Back to Account'}
      </button>
    </div>
  );
};
