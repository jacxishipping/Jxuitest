// @jxui/react v3.0.0 — JXImageList (JXUI v3.0 Unified Component Suite)
import React, { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXImageListItemData {
  id?: string;
  title: string;
  subtitle?: string;
  gradient?: string;
  src?: string;
}

export interface JXImageListProps {
  items: JXImageListItemData[];
  cols?: 2 | 3 | 4;
  lightbox?: boolean;
  className?: string;
}

export const JXImageList: React.FC<JXImageListProps> = ({
  items,
  cols = 3,
  lightbox = true,
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const [activeLightbox, setActiveLightbox] = useState<JXImageListItemData | null>(null);

  useEffect(() => {
    if (!activeLightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLightbox(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeLightbox]);

  const gridCols =
    cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3';

  return (
    <>
      <div className={`grid ${gridCols} gap-3 ${className}`}>
        {items.map((card) => (
          <button
            key={card.id || card.title}
            type="button"
            onClick={() => lightbox && setActiveLightbox(card)}
            className={`group relative h-28 p-3 text-left border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br ${
              card.gradient || 'from-indigo-500/20 via-violet-500/20 to-sky-500/20'
            } overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02] ${getRadiusClass('control')}`}
          >
            <div className="flex justify-end">
              {lightbox && (
                <Maximize2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 opacity-70 group-hover:opacity-100" />
              )}
            </div>
            <div className="p-2 rounded-lg bg-white/85 dark:bg-slate-900/85 backdrop-blur-md">
              <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                {card.title}
              </div>
              {card.subtitle && (
                <div className="text-[10px] font-mono text-slate-500 truncate">
                  {card.subtitle}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {activeLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeLightbox.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4"
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className="max-w-md w-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 jx-elevation-3 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                {activeLightbox.title}
              </h4>
              <button
                type="button"
                onClick={() => setActiveLightbox(null)}
                aria-label="Close lightbox"
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div
              className={`h-40 rounded-xl bg-gradient-to-br ${
                activeLightbox.gradient ||
                'from-indigo-500/20 via-violet-500/20 to-sky-500/20'
              } flex items-center justify-center font-mono text-xs text-slate-700 dark:text-slate-200`}
            >
              {activeLightbox.subtitle}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
