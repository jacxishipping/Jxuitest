// @jxui/react v3.0.0 — JXSwitch (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  helperText?: string;
  cardMode?: boolean;
  trackIcons?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const JXSwitch: React.FC<JXSwitchProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  label,
  helperText,
  cardMode = true,
  trackIcons = true,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isOn = isControlled ? checked! : internalChecked;

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  const trackDims =
    size === 'sm' ? 'w-9 h-5' : size === 'lg' ? 'w-12 h-7' : 'w-11 h-6';
  const thumbDims =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const translateOn =
    size === 'sm'
      ? 'translate-x-4'
      : size === 'lg'
      ? 'translate-x-5'
      : 'translate-x-5';

  const switchPill = (
    <div
      className={`relative ${trackDims} rounded-full p-0.5 transition-colors flex items-center shrink-0 ${
        isOn ? palette.bg : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      {trackIcons && (
        <>
          <Check
            className={`absolute left-1.5 w-2.5 h-2.5 text-white transition-opacity ${
              isOn ? 'opacity-90' : 'opacity-0'
            }`}
          />
          <X
            className={`absolute right-1.5 w-2.5 h-2.5 text-slate-600 dark:text-slate-300 transition-opacity ${
              isOn ? 'opacity-0' : 'opacity-80'
            }`}
          />
        </>
      )}
      <div
        className={`relative z-10 ${thumbDims} rounded-full bg-white shadow-xs transition-transform jx-spring ${
          isOn ? translateOn : 'translate-x-0'
        }`}
      />
    </div>
  );

  if (cardMode) {
    return (
      <div
        role="switch"
        aria-checked={isOn}
        aria-label={label}
        tabIndex={disabled ? -1 : 0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        className={`p-3 border flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${getRadiusClass('control')} ${
          isOn
            ? 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40'
            : 'border-slate-200/70 dark:border-slate-800 hover:bg-slate-50/40 dark:hover:bg-slate-800/20'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
      >
        <div>
          {label && (
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {label}
            </div>
          )}
          {helperText && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {helperText}
            </div>
          )}
        </div>
        {switchPill}
      </div>
    );
  }

  return (
    <div
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      {switchPill}
      {label && (
        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
          {label}
        </span>
      )}
    </div>
  );
};
