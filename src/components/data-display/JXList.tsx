// @jxui/react v3.0.0 — JXList (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FileCode,
  Pin,
  Archive,
  Trash2,
} from 'lucide-react';

export interface JXListNestedItem {
  id: string;
  label: string;
  subtitle?: string;
}

export interface JXListProps {
  folderTitle?: string;
  items?: JXListNestedItem[];
  defaultOpen?: boolean;
  defaultPinnedId?: string | null;
  onPinToggle?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const DEFAULT_FILES: JXListNestedItem[] = [
  { id: 'tokens.json', label: 'tokens.json' },
  { id: 'elevation.css', label: 'elevation.css' },
  { id: 'motion-spring.ts', label: 'motion-spring.ts' },
];

export const JXList: React.FC<JXListProps> = ({
  folderTitle = 'packages/jxui-theme',
  items = DEFAULT_FILES,
  defaultOpen = true,
  defaultPinnedId = 'tokens.json',
  onPinToggle,
  onArchive,
  onDelete,
  className = '',
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [pinnedId, setPinnedId] = useState<string | null>(defaultPinnedId);

  return (
    <div className={`space-y-1 ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-xs font-semibold transition-colors"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          )}
          <Folder className="w-4 h-4 text-indigo-500" />
          <span>{folderTitle}</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {items.length} files
        </span>
      </button>

      {open && (
        <div
          role="list"
          className="ml-5 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-1"
        >
          {items.map((item) => {
            const isPinned = pinnedId === item.id;
            return (
              <div
                key={item.id}
                role="listitem"
                className="group flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-xs transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono truncate">{item.label}</span>
                  {isPinned && (
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 shrink-0">
                      · Pinned
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const next = isPinned ? null : item.id;
                      setPinnedId(next);
                      onPinToggle?.(item.id);
                    }}
                    aria-label={`Pin ${item.label}`}
                    className="p-1 rounded hover:bg-white dark:hover:bg-slate-700"
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onArchive?.(item.id)}
                    aria-label={`Archive ${item.label}`}
                    className="p-1 rounded hover:bg-white dark:hover:bg-slate-700"
                  >
                    <Archive className="w-3 h-3" />
                  </button>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      aria-label={`Delete ${item.label}`}
                      className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
