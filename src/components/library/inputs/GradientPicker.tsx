// @jxui/react v3.0.0 — GradientPicker (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Palette, Copy, Check } from 'lucide-react';

export const GradientPicker: React.FC = () => {
  const { getRadiusClass, pushToast } = useJXTheme();
  const [fromColor, setFromColor] = useState('#6366f1');
  const [toColor, setToColor] = useState('#ec4899');
  const [copied, setCopied] = useState(false);

  const presets = [
    { from: '#6366f1', to: '#ec4899' },
    { from: '#3b82f6', to: '#10b981' },
    { from: '#f59e0b', to: '#ef4444' },
    { from: '#8b5cf6', to: '#06b6d4' },
  ];

  const gradientStyle = `linear-gradient(135deg, ${fromColor}, ${toColor})`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(`background: ${gradientStyle};`);
    setCopied(true);
    pushToast({
      title: 'Copied Gradient CSS',
      description: `background: ${gradientStyle}`,
      variant: 'success',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* Live Gradient Preview Bar */}
      <div
        className="w-full h-8 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-end px-2"
        style={{ background: gradientStyle }}
      >
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 rounded bg-black/40 text-white hover:bg-black/60 transition-colors text-[10px] flex items-center gap-1 cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>CSS</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        {/* Color Pickers */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="color"
              value={fromColor}
              onChange={(e) => setFromColor(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 p-0"
            />
            <span className="text-[11px] text-slate-500">{fromColor}</span>
          </label>
          <span className="text-slate-400">→</span>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="color"
              value={toColor}
              onChange={(e) => setToColor(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 p-0"
            />
            <span className="text-[11px] text-slate-500">{toColor}</span>
          </label>
        </div>

        {/* Preset Chips */}
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setFromColor(p.from);
                setToColor(p.to);
              }}
              style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
              className="w-4 h-4 rounded-full border border-white/40 shadow-xs hover:scale-125 transition-transform cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
