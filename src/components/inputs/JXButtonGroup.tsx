// @jxui/react v3.0.0 — JXButtonGroup (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXButtonGroupItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface JXSplitActionItem {
  id: string;
  label: string;
  onClick?: () => void;
}

export interface JXButtonGroupProps {
  items: JXButtonGroupItem[];
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  variant?: 'segmented' | 'outlined' | 'contained';
  size?: 'sm' | 'md' | 'lg';
  splitActionLabel?: string;
  onSplitPrimaryClick?: (activeId: string) => void;
  splitMenuItems?: JXSplitActionItem[];
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export const JXButtonGroup: React.FC<JXButtonGroupProps> = ({
  items,
  activeId,
  defaultActiveId,
  onChange,
  variant = 'segmented',
  size = 'md',
  splitActionLabel,
  onSplitPrimaryClick,
  splitMenuItems,
  disabled = false,
  ariaLabel = 'Segmented action group',
  className = '',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const isControlled = activeId !== undefined;
  const [internalId, setInternalId] = useState(defaultActiveId || items[0]?.id || '');
  const currentId = isControlled ? activeId! : internalId;

  const [menuOpen, setMenuOpen] = useState(false);
  const splitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (splitRef.current && !splitRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelect = (id: string) => {
    if (disabled) return;
    if (!isControlled) setInternalId(id);
    onChange?.(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = items[(idx + 1) % items.length];
      if (next && !next.disabled) handleSelect(next.id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = items[(idx - 1 + items.length) % items.length];
      if (prev && !prev.disabled) handleSelect(prev.id);
    }
  };

  const padClass =
    size === 'sm'
      ? 'px-2.5 py-1 text-xs'
      : size === 'lg'
      ? 'px-4 py-2 text-sm'
      : 'px-3.5 py-1.5 text-xs';

  return (
    <div className={`inline-flex flex-wrap items-center gap-3 ${className}`}>
      <div
        role="group"
        aria-label={ariaLabel}
        className={`inline-flex p-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 ${getRadiusClass('control')} ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {items.map((item, idx) => {
          const isActive = item.id === currentId;
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled || disabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(item.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`inline-flex items-center gap-1.5 font-semibold capitalize transition-all jx-spring whitespace-nowrap shrink-0 ${padClass} ${getRadiusClass('control')} ${
                isActive
                  ? variant === 'contained'
                    ? `${palette.bg} text-white jx-elevation-1`
                    : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white jx-elevation-1'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {splitActionLabel && (
        <div ref={splitRef} className="relative inline-flex">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSplitPrimaryClick?.(currentId)}
            className={`px-3.5 py-2 text-xs font-semibold text-white ${palette.bg} rounded-l-lg hover:opacity-95 transition-opacity whitespace-nowrap shrink-0`}
          >
            {splitActionLabel}
          </button>
          {splitMenuItems && splitMenuItems.length > 0 && (
            <>
              <button
                type="button"
                disabled={disabled}
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Open split button actions"
                aria-expanded={menuOpen}
                className={`px-2 py-2 text-white ${palette.bg} border-l border-white/20 rounded-r-lg hover:opacity-95`}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-10 z-20 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl jx-elevation-2 p-1 text-xs"
                >
                  {splitMenuItems.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        action.onClick?.();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
