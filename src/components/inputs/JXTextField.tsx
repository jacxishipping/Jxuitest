// @jxui/react v3.0.0 — JXTextField (JXUI v3.0 Unified Component Suite)
import React, { useState, useId } from 'react';
import { Eye, EyeOff, Copy, X, Check } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';
import { calculatePasswordEntropy } from '../../utils/jxuiLogic';

export interface JXTextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  clearable?: boolean;
  copyable?: boolean;
  showEntropyMeter?: boolean;
  showCharacterCounter?: boolean;
  size?: 'sm' | 'md' | 'lg';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const JXTextField: React.FC<JXTextFieldProps> = ({
  value,
  defaultValue = '',
  onChange,
  label,
  type = 'text',
  placeholder,
  helperText,
  error = false,
  errorMessage,
  clearable = true,
  copyable = false,
  showEntropyMeter = false,
  showCharacterCounter = true,
  maxLength = 64,
  size = 'md',
  disabled = false,
  startIcon,
  endIcon,
  className = '',
  id: providedId,
  ...rest
}) => {
  const { palette, getRadiusClass, pushToast } = useJXTheme();
  const autoId = useId();
  const id = providedId || autoId;

  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState(defaultValue);
  const currentVal = isControlled ? value! : internalVal;

  const [showPass, setShowPass] = useState(false);
  const [copied, setCopied] = useState(false);

  const commit = (v: string) => {
    if (disabled) return;
    if (!isControlled) setInternalVal(v);
    onChange?.(v);
  };

  const isPasswordType = type === 'password';
  const effectiveType = isPasswordType ? (showPass ? 'text' : 'password') : type;
  const entropy = calculatePasswordEntropy(currentVal);

  const padClass =
    size === 'sm' ? 'px-2.5 py-1.5' : size === 'lg' ? 'px-4 py-3' : 'px-3.5 py-2';

  return (
    <div className={`space-y-2.5 ${className}`}>
      {(label || (showCharacterCounter && maxLength)) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label
              htmlFor={id}
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {label}
            </label>
          )}
          {showCharacterCounter && maxLength && (
            <span className="font-mono text-[11px] text-slate-400 tabular-nums">
              {currentVal.length}/{maxLength} chars
            </span>
          )}
        </div>
      )}

      <div
        className={`flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border transition-all ${padClass} ${getRadiusClass('control')} ${
          error
            ? 'border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/20'
            : `border-slate-200 dark:border-slate-800 focus-within:ring-3 ${palette.ring}`
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {startIcon && <span className="text-slate-400 shrink-0">{startIcon}</span>}
        <input
          id={id}
          type={effectiveType}
          value={currentVal}
          maxLength={maxLength}
          disabled={disabled}
          onChange={(e) => commit(e.target.value)}
          placeholder={placeholder}
          className="w-full text-xs font-mono bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          {...rest}
        />
        {clearable && currentVal && (
          <button
            type="button"
            onClick={() => commit('')}
            aria-label="Clear secret input"
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            aria-label={showPass ? 'Hide secret' : 'Show secret'}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {showPass ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
        )}
        {copyable && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(currentVal).catch(() => {});
              setCopied(true);
              pushToast({ title: 'Secret copied to clipboard', variant: 'success' });
              setTimeout(() => setCopied(false), 1500);
            }}
            aria-label="Copy secret"
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
        {endIcon && <span className="text-slate-400 shrink-0">{endIcon}</span>}
      </div>

      {showEntropyMeter && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              Entropy Strength:{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {entropy.label}
              </strong>
            </span>
            <span className="font-mono text-slate-500 tabular-nums">
              {entropy.bits} bits
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${entropy.score}%` }}
              className={`h-full transition-all duration-300 ${entropy.colorClass}`}
            />
          </div>
        </div>
      )}

      {(errorMessage || helperText) && (
        <p
          className={`text-[11px] ${
            error ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {error ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};
