// @jxui/react v3.0.0 — JXAlert (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, ChevronDown } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export type JXAlertSeverity = 'warning' | 'success' | 'info' | 'error';

export interface JXAlertProps {
  severity?: JXAlertSeverity;
  title?: string;
  description?: string;
  technicalDetails?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const JXAlert: React.FC<JXAlertProps> = ({
  severity = 'warning',
  title,
  description = 'Automatic burst scaling is ready if traffic exceeds 10,000 req/min.',
  technicalDetails = 'X-RateLimit-Limit: 10000 | X-RateLimit-Remaining: 1200 | Reset: 42s',
  actionLabel = 'Enable Burst',
  onAction,
  className = '',
}) => {
  const { getRadiusClass, pushToast } = useJXTheme();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const defaultTitle =
    severity === 'warning'
      ? 'API Rate Limit Approaching (88% Quota Used)'
      : severity === 'success'
      ? 'Multi-Region Replica Verification Passed'
      : severity === 'error'
      ? 'Primary Shard Connection Timeout'
      : 'Scheduled Kernel Security Patch Available';

  const toneClass =
    severity === 'warning'
      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/60'
      : severity === 'success'
      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/60'
      : severity === 'error'
      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/80 dark:border-rose-800/60'
      : 'bg-sky-50/70 dark:bg-sky-950/30 border-sky-200/80 dark:border-sky-800/60';

  return (
    <div
      role="alert"
      className={`p-4 border transition-colors ${getRadiusClass('control')} ${toneClass} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {severity === 'warning' && (
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          )}
          {severity === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          )}
          {severity === 'error' && (
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          )}
          {severity === 'info' && (
            <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {title || defaultTitle}
            </div>
            {description && (
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {description}
              </p>
            )}
            {technicalDetails && (
              <>
                <button
                  type="button"
                  aria-expanded={detailsOpen}
                  onClick={() => setDetailsOpen((o) => !o)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 pt-1 hover:underline"
                >
                  <span>
                    {detailsOpen ? 'Hide technical details' : 'View technical details'}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      detailsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {detailsOpen && (
                  <pre className="mt-2 p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
                    {technicalDetails}
                  </pre>
                )}
              </>
            )}
          </div>
        </div>

        {actionLabel && (
          <button
            type="button"
            onClick={() => {
              if (onAction) {
                onAction();
              } else {
                pushToast({ title: 'Quota burst scaling enabled', variant: 'success' });
              }
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
