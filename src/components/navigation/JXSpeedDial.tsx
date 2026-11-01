// @jxui/react v3.0.0 — JXSpeedDial (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Plus, FileText, Share2, Download } from 'lucide-react';

export interface JXSpeedDialAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  onClick?: () => void;
}

export interface JXSpeedDialProps {
  actions?: JXSpeedDialAction[];
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onActionSelect?: (action: JXSpeedDialAction) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_ACTIONS: JXSpeedDialAction[] = [
  { id: 'doc', label: 'New Spec Doc', icon: <FileText className="h-3.5 w-3.5 text-indigo-600" />, shortcut: '⌘N' },
  { id: 'share', label: 'Share Snapshot', icon: <Share2 className="h-3.5 w-3.5 text-emerald-600" />, shortcut: '⌘S' },
  { id: 'export', label: 'Export JSON Tokens', icon: <Download className="h-3.5 w-3.5 text-amber-600" />, shortcut: '⌘E' },
];

export const JXSpeedDial: React.FC<JXSpeedDialProps> = ({
  actions = DEFAULT_ACTIONS,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  onActionSelect,
  ariaLabel = 'Quick actions speed dial',
  className = '',
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const toggleOpen = () => {
    const next = !isOpen;
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleActionClick = (action: JXSpeedDialAction) => {
    setLastSelected(action.label);
    action.onClick?.();
    onActionSelect?.(action);
  };

  return (
    <div
      className={`relative h-44 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 p-4 flex items-end justify-between overflow-hidden ${className}`}
    >
      <div className="space-y-1">
        <p className="text-xs text-slate-500 max-w-[175px]">
          Always-visible frosted labels beside each staggered action pill.
        </p>
        {lastSelected && (
          <p className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
            Triggered: {lastSelected}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        {isOpen && (
          <div className="flex flex-col items-end gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleActionClick(action)}
                className="flex items-center gap-2 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:border-indigo-400 hover:shadow transition-all cursor-pointer"
              >
                <span>{action.label}</span>
                {action.shortcut && (
                  <kbd className="text-[10px] font-mono text-slate-400">{action.shortcut}</kbd>
                )}
                {action.icon}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-label={ariaLabel}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-500 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
        </button>
      </div>
    </div>
  );
};
