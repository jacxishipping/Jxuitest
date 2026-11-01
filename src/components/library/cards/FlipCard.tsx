// @jxui/react v3.0.0 — FlipCard (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { KeyRound, RotateCw, ShieldCheck } from 'lucide-react';

// 7. FlipCard
// 3D perspective flip between front presentation surface and back security credentials
export interface FlipCardProps {
  frontTitle?: string;
  frontSubtitle?: string;
  backKey?: string;
  className?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  frontTitle = 'FIDO2 Hardware Key',
  frontSubtitle = 'Click card to flip and verify encrypted enclave key credentials.',
  backKey = 'jx_sec_live_94f8a32d1e0c',
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped((f) => !f)}
      className={`inline-block w-full cursor-pointer select-none ${className}`}
    >
      <div
        style={{
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className={`relative min-h-[140px] w-full ${getRadiusClass('card')}`}
      >
        {/* Front Face */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className={`absolute inset-0 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between ${getRadiusClass(
            'card'
          )}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Front Credential</span>
            </span>
            <RotateCw className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{frontTitle}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{frontSubtitle}</p>
          </div>
          <span className="text-[10px] font-mono text-indigo-500 font-semibold">Click to flip card →</span>
        </div>

        {/* Back Face */}
        <div
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
          className={`absolute inset-0 p-5 bg-indigo-950 text-white border border-indigo-800 shadow-xl flex flex-col justify-between ${getRadiusClass(
            'card'
          )}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hardware Enclave</span>
            </span>
            <RotateCw className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">API Private Key</span>
            <code className="block px-2.5 py-1.5 rounded bg-indigo-900/80 font-mono text-xs text-emerald-300 overflow-x-auto">
              {backKey}
            </code>
          </div>
          <span className="text-[10px] font-mono text-indigo-300">Click to return to front ←</span>
        </div>
      </div>
    </div>
  );
};
