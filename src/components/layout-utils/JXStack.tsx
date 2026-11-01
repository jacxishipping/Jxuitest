// @jxui/react v3.0.0 — JXStack (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';

export interface JXStackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col';
  defaultDirection?: 'row' | 'col';
  onDirectionChange?: (direction: 'row' | 'col') => void;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  divider?: boolean;
  interactiveControls?: boolean;
  items?: React.ReactNode[];
}

export const JXStack: React.FC<JXStackProps> = ({
  direction: controlledDir,
  defaultDirection = 'row',
  onDirectionChange,
  spacing = 'sm',
  divider = true,
  interactiveControls = false,
  items,
  className = '',
  children,
  ...rest
}) => {
  const [internalDir, setInternalDir] = useState<'row' | 'col'>(defaultDirection);
  const dir = controlledDir !== undefined ? controlledDir : internalDir;

  const handleSetDir = (next: 'row' | 'col') => {
    if (controlledDir === undefined) setInternalDir(next);
    onDirectionChange?.(next);
  };

  const spacingClasses = {
    xs: 'gap-1.5',
    sm: 'gap-2.5',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const childArray = items ?? React.Children.toArray(children);

  return (
    <div className={`space-y-3 ${className}`} {...rest}>
      {interactiveControls && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Flex Direction & Auto-Dividers:</span>
          <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleSetDir('row')}
              className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
                dir === 'row'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Row
            </button>
            <button
              type="button"
              onClick={() => handleSetDir('col')}
              className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
                dir === 'col'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Column
            </button>
          </div>
        </div>
      )}

      <div
        className={`flex ${
          dir === 'row' ? 'flex-row items-center' : 'flex-col'
        } ${spacingClasses[spacing]} rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 p-3`}
      >
        {childArray.map((item, idx) => (
          <React.Fragment key={idx}>
            <div className="flex-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 px-3 py-2 text-center text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs">
              {item}
            </div>
            {divider && idx < childArray.length - 1 && (
              <div
                aria-hidden="true"
                className={
                  dir === 'row'
                    ? 'h-5 w-px bg-slate-200 dark:bg-slate-700'
                    : 'h-px w-full bg-slate-200 dark:bg-slate-700'
                }
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
