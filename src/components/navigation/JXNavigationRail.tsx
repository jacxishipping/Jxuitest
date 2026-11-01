// @jxui/react v3.0.0 — JXNavigationRail (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Compass, Layers, Terminal, Settings } from 'lucide-react';

export interface JXNavigationRailItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  description?: string;
}

export interface JXNavigationRailProps {
  items?: JXNavigationRailItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  className?: string;
}

const DEFAULT_RAIL_ITEMS: JXNavigationRailItem[] = [
  {
    id: 'explore',
    label: 'Explore',
    icon: <Compass className="h-4 w-4" />,
    description: 'Browse curated component templates and interactive themes.',
  },
  {
    id: 'layers',
    label: 'Tokens',
    icon: <Layers className="h-4 w-4" />,
    badge: 12,
    description: 'Inspect CSS variable layers, elevation shadows, and radii.',
  },
  {
    id: 'logs',
    label: 'Logs',
    icon: <Terminal className="h-4 w-4" />,
    description: 'Real-time event stream and keyboard accessibility audit logs.',
  },
  {
    id: 'settings',
    label: 'Config',
    icon: <Settings className="h-4 w-4" />,
    description: 'Manage global JXThemeProvider defaults and RTL layout.',
  },
];

export const JXNavigationRail: React.FC<JXNavigationRailProps> = ({
  items = DEFAULT_RAIL_ITEMS,
  value: controlledValue,
  defaultValue = 'explore',
  onChange,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeId = controlledValue !== undefined ? controlledValue : internalValue;

  const handleSelect = (id: string) => {
    if (controlledValue === undefined) setInternalValue(id);
    onChange?.(id);
  };

  const activeItem = items.find((item) => item.id === activeId) || items[0];

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 p-2.5 ${className}`}
    >
      <nav
        aria-label="Vertical Navigation Rail"
        className="flex flex-col items-center gap-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 p-1.5 shadow-xs"
      >
        {items.map((r) => {
          const isActive = activeId === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => handleSelect(r.id)}
              title={r.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {r.icon}
              <span className="text-[9px] font-semibold">{r.label}</span>
              {r.badge !== undefined && (
                <span
                  className={`absolute -top-1 -right-1 rounded-full px-1 text-[8px] font-bold ${
                    isActive
                      ? 'bg-white text-indigo-600'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {r.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="flex-1 text-xs text-slate-600 dark:text-slate-300 space-y-1">
        <div className="font-semibold text-slate-900 dark:text-white capitalize">
          Active Rail: {activeItem?.label}
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          {activeItem?.description ||
            'Compact vertical rail with active pill background, micro-label, and spring hover transition.'}
        </p>
      </div>
    </div>
  );
};
