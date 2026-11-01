// @jxui/react v3.0.0 — JXBottomNavigation (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Home, Compass, Activity, Settings } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXBottomNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface JXBottomNavigationProps {
  items?: JXBottomNavItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  className?: string;
}

const DEFAULT_DOCK_ITEMS: JXBottomNavItem[] = [
  { id: 'home', label: 'Overview', icon: <Home className="w-3.5 h-3.5" /> },
  { id: 'explore', label: 'Catalog', icon: <Compass className="w-3.5 h-3.5" /> },
  { id: 'metrics', label: 'Telemetry', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'settings', label: 'Tokens', icon: <Settings className="w-3.5 h-3.5" /> },
];

export const JXBottomNavigation: React.FC<JXBottomNavigationProps> = ({
  items = DEFAULT_DOCK_ITEMS,
  value,
  defaultValue = 'home',
  onChange,
  className = '',
}) => {
  const { palette } = useJXTheme();
  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState(defaultValue);
  const currentVal = isControlled ? value! : internalVal;

  return (
    <div className={`flex justify-center py-2 ${className}`}>
      <nav
        aria-label="Bottom Dock Navigation"
        className="inline-flex items-center gap-1 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700 jx-elevation-2"
      >
        {items.map((item) => {
          const active = currentVal === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (!isControlled) setInternalVal(item.id);
                onChange?.(item.id);
              }}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all jx-spring whitespace-nowrap ${
                active
                  ? `${palette.bg} text-white`
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.icon}
              {active && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
