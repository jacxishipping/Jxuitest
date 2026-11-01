// @jxui/react v3.0.0 — DualRangeSlider (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';

export interface DualRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultMin?: number;
  defaultMax?: number;
  onChange?: (values: { min: number; max: number }) => void;
}

export const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  defaultMin = 20,
  defaultMax = 80,
  onChange,
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [minVal, setMinVal] = useState(defaultMin);
  const [maxVal, setMaxVal] = useState(defaultMax);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - step);
    setMinVal(value);
    onChange?.({ min: value, max: maxVal });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + step);
    setMaxVal(value);
    onChange?.({ min: minVal, max: value });
  };

  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className="w-full flex flex-col gap-2 py-1 select-none">
      <div className="flex items-center justify-between text-xs font-mono font-medium">
        <span className="text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
          {minVal}px
        </span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Range Span</span>
        <span className="text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
          {maxVal}px
        </span>
      </div>

      <div className="relative w-full h-6 flex items-center">
        {/* Track Background */}
        <div className="absolute inset-x-0 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
        {/* Highlighted Range Bar */}
        <div
          className={`absolute h-2 ${palette.bg} rounded-full`}
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />

        {/* Lower Slider Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          aria-label="Minimum range slider"
          className="absolute inset-x-0 w-full appearance-none pointer-events-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing"
        />

        {/* Upper Slider Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          aria-label="Maximum range slider"
          className="absolute inset-x-0 w-full appearance-none pointer-events-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing"
        />
      </div>
    </div>
  );
};
