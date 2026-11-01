// @jxui/react v3.0.0 — JXDrawer (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXDrawerProps {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  title?: string;
  items?: { code: string; label: string }[];
  className?: string;
}

export const JXDrawer: React.FC<JXDrawerProps> = ({
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  title = 'Inset Sheet',
  items = [
    { code: '01', label: '01. Inputs' },
    { code: '02', label: '02. Data Display' },
  ],
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const isControlled = collapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = isControlled ? collapsed! : internalCollapsed;

  const toggle = () => {
    const next = !isCollapsed;
    if (!isControlled) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`p-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-all duration-200 ${getRadiusClass('control')} ${
          isCollapsed ? 'w-14' : 'w-48'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          {!isCollapsed && (
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {title}
            </span>
          )}
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle mini rail"
            className="p-1 rounded hover:bg-white dark:hover:bg-slate-800"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-3.5 h-3.5" />
            ) : (
              <PanelLeftClose className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <div className="space-y-1 text-xs">
          {items.map((item, idx) => (
            <div
              key={item.code}
              className={`px-2 py-1.5 rounded truncate ${
                idx === 0
                  ? 'bg-white dark:bg-slate-900 font-medium text-slate-900 dark:text-white'
                  : 'text-slate-500'
              }`}
            >
              {isCollapsed ? item.code : item.label}
            </div>
          ))}
        </div>
      </div>
      <span className="text-xs text-slate-500">
        Click icon to toggle Mini-Rail vs. Inset Sheet.
      </span>
    </div>
  );
};
