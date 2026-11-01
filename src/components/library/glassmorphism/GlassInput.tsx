// @jxui/react v3.0.0 — GlassInput (JXUI v3.0 Unified Component Suite)
import React from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';

// 14. GlassInput
export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  children?: React.ReactNode;
}

export const GlassInput: React.FC<GlassInputProps> = ({ label, className = '', children, ...props }) => {
  const { getRadiusClass } = useJXTheme();
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</label>}
      <input
        className={`px-3 py-2 text-sm text-slate-900 dark:text-white bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg border border-slate-300/60 dark:border-slate-700/60 placeholder-slate-400 focus:outline-none focus:border-indigo-500 ${getRadiusClass('control')} transition-all ${className}`}
        {...props}
      />
    </div>
  );
};
