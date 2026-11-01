// @jxui/react v3.0.0 — JXTypography (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface JXTypographyProps {
  variant?: 'display' | 'h2' | 'h3' | 'body' | 'caption' | 'code';
  gradient?: boolean;
  balance?: boolean;
  copyableCommand?: string;
  children?: React.ReactNode;
  className?: string;
}

export const JXTypography: React.FC<JXTypographyProps> = ({
  variant = 'display',
  gradient = true,
  balance = true,
  copyableCommand = 'npm install @jxui/react @jxui/icons',
  children,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`text-2xl font-bold tracking-tight ${
          balance ? 'text-balance' : ''
        } ${
          gradient
            ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent'
            : 'text-slate-900 dark:text-white'
        }`}
      >
        {children || 'Fluid Semantic Type Scale with Balanced Wrapping'}
      </div>

      {variant === 'display' && (
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Every heading in JXUI uses fluid{' '}
          <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            clamp()
          </code>{' '}
          sizing and{' '}
          <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            text-wrap: balance
          </code>
          , paired with inline copyable CLI commands:
        </p>
      )}

      {copyableCommand && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs">
          <span>{copyableCommand}</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(copyableCommand).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            aria-label="Copy install command"
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
