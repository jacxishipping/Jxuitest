// @jxui/react v3.0.0 — JXTimeline (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { GitCommit, Sparkles, Clock } from 'lucide-react';

export interface JXTimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  status?: 'success' | 'active' | 'neutral';
  icon?: React.ReactNode;
  payload?: string;
}

export interface JXTimelineProps {
  events?: JXTimelineEvent[];
  defaultExpandedPayload?: boolean;
  className?: string;
}

const DEFAULT_EVENTS: JXTimelineEvent[] = [
  {
    id: 'release',
    title: 'v3.0.0 Production Release',
    timestamp: '2m ago',
    status: 'success',
    icon: <GitCommit className="h-3.5 w-3.5 text-emerald-600" />,
  },
  {
    id: 'tokens',
    title: 'Design Token Sync',
    timestamp: '14m ago',
    status: 'active',
    icon: <Sparkles className="h-3.5 w-3.5 text-indigo-600" />,
    payload: `+ "--jx-radius-lg": "16px"\n+ "--jx-shadow-elevation-2": "0 10px 25px -4px rgba(15,23,42,0.06)"`,
  },
  {
    id: 'audit',
    title: 'Automated WCAG AA Audit Passed',
    timestamp: '1h ago',
    status: 'neutral',
    icon: <Clock className="h-3.5 w-3.5 text-slate-500" />,
  },
];

export const JXTimeline: React.FC<JXTimelineProps> = ({
  events = DEFAULT_EVENTS,
  defaultExpandedPayload = true,
  className = '',
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    tokens: defaultExpandedPayload,
  });

  const togglePayload = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className={`relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 ${className}`}
    >
      {events.map((ev) => {
        const isExpanded = !!expandedIds[ev.id];
        const ringColor =
          ev.status === 'success'
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
            : ev.status === 'active'
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
            : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800';

        return (
          <div key={ev.id} className="relative">
            <span
              className={`absolute -left-5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 ${ringColor}`}
            >
              {ev.icon}
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 dark:text-white">{ev.title}</span>
              <div className="flex items-center gap-2">
                {ev.payload && (
                  <button
                    type="button"
                    onClick={() => togglePayload(ev.id)}
                    className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {isExpanded ? 'Hide Diff' : 'Show Diff'}
                  </button>
                )}
                <span className="font-mono text-[10px] text-slate-400">{ev.timestamp}</span>
              </div>
            </div>
            {ev.payload && isExpanded && (
              <pre className="mt-1.5 rounded-lg bg-slate-900 text-slate-200 p-2.5 text-[10px] font-mono overflow-x-auto">
                {ev.payload}
              </pre>
            )}
          </div>
        );
      })}
    </div>
  );
};
