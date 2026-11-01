// @jxui/react v3.0.0 — JXTooltip (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXTooltipMetric {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface JXTooltipProps {
  title: string;
  shortcut?: string;
  metrics?: JXTooltipMetric[];
  triggerLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

export const JXTooltip: React.FC<JXTooltipProps> = ({
  title,
  shortcut = '⌘I',
  metrics = [
    { label: 'CPU', value: '34.2%', highlight: true },
    { label: 'MEM', value: '12.4 GB' },
    { label: 'SLA', value: '99.99%' },
  ],
  triggerLabel = 'Hover or Click for Rich Telemetry Card',
  children,
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative inline-flex items-center justify-center py-2 ${className}`}>
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
      >
        {children || (
          <button
            type="button"
            className={`px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${getRadiusClass('control')}`}
          >
            {triggerLabel}
          </button>
        )}
      </div>

      {visible && (
        <div
          role="tooltip"
          className="absolute bottom-14 z-30 w-72 p-3.5 rounded-xl bg-slate-900 text-white jx-elevation-3 text-xs space-y-2 pointer-events-none"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">{title}</span>
            {shortcut && (
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded">
                {shortcut}
              </kbd>
            )}
          </div>
          {metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-slate-800 font-mono text-[11px]">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="text-slate-400">{m.label}</div>
                  <div
                    className={`font-bold tabular-nums ${
                      m.highlight ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const JXHtmlTooltip = JXTooltip;
