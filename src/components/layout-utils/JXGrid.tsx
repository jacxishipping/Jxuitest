// @jxui/react v3.0.0 — JXGrid (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';

export interface JXGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  rowSpan?: 1 | 2 | 3 | 4;
}

const COL_SPAN_MAP: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
};

const ROW_SPAN_MAP: Record<number, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
  4: 'row-span-4',
};

export const JXGridItem: React.FC<JXGridItemProps> = ({
  colSpan = 4,
  rowSpan = 1,
  className = '',
  children,
  ...rest
}) => {
  return (
    <div
      className={`${COL_SPAN_MAP[colSpan] || 'col-span-4'} ${ROW_SPAN_MAP[rowSpan] || 'row-span-1'} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export interface JXGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 12 | 6 | 4;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  bentoPreset?: boolean;
}

export const JXGrid: React.FC<JXGridProps> = ({
  columns = 12,
  gap = 'sm',
  bentoPreset = false,
  className = '',
  children,
  ...rest
}) => {
  const [swapped, setSwapped] = useState(false);

  const gapClasses = {
    xs: 'gap-1.5',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const colClasses = {
    12: 'grid-cols-12',
    6: 'grid-cols-6',
    4: 'grid-cols-4',
  };

  if (bentoPreset) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">12-Column Asymmetric Bento Grid</span>
          <button
            type="button"
            onClick={() => setSwapped((prev) => !prev)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Flip Spans
          </button>
        </div>
        <div className={`grid grid-cols-12 ${gapClasses[gap]} text-center text-[11px] font-mono font-semibold`} {...rest}>
          <JXGridItem
            colSpan={swapped ? 4 : 8}
            className="rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/70 dark:border-indigo-800/60 p-3 text-indigo-700 dark:text-indigo-300 transition-all"
          >
            col-span-{swapped ? 4 : 8} (Hero Tile)
          </JXGridItem>
          <JXGridItem
            colSpan={swapped ? 8 : 4}
            className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/60 p-3 text-emerald-700 dark:text-emerald-300 transition-all"
          >
            col-span-{swapped ? 8 : 4}
          </JXGridItem>
          <JXGridItem
            colSpan={4}
            className="rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-slate-700 dark:text-slate-300"
          >
            col-span-4
          </JXGridItem>
          <JXGridItem
            colSpan={4}
            className="rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-slate-700 dark:text-slate-300"
          >
            col-span-4
          </JXGridItem>
          <JXGridItem
            colSpan={4}
            className="rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/70 dark:border-amber-800/60 p-3 text-amber-700 dark:text-amber-300"
          >
            col-span-4
          </JXGridItem>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid ${colClasses[columns]} ${gapClasses[gap]} ${className}`} {...rest}>
      {children}
    </div>
  );
};
