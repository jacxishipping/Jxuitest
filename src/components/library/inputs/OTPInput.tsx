// @jxui/react v3.0.0 — OTPInput (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';

// 13. OTPInput
// 6-digit one-time code input with auto-advance and bidirectional backspace focus
export interface OTPInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete, className = '' }) => {
  const { getRadiusClass } = useJXTheme();
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, idx: number) => {
    const char = val.slice(-1);
    const next = [...otp];
    next[idx] = char;
    setOtp(next);

    if (char && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }

    if (next.every((d) => d !== '')) {
      onComplete?.(next.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className={`w-9 h-11 text-center font-mono text-base font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all ${getRadiusClass(
            'control'
          )}`}
        />
      ))}
    </div>
  );
};
