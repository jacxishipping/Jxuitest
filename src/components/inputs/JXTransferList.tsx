// @jxui/react v3.0.0 — JXTransferList (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';

export interface JXTransferListProps {
  leftItems?: string[];
  rightItems?: string[];
  defaultLeftItems?: string[];
  defaultRightItems?: string[];
  onChange?: (left: string[], right: string[]) => void;
  leftTitle?: string;
  rightTitle?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

export const JXTransferList: React.FC<JXTransferListProps> = ({
  leftItems,
  rightItems,
  defaultLeftItems = ['read:metrics', 'write:webhooks', 'admin:billing'],
  defaultRightItems = ['read:clusters', 'write:deployments', 'read:audit_log'],
  onChange,
  leftTitle = 'Available',
  rightTitle = 'Granted',
  searchable = true,
  disabled = false,
  className = '',
}) => {
  const isControlled = leftItems !== undefined && rightItems !== undefined;
  const [internalLeft, setInternalLeft] = useState(defaultLeftItems);
  const [internalRight, setInternalRight] = useState(defaultRightItems);

  const left = isControlled ? leftItems! : internalLeft;
  const right = isControlled ? rightItems! : internalRight;

  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');

  const commit = (nextLeft: string[], nextRight: string[]) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalLeft(nextLeft);
      setInternalRight(nextRight);
    }
    onChange?.(nextLeft, nextRight);
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-11 gap-2 items-center ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      {/* Left Pane */}
      <div className="sm:col-span-5 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
          <span>
            {leftTitle} ({left.length})
          </span>
          <span className="text-[10px] text-slate-400">Click to move</span>
        </div>
        {searchable && (
          <input
            type="text"
            value={leftSearch}
            onChange={(e) => setLeftSearch(e.target.value)}
            placeholder="Filter..."
            aria-label="Filter available scopes"
            className="w-full px-2 py-1 text-[11px] mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
          />
        )}
        <div className="space-y-1 min-h-[96px]">
          {left
            .filter((i) => i.toLowerCase().includes(leftSearch.toLowerCase()))
            .map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  commit(
                    left.filter((x) => x !== item),
                    [...right, item]
                  )
                }
                className="w-full text-left px-2 py-1 text-xs font-mono rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
              >
                <span className="truncate">{item}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
            ))}
        </div>
      </div>

      {/* Shuttle Action Bar */}
      <div className="sm:col-span-1 flex sm:flex-col items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => commit([], [...right, ...left])}
          aria-label="Move all right"
          className="p-1.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => commit([...left, ...right], [])}
          aria-label="Move all left"
          className="p-1.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Pane */}
      <div className="sm:col-span-5 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
          <span>
            {rightTitle} ({right.length})
          </span>
        </div>
        {searchable && (
          <input
            type="text"
            value={rightSearch}
            onChange={(e) => setRightSearch(e.target.value)}
            placeholder="Filter..."
            aria-label="Filter granted scopes"
            className="w-full px-2 py-1 text-[11px] mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
          />
        )}
        <div className="space-y-1 min-h-[96px]">
          {right
            .filter((i) => i.toLowerCase().includes(rightSearch.toLowerCase()))
            .map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  commit(
                    [...left, item],
                    right.filter((x) => x !== item)
                  )
                }
                className="w-full text-left px-2 py-1 text-xs font-mono rounded bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between"
              >
                <span className="truncate">{item}</span>
                <X className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
