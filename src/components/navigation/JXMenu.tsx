// @jxui/react v3.0.0 — JXMenu (JXUI v3.0 Unified Component Suite)
import React from 'react';
import { Copy, Share2, Trash2 } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXMenuItemProps {
  icon?: React.ReactNode;
  shortcut?: string;
  destructive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const JXMenuItem: React.FC<JXMenuItemProps> = ({
  icon,
  shortcut,
  destructive = false,
  onClick,
  children,
}) => (
  <button
    type="button"
    role="menuitem"
    onClick={onClick}
    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
      destructive
        ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    <span className="inline-flex items-center gap-2">
      {icon}
      <span>{children}</span>
    </span>
    {shortcut && (
      <kbd className="font-mono text-[10px] opacity-75">{shortcut}</kbd>
    )}
  </button>
);

export interface JXMenuProps {
  children?: React.ReactNode;
  className?: string;
}

export const JXMenu: React.FC<JXMenuProps> = ({ children, className = '' }) => {
  const { pushToast } = useJXTheme();
  return (
    <div
      role="menu"
      className={`w-full max-w-xs p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 jx-elevation-2 text-xs space-y-0.5 ${className}`}
    >
      {children || (
        <>
          <JXMenuItem
            icon={<Copy className="w-3.5 h-3.5 text-slate-400" />}
            shortcut="⌘D"
            onClick={() => pushToast({ title: 'Duplicated node', variant: 'default' })}
          >
            Duplicate Instance
          </JXMenuItem>
          <JXMenuItem
            icon={<Share2 className="w-3.5 h-3.5 text-slate-400" />}
            shortcut="⇧⌘C"
            onClick={() => pushToast({ title: 'Shared permalink', variant: 'success' })}
          >
            Copy Share Link
          </JXMenuItem>
          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
          <JXMenuItem
            destructive
            icon={<Trash2 className="w-3.5 h-3.5" />}
            shortcut="⌘⌫"
            onClick={() => pushToast({ title: 'Removed instance', variant: 'error' })}
          >
            Delete Resource
          </JXMenuItem>
        </>
      )}
    </div>
  );
};
