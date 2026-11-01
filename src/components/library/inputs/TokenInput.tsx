// @jxui/react v3.0.0 — TokenInput (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, RefreshCw } from 'lucide-react';
import { useJXTheme } from '../../../context/JXThemeContext';

export interface TokenInputProps {
  initialToken?: string;
  onRegenerate?: () => void;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  initialToken = 'jx_sec_live_94f8b2c149e8a71b',
  onRegenerate,
}) => {
  const { palette, getRadiusClass, pushToast } = useJXTheme();
  const [token, setToken] = useState(initialToken);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(token);
    setCopied(true);
    pushToast({
      title: 'Secret Token Copied',
      description: 'API key copied safely to clipboard',
      variant: 'success',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegen = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const nextToken = `jx_sec_live_${randomSuffix}`;
    setToken(nextToken);
    onRegenerate?.();
    pushToast({
      title: 'Generated New Token',
      description: 'New ephemeral secret credentials generated',
      variant: 'default',
    });
  };

  const maskedString = token.slice(0, 12) + '•'.repeat(Math.max(4, token.length - 16)) + token.slice(-4);

  return (
    <div className={`flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 ${getRadiusClass('control')} text-xs font-mono`}>
      <span className="text-slate-800 dark:text-slate-200 select-all truncate">
        {revealed ? token : maskedString}
      </span>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setRevealed(!revealed)}
          aria-label={revealed ? 'Hide secret token' : 'Reveal secret token'}
          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy token"
          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <button
          type="button"
          onClick={handleRegen}
          aria-label="Regenerate token"
          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
