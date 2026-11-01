// @jxui/react v3.0.0 — JXAccordion (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useJXTheme } from '../../context/JXThemeContext';

export type JXAccordionIconMorph = 'plus-cross' | 'chevron-flip' | 'arrow-compass';
export type JXAccordionVariant = 'bento' | 'contiguous';

export interface JXAccordionItemData {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: string;
  body: string;
  metrics?: { label: string; value: string }[];
}

export interface JXAccordionProps {
  items?: JXAccordionItemData[];
  defaultOpenIds?: string[];
  defaultOpenId?: string | null;
  variant?: JXAccordionVariant;
  iconMode?: JXAccordionIconMorph;
  allowMultiple?: boolean;
  onExpandChange?: (openIds: string[]) => void;
  className?: string;
}

export const DEFAULT_ACCORDION_ITEMS: JXAccordionItemData[] = [
  {
    id: 'acc-1',
    title: 'Zero-Layout-Shift Morphing Architecture',
    subtitle: 'Bounding-box dimension locking across async transitions',
    meta: 'Core Spec',
    badge: 'Stable v3.0',
    body: 'JXButton, JXProgress, and JXAccordion lock their structural bounding geometry and animate expansion via spring physics (stiffness: 380, damping: 32), eliminating cumulative layout shift (CLS).',
    metrics: [
      { label: 'Spring Stiffness', value: '380 N/m' },
      { label: 'Damping Ratio', value: '32 Ns/m' },
    ],
  },
  {
    id: 'acc-2',
    title: 'Separated Bento Card Ergonomics',
    subtitle: 'Independent specular borders & active focus halos',
    meta: 'Elevation v2',
    badge: 'Bento Surface',
    body: 'Unlike legacy Material UI Accordions that glue panels together with harsh 1px dividers and jarring margin jumps on expand, JXAccordion isolates each panel as a tactile Bento card with diffused ambient elevation.',
    metrics: [
      { label: 'Top Highlight', value: 'inset 0 1px rgba(255,255,255,0.8)' },
      { label: 'Shadow Tier', value: 'jx-elevation-2' },
    ],
  },
  {
    id: 'acc-3',
    title: 'Custom SVG Spring Icon Morphing',
    subtitle: 'Expressive state indicators with tactile rotation physics',
    meta: 'Micro-Physics',
    badge: '60fps SVG',
    body: 'Supports three distinct SVG morphing presets: Plus-to-Cross (135° spring twist), Chevron Flip (180° spring inversion), and Compass Arrow (45° vector morph) with automatic color token transitions.',
  },
];

const MorphingAccordionIcon: React.FC<{
  isOpen: boolean;
  mode: JXAccordionIconMorph;
}> = ({ isOpen, mode }) => {
  if (mode === 'plus-cross') {
    return (
      <motion.span
        animate={{
          rotate: isOpen ? 135 : 0,
          scale: isOpen ? 1.06 : 1,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
        className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
          isOpen
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
            : 'bg-slate-100 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400'
        }`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 2.25V9.75M2.25 6H9.75"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </motion.span>
    );
  }

  if (mode === 'arrow-compass') {
    return (
      <motion.span
        animate={{
          rotate: isOpen ? 90 : 0,
          scale: isOpen ? 1.06 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 26 }}
        className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
          isOpen
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
            : 'bg-slate-100 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400'
        }`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
    );
  }

  // 'chevron-flip'
  return (
    <motion.span
      animate={{
        rotate: isOpen ? 180 : 0,
      }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
        isOpen
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
          : 'bg-slate-100 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400'
      }`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2.75 4.5L6 7.75L9.25 4.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.span>
  );
};

export const JXAccordion: React.FC<JXAccordionProps> = ({
  items = DEFAULT_ACCORDION_ITEMS,
  defaultOpenIds,
  defaultOpenId = 'acc-1',
  variant = 'bento',
  iconMode = 'plus-cross',
  allowMultiple = false,
  onExpandChange,
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const initialIds =
    defaultOpenIds !== undefined
      ? defaultOpenIds
      : defaultOpenId
      ? [defaultOpenId]
      : [];

  const [openIds, setOpenIds] = useState<string[]>(initialIds);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const exists = prev.includes(id);
      const next = allowMultiple
        ? exists
          ? prev.filter((i) => i !== id)
          : [...prev, id]
        : exists
        ? []
        : [id];
      onExpandChange?.(next);
      return next;
    });
  };

  const isBento = variant === 'bento';

  return (
    <div
      className={
        isBento
          ? `space-y-3 ${className}`
          : `divide-y divide-slate-200/80 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden ${getRadiusClass('card')} ${className}`
      }
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const panelId = `jx-accordion-panel-${item.id}`;
        const triggerId = `jx-accordion-trigger-${item.id}`;

        return (
          <motion.div
            key={item.id}
            layout
            transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }}
            className={
              isBento
                ? `border transition-colors overflow-hidden ${getRadiusClass('control')} ${
                    isOpen
                      ? 'border-indigo-500/40 dark:border-indigo-400/40 bg-white dark:bg-slate-900 jx-elevation-2 ring-3 ring-indigo-500/10'
                      : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700 jx-elevation-1'
                  }`
                : `transition-colors ${
                    isOpen
                      ? 'bg-indigo-50/20 dark:bg-indigo-950/20'
                      : 'bg-white dark:bg-slate-900'
                  }`
            }
          >
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleItem(item.id)}
              className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold ${
                        isOpen
                          ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60'
                          : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {item.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {item.meta && (
                  <span className="hidden sm:inline-block font-mono text-[11px] text-slate-400 dark:text-slate-500">
                    {item.meta}
                  </span>
                )}
                <MorphingAccordionIcon isOpen={isOpen} mode={iconMode} />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 },
                    opacity: { duration: 0.18 },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/60 space-y-3">
                    <p>{item.body}</p>
                    {item.metrics && item.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {item.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 px-2.5 py-1.5 flex items-center justify-between text-[11px]"
                          >
                            <span className="text-slate-500 dark:text-slate-400">
                              {m.label}
                            </span>
                            <span className="font-mono font-semibold text-slate-900 dark:text-white">
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
