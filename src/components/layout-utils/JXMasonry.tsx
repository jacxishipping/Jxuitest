// @jxui/react v3.0.0 — JXMasonry (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';

export interface JXMasonryItem {
  id: number | string;
  title: string;
  tag: string;
  heightClass?: string;
  accentClass?: string;
  metric?: string;
}

export interface JXMasonryProps {
  items?: JXMasonryItem[];
  categories?: string[];
  defaultCategory?: string;
  columns?: 2 | 3;
  onCategoryChange?: (category: string) => void;
  className?: string;
}

const DEFAULT_MASONRY_ITEMS: JXMasonryItem[] = [
  {
    id: 1,
    title: 'Glass Card Token',
    tag: 'ui',
    heightClass: 'h-20',
    accentClass: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800/60',
    metric: 'blur(16px)',
  },
  {
    id: 2,
    title: 'p99 Edge Metric',
    tag: 'metrics',
    heightClass: 'h-28',
    accentClass: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60',
    metric: '11.4ms',
  },
  {
    id: 3,
    title: 'Spring Physics Curve',
    tag: 'ui',
    heightClass: 'h-24',
    accentClass: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60',
    metric: 'cubic-bezier(0.22,1,0.36,1)',
  },
  {
    id: 4,
    title: 'Throughput Cluster',
    tag: 'metrics',
    heightClass: 'h-20',
    accentClass: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800/60',
    metric: '14.2k req/s',
  },
];

export const JXMasonry: React.FC<JXMasonryProps> = ({
  items = DEFAULT_MASONRY_ITEMS,
  categories = ['all', 'ui', 'metrics'],
  defaultCategory = 'all',
  columns = 2,
  onCategoryChange,
  className = '',
}) => {
  const [filter, setFilter] = useState<string>(defaultCategory);

  const handleFilterChange = (cat: string) => {
    setFilter(cat);
    onCategoryChange?.(cat);
  };

  const filteredItems = items.filter((m) => filter === 'all' || m.tag === filter);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {categories.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleFilterChange(f)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {filteredItems.length} bricks
        </span>
      </div>

      <div className={columns === 3 ? 'columns-3 gap-2.5 space-y-2.5' : 'columns-2 gap-2.5 space-y-2.5'}>
        {filteredItems.map((m) => (
          <div
            key={m.id}
            className={`break-inside-avoid rounded-xl border p-3 ${
              m.heightClass || 'h-24'
            } ${
              m.accentClass ||
              'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            } flex flex-col justify-between transition-all`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                {m.tag}
              </span>
              {m.metric && (
                <span className="text-[10px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  {m.metric}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
              {m.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
