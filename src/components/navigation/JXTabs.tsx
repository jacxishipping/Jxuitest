// @jxui/react v3.0.0 — JXTabs (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';

export interface JXTabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface JXTabProps {
  tab: JXTabItem;
  selected: boolean;
  indicatorVariant?: 'pill' | 'underline';
  onSelect: (id: string) => void;
}

export const JXTab: React.FC<JXTabProps> = ({
  tab,
  selected,
  indicatorVariant = 'pill',
  onSelect,
}) => {
  if (indicatorVariant === 'underline') {
    return (
      <button
        type="button"
        role="tab"
        aria-selected={selected}
        disabled={tab.disabled}
        onClick={() => !tab.disabled && onSelect(tab.id)}
        className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 ${
          selected
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        {tab.icon}
        <span>{tab.label}</span>
        {tab.count !== undefined && (
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
              selected
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            {tab.count}
          </span>
        )}
        {selected && (
          <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      disabled={tab.disabled}
      onClick={() => !tab.disabled && onSelect(tab.id)}
      className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 ${
        selected
          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
      }`}
    >
      {tab.icon}
      <span>{tab.label}</span>
      {tab.count !== undefined && (
        <span
          className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
            selected
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300'
              : 'bg-slate-200/70 dark:bg-slate-700 text-slate-500'
          }`}
        >
          {tab.count}
        </span>
      )}
    </button>
  );
};

export interface JXTabsProps {
  tabs?: JXTabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  indicatorVariant?: 'pill' | 'underline';
  className?: string;
}

const DEFAULT_TABS: JXTabItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    count: 4,
    content: (
      <span>
        Viewing <strong className="text-slate-900 dark:text-white">Overview</strong> panel with smooth layout pill projection and Title Case typography.
      </span>
    ),
  },
  {
    id: 'metrics',
    label: 'Metrics',
    count: 18,
    content: (
      <span>
        Viewing <strong className="text-slate-900 dark:text-white">Metrics</strong> telemetry feed — 99.98% uptime across 18 global edge PoPs.
      </span>
    ),
  },
  {
    id: 'webhooks',
    label: 'Webhooks',
    count: 2,
    content: (
      <span>
        Viewing <strong className="text-slate-900 dark:text-white">Webhooks</strong> endpoints with automatic exponential retry policies enabled.
      </span>
    ),
  },
];

export const JXTabs: React.FC<JXTabsProps> = ({
  tabs = DEFAULT_TABS,
  value: controlledValue,
  defaultValue = 'overview',
  onChange,
  indicatorVariant = 'pill',
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeId = controlledValue !== undefined ? controlledValue : internalValue;

  const handleSelect = (id: string) => {
    if (controlledValue === undefined) setInternalValue(id);
    onChange?.(id);
  };

  const activeTab = tabs.find((t) => t.id === activeId) || tabs[0];

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        role="tablist"
        className={
          indicatorVariant === 'pill'
            ? 'flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1'
            : 'flex border-b border-slate-200 dark:border-slate-700'
        }
      >
        {tabs.map((t) => (
          <JXTab
            key={t.id}
            tab={t}
            selected={activeId === t.id}
            indicatorVariant={indicatorVariant}
            onSelect={handleSelect}
          />
        ))}
      </div>
      <div
        role="tabpanel"
        className="rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 p-3 text-xs text-slate-600 dark:text-slate-300"
      >
        {activeTab?.content ?? (
          <span>
            Viewing <strong className="text-slate-900 dark:text-white">{activeTab?.label}</strong> panel with smooth layout pill projection and Title Case typography.
          </span>
        )}
      </div>
    </div>
  );
};
